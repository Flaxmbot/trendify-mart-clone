import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate required field: email
    if (!email) {
      return NextResponse.json({ 
        error: "Email is required",
        code: "MISSING_EMAIL" 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Invalid email format",
        code: "INVALID_EMAIL_FORMAT" 
      }, { status: 400 });
    }

    // Sanitize email input
    const sanitizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await db.select()
      .from(users)
      .where(eq(users.email, sanitizedEmail))
      .limit(1);

    // Generate password reset token using uuid v4
    const resetToken = uuidv4();
    
    // Calculate expiration time (1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // If user exists, store reset token in sessions table
    if (user.length > 0) {
      await db.insert(sessions)
        .values({
          userId: user[0].id,
          token: resetToken,
          expiresAt: expiresAt,
          createdAt: new Date().toISOString()
        });
    }

    // Always return success message for security (don't reveal if email exists)
    return NextResponse.json({
      message: "If an account with this email exists, a password reset link has been sent to your email address."
    }, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}