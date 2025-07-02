
import type { AdminTokenView } from '@/lib/types';
import { initialRoles } from '@/lib/data/permissions-data';

export type ApiToken = {
  id: string;
  token: string;
  owner: string;
  scopes: string[];
  status: 'active' | 'revoked';
  created_at: string;
  last_used: string;
};

const superAdminPermissions = initialRoles.find(r => r.name === 'Super Admin')?.permissions || [];

// A mock database of API tokens. In a real application, this would be
// stored in a secure database like PostgreSQL or MongoDB.
let apiTokens: ApiToken[] = [
  {
    id: '1a7a8a61-7c4f-4d14-9b1e-2a4b8c6e7f21',
    token: process.env.ADMIN_API_SECRET_TOKEN || 'dev-secret-token-for-admin-panel-with-write-access',
    owner: 'lcuzr_admin_panel',
    scopes: superAdminPermissions,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    last_used: '2024-07-29T10:00:00Z',
  },
  {
    id: '2b8b9b72-8d5g-5e25-ac2f-3b5c9d7f8g32',
    token: 'readonly-token-example',
    owner: 'lcuzr_auditor',
    scopes: ['companies:view', 'logs:read'],
    status: 'active',
    created_at: '2024-03-15T00:00:00Z',
    last_used: '2024-07-28T14:30:00Z',
  },
  {
    id: '3c9c0c83-9e6h-6f36-bd3g-4c6d0e8g9h43',
    token: 'billing-service-token',
    owner: 'billing_microservice',
    scopes: ['billing:view', 'companies:view'],
    status: 'active',
    created_at: '2024-05-20T00:00:00Z',
    last_used: '2024-07-29T11:00:00Z',
  },
  {
    id: '4d0d1d94-0f7i-7g47-ce4h-5d7e1f9h0i54',
    token: 'revoked-token-example',
    owner: 'former_employee',
    scopes: ['companies:view'],
    status: 'revoked',
    created_at: '2023-11-01T00:00:00Z',
    last_used: '2024-06-01T09:00:00Z',
  },
];

// Helper to generate a cryptographically secure random token using the Web Crypto API.
function generateSecureToken(length = 48) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates a new API token and adds it to our mock database.
 * @param owner The owner of the token.
 * @param scopes The permissions assigned to the token.
 * @returns The newly created token object.
 */
export function createToken(owner: string, scopes: string[]): ApiToken {
  const newToken: ApiToken = {
    id: crypto.randomUUID(), // This uses the Web Crypto API, available in Node.js and Edge
    token: generateSecureToken(),
    owner,
    scopes,
    status: 'active',
    created_at: new Date().toISOString(),
    last_used: new Date().toISOString(), // last_used is same as created_at initially
  };
  apiTokens.unshift(newToken); // Add to the top of the list
  return newToken;
}

/**
 * Revokes an API token by its ID.
 * @param id The ID of the token to revoke.
 * @returns The revoked token object or null if not found.
 */
export function revokeToken(id: string): ApiToken | null {
  const tokenIndex = apiTokens.findIndex((t) => t.id === id);
  if (tokenIndex === -1) {
    return null;
  }
  apiTokens[tokenIndex].status = 'revoked';
  return apiTokens[tokenIndex];
}

/**
 * Returns a list of tokens for the admin UI, omitting the sensitive token string.
 * @returns An array of token data safe for UI display.
 */
export function getTokensForAdmin(): AdminTokenView[] {
  return apiTokens.map(({ token, ...rest }) => rest);
}

export type TokenPayload = {
  owner: string;
  scopes: string[];
}

/**
 * Verifies a token string. Checks if it exists and is active.
 * @param token The token string from the Authorization header.
 * @returns The token payload if valid, otherwise null.
 */
export async function verifyToken(token: string | null | undefined): Promise<TokenPayload | null> {
  if (!token) {
    return null;
  }
  
  // This can be replaced by an actual DB query in the future.
  const foundToken = apiTokens.find((t) => t.token === token && t.status === 'active');

  if (!foundToken) {
    return null;
  }

  // Update last_used timestamp (demonstration purpose)
  const tokenIndex = apiTokens.findIndex(t => t.id === foundToken.id);
  if (tokenIndex !== -1) {
    apiTokens[tokenIndex].last_used = new Date().toISOString();
  }

  return {
    owner: foundToken.owner,
    scopes: foundToken.scopes,
  };
}
