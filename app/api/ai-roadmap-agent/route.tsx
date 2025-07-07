import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { recordId, customPrompt, userExperience, userGoals } = await req.json();

    if (!recordId || !customPrompt) {
      return NextResponse.json({ 
        error: 'Missing required fields: recordId and customPrompt' 
      }, { status: 400 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ 
        error: 'User not authenticated' 
      }, { status: 401 });
    }

    // Send event to Inngest for processing
    const resultIds = await inngest.send({
      name: 'AIRoadmapAgent',
      data: {
        recordId,
        customPrompt,
        userExperience: userExperience || 'Beginner',
        userGoals: userGoals || 'Career advancement',
        aiAgentType: '/ai-tools/ai-roadmap-agent',
        userEmail: user?.primaryEmailAddress?.emailAddress
      }
    });

    const runId = resultIds?.ids[0];
    console.log('Roadmap generation started with run ID:', runId);

    if (!runId) {
      return NextResponse.json({ 
        error: 'Failed to start roadmap generation' 
      }, { status: 500 });
    }

    // Wait for the roadmap generation to complete
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
        return NextResponse.json({ 
          error: 'Roadmap generation failed' 
        }, { status: 500 });
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json({ 
        error: 'Roadmap generation timeout' 
      }, { status: 408 });
    }

    return NextResponse.json(runStatus.data?.[0].output);

  } catch (error) {
    console.error('Error in roadmap generation:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

async function getRuns(runId: string) {
  const response = await fetch(`${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`, {
    headers: {
      Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
    }
  });
  return response.json();
} 