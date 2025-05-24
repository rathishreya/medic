
"use client"; // Required for useState, useEffect, and event handlers

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageSquareText, CreditCard, MicVocal, Users, Heart, ClipboardList, ShieldCheck, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DepartmentCard from "@/components/landing/DepartmentCard";
import DoctorProfileCard from "@/components/landing/DoctorProfileCard";
import TestimonialCard from "@/components/landing/TestimonialCard";
import DoctorRecommendation from "@/components/landing/DoctorRecommendation";
import TestimonialForm, { type TestimonialFormData } from "@/components/landing/TestimonialForm";

// Define types for shared data structures
export interface Department {
  name: string;
  description: string;
  Icon: LucideIcon;
  imageSrc: string;
  dataAiHint: string;
}

export interface Doctor {
  name: string;
  specialty: string;
  bio: string;
  imageSrc: string;
  dataAiHint: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  imageSrc: string;
  dataAiHint: string;
}


// Initial Mock Data
const initialDepartments: Department[] = [
  {
    name: "Cardiology",
    description: "Expert care for heart conditions, from prevention to advanced treatment options. Our cardiologists are leaders in their field.",
    Icon: Heart,
    imageSrc: "https://placehold.co/600x338.png",
    dataAiHint: "heart health medical",
  },
  {
    name: "Gastroenterology",
    description: "Comprehensive diagnosis and treatment for digestive system disorders. We offer cutting-edge procedures and compassionate care.",
    Icon: ClipboardList,
    imageSrc: "https://placehold.co/600x338.png",
    dataAiHint: "digestive system medical",
  },
  {
    name: "General Medicine",
    description: "Primary care services for adults, focusing on overall health, prevention, and management of common illnesses.",
    Icon: ShieldCheck, // Changed to a more relevant icon
    imageSrc: "https://placehold.co/600x338.png",
    dataAiHint: "general practice doctor",
  },
];

const initialDoctors: Doctor[] = [
  {
    name: "Dr. Emily Carter",
    specialty: "Cardiology",
    bio: "Dr. Carter is a board-certified cardiologist with over 10 years of experience in treating complex heart conditions and promoting cardiovascular wellness.",
    imageSrc: "https://placehold.co/200x200.png",
    dataAiHint: "female doctor portrait",
  },
  {
    name: "Dr. Johnathan Lee",
    specialty: "Gastroenterology",
    bio: "Dr. Lee specializes in digestive health, offering advanced diagnostics and treatments for a wide range of gastrointestinal issues.",
    imageSrc: "https://placehold.co/200x200.png",
    dataAiHint: "male doctor portrait",
  },
  {
    name: "Dr. Sarah Green",
    specialty: "General Medicine",
    bio: "Dr. Green provides comprehensive primary care, focusing on preventative health and patient education for long-term well-being.",
    imageSrc: "https://placehold.co/200x200.png",
    dataAiHint: "doctor portrait professional",
  },
];

const initialTestimonials: Testimonial[] = [
  {
    quote: "The telehealth consultation was incredibly convenient and the doctor was very attentive. I got the help I needed without leaving home!",
    author: "Alex P.",
    role: "Verified Patient",
    imageSrc: "https://placehold.co/100x100.png",
    dataAiHint: "person smiling happy",
  },
  {
    quote: "RemoteCare Connect made it so easy to manage my appointments and speak to a specialist. Highly recommend their services.",
    author: "Maria G.",
    role: "Returning Patient",
    imageSrc: "https://placehold.co/100x100.png",
    dataAiHint: "professional headshot",
  },
  {
    quote: "I was hesitant about online consultations, but the experience was seamless and professional. The AI transcription was a great bonus!",
    author: "David K.",
    role: "First-time User",
    imageSrc: "https://placehold.co/100x100.png",
    dataAiHint: "person technology",
  },
];


export default function HomePage() {
  const [departments] = useState<Department[]>(initialDepartments);
  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  const handleNewTestimonial = (data: TestimonialFormData) => {
    const newTestimonial: Testimonial = {
      quote: data.quote,
      author: data.author,
      role: data.role || "New User",
      imageSrc: data.imageSrc || "https://placehold.co/100x100.png", // Default placeholder
      dataAiHint: data.dataAiHint || "person avatar",
    };
    setTestimonials(prevTestimonials => [newTestimonial, ...prevTestimonials]);
  };
  
  const availableSpecialties = initialDepartments.map(dept => dept.name);

  return (
    <div className="space-y-20"> {/* Increased spacing between sections */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
          Welcome to RemoteCare Connect
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your trusted platform for instant, reliable, and secure telehealth consultations. Access quality healthcare from the comfort of your home, anytime you need it.
        </p>
        <Button size="lg" className="mt-10 text-lg px-10 py-7 bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link href="/consultation">Start New Consultation</Link>
        </Button>
      </section>

      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <Image
            src="https://placehold.co/600x450.png"
            alt="Telehealth consultation illustration"
            width={600}
            height={450}
            className="rounded-xl shadow-2xl object-cover aspect-[4/3]"
            data-ai-hint="telehealth doctor patient laptop"
          />
        </div>
        <div className="space-y-6 order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary">Why Choose Us?</h2>
          <ul className="space-y-5">
            <BenefitItem icon={<CheckCircle className="h-7 w-7 text-accent flex-shrink-0" />} title="Convenient & Accessible" description="Connect with healthcare professionals anytime, anywhere." />
            <BenefitItem icon={<CheckCircle className="h-7 w-7 text-accent flex-shrink-0" />} title="Secure & Private" description="Your health information is protected with top-tier security measures." />
            <BenefitItem icon={<CheckCircle className="h-7 w-7 text-accent flex-shrink-0" />} title="Multi-Specialty Care" description="Access a wide range of medical specialties to suit your needs." />
            <BenefitItem icon={<CheckCircle className="h-7 w-7 text-accent flex-shrink-0" />} title="Expert Providers" description="Consult with experienced and board-certified doctors and specialists." />
          </ul>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-primary">Our Core Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="h-10 w-10 text-accent" />}
            title="Patient Information"
            description="Easily capture and manage patient details securely for a personalized experience."
          />
          <FeatureCard
            icon={<MessageSquareText className="h-10 w-10 text-accent" />}
            title="Real-Time Chat"
            description="Communicate effectively with your doctor during sessions using our integrated chat."
          />
          <FeatureCard
            icon={<CreditCard className="h-10 w-10 text-accent" />}
            title="Secure Payments"
            description="Hassle-free and secure payment processing before your consultation begins."
          />
          <FeatureCard
            icon={<MicVocal className="h-10 w-10 text-accent" />}
            title="Live Transcription"
            description="AI-powered transcription with summarization and follow-up suggestions."
          />
        </div>
      </section>

      {/* AI Doctor Recommendation Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <DoctorRecommendation availableSpecialties={availableSpecialties} departments={departments} />
        </div>
      </section>

      <section className="py-16 bg-muted/30 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-primary">Our Medical Departments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <DepartmentCard
                key={dept.name}
                name={dept.name}
                description={dept.description}
                Icon={dept.Icon}
                imageSrc={dept.imageSrc}
                dataAiHint={dept.dataAiHint}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-primary">Meet Our Specialists</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <DoctorProfileCard
                key={doctor.name}
                name={doctor.name}
                specialty={doctor.specialty}
                bio={doctor.bio}
                imageSrc={doctor.imageSrc}
                dataAiHint={doctor.dataAiHint}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-primary">What Our Patients Say</h2>
          {testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.author}-${index}`} // Ensure unique key
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  imageSrc={testimonial.imageSrc}
                  dataAiHint={testimonial.dataAiHint}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No testimonials yet. Be the first to share your experience!</p>
          )}
        </div>
      </section>
      
      {/* Testimonial Submission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <TestimonialForm onSubmitTestimonial={handleNewTestimonial} />
        </div>
      </section>

    </div>
  );
}

interface BenefitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitItem({ icon, title, description }: BenefitItemProps) {
  return (
    <li className="flex items-start gap-4">
      {icon}
      <div>
        <h3 className="font-semibold text-xl text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-card hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col">
      <CardHeader className="items-center pt-8">
        {icon}
        <CardTitle className="mt-4 text-2xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-8 flex-grow">
        <CardDescription className="text-center text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
