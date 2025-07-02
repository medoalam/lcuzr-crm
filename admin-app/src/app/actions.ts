
'use server';

import { revalidatePath } from 'next/cache';
import type { Company, AdminTokenView, AuditLog, Transaction, Ticket, User, TicketStatus } from '@/lib/types';
import { createToken, getTokensForAdmin, revokeToken } from '@/lib/auth/tokens';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
const ADMIN_API_TOKEN = process.env.ADMIN_API_SECRET_TOKEN || 'dev-secret-token-for-admin-panel-with-write-access';
const AUTH_HEADER = { 'Authorization': `Bearer ${ADMIN_API_TOKEN}` };

async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: `API Error: ${response.statusText}` }));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }
  return response.json();
}


// -------- Company Actions --------
type GetCompaniesResult = Company[] | { error: string };
export async function getCompanies(): Promise<GetCompaniesResult> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/companies`, { headers: AUTH_HEADER, cache: 'no-store' });
    return await handleApiResponse(response);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'An unknown error occurred.' };
  }
}

export async function addCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'usage' | 'website'>): Promise<{ error?: string }> {
    try {
      await fetch(`${BASE_URL}/api/v1/companies`, { method: 'POST', headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' }, body: JSON.stringify(companyData) });
      revalidatePath('/');
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to add company.' };
    }
}

export async function updateCompany(companyData: Partial<Company> & { id: string }): Promise<{ error?: string }> {
    try {
      await fetch(`${BASE_URL}/api/v1/companies`, { method: 'PATCH', headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' }, body: JSON.stringify(companyData) });
      revalidatePath('/');
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to update company.' };
    }
}


export async function deleteCompany(id: string): Promise<{ error?: string }> {
    try {
      await fetch(`${BASE_URL}/api/v1/companies`, { method: 'DELETE', headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      revalidatePath('/');
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete company.' };
    }
}

// -------- Billing Actions --------
type GetTransactionsResult = Transaction[] | { error: string };
export async function getTransactions(): Promise<GetTransactionsResult> {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/billing`, { headers: AUTH_HEADER, cache: 'no-store' });
        return handleApiResponse(response);
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'An unknown error occurred.' };
    }
}

// -------- Support Ticket Actions --------
type GetTicketsResult = Ticket[] | { error: string };
export async function getTickets(): Promise<GetTicketsResult> {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/tickets`, { headers: AUTH_HEADER, cache: 'no-store' });
        return handleApiResponse(response);
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'An unknown error occurred.' };
    }
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<{ error?: string }> {
    try {
        await fetch(`${BASE_URL}/api/v1/tickets`, { method: 'PATCH', headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
        revalidatePath('/');
        return {};
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Failed to update ticket.' };
    }
}


// -------- User Actions --------
type GetUsersResult = User[] | { error: string };
export async function getUsers(): Promise<GetUsersResult> {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/users`, { headers: AUTH_HEADER, cache: 'no-store' });
        return handleApiResponse(response);
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'An unknown error occurred.' };
    }
}

export async function addUser(userData: Omit<User, 'id' | 'lastLogin'>): Promise<{ error?: string }> {
    try {
        await fetch(`${BASE_URL}/api/v1/users`, { method: 'POST', headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' }, body: JSON.stringify(userData) });
        revalidatePath('/');
        return {};
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Failed to add user.' };
    }
}

export async function updateUser(userData: Partial<User> & { id: string }): Promise<{ error?: string }> {
    try {
        await fetch(`${BASE_URL}/api/v1/users`, { method: 'PATCH', headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' }, body: JSON.stringify(userData) });
        revalidatePath('/');
        return {};
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Failed to update user.' };
    }
}

export async function deleteUser(id: string): Promise<{ error?: string }> {
    try {
        await fetch(`${BASE_URL}/api/v1/users`, { method: 'DELETE', headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        revalidatePath('/');
        return {};
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Failed to delete user.' };
    }
}


// -------- Token Actions --------
type GetAdminTokensResult = AdminTokenView[] | { error: string };
export async function getAdminTokensAction(): Promise<GetAdminTokensResult> {
  try {
    const tokens = getTokensForAdmin();
    return tokens;
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'An unknown error occurred.' };
  }
}

export async function createApiToken(data: { owner: string; scopes: string[] }): Promise<{ token: string } | { error: string }> {
  try {
    const { owner, scopes } = data;
    if (!owner || scopes.length === 0) {
      return { error: 'Owner and at least one scope are required.' };
    }
    const newToken = createToken(owner, scopes);
    revalidatePath('/'); 
    return { token: newToken.token };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create token.' };
  }
}

export async function revokeApiToken(id: string): Promise<{ success: true } | { error: string }> {
  try {
    const result = revokeToken(id);
    if (!result) {
      return { error: 'Token not found.' };
    }
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to revoke token.' };
  }
}


// -------- Audit Log Actions --------
type GetAuditLogsResult = AuditLog[] | { error: string };
export async function getAuditLogs(): Promise<GetAuditLogsResult> {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/logs`, { headers: AUTH_HEADER, cache: 'no-store' });
        return await handleApiResponse(response);
      } catch (err) {
        if (err instanceof Error) {
            return { error: err.message };
        }
        return { error: 'An unknown error occurred.' };
      }
}
