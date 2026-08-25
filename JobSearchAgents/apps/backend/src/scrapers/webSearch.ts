import type { Job } from '../core/types.js';
import { config } from '../core/config.js';
import { launchBrowser, newPage, detectCaptcha, closeBrowser, withRetries } from './browser.js';
import { extractJobKeywords } from '../services/atsOptimizer.js';

/**
 * General-web job scraper.
 *
 * Beyond the four job portals, this searches the open web for job postings on
 * ANY company/careers site, then opens each result and extracts the job
 * requirements (skills, experience, education, responsibilities, salary).
 *
 * Discovery uses DuckDuckGo's HTML endpoint (html.duckduckgo.com/html/) which
 * returns plain, script-friendly HTML — the big three engines serve
 * anti-bot/cached pages to headless browsers. Detail extraction opens each
 * posting with Playwright. Fully offline-testable in demo mode.
 */

interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

interface RequirementExtract {
  skills: string[];
  experience: string;
  education: string;
  responsibilities: string[];
  salary: string;
}

/** Query builder for the DuckDuckGo HTML endpoint. */
function ddgHtmlUrl(query: string, location: string): string {
  const q = `${query}${location ? ` ${location}` : ''} job posting apply`;
  return `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
}

/** Query builder for the DuckDuckGo lite endpoint (fallback). */
function ddgLiteUrl(query: string, location: string): string {
  const q = `${query}${location ? ` ${location}` : ''} job posting apply`;
  return `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(q)}`;
}

/** Query builder for Bing (last-resort fallback). */
function bingUrl(query: string, location: string): string {
  const q = `${query}${location ? ` ${location}` : ''} job posting apply`;
  return `https://www.bing.com/search?q=${encodeURIComponent(q)}`;
}

const STOP_DOMAINS = new Set([
  'google.com', 'bing.com', 'duckduckgo.com', 'youtube.com', 'facebook.com',
  'twitter.com', 'x.com', 'instagram.com', 'reddit.com', 'wikipedia.org',
  'amazon.com', 'amazon.in', 'flipkart.com', 'paypal.com',
]);

const SKILL_HINT_RE = /(required\s+skills?|skills?\s*required|what\s+you'?ll?\s+need|what\s+we'?re\s+looking\s+for|you\s+have)\s*[:–-]?\s*([^.\n]{10,})/i;
const EXPERIENCE_RE = /\b(\d+)\+?\s*(?:to\s*\d+\+?)?\s*(?:years?|yrs?)\b/i;
const SALARY_RE = /(?:salary|pay|compensation|range|annual)[^$\n]{0,20}?\$?\s?([\d,]{2,}(?:k|,\d{3})?(?:\s*[-–]\s*\$?\s?[\d,]{2,}(?:k|,\d{3})?)?)/i;
const EDUCATION_RE = /(bachelor'?s|master'?s|ph\.?d|degree|b\.?tech|m\.?tech|m\.?b\.?a|diploma)[^.\n]{0,60}/i;

function normalizeJobUrl(url: string): string {
  // Protocol-relative links like //duckduckgo.com/l/?uddg=...
  const absolute = url.startsWith('//') ? `https:${url}` : url;
  try {
    const u = new URL(absolute);
    // DDG HTML wraps destinations in /l/?uddg=<url-encoded-real-url>
    const param =
      u.searchParams.get('uddg') ??
      u.searchParams.get('url') ??
      u.searchParams.get('q') ??
      u.searchParams.get('u');
    if (param) {
      // URL-encoded (DDG uddg).
      try {
        const decoded = decodeURIComponent(param);
        if (/^https?:\/\//i.test(decoded)) return decoded;
      } catch {
        /* not url-encoded */
      }
      // base64 / base64url (some engines).
      if (/^[A-Za-z0-9+/=_-]{10,}$/.test(param)) {
        try {
          const decoded = Buffer.from(param, 'base64').toString('utf8');
          if (/^https?:\/\//i.test(decoded)) return decoded;
        } catch {
          /* not base64 */
        }
      }
      if (/^https?:\/\//i.test(param)) return param;
    }
    return u.href;
  } catch {
    return url;
  }
}

function parseList(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim().replace(/^[-•*▪\d.)\s]+/, ''))
    .filter((l) => l.length > 2 && l.length < 200);
}

export function extractRequirements(htmlOrText: string): RequirementExtract {
  const text = htmlOrText
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&amp;|&lt;|&gt;|&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length < 40) return { skills: [], experience: '', education: '', responsibilities: [], salary: '' };

  const skills = [...new Set(extractJobKeywords(text))];
  const expMatch = EXPERIENCE_RE.exec(text);
  const salMatch = SALARY_RE.exec(text);
  const eduMatch = EDUCATION_RE.exec(text);
  const responsibilities: string[] = [];

  // Prefer a "responsibilities" section when present; otherwise pick the most
  // bullet-like sentences (bullet chars survive into the plain text).
  const respMatch = /(?:responsibilities|what\s+you'?ll\s+do|the\s+role|key\s+responsibilities)\s*[:–-]?\s*([\s\S]{40,})/i.exec(htmlOrText);
  if (respMatch?.[1]) {
    responsibilities.push(...parseList(respMatch[1]).slice(0, 8));
  } else {
    const sentences = text.split(/(?<=[.!?])\s+/);
    responsibilities.push(...sentences.filter((s) => /(build|develop|design|lead|manage|implement|maintain|write|test|collaborate|own|drive|improve|analyze)/i.test(s)).slice(0, 8));
  }

  return {
    skills,
    experience: expMatch?.[0]?.trim() ?? '',
    education: eduMatch?.[0]?.trim() ?? '',
    responsibilities: responsibilities.slice(0, 8),
    salary: salMatch?.[0]?.trim() ?? '',
  };
}

/** Builds a normalized Job from a search result + (optional) page text. */
export function buildJobFromResult(
  result: SearchResult,
  query: string,
  location: string,
  pageText = '',
): Job {
  const req = pageText ? extractRequirements(pageText) : extractRequirements(result.snippet ?? result.title);
  const title = (pageText ? result.title : result.title).replace(/\s*[-|]\s*.+$/, '').trim();
  const companyGuess = (result.snippet.match(/(?:at|with|for)\s+([A-Z][A-Za-z0-9&. ]{2,40}?)(?:\s*[-–—,.]|\s*$)/i)?.[1] ?? '').trim();

  return {
    portal: 'web',
    title: title.slice(0, 120) || query,
    company: companyGuess || new URL(result.url).hostname.replace(/^www\./, '').split('.')[0] || 'Unknown',
    location: location || '',
    description: pageText ? extractRequirements(pageText).responsibilities.join(' ') || pageText.slice(0, 1500) : result.snippet,
    url: result.url,
    skills: req.skills,
    searchQuery: query,
  };
}

/**
 * Demo mode: realistic web results without touching the network.
 */
export function sampleWebJobs(query: string, location: string): Job[] {
  const q = query.toLowerCase();
  const companies = [
    { name: 'Nimbus Systems', role: 'Senior Software Engineer', stack: ['TypeScript', 'React', 'Node.js', 'AWS'], loc: 'Remote' },
    { name: 'Vertex Analytics', role: 'Data Engineer', stack: ['Python', 'Spark', 'Airflow', 'SQL'], loc: 'Remote' },
    { name: 'Brightpath Health', role: 'Frontend Engineer', stack: ['React', 'TypeScript', 'GraphQL', 'Playwright'], loc: 'Hybrid' },
    { name: 'Meridian Labs', role: 'Backend Engineer', stack: ['Go', 'PostgreSQL', 'Kafka', 'Docker'], loc: 'Remote' },
  ];
  return companies
    .filter((c) => c.role.toLowerCase().includes(q) || c.stack.some((s) => q.includes(s.toLowerCase())))
    .map((c, i) => ({
      portal: 'web' as const,
      title: c.role,
      company: c.name,
      location: location || c.loc,
      description:
        `We are hiring a ${c.role.toLowerCase()} at ${c.name}. Required skills: ${c.stack.join(', ')}. ` +
        `You will build and maintain production systems, collaborate with cross-functional teams, and own features end to end. ` +
        `Bachelor's degree in Computer Science or equivalent, 3+ years of experience, strong problem-solving skills required.`,
      url: `https://careers.${c.name.toLowerCase().replace(/[^a-z]/g, '')}.example/jobs/${i}`,
      skills: c.stack,
      searchQuery: query,
    }));
}

/** Discovers job URLs from search endpoints via fetch (no browser). */
async function searchWebForJobs(
  query: string,
  location: string,
  engine = config.WEB_SEARCH_ENGINE,
): Promise<SearchResult[]> {
  const urls: string[] = [];
  if (engine === 'bing') urls.push(bingUrl(query, location), ddgHtmlUrl(query, location), ddgLiteUrl(query, location));
  else if (engine === 'google') urls.push(ddgHtmlUrl(query, location), ddgLiteUrl(query, location));
  else urls.push(ddgHtmlUrl(query, location), ddgLiteUrl(query, location), bingUrl(query, location));

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    Accept: 'text/html',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers });
      const html = await res.text();
      // DDG HTML: <a class="result__a" href="//duckduckgo.com/l/?uddg=...">Title</a>
      // DDG lite: <a rel="nofollow" href="//duckduckgo.com/l/?uddg=...">Title</a> inside .result-link
      const rows = [
        ...html.matchAll(/<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g),
        ...html.matchAll(/<a[^>]*class="[^"]*result-link[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g),
      ];
      if (!rows.length) continue;

      const results: SearchResult[] = [];
      for (const match of rows) {
        const href = match[1];
        const titleHtml = match[2] ?? '';
        if (!href) continue;
        const url = normalizeJobUrl(href);
        const title = titleHtml
          .replace(/<[^>]+>/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/\s+/g, ' ')
          .trim();
        if (!/^https?:\/\//i.test(url) || !title) continue;
        try {
          const host = new URL(url).hostname;
          if (STOP_DOMAINS.has(host)) continue;
        } catch {
          continue;
        }
        results.push({ url, title, snippet: title });
      }
      if (!results.length) continue;

      // De-dupe by URL and cap at the configured max.
      const seen = new Set<string>();
      const unique = results.filter((r) => {
        if (seen.has(r.url)) return false;
        seen.add(r.url);
        return true;
      });
      return unique.slice(0, config.WEB_SEARCH_MAX_RESULTS);
    } catch {
      /* try next endpoint */
    }
  }
  return [];
}

/** Opens a result page and pulls the requirements text. */
async function fetchDetailText(url: string): Promise<string> {
  const browser = await launchBrowser();
  try {
    const page = await newPage(browser);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.SCRAPER_TIMEOUT_MS });
    await detectCaptcha(page);
    // Grab the readable text of the main content area if possible.
    const text = await page.evaluate(() => {
      const candidates = ['main', 'article', '#content', '.job-description', '.description', '.posting'];
      for (const sel of candidates) {
        const el = document.querySelector(sel);
        const t = el?.textContent?.trim();
        if (t && t.length > 100) return t;
      }
      return document.body?.innerText ?? '';
    });
    return text;
  } finally {
    await closeBrowser(browser);
  }
}

/**
 * General-web job search. In demo mode returns realistic sample results
 * instantly; in live mode searches the engine, follows each result, extracts
 * requirements, and normalizes everything into Job records. Discovery results
 * are cached per query to avoid hammering the engine (rate limits).
 */
const discoveryCache = new Map<string, SearchResult[]>();

export async function searchWebJobs(query: string, location = '', demo = config.SCRAPER_DEMO_MODE): Promise<Job[]> {
  if (demo) return sampleWebJobs(query, location);

  const cacheKey = `${query}|${location}`;
  const cached = discoveryCache.get(cacheKey);
  const results = cached ?? (await withRetries(
    () => searchWebForJobs(query, location),
    config.SCRAPER_RETRIES,
    `web search "${query}"`,
  ));
  if (!cached && results.length) discoveryCache.set(cacheKey, results);
  if (!results.length) return [];

  const jobs: Job[] = [];
  for (const result of results) {
    try {
      const pageText = config.WEB_SEARCH_FOLLOW_DETAIL ? await fetchDetailText(result.url) : '';
      jobs.push(buildJobFromResult(result, query, location, pageText));
    } catch {
      // If the detail page fails, still keep the snippet-based job.
      jobs.push(buildJobFromResult(result, query, location, ''));
    }
  }
  return jobs;
}
