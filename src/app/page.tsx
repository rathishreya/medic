
"use client"; 

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
import telehealth from "@/images/telehealth.png";
import Cardiology from "@/images/cardiology.webp";
import type { StaticImageData } from "next/image";
import Gas from "@/images/gas.png"; 
import Medicine from "@/images/medicine.jpg";

// Define types for shared data structures
export interface Department {
  name: string;
  description: string;
  Icon: LucideIcon;
  imageSrc: string | StaticImageData;
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
    imageSrc: Cardiology,
    dataAiHint: "heart health medical",
  },
  {
    name: "Gastroenterology",
    description: "Comprehensive diagnosis and treatment for digestive system disorders. We offer cutting-edge procedures and compassionate care.",
    Icon: ClipboardList,
    imageSrc: Gas,
    dataAiHint: "digestive system medical",
  },
  {
    name: "General Medicine",
    description: "Primary care services for adults, focusing on overall health, prevention, and management of common illnesses.",
    Icon: ShieldCheck,
    imageSrc: Medicine,
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
    author: "Deepak Chopra", 
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
    <div className="space-y-24 bg-gradient-to-b from-emerald-50/30 to-white">
      {/* Hero Section */}
      <section className="text-center py-20 md:py-28 bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-md">
            Welcome to RemoteCare Connect
          </h1>
          <p className="mt-6 text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto">
            Your trusted platform for instant, reliable, and secure telehealth consultations. Access quality healthcare from the comfort of your home, anytime you need it.
          </p>
          <Button 
            size="lg" 
            className="mt-10 text-lg px-10 py-7 bg-white text-emerald-600 hover:bg-white/90 hover:text-emerald-700 font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            asChild
          >
            <Link href="/consultation">Start New Consultation</Link>
          </Button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center container mx-auto px-4">
        <div className="order-2 md:order-1 animate-fade-in-up opacity-0 motion-safe:animate-fade-in-up">
          <Image
            src={telehealth}
            alt="Telehealth consultation illustration"
            width={600}
            height={450}
            className="rounded-xl shadow-2xl object-cover aspect-[4/3] border-4 border-emerald-100 transition-transform duration-700 ease-in-out hover:scale-105"
            data-ai-hint="telehealth doctor patient laptop"
          />
        </div>
        <div className="space-y-6 order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl font-semibold text-emerald-800">Why Choose Us?</h2>
          <ul className="space-y-5">
            <BenefitItem 
              icon={<CheckCircle className="h-7 w-7 text-emerald-500 flex-shrink-0" />} 
              title="Convenient & Accessible" 
              description="Connect with healthcare professionals anytime, anywhere." 
            />
            <BenefitItem 
              icon={<CheckCircle className="h-7 w-7 text-emerald-500 flex-shrink-0" />} 
              title="Secure & Private" 
              description="Your health information is protected with top-tier security measures." 
            />
            <BenefitItem 
              icon={<CheckCircle className="h-7 w-7 text-emerald-500 flex-shrink-0" />} 
              title="Multi-Specialty Care" 
              description="Access a wide range of medical specialties to suit your needs." 
            />
            <BenefitItem 
              icon={<CheckCircle className="h-7 w-7 text-emerald-500 flex-shrink-0" />} 
              title="Expert Providers" 
              description="Consult with experienced and board-certified doctors and specialists." 
            />
          </ul>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-emerald-800">Our Core Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="h-10 w-10 text-emerald-500" />}
            title="Patient Information"
            description="Easily capture and manage patient details securely for a personalized experience."
          />
          <FeatureCard
            icon={<MessageSquareText className="h-10 w-10 text-emerald-500" />}
            title="Real-Time Chat"
            description="Communicate effectively with your doctor during sessions using our integrated chat."
          />
          <FeatureCard
            icon={<CreditCard className="h-10 w-10 text-emerald-500" />}
            title="Secure Payments"
            description="Hassle-free and secure payment processing before your consultation begins."
          />
          <FeatureCard
            icon={<MicVocal className="h-10 w-10 text-emerald-500" />}
            title="Live Transcription"
            description="AI-powered transcription with summarization and follow-up suggestions."
          />
        </div>
      </section>

      {/* AI Doctor Recommendation Section */}
      <section className="py-16 bg-emerald-50/50 rounded-3xl">
        <div className="container mx-auto px-4">
          <DoctorRecommendation availableSpecialties={availableSpecialties} departments={departments} />
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-emerald-800">Our Medical Departments</h2>
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
      </section>

      {/* Doctors Section */}
      <section className="py-16 bg-emerald-50/30 rounded-3xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-emerald-800">Meet Our Specialists</h2>
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

      {/* Testimonials Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-emerald-800">What Our Patients Say</h2>
        {testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.author}-${index}`}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                imageSrc={testimonial.imageSrc}
                dataAiHint={testimonial.dataAiHint}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-emerald-700">No testimonials yet. Be the first to share your experience!</p>
        )}
      </section>
      
      {/* Testimonial Submission Section */}
      <section className="py-16 bg-emerald-50/50 rounded-3xl">
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
    <li className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-2 bg-emerald-100 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-xl text-emerald-800">{title}</h3>
        <p className="text-emerald-700">{description}</p>
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
    <Card className="bg-white hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col border-0 shadow-sm group">
      <CardHeader className="items-center pt-8">
        <div className="p-4 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors duration-300">
          {icon}
        </div>
        <CardTitle className="mt-4 text-2xl text-center text-emerald-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-8 flex-grow">
        <CardDescription className="text-center text-base text-emerald-700">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

