import { NextResponse } from 'next/server';
import { getTokensForAdmin } from '@/lib/auth/tokens';

// In a real app, this would fetch from a database.
// This function is just for the admin UI and masks the full token.
export async function GET(request: Request) {
  // Middleware has already handled authentication and authorization.
  const tokens = getTokensForAdmin();
  return NextResponse.json(tokens);
}
