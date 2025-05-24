
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react'; // Generic user icon for fallback

interface DoctorProfileCardProps {
  name: string;
  specialty: string;
  bio: string;
  imageSrc: string;
  dataAiHint?: string;
}

export default function DoctorProfileCard({ name, specialty, bio, imageSrc, dataAiHint }: DoctorProfileCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="items-center text-center pb-4">
        <Avatar className="h-32 w-32 mb-4 border-4 border-primary/50 shadow-md">
          <AvatarImage src={imageSrc} alt={name} data-ai-hint={dataAiHint} className="object-cover" />
          <AvatarFallback>
            <User className="h-16 w-16 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl text-primary">{name}</CardTitle>
        <CardDescription className="text-base text-accent font-medium">{specialty}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow text-center">
        <p className="text-sm text-muted-foreground">{bio}</p>
      </CardContent>
    </Card>
  );
}
