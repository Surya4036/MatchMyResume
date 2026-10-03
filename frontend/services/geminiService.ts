import { GoogleGenAI, Type } from '@google/genai';
import { MatchAnalysisResult, BulletRewrite, ApplicationKit, CandidateProfile } from '../types';

export async function scrapeJobDescriptionFromUrl(url: string): Promise<{
  text: string;
  sources: { uri?: string; title?: string }[];
}> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

  const prompt = `You are an automated web scraping and job listing extraction agent.
Find, scrape, and extract the complete job specification from the following URL:
${url}

Extract and structure the following:
- Job Title
- Company & Location
- Role Summary / Department
- Core Responsibilities & Daily Duties
- Required Technical Skills & Qualifications
- Preferred / Nice-to-Have Requirements
- Tech Stack & Tooling

If the live URL requires session cookies or blocks direct parsing, use Google Search grounding to find the exact job listing for this company and position, and output the clean full job description ready for ATS analysis. Return only the extracted job description text without commentary.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const extractedText = response.text || '';
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: { uri?: string; title?: string }[] = [];

  for (const chunk of chunks) {
    if (chunk.web?.uri) {
      sources.push({
        uri: chunk.web.uri,
        title: chunk.web.title || chunk.web.uri,
      });
    }
  }

  return {
    text: extractedText.trim(),
    sources,
  };
}

export async function analyzeResumeAndJobMatch(
  resumeText: string,
  jobDescriptionText: string
): Promise<MatchAnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

  const prompt = `You are an elite Executive Talent Acquisition Director and ATS (Applicant Tracking System) Algorithm Specialist.
Analyze the following Resume against the Job Description.

Perform a thorough, honest, quantitative, and qualitative evaluation.

[RESUME START]
${resumeText}
[RESUME END]

[JOB DESCRIPTION START]
${jobDescriptionText}
[JOB DESCRIPTION END]

Provide deep actionable insights:
1. ATS Compatibility score and categorical breakdown (Skills, Experience, Education, Seniority).
2. Identified skills with status (matched, missing, partial) and importance (critical, preferred, bonus).
3. Exact missing keywords that will cause ATS filters to drop the candidate.
4. Specific bullet points from the resume that can be rewritten using the STAR (Situation, Task, Action, Result) methodology incorporating job keywords naturally without lying. Provide at least 4-6 high quality bullet rewrites.
5. High-probability interview questions targeting the candidate's exact gaps and transitions.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
          atsCompatibilityScore: { type: Type.INTEGER, description: 'ATS pass score between 0 and 100' },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              skillsMatch: { type: Type.INTEGER },
              experienceAlignment: { type: Type.INTEGER },
              educationCertifications: { type: Type.INTEGER },
              seniorityLevelFit: { type: Type.INTEGER }
            },
            required: ['skillsMatch', 'experienceAlignment', 'educationCertifications', 'seniorityLevelFit']
          },
          jobSummary: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              level: { type: Type.STRING },
              companyVibe: { type: Type.STRING },
              primaryStack: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'level', 'companyVibe', 'primaryStack']
          },
          candidateSummary: {
            type: Type.OBJECT,
            properties: {
              inferredTitle: { type: Type.STRING },
              totalYearsExp: { type: Type.STRING },
              topStrengths: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['inferredTitle', 'totalYearsExp', 'topStrengths']
          },
          executiveVerdict: { type: Type.STRING, description: '2-3 sentences of blunt executive advice on chances' },
          keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillsBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING, enum: ['hard', 'soft', 'tool', 'certification'] },
                status: { type: Type.STRING, enum: ['matched', 'missing', 'partial'] },
                importance: { type: Type.STRING, enum: ['critical', 'preferred', 'bonus'] },
                evidenceInResume: { type: Type.STRING }
              },
              required: ['name', 'category', 'status', 'importance']
            }
          },
          tailoredHeadline: { type: Type.STRING, description: 'A punchy customized 1-line resume header' },
          tailoredSummary: { type: Type.STRING, description: 'A 3-4 sentence customized resume summary highlighting matched value' },
          bulletRewrites: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                improved: { type: Type.STRING },
                rationale: { type: Type.STRING },
                targetedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['original', 'improved', 'rationale', 'targetedKeywords']
            }
          },
          interviewQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                category: { type: Type.STRING, enum: ['technical', 'behavioral', 'gap-investigation'] },
                reasoning: { type: Type.STRING },
                recommendedAnswerStrategy: { type: Type.STRING }
              },
              required: ['question', 'category', 'reasoning', 'recommendedAnswerStrategy']
            }
          }
        },
        required: [
          'overallScore',
          'atsCompatibilityScore',
          'breakdown',
          'jobSummary',
          'candidateSummary',
          'executiveVerdict',
          'keyStrengths',
          'criticalGaps',
          'missingKeywords',
          'skillsBreakdown',
          'tailoredHeadline',
          'tailoredSummary',
          'bulletRewrites',
          'interviewQuestions'
        ]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{}') as MatchAnalysisResult;
  return parsed;
}

export async function optimizeCustomBullet(
  customBullet: string,
  jobDescriptionText: string,
  targetKeywords: string[]
): Promise<BulletRewrite> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

  const prompt = `You are a world-class Executive Resume Writer.
Rewrite the following raw resume bullet into an exceptionally strong, quantified, STAR-format bullet point tailored to the target Job Description and its key ATS keywords.

[RAW BULLET]
${customBullet}

[TARGET JOB DESCRIPTION]
${jobDescriptionText}

[KEY ATS KEYWORDS TO WEAVE IN IF APPROPRIATE]
${targetKeywords.join(', ')}

Guidelines:
1. Start with a decisive past-tense action verb (e.g. Engineered, Spearheaded, Architected, Accelerated, Automated, Orchestrated).
2. Follow the STAR / XYZ formula (Accomplished [X] as measured by [Y] by doing [Z]).
3. Infuse authentic job keywords naturally without hallucinating impossible claims.
4. Provide a clear rationale explaining the recruiter and ATS impact.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.25,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          improved: { type: Type.STRING },
          rationale: { type: Type.STRING },
          targetedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['original', 'improved', 'rationale', 'targetedKeywords']
      }
    }
  });

  return JSON.parse(response.text || '{}') as BulletRewrite;
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescriptionText: string,
  tone: 'confident' | 'technical' | 'conversational' | 'executive',
  keyStrengths?: string[]
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

  const toneInstructions = {
    confident: 'Direct, results-oriented, high-energy and clear evidence of ROI.',
    technical: 'Detailed, focused on architecture, technologies, problem-solving methodologies, and scale.',
    conversational: 'Warm, mission-aligned, culturally resonant and authentic yet professional.',
    executive: 'Strategic, focused on cross-functional alignment, roadmap impact, revenue, and organizational leverage.'
  };

  const strengthsContext = keyStrengths && keyStrengths.length > 0
    ? `\nPrioritize these top matched candidate strengths in the body paragraphs:\n${keyStrengths.map(s => `- ${s}`).join('\n')}`
    : '';

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Write an exceptionally compelling, concise, and targeted Cover Letter for this candidate applying to this position.
Do not use clichés like "I am writing to express my enthusiastic interest...".
Hook the hiring manager immediately with concrete proof of how the candidate's verified strengths solve the specific operational or technical challenges in the job description.
${strengthsContext}

Target Tone: ${tone.toUpperCase()} (${toneInstructions[tone]})

[RESUME]
${resumeText}

[JOB DESCRIPTION]
${jobDescriptionText}

Format with clear professional paragraphs. Keep it tight and targeted between 220 and 320 words. Return only the letter text itself.`
  });

  return response.text?.trim() || 'Could not generate cover letter at this time.';
}

export async function generateApplicationKit(
  resumeText: string,
  jobDescriptionText: string,
  jobUrl: string,
  candidateProfile: CandidateProfile
): Promise<ApplicationKit> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

  const prompt = `You are an Auto-Apply Robotic Agent & Recruitment Copilot.
Analyze this job description, resume, and applicant profile. Generate a complete, ready-to-fill Application Kit that auto-solves standard ATS job application forms and screening questions.

[JOB URL]
${jobUrl || 'https://careers.company.com/apply'}

[CANDIDATE PROFILE]
Name: ${candidateProfile.fullName}
Email: ${candidateProfile.email}
Phone: ${candidateProfile.phone}
Location: ${candidateProfile.location}
Salary Target: ${candidateProfile.desiredSalary}

[RESUME]
${resumeText}

[JOB DESCRIPTION]
${jobDescriptionText}

Task:
1. Identify the likely ATS portal type (Greenhouse, Lever, Workday, Ashby, LinkedIn, or Direct Career Portal).
2. Infer company name and exact job title.
3. Formulate high-quality, tailored answers to the 4 most common ATS screening questions:
   - "Why are you interested in joining our team?"
   - "Describe a relevant project or technical achievement relevant to this role."
   - "What are your salary expectations?"
   - "What is your earliest start date or notice period?"
4. Provide a professional recruiter outreach subject line and direct application URL.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          portalType: {
            type: Type.STRING,
            enum: ['Greenhouse', 'Lever', 'Workday', 'Ashby', 'LinkedIn', 'Direct Career Portal']
          },
          companyName: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
          subjectLine: { type: Type.STRING },
          directApplyUrl: { type: Type.STRING },
          salaryRecommendation: { type: Type.STRING },
          screeningAnswers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                suggestedAnswer: { type: Type.STRING },
                fieldCategory: {
                  type: Type.STRING,
                  enum: ['motivation', 'experience', 'compensation', 'availability', 'general']
                }
              },
              required: ['question', 'suggestedAnswer', 'fieldCategory']
            }
          }
        },
        required: [
          'portalType',
          'companyName',
          'jobTitle',
          'subjectLine',
          'directApplyUrl',
          'salaryRecommendation',
          'screeningAnswers'
        ]
      }
    }
  });

  return JSON.parse(response.text || '{}') as ApplicationKit;
}
