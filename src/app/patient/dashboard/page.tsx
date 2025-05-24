
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StoredPrescription } from '@/components/doctor/PrescriptionPad'; // Assuming this is exported
import PrescriptionViewCard from '@/components/patient/PrescriptionViewCard';
import { FileText, UserCircle } from 'lucide-react';

const LOCAL_STORAGE_CURRENT_USER_KEY = "telehealthAppCurrentUser";
const LOCAL_STORAGE_PRESCRIPTIONS_KEY_PREFIX = "telehealthAppPrescriptions_";

interface CurrentUser {
  email: string;
  role: "patient" | "doctor";
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [prescriptions, setPrescriptions] = useState<StoredPrescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userStr = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (userStr) {
      const user: CurrentUser = JSON.parse(userStr);
      if (user.role === 'patient') {
        setCurrentUser(user);
        // Fetch prescriptions
        const prescriptionsKey = LOCAL_STORAGE_PRESCRIPTIONS_KEY_PREFIX + user.email.toLowerCase();
        const storedPrescriptionsStr = localStorage.getItem(prescriptionsKey);
        if (storedPrescriptionsStr) {
          setPrescriptions(JSON.parse(storedPrescriptionsStr));
        }
      } else {
        // Not a patient, redirect
        router.push('/');
      }
    } else {
      // Not logged in, redirect to login
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  if (!isClient || isLoading || !currentUser) {
    // You can render a loading spinner here
    return <div className="flex justify-center items-center h-screen"><p>Loading Patient Dashboard...</p></div>;
  }

  const patientName = currentUser.email.split('@')[0] || "Patient";

  return (
    <div className="space-y-8 py-8">
      <Card className="shadow-xl border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserCircle className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl md:text-4xl text-primary">
              Patient Dashboard
            </CardTitle>
          </div>
          <CardDescription className="text-lg">
            Welcome, {patientName}! View your health information and prescriptions.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-lg border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl text-primary">Your Prescriptions</CardTitle>
          </div>
          <CardDescription>Review the prescriptions issued by your doctors.</CardDescription>
        </CardHeader>
        <CardContent>
          {prescriptions.length > 0 ? (
            <ScrollArea className="h-[400px] md:h-[500px] pr-4">
              <div className="space-y-4">
                {prescriptions.sort((a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()).map((rx) => (
                  <PrescriptionViewCard key={rx.id} prescription={rx} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">You have no prescriptions on file.</p>
          )}
        </CardContent>
      </Card>

      {/* Future sections like "Appointments", "Medical History" can be added here */}
    </div>
  );
}
