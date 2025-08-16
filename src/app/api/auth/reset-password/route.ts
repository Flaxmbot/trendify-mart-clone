import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { oobCode, newPassword } = body;

    if (!oobCode || !newPassword) {
      return NextResponse.json({ error: "Reset code and new password are required" }, { status: 400 });
    }

    const email = await adminAuth.verifyPasswordResetCode(oobCode);
    const user = await adminAuth.getUserByEmail(email);

    await adminAuth.updateUser(user.uid, {
        password: newPassword
    });

    await adminAuth.revokeRefreshTokens(user.uid);

    return NextResponse.json({ message: "Password reset successfully" });

  } catch (error: any) {
    console.error('POST error:', error);
    if (error.code === 'auth/invalid-action-code') {
        return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}