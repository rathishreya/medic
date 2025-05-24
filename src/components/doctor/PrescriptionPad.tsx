
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, CalendarDays, Pill, FileSignature, Save, FileText, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface PrescriptionPadProps {
  doctorName: string;
  doctorContact: string;
  clinicName: string;
  clinicAddress: string;
}

export interface StoredPrescription {
  id: string;
  doctorName: string;
  doctorContact: string;
  clinicName: string;
  clinicAddress: string;
  patientName: string;
  patientEmail: string; // Used to key prescriptions for patient
  prescriptionDate: string;
  medication: string;
  dosage: string;
  instructions: string;
  issuedDate: string; // ISO string of when it was saved
}

const LOCAL_STORAGE_PRESCRIPTIONS_KEY_PREFIX = "telehealthAppPrescriptions_";

export default function PrescriptionPad({
  doctorName,
  doctorContact,
  clinicName,
  clinicAddress
}: PrescriptionPadProps) {
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const { toast } = useToast();

  const handleSaveAndSendPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientEmail || !medication || !dosage) { // Instructions are optional
        toast({
            title: "Missing Information",
            description: "Please fill all required fields (Patient Name, Email, Medication, Dosage) before saving.",
            variant: "destructive",
        });
        return;
    }
    if (!patientEmail.match(/^[\w.-]+@[\w.-]+\.\w{2,}$/)) {
        toast({
            title: "Invalid Patient Email",
            description: "Please enter a valid email address for the patient.",
            variant: "destructive",
        });
        return;
    }

    const newPrescription: StoredPrescription = {
      id: Date.now().toString(),
      doctorName,
      doctorContact,
      clinicName,
      clinicAddress,
      patientName,
      patientEmail: patientEmail.toLowerCase(),
      prescriptionDate,
      medication,
      dosage,
      instructions,
      issuedDate: new Date().toISOString(),
    };

    try {
      const storageKey = LOCAL_STORAGE_PRESCRIPTIONS_KEY_PREFIX + newPrescription.patientEmail;
      const existingPrescriptionsStr = localStorage.getItem(storageKey);
      const existingPrescriptions: StoredPrescription[] = existingPrescriptionsStr ? JSON.parse(existingPrescriptionsStr) : [];
      
      existingPrescriptions.push(newPrescription);
      localStorage.setItem(storageKey, JSON.stringify(existingPrescriptions));

      toast({
        title: "Prescription Saved & Sent",
        description: `Prescription for ${patientName} has been saved and is (simulated) sent to ${patientEmail}.`,
        variant: "default",
        className: "bg-green-600 text-white dark:bg-green-700 dark:text-white"
      });

      // Optionally clear fields after saving
      // setPatientName('');
      // setPatientEmail('');
      // setMedication('');
      // setDosage('');
      // setInstructions('');
    } catch (error) {
      console.error("Error saving prescription to localStorage:", error);
      toast({
        title: "Storage Error",
        description: "Could not save the prescription due to a storage issue.",
        variant: "destructive",
      });
    }
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
      <form onSubmit={handleSaveAndSendPrescription}>
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
              <Label htmlFor="patientEmail" className="flex items-center gap-2 text-base mb-1"><Mail className="h-4 w-4 text-accent" />Patient Email</Label>
              <Input
                id="patientEmail"
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="patient@example.com"
                required
                className="text-base"
              />
            </div>
          </div>
           <div>
              <Label htmlFor="prescriptionDate" className="flex items-center gap-2 text-base mb-1"><CalendarDays className="h-4 w-4 text-accent" />Prescription Date</Label>
              <Input
                id="prescriptionDate"
                type="date"
                value={prescriptionDate}
                onChange={(e) => setPrescriptionDate(e.target.value)}
                required
                className="text-base"
              />
            </div>

          <div>
            <Label htmlFor="medication" className="flex items-center gap-2 text-base mb-1"><Pill className="h-4 w-4 text-accent" />Medication(s)</Label>
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
              placeholder="e.g., Take after meals. Drink plenty of water. Complete the full course."
              rows={3}
              className="text-base"
            />
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t border-primary/30 flex flex-col items-end space-y-3">
          <div className="w-full text-right">
            <p className="text-sm text-muted-foreground">Doctor's Signature:</p>
            <p className="font-serif text-lg text-primary italic">{doctorName}</p>
          </div>
          <Button type="submit" size="lg" className="text-base">
            <Save className="mr-2 h-5 w-5" /> Save & Send Prescription
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
