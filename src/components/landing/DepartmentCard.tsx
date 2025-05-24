
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DepartmentCardProps {
  name: string;
  description: string;
  Icon?: LucideIcon; // Optional: if you prefer an icon over an image
  imageSrc?: string; // Optional: if you prefer an image
  imageAlt?: string;
  dataAiHint?: string;
}

export default function DepartmentCard({ name, description, Icon, imageSrc, imageAlt = "Department image", dataAiHint }: DepartmentCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          {Icon && <Icon className="h-10 w-10 text-primary" />}
          <CardTitle className="text-2xl text-primary">{name}</CardTitle>
        </div>
        {imageSrc && (
          <div className="aspect-[16/9] relative w-full rounded-md overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              data-ai-hint={dataAiHint}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-base text-muted-foreground">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
