
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeartPulse, LogIn, LogOut, UserPlus, UserCircle, Briefcase, LayoutDashboard } from 'lucide-react'; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

    checkUser(); 

    window.addEventListener('authChange', checkUser);
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
    router.push('/login'); 
    window.dispatchEvent(new Event('authChange')); 
  };

  if (!isClient) {
    return (
      <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-emerald-700 hover:opacity-80 transition-opacity">
            <HeartPulse className="h-7 w-7 text-emerald-600" />
            <span>RemoteCare Connect</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <div className="h-9 w-20 bg-emerald-100 rounded-md animate-pulse"></div>
            <div className="h-9 w-24 bg-emerald-100 rounded-md animate-pulse"></div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-emerald-700 hover:opacity-80 transition-opacity">
          <HeartPulse className="h-7 w-7 text-emerald-600" />
          <span>RemoteCare Connect</span>
        </Link>
        
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <Button variant="ghost" asChild className="text-emerald-800 hover:text-emerald-700 hover:bg-emerald-50 px-2 sm:px-3">
            <Link href="/">Home</Link>
          </Button>
          
          {currentUser ? (
            <>
              {currentUser.role === 'patient' && (
                <Button variant="ghost" asChild className="text-emerald-800 hover:text-emerald-700 hover:bg-emerald-50 px-2 sm:px-3">
                  <Link href="/patient/dashboard">
                    <LayoutDashboard className="mr-0 sm:mr-2 h-4 w-4 text-emerald-600" />
                    <span className="hidden sm:inline">My Dashboard</span>
                  </Link>
                </Button>
              )}
              {currentUser.role === 'doctor' && (
                <Button variant="ghost" asChild className="text-emerald-800 hover:text-emerald-700 hover:bg-emerald-50 px-2 sm:px-3">
                  <Link href="/doctor/dashboard">
                    <LayoutDashboard className="mr-0 sm:mr-2 h-4 w-4 text-emerald-600" />
                    <span className="hidden sm:inline">Doctor Dashboard</span>
                  </Link>
                </Button>
              )}
              
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-emerald-700 border-l border-emerald-100 pl-2 sm:pl-3 md:pl-4">
                <div className="p-1 bg-emerald-100 rounded-full">
                  {currentUser.role === 'doctor' ? 
                    <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" /> : 
                    <UserCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                  }
                </div>
                <span className="truncate max-w-[80px] sm:max-w-[120px]">
                  {currentUser.email.split('@')[0]}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-2 sm:px-3 text-xs sm:text-sm"
              >
                <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-emerald-800 hover:text-emerald-700 hover:bg-emerald-50 px-2 sm:px-3">
                <Link href="/consultation">New Consultation</Link>
              </Button>
              
              <Button 
                variant="outline" 
                asChild 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-2 sm:px-3 text-xs sm:text-sm"
              >
                <Link href="/login">
                  <LogIn className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Login
                </Link>
              </Button>
              
              <Button 
                variant="default" 
                asChild 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 sm:px-3 text-xs sm:text-sm shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href="/signup">
                  <UserPlus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
