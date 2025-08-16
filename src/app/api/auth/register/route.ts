import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { email, password, name, role = 'user' } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password and name are required" }, { status: 400 });
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    return NextResponse.json({ uid: userRecord.uid, email: userRecord.email }, { status: 201 });

  } catch (error: any) {
    console.error('POST error:', error);
    if (error.code === 'auth/email-already-exists') {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}