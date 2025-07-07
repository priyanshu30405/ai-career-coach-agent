import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { OpenAI } from "openai";
import { db } from "@/configs/db";
import { HistoryTable } from "@/configs/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("resumeFile") as File;
  const userId = formData.get("userId") as string;

  if (!file || !userId) {
    return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
  }

  // Read PDF buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Convert to base64 for storage
  const base64Pdf = buffer.toString('base64');
  const dataUrl = `data:application/pdf;base64,${base64Pdf}`;

  // Extract text from PDF
  const pdfData = await pdfParse(buffer);
  const resumeText = pdfData.text;

  // Call OpenAI for analysis
  const prompt = `
You are an AI Resume Analyzer. Analyze the following resume and return a JSON with:
- overall_score (0-100)
- overall_feedback (short summary)
- summary_comment (1-2 sentences)
- sections: Contact Info, Experience, Skills, Education (each with score and comment)
- tips_for_improvement (array)
- whats_good (array)
- needs_improvement (array)

Resume:
${resumeText}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  // Extract JSON from OpenAI response
  const content = completion.choices[0].message.content || "{}";
  const analysis = JSON.parse(content.replace(/```json|```/g, "").trim());

  // Store in Neon DB with base64 PDF data
  const recordId = crypto.randomUUID();
  await db.insert(HistoryTable).values({
    recordId,
    userEmail: userId,
    content: analysis,
    createdAt: new Date().toISOString(),
    aiAgentType: "ai-resume-analyzer",
    metaData: dataUrl, // Store base64 PDF data
  });

  return NextResponse.json({ analysis, recordId });
} 