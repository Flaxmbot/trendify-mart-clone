import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
import { eq, lt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: "Authorization token is required",
        code: "MISSING_TOKEN" 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return NextResponse.json({ 
        error: "Valid authorization token is required",
        code: "INVALID_TOKEN" 
      }, { status: 401 });
    }

    // Clean up expired sessions first
    const now = new Date().toISOString();
    await db.delete(sessions).where(lt(sessions.expiresAt, now));

    // Find session with user info
    const sessionResult = await db
      .select({
        sessionId: sessions.id,
        sessionToken: sessions.token,
        sessionExpiresAt: sessions.expiresAt,
        sessionCreatedAt: sessions.createdAt,
        userId: users.id,
        userEmail: users.email,
        userName: users.name,
        userRole: users.role,
        userCreatedAt: users.createdAt,
        userUpdatedAt: users.updatedAt
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1);

    if (sessionResult.length === 0) {
      return NextResponse.json({ 
        error: "Invalid or expired session token",
        code: "INVALID_SESSION" 
      }, { status: 401 });
    }

    const result = sessionResult[0];

    // Check if session is expired
    if (new Date(result.sessionExpiresAt) < new Date()) {
      // Clean up this expired session
      await db.delete(sessions).where(eq(sessions.token, token));
      
      return NextResponse.json({ 
        error: "Session has expired",
        code: "EXPIRED_SESSION" 
      }, { status: 401 });
    }

    // Return user info (without password) and session info
    const response = {
      user: {
        id: result.userId,
        email: result.userEmail,
        name: result.userName,
        role: result.userRole,
        createdAt: result.userCreatedAt,
        updatedAt: result.userUpdatedAt
      },
      session: {
        id: result.sessionId,
        token: result.sessionToken,
        expiresAt: result.sessionExpiresAt,
        createdAt: result.sessionCreatedAt
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('GET current user error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}