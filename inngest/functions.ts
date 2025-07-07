import { Description } from "@radix-ui/react-dialog";
import { inngest } from "./client";
import { createAgent, anthropic, gemini } from '@inngest/agent-kit';
import ImageKit from "imagekit";
import { db } from "@/configs/db";
import { HistoryTable } from "@/configs/schema";

// Hello World function
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

// Career Chat Agent
export const AiCareerChatAgent = createAgent({
  name: 'AiCareerChatAgent',
  description: 'An AI Agent that answers career-related questions.',
  system: `You are a helpful, professional AI Career Coach. Your role is to guide users with questions related to careers, including job advice, interview preparation, resume improvement, skill development, career transitions, and industry trends.
Always respond with clarity, encouragement, and actionable advice tailored to the user's needs.
If the user asks something unrelated to careers (e.g., topics like health, relationships, coding help, or general trivia), gently inform them that you are a career coach and suggest relevant career-focused questions instead.`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY
  })
});

// Resume Analyzer Agent
export const AiResumeAnalyzerAgent = createAgent({
  name: 'AiResumeAnalyzerAgent',
  description: 'AI Resume Analyzer Agent help to return report',
  system: ``,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY
  })
});

// Roadmap Generator Agent
export const AiRoadmapGeneratorAgent = createAgent({
  name: 'AiRoadmapGeneratorAgent',
  description: 'AI Roadmap Generator Agent that creates comprehensive career roadmaps',
  system: `You are an expert AI Career Roadmap Generator. Your role is to create detailed, structured learning roadmaps for various career paths in technology and other industries.`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY
  })
});

// Career Chat Function
export const AiCareerAgent = inngest.createFunction(
  { id: 'AiCareerAgent' },
  { event: 'AiCareerAgent' },
  async ({ event, step }) => {
    const { userInput } = await event?.data;
    const result = await AiCareerChatAgent.run(userInput);
    return result;
  }
);

// Cover Letter Generator Agent
export const AiCoverLetterAgent = createAgent({
  name: 'AiCoverLetterAgent',
  description: 'AI Cover Letter Generator Agent that creates personalized cover letters based on job and user profile information',
  system: `You are an expert AI Cover Letter Writer. Your role is to generate highly personalized, professional cover letters for job applications. Use the job title, company name, job description, and the user\'s profile (resume or LinkedIn) to craft a compelling letter. Format the output as a ready-to-send cover letter.`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY
  })
});

export const AiCoverLetterFunction = inngest.createFunction(
  { id: 'AiCoverLetterFunction' },
  { event: 'AiCoverLetterFunction' },
  async ({ event, step }) => {
    const { jobTitle, companyName, jobDescription, profileText } = await event.data;
    const prompt = `Generate a professional cover letter for the following job application.\n\nJob Title: ${jobTitle}\nCompany Name: ${companyName}\nJob Description: ${jobDescription}\n\nUser Profile:\n${profileText}\n\nThe cover letter should be personalized, concise, and highlight the user\'s relevant skills and experience. Format as a ready-to-send letter.`;
    const aiResponse = await AiCoverLetterAgent.run(prompt);
    const coverLetter = (aiResponse.output?.[0] as { content: string })?.content || "";
    return { coverLetter };
  }
);

// ImageKit Setup
const imagekit = new ImageKit({
  //@ts-ignore
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  //@ts-ignore
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  //@ts-ignore
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL
});

// Resume Analyzer Function
export const AiResumeAgent = inngest.createFunction(
  { id: 'AiResumeAgent' },
  { event: 'AiResumeAgent' },
  async ({ event, step }) => {
    const { recordId, base64ResumeFile, pdfText, aiAgentType, userEmail } = await event.data;

    // Upload resume to ImageKit
    const uploadFileUrl = await step.run("uploadImage", async () => {
      const imageKitFile = await imagekit.upload({
        file: `data:application/pdf;base64,${base64ResumeFile}`,
        fileName: `${Date.now()}.pdf`,
        isPublished: true,
        responseFields: ['url'],
       tags: ['resume', 'pdf'],
      });
      return imageKitFile.url;
    });

    // Run Gemini AI Resume Analyzer
    const aiResponse = await AiResumeAnalyzerAgent.run(`
You are an advanced AI Resume Analyzer Agent.
Your task is to evaluate a candidate's resume and return a detailed analysis in the following strict JSON format:

{
  overall_score: number, // 0-100
  overall_feedback: string, // short message (e.g., "Excellent", "Needs improvement")
  summary_comment: string, // 1-2 sentence summary
  sections: {
    Experience: { score: number, comment: string },
    Education: { score: number, comment: string },
    Skills: { score: number, comment: string },
    Contact_Info: { score: number, comment: string }
  },
  tips_for_improvement: string[], // 3-5 tips
  whats_good: string[], // 1-3 strengths
  needs_improvement: string[] // 1-3 weaknesses
}

Do NOT omit any field. If a section is missing in the resume, still include it with score 0 and an appropriate comment. Do not include any text outside the JSON. Only return valid JSON.

Here is the resume text:
${pdfText}
    `);

    // Extract JSON from AI response
     const rawContent = (aiResponse.output?.[0] as { content: string })?.content || "";
    const rawContentJson = rawContent.replace("```json", "").replace("```", "").trim();
    const parsedJson = JSON.parse(rawContentJson);

    // Save to DB
    await step.run("SaveToDb", async () => {
      await db.insert(HistoryTable).values({
        recordId,
        content: parsedJson,
        aiAgentType,
        createdAt: new Date().toISOString(),
        userEmail,
        metaData:uploadFileUrl
      });
    });

    return {
      recordId,
      uploadedUrl: uploadFileUrl,
      analysis: parsedJson
    };
  }
);

// Roadmap Generator Function
export const AIRoadmapAgent = inngest.createFunction(
  { id: 'AIRoadmapAgent' },
  { event: 'AIRoadmapAgent' },
  async ({ event, step }) => {
    const { recordId, customPrompt, userExperience, userGoals, aiAgentType, userEmail } = await event.data;

    // Run Gemini AI Roadmap Generator
    const aiResponse = await AiRoadmapGeneratorAgent.run(`
You are an expert AI Roadmap Generator. Create a comprehensive learning roadmap based on the user's custom request.

User Request: ${customPrompt}
User Experience Level: ${userExperience}
User Goals: ${userGoals}

Generate a detailed roadmap in the following strict JSON format:

{
  "title": "Roadmap Title",
  "description": "Comprehensive description of the roadmap",
  "duration": "Estimated duration (e.g., '12-24 months')",
  "phases": [
    {
      "title": "Phase Title",
      "description": "Phase description",
      "duration": "Phase duration (e.g., '3-4 months')",
      "color": "bg-blue-500",
      "technologies": [
        {
          "name": "Technology/Skill Name",
          "description": "Detailed description of what to learn"
        }
      ]
    }
  ]
}

Guidelines:
- Create 4-5 phases with clear progression
- Include 3-5 technologies/skills per phase
- Use realistic timeframes based on the user's experience level
- Focus on practical, actionable learning
- Include both technical and soft skills where relevant
- Use color classes: bg-blue-500, bg-green-500, bg-purple-500, bg-orange-500, bg-red-500
- Tailor the roadmap specifically to the user's custom request
- Make sure the roadmap addresses the user's specific goals

Only return valid JSON. Do not include any text outside the JSON structure.
    `);

    // Extract JSON from AI response
    const rawContent = (aiResponse.output?.[0] as { content: string })?.content || "";
    const rawContentJson = rawContent.replace("```json", "").replace("```", "").trim();
    const parsedJson = JSON.parse(rawContentJson);

    // Save to DB
    await step.run("SaveToDb", async () => {
      await db.insert(HistoryTable).values({
        recordId,
        content: parsedJson,
        aiAgentType,
        createdAt: new Date().toISOString(),
        userEmail
      });
    });

    return {
      recordId,
      roadmap: parsedJson
    };
  }
);


