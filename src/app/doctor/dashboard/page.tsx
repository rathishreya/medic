
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppointmentsDashboard from '@/components/doctor/AppointmentsDashboard';
import PrescriptionPad from '@/components/doctor/PrescriptionPad';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Stethoscope, FileText } from 'lucide-react';

const LOCAL_STORAGE_CURRENT_USER_KEY = "telehealthAppCurrentUser";

interface CurrentUser {
  email: string;
  role: "patient" | "doctor";
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userStr = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (userStr) {
      const user: CurrentUser = JSON.parse(userStr);
      if (user.role === 'doctor') {
        setCurrentUser(user);
      } else {
        // Not a doctor, redirect to home or patient dashboard
        router.push('/');
      }
    } else {
      // Not logged in, redirect to login
      router.push('/login');
    }
  }, [router]);

  if (!isClient || !currentUser) {
    // You can render a loading spinner here
    return <div className="flex justify-center items-center h-screen"><p>Loading Doctor Dashboard...</p></div>;
  }

  const doctorName = currentUser.email.split('@')[0] || "Doctor"; // Example: extract name from email

  return (
    <div className="space-y-8 py-8">
      <Card className="shadow-xl border-border">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl text-primary">
            Doctor Dashboard
          </CardTitle>
          <CardDescription className="text-lg">
            Welcome, Dr. {doctorName}! Manage your appointments and prescriptions.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl text-primary">Scheduled Appointments</CardTitle>
            </div>
            <CardDescription>View and manage your upcoming patient consultations.</CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentsDashboard />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl text-primary">Create Prescription</CardTitle>
            </div>
            <CardDescription>Generate a new prescription for your patient.</CardDescription>
          </CardHeader>
          <CardContent>
            <PrescriptionPad doctorName={`Dr. ${doctorName}`} doctorContact="doc.email@example.com | (123) 456-7890" clinicName="RemoteCare Connect Clinic" clinicAddress="123 Health St, WebCity" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
