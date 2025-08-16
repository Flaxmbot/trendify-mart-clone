import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
import { eq, lt } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json({
        error: "Email is required",
        code: "MISSING_EMAIL"
      }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({
        error: "Password is required",
        code: "MISSING_PASSWORD"
      }, { status: 400 });
    }

    // Sanitize email input
    const sanitizedEmail = email.toLowerCase().trim();

    // Clean up expired sessions
    await db.delete(sessions)
      .where(lt(sessions.expiresAt, new Date().toISOString()));

    // Find user by email (case insensitive)
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, sanitizedEmail))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS"
      }, { status: 401 });
    }

    const user = userResult[0];

    // Compare password using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS"
      }, { status: 401 });
    }

    // Generate secure session token
    const sessionToken = uuidv4();
    
    // Calculate expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create session record
    const newSession = await db.insert(sessions)
      .values({
        userId: user.id,
        token: sessionToken,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString()
      })
      .returning();

    // Return user info (without password) and session token
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      sessionToken: sessionToken,
      expiresAt: expiresAt.toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}