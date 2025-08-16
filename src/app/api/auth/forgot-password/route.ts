import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const link = await adminAuth.generatePasswordResetLink(email);

    // In a real app, you would send this link to the user's email address.
    // For this example, we'll return the link in the response for testing purposes.
    return NextResponse.json({ message: "Password reset link sent", link });

  } catch (error: any) {
    console.error('POST error:', error);
    if (error.code === 'auth/user-not-found') {
        // Don't reveal that the user doesn't exist.
        return NextResponse.json({ message: "Password reset link sent" });
    }
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}