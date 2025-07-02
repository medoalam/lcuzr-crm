'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

interface UserContextType {
  user: User | null;
  setUserRole: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  'Admin': { name: 'Admin User', role: 'Admin', avatar: 'https://placehold.co/40x40.png', scopes: ['billing:view', 'users:view', 'support:view', 'settings:edit'] },
  'Sales Manager': { name: 'S. Manager', role: 'Sales Manager', avatar: 'https://placehold.co/40x40.png', scopes: ['billing:view', 'support:view'] },
  'Showroom Rep': { name: 'S. Rep', role: 'Showroom Rep', avatar: 'https://placehold.co/40x40.png', scopes: ['support:view'] },
  'Field Rep': { name: 'F. Rep', role: 'Field Rep', avatar: 'https://placehold.co/40x40.png', scopes: ['support:view'] },
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') as UserRole | null : null;
    if (storedRole && mockUsers[storedRole]) {
      setUser(mockUsers[storedRole]);
    } else {
      setUser(null); // Clear user if no role
      const publicPages = ['/', '/login'];
      if (!publicPages.includes(pathname)) {
        router.push('/login');
      }
    }
    setIsLoading(false);
  }, [router, pathname]);

  const setUserRole = (role: UserRole) => {
    if (mockUsers[role]) {
      localStorage.setItem('userRole', role);
      setUser(mockUsers[role]);
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('userRole');
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUserRole, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
