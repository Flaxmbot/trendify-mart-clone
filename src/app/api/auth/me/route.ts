import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = cookies().get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const user = await adminAuth.getUser(decodedToken.uid);

    return NextResponse.json({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.customClaims?.role || 'user'
    }, { status: 200 });

  } catch (error) {
    console.error('GET current user error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}