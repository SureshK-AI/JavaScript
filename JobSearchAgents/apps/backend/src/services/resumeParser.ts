import type { ParsedResume } from '../core/types.js';

/**
 * Resume text extraction + structured parsing.
 *
 * The BDD spec requires PDF/DOCX/TXT support. `pdf-parse` and `mammoth` are the
 * canonical engines — imported lazily so the suite still runs if native/optional
 * deps are unavailable (extraction then falls back to embedded test fixtures).
 */
export async function extractTextFromBuffer(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'text/plain' || mimeType.includes('text')) {
    return buffer.toString('utf8');
  }
  if (mimeType.includes('pdf')) {
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const result = await pdfParse(buffer);
      return result.text ?? '';
    } catch (err) {
      // Fallback: many generated PDFs embed readable text streams.
      const raw = buffer.toString('latin1');
      const text = extractTextStreams(raw);
      if (text) return text;
      throw new Error(`PDF parsing failed: ${(err as Error).message}`);
    }
  }
  if (
    mimeType.includes('word') ||
    mimeType.includes('officedocument') ||
    mimeType.endsWith('docx')
  ) {
    try {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      return result.value ?? '';
    } catch (err) {
      // Fallback: pull any readable text out of the docx zip.
      const raw = buffer.toString('latin1');
      const text = extractTextStreams(raw);
      if (text) return text;
      throw new Error(`DOCX parsing failed: ${(err as Error).message}`);
    }
  }
  throw new Error(`Unsupported resume format: ${mimeType}`);
}

/** Crude extraction of `(...) Tj` PDF text objects / embedded strings. */
function extractTextStreams(raw: string): string {
  const matches = [...raw.matchAll(/\(([^)]*)\)\s*Tj/g)].map((m) => m[1] ?? '');
  if (matches.length) return matches.join('\n');
  const bt = [...raw.matchAll(/BT\s*([\s\S]*?)\s*ET/g)].map((m) => m[1] ?? '');
  if (bt.length) return bt.join('\n').replace(/[()]/g, '');
  return '';
}

const SKILL_LEXICON = [
  'javascript', 'typescript', 'node', 'node.js', 'react', 'angular', 'vue', 'express',
  'python', 'java', 'c#', 'c++', 'go', 'rust', 'ruby', 'php', 'kotlin', 'swift', 'scala',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest', 'apollo',
  'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'github actions',
  'aws', 'azure', 'gcp', 's3', 'lambda', 'serverless', 'ec2',
  'playwright', 'selenium', 'cypress', 'jest', 'mocha', 'pytest', 'cucumber', 'bdd',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'webpack', 'vite', 'next.js', 'vite',
  'git', 'github', 'gitlab', 'bitbucket', 'svn',
  'agile', 'scrum', 'kanban', 'jira', 'confluence', 'tdd',
  'machine learning', 'deep learning', 'nlp', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy',
  'data analysis', 'data engineering', 'etl', 'spark', 'hadoop', 'airflow', 'dbt',
  'excel', 'power bi', 'tableau', 'looker', 'google analytics',
  'communication', 'leadership', 'mentoring', 'problem solving', 'teamwork',
] as const;

const DEGREE_PATTERNS = [
  /(?:b\.?s\.?c|bachelor|b\.?tech|b\.?e|b\.?a|m\.?s\.?c|master|m\.?tech|m\.?b\.?a|ph\.?d|doctorate|diploma|associate)[^,\n]*/gi,
];

const CERT_PATTERNS = [
  /(?:certified|certification|azure|aws|gcp|pmp|ccna|comptia|cspo|scrum master)[^,\n]*/gi,
];

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const EXPERIENCE_HEADER_RE = /^(experience|work history|employment|professional experience)\s*$/im;
const EDUCATION_HEADER_RE = /^(education|academic|qualification)\s*$/im;

export function parseResumeText(rawText: string): ParsedResume {
  const lower = rawText.toLowerCase();
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const skills = SKILL_LEXICON.filter((skill) => lower.includes(skill.toLowerCase()));

  const email = EMAIL_RE.exec(rawText)?.[0];
  const phone = PHONE_RE.exec(rawText)?.[0]?.trim();
  const nameGuess = lines[0] && lines[0].length < 60 ? lines[0] : undefined;

  // Education entries: lines between the education header and the next header.
  let education: ParsedResume['education'] = [];
  const eduIdx = lines.findIndex((l) => EDUCATION_HEADER_RE.test(l));
  if (eduIdx >= 0) {
    const slice = lines.slice(eduIdx + 1);
    for (const line of slice) {
      if (EXPERIENCE_HEADER_RE.test(line) || /^(skills|projects|certifications)/i.test(line)) break;
      if (DEGREE_PATTERNS.some((re) => re.test(line))) {
        education.push({ degree: line });
      }
    }
  }

  // Experience entries: bullets under the experience header.
  let experience: ParsedResume['experience'] = [];
  const expIdx = lines.findIndex((l) => EXPERIENCE_HEADER_RE.test(l));
  if (expIdx >= 0) {
    const slice = lines.slice(expIdx + 1);
    const bullets: string[] = [];
    let current: ParsedResume['experience'][number] | null = null;
    for (const line of slice) {
      if (EDUCATION_HEADER_RE.test(line) || /^(skills|projects|certifications)/i.test(line)) break;
      if (line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line)) {
        bullets.push(line.replace(/^[-•]\s*/, ''));
      } else if (current) {
        current.title = line;
        if (bullets.length) {
          current.bullets = [...bullets];
          experience.push(current);
          bullets.length = 0;
        }
        current = null;
      } else {
        current = { bullets: [] };
      }
    }
    if (current && bullets.length) {
      current.bullets = [...bullets];
      experience.push(current);
    }
  }

  const certifications = [...new Set(CERT_PATTERNS.flatMap((re) => rawText.match(re) ?? []))].slice(0, 10);

  const languages = ['english', 'spanish', 'hindi', 'french', 'german', 'telugu', 'tamil']
    .filter((lang) => lower.includes(lang))
    .map((l) => l.charAt(0).toUpperCase() + l.slice(1));

  return {
    fullName: nameGuess,
    email,
    phone,
    skills,
    education,
    experience,
    certifications,
    languages,
    rawText,
    parsedAt: new Date().toISOString(),
  };
}

/** Best-effort accuracy vs the SRS's ≥90% parse accuracy target. */
export function extractionAccuracy(parsed: ParsedResume, groundTruth: ParsedResume): number {
  const skillsHit = groundTruth.skills.filter((s) => parsed.skills.includes(s.toLowerCase())).length;
  const skillsTotal = Math.max(groundTruth.skills.length, 1);
  const emailHit = groundTruth.email ? parsed.email === groundTruth.email : true;
  const phoneHit = groundTruth.phone ? parsed.phone === groundTruth.phone : true;
  const score = (skillsHit / skillsTotal) * 0.6 + (emailHit ? 0.2 : 0) + (phoneHit ? 0.2 : 0);
  return Math.round(score * 100);
}
