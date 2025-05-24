
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeartPulse, LogIn, LogOut, UserPlus, UserCircle, Briefcase } from 'lucide-react'; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_CURRENT_USER_KEY = "telehealthAppCurrentUser";

interface CurrentUser {
  email: string;
  role: "patient" | "doctor";
}

export default function Header() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const checkUser = () => {
      const userStr = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      } else {
        setCurrentUser(null);
      }
    };

    checkUser(); // Initial check

    // Listen for custom event to re-check auth status
    window.addEventListener('authChange', checkUser);
    
    // Listen for storage changes from other tabs (optional but good practice)
    window.addEventListener('storage', (event) => {
      if (event.key === LOCAL_STORAGE_CURRENT_USER_KEY) {
        checkUser();
      }
    });

    return () => {
      window.removeEventListener('authChange', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login'); // Redirect to login page
    window.dispatchEvent(new Event('authChange')); // Notify other components if needed
  };

  if (!isClient) {
    // To prevent hydration mismatch, render a placeholder or null on the server
    return (
      <header className="bg-card border-b border-border shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary hover:opacity-80 transition-opacity">
            <HeartPulse className="h-7 w-7" />
            <span>RemoteCare Connect</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            {/* Placeholder for loading state or to avoid layout shift */}
            <div className="h-9 w-20 bg-muted rounded-md animate-pulse"></div>
            <div className="h-9 w-24 bg-muted rounded-md animate-pulse"></div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card border-b border-border shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary hover:opacity-80 transition-opacity">
          <HeartPulse className="h-7 w-7" />
          <span>RemoteCare Connect</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="text-foreground hover:text-primary hover:bg-primary/10">
            <Link href="/">Home</Link>
          </Button>
          
          {currentUser ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {currentUser.role === 'doctor' ? <Briefcase className="h-5 w-5 text-accent" /> : <UserCircle className="h-5 w-5 text-accent" />}
                <span>
                  {currentUser.role === 'patient' ? 'Patient' : 'Doctor'}: {currentUser.email.split('@')[0]}
                </span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-foreground hover:text-primary hover:bg-primary/10">
                <Link href="/consultation">New Consultation</Link>
              </Button>
              <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/login"><LogIn className="mr-2 h-4 w-4" />Login</Link>
              </Button>
              <Button variant="default" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" />Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
