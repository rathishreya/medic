
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeartPulse } from 'lucide-react'; 

export default function Header() {
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
          <Button variant="ghost" asChild className="text-foreground hover:text-primary hover:bg-primary/10">
            <Link href="/consultation">New Consultation</Link>
          </Button>
          {/* Example: Login button, can be expanded later 
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button> 
          */}
        </nav>
      </div>
    </header>
  );
}
