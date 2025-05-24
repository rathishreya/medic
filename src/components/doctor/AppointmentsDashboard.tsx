
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
  { id: "apt1", patientName: "Aisha Khan", date: "2024-08-15", time: "10:00 AM", status: "Scheduled" },
  { id: "apt2", patientName: "Mohan Kumar", date: "2024-08-15", time: "11:30 AM", status: "Scheduled" },
  { id: "apt3", patientName: "Priya Singh", date: "2024-08-16", time: "02:00 PM", status: "Scheduled" },
  { id: "apt4", patientName: "Rohan Patel", date: "2024-08-16", time: "03:30 PM", status: "Completed" },
  { id: "apt5", patientName: "Sanjana Gupta", date: "2024-08-17", time: "09:00 AM", status: "Cancelled" },
];

export default function AppointmentsDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching appointments
    setAppointments(mockAppointments.filter(apt => apt.status === "Scheduled"));
  }, []);

  const handleReschedule = (appointmentId: string) => {
    setAppointments(prevAppointments => 
      prevAppointments.filter(apt => apt.id !== appointmentId)
    );
    toast({
      title: "Appointment Rescheduled",
      description: `Appointment ID ${appointmentId} has been marked for rescheduling.`,
      variant: "default",
    });
    // In a real app, this would involve backend calls to update appointment status,
    // notify the patient, and potentially offer new time slots.
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
                        This will remove the appointment from the current "Scheduled" list.
                        Are you sure you want to proceed with rescheduling for {apt.patientName}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleReschedule(apt.id)}>
                        Proceed
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

    