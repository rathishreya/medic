
"use client"; // Required for useState, useEffect, and event handlers

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageSquareText, CreditCard, MicVocal, Users, Heart, ClipboardList, ShieldCheck, type LucideIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DepartmentCard from "@/components/landing/DepartmentCard";
import DoctorProfileCard from "@/components/landing/DoctorProfileCard";
import TestimonialCard from "@/components/landing/TestimonialCard";
import DoctorRecommendation from "@/components/landing/DoctorRecommendation";
import TestimonialForm, { type TestimonialFormData } from "@/components/landing/TestimonialForm";
import DoctorListModal from "@/components/landing/DoctorListModal";


// Define types for shared data structures
export interface Department {
  name: string;
  description: string;
  Icon: LucideIcon;
  imageSrc: string;
  dataAiHint: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string; // This should match a Department name
  qualification: string;
  consultationCharge: number;
  reviews: {
    averageRating: number; // e.g., 4.5
    count: number; // e.g., 120
  };
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
    imageSrc: "https://source.unsplash.com/random/600x338/?heart+health+medical",
    dataAiHint: "heart health medical",
  },
  {
    name: "Gastroenterology",
    description: "Comprehensive diagnosis and treatment for digestive system disorders. We offer cutting-edge procedures and compassionate care.",
    Icon: ClipboardList,
    imageSrc: "https://source.unsplash.com/random/600x338/?digestive+system+medical",
    dataAiHint: "digestive system medical",
  },
  {
    name: "General Medicine",
    description: "Primary care services for adults, focusing on overall health, prevention, and management of common illnesses.",
    Icon: ShieldCheck,
    imageSrc: "https://source.unsplash.com/random/600x338/?general+practice+doctor",
    dataAiHint: "general practice doctor",
  },
];

const initialDoctors: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. Priya Sharma",
    specialty: "Cardiology",
    qualification: "MD, FACC (Fellow of the American College of Cardiology)",
    consultationCharge: 2500, // Assuming INR
    reviews: { averageRating: 4.8, count: 150 },
    bio: "Dr. Sharma is a board-certified cardiologist with over 10 years of experience in treating complex heart conditions and promoting cardiovascular wellness.",
    imageSrc: "https://source.unsplash.com/random/200x200/?female+doctor+portrait",
    dataAiHint: "female doctor portrait",
  },
  {
    id: "doc2",
    name: "Dr. Rohan Mehra",
    specialty: "Gastroenterology",
    qualification: "MD, AGAF (Fellow of the American Gastroenterological Association)",
    consultationCharge: 2200, // Assuming INR
    reviews: { averageRating: 4.7, count: 135 },
    bio: "Dr. Mehra specializes in digestive health, offering advanced diagnostics and treatments for a wide range of gastrointestinal issues.",
    imageSrc: "https://source.unsplash.com/random/200x200/?male+doctor+portrait",
    dataAiHint: "male doctor portrait",
  },
  {
    id: "doc3",
    name: "Dr. Ananya Reddy",
    specialty: "General Medicine",
    qualification: "MD, MPH (Master of Public Health)",
    consultationCharge: 1800, // Assuming INR
    reviews: { averageRating: 4.9, count: 210 },
    bio: "Dr. Reddy provides comprehensive primary care, focusing on preventative health and patient education for long-term well-being.",
    imageSrc: "https://source.unsplash.com/random/200x200/?doctor+portrait+professional",
    dataAiHint: "doctor portrait professional",
  },
  {
    id: "doc4",
    name: "Dr. Vikram Singh",
    specialty: "Cardiology",
    qualification: "MBBS, MRCP (Member of the Royal College of Physicians)",
    consultationCharge: 2600, // Assuming INR
    reviews: { averageRating: 4.6, count: 95 },
    bio: "Dr. Singh is known for his patient-centric approach and expertise in interventional cardiology.",
    imageSrc: "https://source.unsplash.com/random/200x200/?senior+male+doctor",
    dataAiHint: "senior male doctor",
  },
  {
    id: "doc5",
    name: "Dr. Sunita Patel",
    specialty: "Gastroenterology",
    qualification: "DO (Doctor of Osteopathic Medicine)",
    consultationCharge: 2300, // Assuming INR
    reviews: { averageRating: 4.5, count: 110 },
    bio: "Dr. Patel is passionate about holistic digestive care and managing chronic conditions.",
    imageSrc: "https://source.unsplash.com/random/200x200/?female+doctor+smiling",
    dataAiHint: "female doctor smiling",
  },
];

const initialTestimonials: Testimonial[] = [
  {
    quote: "The telehealth consultation was incredibly convenient and the doctor was very attentive. I got the help I needed without leaving home!",
    author: "Arjun Kumar",
    role: "Verified Patient",
    imageSrc: "https://source.unsplash.com/random/100x100/?indian+person+smiling",
    dataAiHint: "person smiling happy",
  },
  {
    quote: "RemoteCare Connect made it so easy to manage my appointments and speak to a specialist. Highly recommend their services.",
    author: "Meera Iyer",
    role: "Returning Patient",
    imageSrc: "https://source.unsplash.com/random/100x100/?indian+professional+headshot",
    dataAiHint: "professional headshot",
  },
  {
    quote: "I was hesitant about online consultations, but the experience was seamless and professional. The AI transcription was a great bonus!",
    author: "Deepak Chopra", // Using a well-known name for variety in example
    role: "First-time User",
    imageSrc: "https://source.unsplash.com/random/100x100/?indian+person+technology",
    dataAiHint: "person technology",
  },
];


export default function HomePage() {
  const [departments] = useState<Department[]>(initialDepartments);
  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [selectedDepartmentDoctors, setSelectedDepartmentDoctors] = useState<Doctor[]>([]);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");

  const handleNewTestimonial = (data: TestimonialFormData) => {
    const newTestimonial: Testimonial = {
      quote: data.quote,
      author: data.author,
      role: data.role || "New User",
      imageSrc: data.imageSrc || `https://source.unsplash.com/random/100x100/?${data.dataAiHint || 'person+avatar'}`, 
      dataAiHint: data.dataAiHint || "person avatar",
    };
    setTestimonials(prevTestimonials => [newTestimonial, ...prevTestimonials]);
  };
  
  const availableSpecialties = initialDepartments.map(dept => dept.name);

  const handleDepartmentClick = (departmentName: string) => {
    const filteredDoctors = doctors.filter(doc => doc.specialty === departmentName);
    setSelectedDepartmentDoctors(filteredDoctors);
    setSelectedDepartmentName(departmentName);
    setIsDoctorModalOpen(true);
  };

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
            src="https://source.unsplash.com/random/600x450/?telehealth+doctor+patient+laptop"
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
              <div key={dept.name} onClick={() => handleDepartmentClick(dept.name)} className="cursor-pointer group">
                <DepartmentCard
                  name={dept.name}
                  description={dept.description}
                  Icon={dept.Icon}
                  imageSrc={dept.imageSrc}
                  dataAiHint={dept.dataAiHint}
                />
              </div>
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
                key={doctor.id}
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

      {/* Doctor List Modal - Rendered conditionally */}
      <DoctorListModal
        isOpen={isDoctorModalOpen}
        onOpenChange={setIsDoctorModalOpen}
        doctors={selectedDepartmentDoctors}
        departmentName={selectedDepartmentName}
      />
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

    