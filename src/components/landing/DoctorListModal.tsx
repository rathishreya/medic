
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Doctor } from "@/app/page"; // Assuming Doctor type is exported from page.tsx
import { Star, UserCircle } from "lucide-react";
import Image from "next/image";

interface DoctorListModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  doctors: Doctor[];
  departmentName: string;
}

export default function DoctorListModal({
  isOpen,
  onOpenChange,
  doctors,
  departmentName,
}: DoctorListModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
        {/* Basic implementation doesn't include half star for now, could be added */}
        {Array(emptyStars).fill(0).map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />)}
      </div>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl md:text-3xl text-primary">
            Doctors in {departmentName}
          </DialogTitle>
          <DialogDescription>
            Browse available specialists in the {departmentName} department.
          </DialogDescription>
        </DialogHeader>
        
        {doctors.length > 0 ? (
          <ScrollArea className="flex-grow pr-4 -mr-4"> {/* pr-4 -mr-4 for scrollbar spacing */}
            <div className="space-y-4 py-4">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 md:w-1/4 relative aspect-square sm:aspect-auto">
                      <Image
                        src={doctor.imageSrc}
                        alt={doctor.name}
                        fill
                        className="object-cover"
                        data-ai-hint={doctor.dataAiHint}
                      />
                    </div>
                    <div className="flex-1 p-4 sm:p-6">
                      <CardTitle className="text-xl text-primary mb-1">{doctor.name}</CardTitle>
                      <p className="text-sm text-accent font-medium mb-2">{doctor.qualification}</p>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{doctor.bio}</p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-semibold text-foreground">
                          {formatCurrency(doctor.consultationCharge)}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {renderStars(doctor.reviews.averageRating)}
                          <span className="text-xs text-muted-foreground">({doctor.reviews.count} reviews)</span>
                        </div>
                      </div>
                      
                      <CardDescription className="text-xs text-muted-foreground">
                        Specialty: {doctor.specialty}
                      </CardDescription>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10">
            <UserCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No doctors currently listed for this department.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
