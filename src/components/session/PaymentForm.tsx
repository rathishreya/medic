
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CalendarDays, Lock, CheckCircle, Loader2, QrCode, AtSign } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";

type PaymentMethod = "card" | "upi";

// Define a type for SVG props if not already available globally
interface UserCircleIconProps extends React.SVGProps<SVGSVGElement> {}


export default function PaymentForm() {
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const mockConsultationFeeINR = 2000; // Example fee in INR

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentSuccess) return;

    // Basic validation for UPI ID if selected
    if (paymentMethod === "upi" && !upiId.match(/^[\w.-]+@[\w.-]+$/)) {
      toast({
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI ID (e.g., yourname@bank).",
        variant: "destructive",
      });
      return;
    }
    // Basic validation for Card if selected
    if (paymentMethod === "card" && (!cardHolderName || !cardNumber || !expiryDate || !cvv)) {
        toast({
            title: "Missing Card Details",
            description: "Please fill in all card details.",
            variant: "destructive",
        });
        return;
    }


    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccess(true);
      toast({
        title: `Payment Successful via ${paymentMethod.toUpperCase()} (Simulated)`,
        description: `Your consultation fee of ₹${mockConsultationFeeINR} has been processed. You can now proceed.`,
        variant: "default",
        className: "bg-green-600 text-white dark:bg-green-700 dark:text-white"
      });
    }, 2000);
  };

  const resetForm = () => {
    setPaymentSuccess(false);
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setCardHolderName("");
    setUpiId("");
    // setPaymentMethod("card"); // Optionally reset payment method
  }

  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-border">
        <CardHeader className="items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl text-primary">Payment Confirmed!</CardTitle>
          <CardDescription>Your payment via {paymentMethod.toUpperCase()} was successful. You can proceed with other consultation steps.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button onClick={resetForm} variant="outline">Make Another Payment (Demo)</Button>
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
        <CardDescription>Select your payment method. (This is a simulated form for demonstration purposes)</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base mb-2 block">Payment Method</Label>
            <RadioGroup
              defaultValue="card"
              onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="text-base font-normal">Credit/Debit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="text-base font-normal">UPI</Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "card" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cardHolderName" className="flex items-center gap-1 text-base"><UserCircleIcon className="h-5 w-5 text-accent"/>Card Holder Name</Label>
                <Input 
                  id="cardHolderName" 
                  placeholder="e.g., Rohan Sharma" 
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  required={paymentMethod === "card"} 
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="flex items-center gap-1 text-base"><CreditCard className="h-5 w-5 text-accent"/>Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required={paymentMethod === "card"}
                  className="text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="flex items-center gap-1 text-base"><CalendarDays className="h-5 w-5 text-accent"/>Expiry Date</Label>
                  <Input 
                    id="expiryDate" 
                    placeholder="MM/YY" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required={paymentMethod === "card"}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="flex items-center gap-1 text-base"><Lock className="h-5 w-5 text-accent"/>CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123" 
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required={paymentMethod === "card"}
                    className="text-base"
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === "upi" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId" className="flex items-center gap-1 text-base"><AtSign className="h-5 w-5 text-accent"/>Enter UPI ID</Label>
                <Input 
                  id="upiId" 
                  placeholder="yourname@okhdfcbank" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required={paymentMethod === "upi"}
                  className="text-base"
                />
              </div>
              <div className="text-center space-y-2">
                <Label className="text-base">Or Scan QR Code</Label>
                <div className="flex justify-center items-center bg-muted p-4 rounded-md border border-dashed">
                    <Image
                        src="https://placehold.co/200x200.png?text=Scan+Me"
                        alt="Mock UPI QR Code"
                        width={160}
                        height={160}
                        className="rounded-md"
                        data-ai-hint="qr code payment"
                    />
                </div>
                <p className="text-xs text-muted-foreground">This is a placeholder QR code for demonstration.</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : `Pay Consultation Fee (₹${mockConsultationFeeINR}) via ${paymentMethod.toUpperCase()}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// Keeping UserCircleIcon as it's used for card holder name
function UserCircleIcon(props: UserCircleIconProps) { // Use the defined type here
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
