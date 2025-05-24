
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, CalendarDays, Pill, FileSignature, Save, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface PrescriptionPadProps {
  doctorName: string;
  doctorContact: string;
  clinicName: string;
  clinicAddress: string;
}

export default function PrescriptionPad({
  doctorName,
  doctorContact,
  clinicName,
  clinicAddress
}: PrescriptionPadProps) {
  const [patientName, setPatientName] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const { toast } = useToast();

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !medication || !dosage || !instructions) {
        toast({
            title: "Missing Information",
            description: "Please fill all fields before saving the prescription.",
            variant: "destructive",
        });
        return;
    }

    // Simulate save action
    console.log({
      doctorName,
      patientName,
      prescriptionDate,
      medication,
      dosage,
      instructions,
    });
    toast({
      title: "Prescription Saved",
      description: `Prescription for ${patientName} has been saved.`,
      variant: "default",
      className: "bg-green-600 text-white dark:bg-green-700 dark:text-white"
    });
    // Optionally clear fields after saving
    // setPatientName('');
    // setMedication('');
    // setDosage('');
    // setInstructions('');
  };

  return (
    <Card className="border-2 border-primary/50 shadow-md">
      <CardHeader className="bg-muted/30 p-4 border-b border-primary/30">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary">{clinicName}</h2>
          <p className="text-sm text-muted-foreground">{clinicAddress}</p>
          <p className="text-sm text-muted-foreground">{doctorName} | {doctorContact}</p>
        </div>
      </CardHeader>
      <form onSubmit={handleSavePrescription}>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName" className="flex items-center gap-2 text-base mb-1"><User className="h-4 w-4 text-accent" />Patient Name</Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Full Name of Patient"
                required
                className="text-base"
              />
            </div>
            <div>
              <Label htmlFor="prescriptionDate" className="flex items-center gap-2 text-base mb-1"><CalendarDays className="h-4 w-4 text-accent" />Date</Label>
              <Input
                id="prescriptionDate"
                type="date"
                value={prescriptionDate}
                onChange={(e) => setPrescriptionDate(e.target.value)}
                required
                className="text-base"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="medication" className="flex items-center gap-2 text-base mb-1"><Pill className="h-4 w-4 text-accent" />Medication</Label>
            <Textarea
              id="medication"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              placeholder="e.g., Amoxicillin 250mg, Tab Paracetamol 500mg"
              rows={3}
              required
              className="text-base"
            />
          </div>

          <div>
            <Label htmlFor="dosage" className="flex items-center gap-2 text-base mb-1"><FileSignature className="h-4 w-4 text-accent" />Dosage & Frequency</Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 1 tablet thrice daily for 5 days"
              required
              className="text-base"
            />
          </div>

          <div>
            <Label htmlFor="instructions" className="flex items-center gap-2 text-base mb-1"><FileText className="h-4 w-4 text-accent" />Instructions/Notes</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Take after meals. Drink plenty of water."
              rows={3}
              className="text-base" // Instructions are not strictly required, so removed 'required'
            />
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t border-primary/30 flex flex-col items-end space-y-3">
          <div className="w-full text-right">
            <p className="text-sm text-muted-foreground">Doctor's Signature:</p>
            <p className="font-serif text-lg text-primary italic">{doctorName}</p>
          </div>
          <Button type="submit" size="lg" className="text-base">
            <Save className="mr-2 h-5 w-5" /> Save Prescription
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
