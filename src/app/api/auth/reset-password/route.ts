import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    // Validate required fields
    if (!token) {
      return NextResponse.json({ 
        error: "Reset token is required",
        code: "MISSING_TOKEN" 
      }, { status: 400 });
    }

    if (!newPassword) {
      return NextResponse.json({ 
        error: "New password is required",
        code: "MISSING_PASSWORD" 
      }, { status: 400 });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters long",
        code: "WEAK_PASSWORD" 
      }, { status: 400 });
    }

    // Find valid reset token in sessions table
    const sessionResult = await db.select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);

    if (sessionResult.length === 0) {
      return NextResponse.json({ 
        error: "Invalid reset token",
        code: "INVALID_TOKEN" 
      }, { status: 401 });
    }

    const session = sessionResult[0];

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    if (now > expiresAt) {
      // Delete expired token
      await db.delete(sessions)
        .where(eq(sessions.id, session.id));

      return NextResponse.json({ 
        error: "Reset token has expired",
        code: "EXPIRED_TOKEN" 
      }, { status: 401 });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password and updatedAt timestamp
    const updatedUser = await db.update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, session.userId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete used reset token from sessions
    await db.delete(sessions)
      .where(eq(sessions.id, session.id));

    return NextResponse.json({
      message: "Password reset successfully",
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}