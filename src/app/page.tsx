
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageSquareText, CreditCard, MicVocal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16">
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
            icon={<UsersIcon className="h-10 w-10 text-accent" />}
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
            description="AI-powered transcription to overcome language barriers and keep accurate records."
          />
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
    <Card className="bg-card hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <CardHeader className="items-center pt-8">
        {icon}
        <CardTitle className="mt-4 text-2xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-8">
        <CardDescription className="text-center text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) { // Using a generic Users icon
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
