
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Package2, ArrowRight, Loader2 } from 'lucide-react';

import { useUser } from '@/hooks/use-user';
import type { User, UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';


const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().optional(),
});

const mockUsers: Record<UserRole, User> = {
  'Admin': { name: 'Admin User', role: 'Admin', avatar: 'https://placehold.co/100x100.png' },
  'Sales Manager': { name: 'S. Manager', role: 'Sales Manager', avatar: 'https://placehold.co/100x100.png' },
  'Showroom Rep': { name: 'S. Rep', role: 'Showroom Rep', avatar: 'https://placehold.co/100x100.png' },
  'Field Rep': { name: 'F. Rep', role: 'Field Rep', avatar: 'https://placehold.co/100x100.png' },
};


const UserSelectionCard = ({ user, onSelect, disabled }: { user: User, onSelect: (role: UserRole) => void, disabled: boolean }) => {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card
        onClick={() => !disabled && onSelect(user.role)}
        className={`cursor-pointer transition-all hover:shadow-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>
    </motion.div>
  );
};


export default function LoginPage() {
    const { setUserRole } = useUser();
    const [step, setStep] = React.useState<'login' | 'selection' | 'workspace_loading'>('login');
    const [isLoggingIn, setIsLoggingIn] = React.useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: '', password: '', rememberMe: false },
    });
    
    const startLoginProcess = () => {
        setIsLoggingIn(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoggingIn(false);
            setStep('selection');
        }, 1500);
    }

    const handleLogin = (values: z.infer<typeof loginSchema>) => {
        console.log("Simulating login for:", values.email);
        startLoginProcess();
    };
    
    const handleDemoLogin = () => {
        form.setValue('email', 'demo@lcuzr.com');
        form.setValue('password', 'lcuzr123');
        // A short delay to allow the user to see the filled fields
        setTimeout(() => {
             startLoginProcess();
        }, 200);
    }

    const handleSelectRole = (role: UserRole) => {
        setStep('workspace_loading');
        setTimeout(() => {
            setUserRole(role);
        }, 1500);
    };
    
    if (step === 'workspace_loading') {
        return (
             <div className="w-full max-w-md space-y-8 text-center">
                 <Package2 className="mx-auto h-12 w-12 text-primary animate-pulse" />
                 <h1 className="mt-6 text-3xl font-bold tracking-tight">Preparing your workspace...</h1>
                 <p className="mt-2 text-muted-foreground">Please wait a moment while we get things ready.</p>
            </div>
        )
    }
    
    if (step === 'selection') {
        return (
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <Package2 className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-6 text-3xl font-bold tracking-tight">Welcome Back!</h1>
                <p className="mt-2 text-muted-foreground">Please select your profile to continue.</p>
              </div>

              <div className="space-y-4">
                {Object.values(mockUsers).map((user) => (
                  <UserSelectionCard 
                    key={user.role} 
                    user={user} 
                    onSelect={handleSelectRole}
                    disabled={step === 'workspace_loading'}
                  />
                ))}
              </div>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <div className="mb-4">
                     <Package2 className="mx-auto h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Sign in to your account</CardTitle>
                <CardDescription>Enter your email and password below to log in.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input placeholder="name@example.com" {...field} disabled={isLoggingIn} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                 <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                    <Link href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
                                 </div>
                                <FormControl><Input type="password" placeholder="••••••••" {...field} disabled={isLoggingIn} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="rememberMe" render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoggingIn} /></FormControl>
                                <FormLabel className="font-normal">Remember me</FormLabel>
                            </FormItem>
                        )}/>
                        <Button type="submit" className="w-full" disabled={isLoggingIn}>
                            {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </form>
                </Form>
                 <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <Button variant="outline" className="w-full" onClick={handleDemoLogin} disabled={isLoggingIn}>
                    {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Login with Demo Account
                </Button>
                
                 <div className="mt-4 text-center text-sm">
                    Don't have an account? <Link href="/signup" className="underline">Sign up</Link>
                </div>
            </CardContent>
        </Card>
    );
}
