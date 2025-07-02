
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/tokens';

// Define the required scopes for each route, acting as a gateway config
const routeScopes: Record<string, { method: string; scope: string }[]> = {
  '^/api/v1/companies$': [
    { method: 'GET', scope: 'companies:view' },
    { method: 'POST', scope: 'companies:create' },
    { method: 'PATCH', scope: 'companies:edit' },
    { method: 'DELETE', scope: 'companies:delete' }
  ],
  '^/api/v1/users$': [
    { method: 'GET', scope: 'users:view' },
    { method: 'POST', scope: 'users:invite' },
    { method: 'PATCH', scope: 'users:manage' },
    { method: 'DELETE', scope: 'users:manage' }
  ],
  '^/api/v1/tickets$': [
    { method: 'GET', scope: 'support:view' },
    { method: 'PATCH', scope: 'support:manage' },
  ],
  '^/api/v1/billing$': [
    { method: 'GET', scope: 'billing:view' },
  ],
  '^/api/v1/tokens$': [{ method: 'GET', scope: 'gateway:admin' }],
  '^/api/v1/logs$': [{ method: 'GET', scope: 'logs:read' }],
  '^/api/v1/company/([^/]+)$': [
    { method: 'GET', scope: 'companies:view' },
    { method: 'PATCH', scope: 'companies:edit' },
    { method: 'DELETE', scope: 'companies:delete' }
  ],
  '^/api/v1/company/([^/]+)/plan$': [{ method: 'PATCH', scope: 'billing:manage' }],
  '^/api/v1/logs/([^/]+)$': [{ method: 'GET', scope: 'logs:read' }],
};

function findRouteConfig(path: string) {
  for (const pattern in routeScopes) {
    if (new RegExp(pattern).test(path)) {
      return routeScopes[pattern];
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const requiredPermissions = findRouteConfig(path);
  
  // If no permissions are defined for this route, deny access.
  if (!requiredPermissions) {
    return new Response(JSON.stringify({ error: 'Forbidden: Unknown API endpoint or route not configured in gateway.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
    
  const permissionForMethod = requiredPermissions.find(p => p.method === request.method);

  // If the method is not configured for this route, deny access.
  if (!permissionForMethod) {
    return new Response(JSON.stringify({ error: `Forbidden: Method ${request.method} not allowed for this endpoint.` }), {
      status: 405, // Method Not Allowed
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const requiredScope = permissionForMethod.scope;

  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid token format.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.split(' ')[1];
  const tokenPayload = await verifyToken(token);

  if (!tokenPayload) {
    return new Response(JSON.stringify({ error: 'Forbidden: Invalid or inactive token.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!tokenPayload.scopes.includes(requiredScope)) {
    // A real audit system would log this failure
    return new Response(JSON.stringify({ error: `Forbidden: Your token is missing the required scope: '${requiredScope}'` }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // A real audit system would log this successful access
  
  return NextResponse.next();
}

// Apply this middleware to all /api/v1/ routes
export const config = {
  matcher: '/api/v1/:path*',
};
