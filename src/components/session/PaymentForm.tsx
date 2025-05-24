
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CalendarDays, Lock, CheckCircle, Loader2 } from "lucide-react";

export default function PaymentForm() {
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(paymentSuccess) return;

    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccess(true);
      toast({
        title: "Payment Successful (Mock)",
        description: "Your consultation fee has been processed. You can now proceed.",
        variant: "default",
        className: "bg-green-600 text-white dark:bg-green-700 dark:text-white"
      });
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-border">
        <CardHeader className="items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl text-primary">Payment Confirmed!</CardTitle>
          <CardDescription>Your payment was successful. You can now proceed with other consultation steps.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button onClick={() => setPaymentSuccess(false)} variant="outline">Make Another Payment (Demo)</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-border">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-primary">
          <CreditCard className="h-7 w-7"/> Secure Payment
        </CardTitle>
        <CardDescription>Enter your card details to proceed. (This is a mock form for demonstration purposes)</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cardHolderName" className="flex items-center gap-1"><UserCircleIcon className="h-4 w-4 text-accent"/>Card Holder Name</Label>
            <Input 
              id="cardHolderName" 
              placeholder="John Doe" 
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              required 
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="flex items-center gap-1"><CreditCard className="h-4 w-4 text-accent"/>Card Number</Label>
            <Input 
              id="cardNumber" 
              placeholder="0000 0000 0000 0000" 
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required 
              className="text-base"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="flex items-center gap-1"><CalendarDays className="h-4 w-4 text-accent"/>Expiry Date</Label>
              <Input 
                id="expiryDate" 
                placeholder="MM/YY" 
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required 
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv" className="flex items-center gap-1"><Lock className="h-4 w-4 text-accent"/>CVV</Label>
              <Input 
                id="cvv" 
                placeholder="123" 
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required 
                className="text-base"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : "Pay Consultation Fee ($50)"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function UserCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  )
}
