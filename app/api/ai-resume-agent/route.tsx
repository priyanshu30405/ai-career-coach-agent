// Bypass SSL certificate verification for local development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { NextRequest, NextResponse } from "next/server";
import {WebPDFLoader} from '@langchain/community/document_loaders/web/pdf'
import { inngest } from "@/inngest/client";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req:NextRequest){
  try {
    const FormData = await req.formData();
    const resumeFile:any = FormData.get('resumeFile');
    const recordId =  FormData.get('recordId');

    if (!resumeFile || !recordId) {
      return NextResponse.json({ error: 'Missing resume file or record ID' }, { status: 400 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const loader = new WebPDFLoader(resumeFile);
    const docs = await loader.load();
    console.log(docs[0]); // Raw pdf Text

    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const resultIds = await inngest.send({
      name: 'AiResumeAgent',
      data: {
        recordId: recordId, 
        base64ResumeFile: base64,
        pdfText: docs[0]?.pageContent,
        aiAgentType: '/ai-tools/ai-resume-analyzer',
        userEmail: user?.primaryEmailAddress?.emailAddress
      }
    });

    const runId = resultIds?.ids[0];
    console.log('Run ID:', runId);

    if (!runId) {
      return NextResponse.json({ error: 'Failed to start analysis' }, { status: 500 });
    }

    let runStatus;
    let attempts = 0;
    const maxAttempts = 60; // 30 seconds max wait

    while (attempts < maxAttempts) {
      runStatus = await getRuns(runId);
      console.log('Run status:', runStatus?.data);
      
      if (runStatus?.data[0]?.status === 'Completed') {
        break;
      }
      
      if (runStatus?.data[0]?.status === 'Failed') {
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json({ error: 'Analysis timeout' }, { status: 408 });
    }

    return NextResponse.json(runStatus.data?.[0].output); // full parsed JSON
  } catch (error) {
    console.error('Error in resume analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 
 export async function getRuns(runId: string) {
   const result = await axios.get(`${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`, {
     headers: {
       Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
     }
   });
   return result.data;
 }   