'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function GetStartedButton({ size = 'lg', variant = 'default', children, className }: { size?: 'lg' | 'default' | 'sm' | 'icon', variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link', children?: React.ReactNode, className?: string }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasToken, setHasToken] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    // Check for token on component mount
    const token = localStorage.getItem('userRole'); // Check for the role as per useUser logic
    if (token) {
      setHasToken(true);
    }
  }, []);

  const handleClick = () => {
    setIsLoading(true);

    if (hasToken) {
      router.push('/dashboard');
      return;
    }
    
    // For new users, redirect to the signup page
    router.push('/signup');
  };
  
  const buttonText = hasToken ? "Go to Dashboard" : (children || "Get Started Free");

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        size={size}
        variant={variant as any}
        onClick={handleClick}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {isLoading ? 'Redirecting...' : buttonText}
      </Button>
    </motion.div>
  );
}
