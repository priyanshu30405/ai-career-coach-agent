import { NextResponse } from "next/server";

export async function GET() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_NEON_DB_CONNECTION_STRING',
    'GEMINI_API_KEY',
    'IMAGEKIT_PUBLIC_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'IMAGEKIT_ENDPOINT_URL',
    'INNGEST_SERVER_HOST',
    'INNGEST_SIGNING_KEY'
  ];

  const envStatus = requiredEnvVars.map(envVar => ({
    name: envVar,
    set: !!process.env[envVar],
    value: process.env[envVar] ? '***' : 'NOT SET'
  }));

  return NextResponse.json({
    status: 'Environment Check',
    variables: envStatus,
    allSet: envStatus.every(v => v.set)
  });
} 