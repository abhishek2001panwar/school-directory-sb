import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // For JWT tokens, logout is primarily handled client-side
    // by removing the token from localStorage
    // This endpoint can be used for logging or cleanup if needed
    
    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
