import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { HistoryTable } from "@/configs/schema";

export async function GET() {
  try {
    // Test database connection by trying to select from the history table
    const result = await db.select().from(HistoryTable).limit(1);
    
    return NextResponse.json({
      status: 'Database connection successful',
      tableExists: true,
      recordCount: result.length
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      status: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      tableExists: false
    }, { status: 500 });
  }
} 