import { PresetSample, CandidateProfile } from './types';

export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  fullName: 'Alex Rivera',
  email: 'alex.rivera.dev@gmail.com',
  phone: '+1 (415) 890-4321',
  location: 'San Francisco, CA (Open to Remote)',
  linkedinUrl: 'https://linkedin.com/in/alexrivera-dev',
  portfolioUrl: 'https://alexrivera.io',
  githubUrl: 'https://github.com/arivera',
  authorizedInCountry: true,
  requiresSponsorship: false,
  noticePeriod: '2 weeks',
  desiredSalary: '$185,000 - $210,000'
};

export const SAMPLE_PRESETS: PresetSample[] = [
  {
    id: 'staff-software-engineer',
    title: 'Senior Frontend to Staff Full-Stack Engineer',
    role: 'Staff Full-Stack Engineer @ CloudScale',
    suggestedUrl: 'https://boards.greenhouse.io/cloudscale/jobs/4982710002',
    resume: `ALEX RIVERA
San Francisco, CA | alex.rivera@email.com | linkedin.com/in/alexrivera-dev | github.com/arivera

SUMMARY
Senior Frontend Engineer with 7+ years of experience leading UI architecture, building scalable web applications with React, TypeScript, and Next.js. Spearheaded micro-frontends transition resulting in 40% faster deploy cycles.

EXPERIENCE
Lead Frontend Engineer | FinTech Velocity (2021 - Present)
- Architected enterprise React/TypeScript trading dashboard used by 120k daily active traders.
- Migrated legacy SPA to Next.js 14 and Turborepo, cutting initial bundle size by 38% and lowering LCP from 3.2s to 1.1s.
- Mentored a distributed team of 8 engineers and conducted 50+ technical interviews.
- Integrated WebSocket streaming feeds for live tick-by-tick order book data.
- Built reusable component library using Tailwind CSS and Radix UI with 98% unit test coverage using Vitest.

Senior Software Engineer | DataStream Analytics (2018 - 2021)
- Built interactive analytics dashboards with React, Redux, and D3.js.
- Developed Node.js REST APIs for customer telemetry ingestion handling 15M records/day.
- Implemented CI/CD pipelines via GitHub Actions and Docker containerization.
- Collaborated with product managers to define SLOs and sprint roadmaps.

EDUCATION & SKILLS
B.S. in Computer Science - UC Berkeley (2018)
Core Skills: TypeScript, React, Next.js, Node.js, GraphQL, REST APIs, Tailwind CSS, Docker, Jest/Vitest, Git.`,
    jobDescription: `Position: Staff Full-Stack Engineer (Platform & Core Systems)
Company: CloudScale Infrastructure Inc.
Location: Remote (US)

About the Role:
We are looking for a Staff Full-Stack Engineer to lead the architecture of our cloud telemetry and fleet management platform. You will be responsible for end-to-end technical direction across modern TypeScript frontends, high-throughput Go/Node backends, and cloud infrastructure on AWS.

Requirements:
- 8+ years professional software engineering experience.
- Deep expertise in React, TypeScript, and modern state architectures.
- Solid server-side experience with Node.js and familiarity with Go or distributed microservices.
- Strong hands-on experience with cloud infrastructure (AWS/GCP), Kubernetes, and Terraform.
- Proven track record of system design: high throughput, low latency (gRPC or WebSockets), and data pipelines.
- Experience with PostgreSQL and Redis caching strategies.
- Demonstrated leadership: mentoring staff/senior engineers and driving cross-team technical roadmaps.

Nice to Have:
- Experience with Kafka or AWS Kinesis stream processing.
- Contributions to open-source developer tooling.`
  },
  {
    id: 'product-marketing-manager',
    title: 'PMM to Senior Director of Product Marketing',
    role: 'Senior Product Marketing Manager @ NexusAI',
    suggestedUrl: 'https://jobs.lever.co/nexusai/8dfa2839-2b81-4cd9-bc20-912f201018e2',
    resume: `PRIYA SHARMA
Austin, TX | priya.sharma@domain.com | linkedin.com/in/priyasharmapmm

PROFILE
Dynamic Product Marketing Manager with 5 years experience driving B2B SaaS positioning, multi-channel GTM campaigns, and sales enablement. Generated $14M in attributed pipeline across 3 product launches.

EXPERIENCE
Product Marketing Manager | SaaSFlow (2022 - Present)
- Owned GTM strategy for flagship automation platform, driving 35% YoY expansion revenue.
- Authored ICP personas, competitive battlecards against Salesforce and HubSpot, improving sales win rate by 18%.
- Produced thought leadership whitepapers, video demos, and case studies with enterprise Fortune 500 customers.
- Partnered with product and engineering teams to translate technical feature releases into customer value narratives.

Associate Marketing Manager | CloudPulse (2019 - 2022)
- Managed webinar program generating 2,500+ MQLs per quarter.
- Executed email nurture workflows via HubSpot and tracked attribution in Salesforce CRM.
- Coordinated annual customer conference with 1,200 attendees.

SKILLS
GTM Strategy, Positioning & Messaging, Competitive Intelligence (Klue), Sales Enablement, HubSpot, Google Analytics, Content Strategy.`,
    jobDescription: `Role: Senior Product Marketing Manager (AI Enterprise Solutions)
Company: NexusAI
Location: Austin, TX or Remote

What you'll do:
NexusAI is seeking a Senior Product Marketing Manager to craft the narrative, positioning, and go-to-market engine for our new Enterprise LLM Agent platform.

Key Responsibilities:
- Formulate value propositions, tiering, and messaging targeted at enterprise CIOs and CTOs.
- Orchestrate end-to-end Tier 1 product launches across PR, analyst relations (Gartner/Forrester), and digital channels.
- Partner closely with sales to deliver enterprise-grade pitch decks, ROI calculators, and competitive battlecards.
- Conduct primary win/loss research and customer advisory board (CAB) sessions.
- Drive pricing and packaging experiments with finance and product leadership.

Requirements:
- 6+ years of B2B SaaS product marketing experience, preferably in Developer Tools, Data Infrastructure, or Enterprise AI.
- Demonstrated experience collaborating with Industry Analysts (Gartner Magic Quadrant / Forrester Wave).
- Deep familiarity with pricing and packaging models for consumption-based or enterprise SaaS.
- Exceptional analytical and presentation skills; ability to speak fluently to both technical buyers and C-level executives.`
  }
];
