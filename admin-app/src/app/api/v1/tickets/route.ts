import { NextResponse } from 'next/server';
import { tickets } from '@/lib/data/mock-data';
import type { TicketStatus } from '@/lib/types';

export async function GET(request: Request) {
  // Middleware has already handled authentication and authorization.
  return NextResponse.json(tickets);
}

export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json() as { id: string, status: TicketStatus};
        
        if (!id || !status) {
            return NextResponse.json({ error: "Ticket ID and status are required" }, { status: 400 });
        }
    
        const ticketIndex = tickets.findIndex(t => t.id === id);
    
        if (ticketIndex === -1) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }
        
        tickets[ticketIndex].status = status;
    
        return NextResponse.json(tickets[ticketIndex], { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
