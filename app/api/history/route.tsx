import { NextResponse } from "next/server";
import { db } from '../../../configs/db'
import { HistoryTable } from '../../../configs/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq, and } from "drizzle-orm";
import { or } from "drizzle-orm";


export async function POST(req:any) {
  const { content, recordId, aiAgentType, metaData } = await req.json();
  const user = await currentUser();
  try {
    // Insert record
    const result = await db.insert(HistoryTable).values({
      recordId: recordId,
      content: content,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: (new Date()).toString(),
      aiAgentType: aiAgentType,
      metaData: metaData // <-- store metaData if provided
    });
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json(e)
  }
}


export async function PUT(req:any){
  const { content, recordId, metaData } = await req.json();
   try {
    // Update record
    const result = await db.update(HistoryTable).set({
      content: content,
      ...(metaData !== undefined ? { metaData } : {}) // update metaData if provided
    }).where(eq(HistoryTable.recordId,recordId))

    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json(e)
  }

}

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const recordId = searchParams.get('recordId');
  const user = await currentUser();

  try {
    if (recordId) {
      const result = await db.select().from(HistoryTable)
        .where(eq(HistoryTable.recordId, recordId));
      
      if (result[0]) {
        // If we have base64 PDF data, extract text for fallback display
        let pdfText = null;
        if (result[0].metaData && result[0].metaData.startsWith('data:application/pdf;base64,')) {
          try {
            const pdfParse = require('pdf-parse');
            const base64Data = result[0].metaData.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            const pdfData = await pdfParse(buffer);

            pdfText = pdfData.text;
          } catch (error) {
            console.error('Error parsing PDF text:', error);
          }
        }
        
        return NextResponse.json({
          ...result[0],
          pdfText
        });
      }
      return NextResponse.json({});
    }
    else{
       const result = await db.select().from(HistoryTable)
        .where(eq(HistoryTable.userEmail, user?.primaryEmailAddress?.emailAddress || ''));
        return NextResponse.json(result);
    }
    return NextResponse.json({});
    
  } catch (e) {
    return NextResponse.json(e);
  }
}

export async function DELETE(req: any) {
  const { searchParams } = new URL(req.url);
  const recordId = searchParams.get('recordId');
  const clearAll = searchParams.get('clearAll');
  const user = await currentUser();

  if (clearAll === 'true') {
    // Delete all history for the user
    if (!user || typeof user.primaryEmailAddress?.emailAddress !== 'string') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 400 });
    }
    const userEmail: string = user.primaryEmailAddress.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ error: 'Missing user email' }, { status: 400 });
    }
    try {
      const result = await db.delete(HistoryTable)
        .where(eq(HistoryTable.userEmail, userEmail!));
      return NextResponse.json({ success: true, result });
    } catch (e) {
      return NextResponse.json({ error: 'Failed to clear history', details: e }, { status: 500 });
    }
  }

  if (!recordId || typeof recordId !== 'string' || !user || typeof user.primaryEmailAddress?.emailAddress !== 'string') {
    return NextResponse.json({ error: 'Missing recordId or not authenticated' }, { status: 400 });
  }
  try {
    // Only delete if the user owns the record
    const userEmail = user.primaryEmailAddress?.emailAddress || '';
    if (!userEmail) {
      return NextResponse.json({ error: 'Missing user email' }, { status: 400 });
    }
    const result = await db.delete(HistoryTable)
      .where(
        and(
          eq(HistoryTable.recordId, recordId as string),
          eq(HistoryTable.userEmail, userEmail)
        )
      );
    return NextResponse.json({ success: true, result });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete history', details: e }, { status: 500 });
  }
}