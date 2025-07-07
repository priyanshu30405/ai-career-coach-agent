import { NextRequest, NextResponse } from 'next/server';
import { AiCoverLetterAgent } from '@/inngest/functions';

export async function POST(req: NextRequest) {
  try {
    const { jobTitle, companyName, jobDescription, profileText } = await req.json();
    const prompt = `Generate a professional cover letter for the following job application.\n\nJob Title: ${jobTitle}\nCompany Name: ${companyName}\nJob Description: ${jobDescription}\n\nUser Profile:\n${profileText}\n\nThe cover letter should be personalized, concise, and highlight the user's relevant skills and experience. Format as a ready-to-send letter.`;
    const aiResponse = await AiCoverLetterAgent.run(prompt);
    const coverLetter = (aiResponse.output?.[0] as { content: string })?.content || '';
    return NextResponse.json({ coverLetter });
  } catch (error) {
    const message = typeof error === 'object' && error && 'message' in error ? (error as any).message : 'Failed to generate cover letter';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 