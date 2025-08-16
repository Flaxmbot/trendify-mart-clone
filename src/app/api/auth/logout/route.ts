import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({ 
        error: "Authorization header is required",
        code: "MISSING_AUTH_HEADER" 
      }, { status: 401 });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: "Invalid authorization format. Expected 'Bearer <token>'",
        code: "INVALID_AUTH_FORMAT" 
      }, { status: 401 });
    }

    // Extract token
    const token = authHeader.substring(7).trim();
    
    if (!token) {
      return NextResponse.json({ 
        error: "Token is required",
        code: "MISSING_TOKEN" 
      }, { status: 401 });
    }

    // Check if session exists
    const existingSession = await db.select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);

    if (existingSession.length === 0) {
      return NextResponse.json({ 
        error: "Invalid or expired session token",
        code: "INVALID_TOKEN" 
      }, { status: 401 });
    }

    // Delete the session
    const deletedSession = await db.delete(sessions)
      .where(eq(sessions.token, token))
      .returning();

    if (deletedSession.length === 0) {
      return NextResponse.json({ 
        error: "Failed to logout. Session may have already been deleted",
        code: "LOGOUT_FAILED" 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      message: "Successfully logged out",
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error('POST logout error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}