import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { users } from '@/lib/data/mock-data';

// GET /api/v1/users
export async function GET(request: Request) {
  return NextResponse.json(users);
}

// POST /api/v1/users
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = {
      id: crypto.randomUUID(),
      ...body,
      lastLogin: new Date().toISOString(),
    };
    users.unshift(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// PATCH /api/v1/users
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    users[userIndex] = { ...users[userIndex], ...updateData };
    return NextResponse.json(users[userIndex]);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// DELETE /api/v1/users
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const initialLength = users.length;
    const indexToDelete = users.findIndex(u => u.id === id);
    if (indexToDelete === -1) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    users.splice(indexToDelete, 1);
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
