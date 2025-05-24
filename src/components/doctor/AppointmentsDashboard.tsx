
"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, Edit3, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

const mockAppointments: Appointment[] = [
  { id: "apt1", patientName: "Alice Wonderland", date: "2024-08-15", time: "10:00 AM", status: "Scheduled" },
  { id: "apt2", patientName: "Bob The Builder", date: "2024-08-15", time: "11:30 AM", status: "Scheduled" },
  { id: "apt3", patientName: "Charlie Brown", date: "2024-08-16", time: "02:00 PM", status: "Scheduled" },
  { id: "apt4", patientName: "Diana Prince", date: "2024-08-16", time: "03:30 PM", status: "Completed" },
  { id: "apt5", patientName: "Edward Scissorhands", date: "2024-08-17", time: "09:00 AM", status: "Cancelled" },
];

export default function AppointmentsDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching appointments
    setAppointments(mockAppointments.filter(apt => apt.status === "Scheduled"));
  }, []);

  const handleReschedule = (appointmentId: string) => {
    // This is a mock action. In a real app, this would trigger a modal or navigation.
    toast({
      title: "Reschedule Action",
      description: `Reschedule for appointment ID ${appointmentId} would be handled here. (Not implemented)`,
      variant: "default",
    });
  };

  if (appointments.length === 0) {
    return <p className="text-muted-foreground">No upcoming appointments scheduled.</p>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><User className="inline-block mr-1 h-4 w-4" />Patient Name</TableHead>
            <TableHead><CalendarDays className="inline-block mr-1 h-4 w-4" />Date</TableHead>
            <TableHead><Clock className="inline-block mr-1 h-4 w-4" />Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((apt) => (
            <TableRow key={apt.id}>
              <TableCell className="font-medium">{apt.patientName}</TableCell>
              <TableCell>{new Date(apt.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
              <TableCell>{apt.time}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-accent-foreground border-accent hover:bg-accent/80">
                      <Edit3 className="mr-1 h-4 w-4" /> Reschedule
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reschedule Appointment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This functionality is for demonstration. Actual rescheduling would involve more complex logic.
                        Do you want to simulate a reschedule request for {apt.patientName}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleReschedule(apt.id)}>
                        Proceed (Mock)
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
