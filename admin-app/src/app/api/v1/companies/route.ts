
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { companies } from '@/lib/data/mock-data';

// GET /api/v1/companies
export async function GET(request: Request) {
  // Middleware has already handled authentication and authorization.
  return NextResponse.json(companies);
}

// POST /api/v1/companies
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCompany = {
      id: crypto.randomUUID(),
      ...body,
      website: `https://www.${body.name.toLowerCase().replace(/ /g, '')}.com`,
      usage: { users: 0, storage: 0, limit: body.plan === 'Free' ? 10 : 50 }, // Example logic
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    companies.unshift(newCompany); // Add to the top
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// PATCH /api/v1/companies
export async function PATCH(request: Request) {
    try {
      const body = await request.json();
      const { id, ...updateData } = body;
  
      const companyIndex = companies.findIndex(c => c.id === id);
  
      if (companyIndex === -1) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
      }
  
      companies[companyIndex] = {
        ...companies[companyIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
  
      return NextResponse.json(companies[companyIndex]);
    } catch (error) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

// DELETE /api/v1/companies
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
    
        if (!id) {
            return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
        }
    
        const initialLength = companies.length;
        const indexToDelete = companies.findIndex(c => c.id === id);
        
        if (indexToDelete === -1) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 });
        }
        
        companies.splice(indexToDelete, 1);
    
        return NextResponse.json({ message: "Company deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
