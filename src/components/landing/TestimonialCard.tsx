import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { User } from 'lucide-react'; 

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  imageSrc?: string;
  dataAiHint?: string;
}

export default function TestimonialCard({ quote, author, role, imageSrc, dataAiHint }: TestimonialCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <blockquote className="text-lg italic text-foreground relative">
          <span className="absolute -top-2 -left-3 text-5xl text-primary/50 opacity-75">&ldquo;</span>
          {quote}
          <span className="absolute -bottom-4 -right-1 text-5xl text-primary/50 opacity-75">&rdquo;</span>
        </blockquote>
      </CardHeader>
      <CardContent className="flex-grow" /> 
      <CardFooter className="mt-auto pt-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          {imageSrc && (
            <Avatar className="h-12 w-12 border-2 border-accent">
              <AvatarImage src={imageSrc} alt={author} data-ai-hint={dataAiHint} className="object-cover"/>
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <p className="font-semibold text-primary">{author}</p>
            {role && <p className="text-sm text-muted-foreground">{role}</p>}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}


