
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StoredPrescription } from "@/components/doctor/PrescriptionPad";
import { CalendarDays, Pill, FileSignature, FileText, Hospital, UserMd } from "lucide-react";
import { format, parseISO } from "date-fns";

interface PrescriptionViewCardProps {
  prescription: StoredPrescription;
}

export default function PrescriptionViewCard({ prescription }: PrescriptionViewCardProps) {
  return (
    <Card className="border-primary/30 shadow-md w-full">
      <CardHeader className="bg-muted/20 p-4 border-b border-primary/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Pill className="h-6 w-6" /> Prescription Details
            </CardTitle>
            <CardDescription className="text-sm">
              Issued on: {format(parseISO(prescription.issuedDate), "PPP p")}
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground text-left sm:text-right">
            <p className="font-medium flex items-center gap-1"><UserMd className="h-4 w-4 text-accent"/>Dr. {prescription.doctorName}</p>
            <p className="flex items-center gap-1"><Hospital className="h-4 w-4 text-accent"/>{prescription.clinicName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">Patient Name</Label>
          <p className="text-base font-medium">{prescription.patientName}</p>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Prescription Date</Label>
          <p className="text-base">{format(new Date(prescription.prescriptionDate), "PPP")}</p>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground flex items-center gap-1"><Pill className="h-3 w-3" />Medication(s)</Label>
          <p className="text-base whitespace-pre-wrap break-words bg-background/50 p-2 rounded-md border">{prescription.medication}</p>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground flex items-center gap-1"><FileSignature className="h-3 w-3" />Dosage & Frequency</Label>
          <p className="text-base bg-background/50 p-2 rounded-md border">{prescription.dosage}</p>
        </div>
        {prescription.instructions && (
          <div>
            <Label className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" />Instructions/Notes</Label>
            <p className="text-base whitespace-pre-wrap break-words bg-background/50 p-2 rounded-md border">{prescription.instructions}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t border-primary/20">
        <p className="text-xs text-muted-foreground">
          This prescription was digitally issued. Always follow your doctor's advice. If you have questions, contact {prescription.doctorContact}.
        </p>
      </CardFooter>
    </Card>
  );
}

// Minimal Label component if not imported globally or needed locally
const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`block font-medium ${className || ''}`}>{children}</span>
);
