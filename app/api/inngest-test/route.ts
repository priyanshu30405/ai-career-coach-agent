import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function GET() {
  try {
    // Test Inngest connection by sending a simple event
    const result = await inngest.send({
      name: 'test/connection',
      data: {
        message: 'Test connection'
      }
    });

    return NextResponse.json({
      status: 'Inngest connection successful',
      eventId: result.ids[0]
    });
  } catch (error) {
    console.error('Inngest connection error:', error);
    return NextResponse.json({
      status: 'Inngest connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 