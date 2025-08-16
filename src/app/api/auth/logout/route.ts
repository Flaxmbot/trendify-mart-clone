import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    cookies().delete('session');
    return NextResponse.json({ message: "Successfully logged out" }, { status: 200 });
  } catch (error) {
    console.error('POST logout error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}