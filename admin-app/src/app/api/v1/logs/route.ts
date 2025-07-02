import { NextResponse } from 'next/server';
import { auditLogs } from '@/lib/data/mock-data';


export async function GET(request: Request) {
  // Middleware has already handled authentication and authorization.
  return NextResponse.json(auditLogs);
}
