import type { Job, PortalName } from '../core/types.js';

/**
 * Realistic sample data used when SCRAPER_DEMO_MODE=true — keeps the platform
 * fully testable offline and free-tier friendly.
 */
const SAMPLE_POOL: Array<Omit<Job, 'portal' | 'searchQuery'>> = [
  {
    title: 'Senior Frontend Engineer (React)',
    company: 'Acme Cloud',
    location: 'Remote',
    description:
      'We are looking for a Senior Frontend Engineer with strong React, TypeScript, and CSS experience. You will build accessible, high-performance web applications. Experience with Vite, testing with Jest and Playwright, and CI/CD with GitHub Actions is required. Knowledge of GraphQL and Node.js is a plus.',
    salary: '$130k - $160k',
    postedAt: '2 days ago',
    skills: ['react', 'typescript', 'jest', 'playwright', 'graphql', 'node.js'],
  },
  {
    title: 'Backend Engineer (Node.js)',
    company: 'Globex Systems',
    location: 'Bengaluru, IN',
    description:
      'Globex Systems is hiring a Backend Engineer skilled in Node.js, TypeScript, and PostgreSQL. You will design REST APIs, work with Docker and Kubernetes, and own services end to end. Experience with Redis, event-driven architectures, and AWS is a plus. Agile environment with a focus on clean code and testing.',
    salary: '₹25L - ₹40L',
    postedAt: '1 week ago',
    skills: ['node.js', 'typescript', 'postgresql', 'docker', 'kubernetes', 'aws'],
  },
  {
    title: 'Full-Stack Developer (TypeScript)',
    company: 'Initech Digital',
    location: 'Hyderabad, IN',
    description:
      'Join our product team as a Full-Stack Developer. You will work across React, Node.js, and MongoDB building customer-facing features. Strong fundamentals in TypeScript, REST APIs, and automated testing are essential. Familiarity with Playwright for E2E testing and cloud deployment on Vercel/AWS is valued.',
    salary: '₹18L - ₹30L',
    postedAt: '3 days ago',
    skills: ['typescript', 'react', 'node.js', 'mongodb', 'playwright'],
  },
  {
    title: 'DevOps Engineer (Kubernetes)',
    company: 'Umbrella Corp',
    location: 'Remote (US)',
    description:
      'Seeking a DevOps Engineer to own CI/CD pipelines, container orchestration on Kubernetes, and infrastructure as code with Terraform. You should be comfortable with AWS, GitHub Actions, observability stacks, and incident response. Strong scripting skills in TypeScript or Python preferred.',
    salary: '$140k - $175k',
    postedAt: '5 days ago',
    skills: ['kubernetes', 'terraform', 'aws', 'github actions', 'ci/cd'],
  },
  {
    title: 'QA Automation Engineer',
    company: 'Stark Analytics',
    location: 'Pune, IN',
    description:
      'We are looking for a QA Automation Engineer to build end-to-end test suites with Playwright and Cucumber (BDD). You will own test strategy, integrate tests into CI, and partner with developers on quality. Experience with TypeScript, API testing, and test reporting is required.',
    salary: '₹14L - ₹22L',
    postedAt: '4 days ago',
    skills: ['playwright', 'cucumber', 'typescript', 'jest', 'ci/cd'],
  },
  {
    title: 'Machine Learning Engineer',
    company: 'Hooli Data',
    location: 'Remote',
    description:
      'Hooli Data is hiring an ML Engineer to productionize NLP and recommendation models. You will work with Python, PyTorch, and Hugging Face, build training pipelines, and deploy with Docker. Experience with embeddings, semantic search, and MLOps tooling is a strong plus.',
    salary: '$150k - $190k',
    postedAt: '1 week ago',
    skills: ['python', 'pytorch', 'nlp', 'docker', 'machine learning'],
  },
];

export function sampleJobs(query: string, portal?: PortalName): Job[] {
  const q = query.toLowerCase();
  const matches = SAMPLE_POOL.filter(
    (j) =>
      j.title.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      j.skills?.some((s) => q.includes(s)),
  );
  const pool = matches.length ? matches : SAMPLE_POOL;
  const portals: PortalName[] = portal ? [portal] : ['naukri', 'linkedin', 'indeed', 'glassdoor'];
  return pool.slice(0, 4).flatMap((job, i) =>
    portals.map((p, pi) => ({
      ...job,
      portal: p,
      searchQuery: query,
      url: `https://www.${p}.com/jobs/view/${encodeURIComponent(job.title.toLowerCase().replace(/\s+/g, '-'))}-${i}-${pi}`,
    })),
  );
}
