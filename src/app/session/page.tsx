
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentForm from "@/components/session/PaymentForm";
import ChatInterface from "@/components/session/ChatInterface";
import TranscriptionInterface from "@/components/session/TranscriptionInterface";
import VideoCallInterface from "@/components/session/VideoCallInterface"; // Added import
import { CreditCard, MessageCircle, Mic, Video } from "lucide-react"; // Added Video icon
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SessionPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl border-border">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Telehealth Session</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Manage your payment, chat, transcription, and video call.
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="payment" className="w-full px-2 sm:px-6 pb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 mb-8 bg-card p-1 rounded-lg">
            <TabsTrigger value="payment" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
              <CreditCard className="mr-2 h-5 w-5" /> Payment
            </TabsTrigger>
            <TabsTrigger value="chat" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
              <MessageCircle className="mr-2 h-5 w-5" /> Chat
            </TabsTrigger>
            <TabsTrigger value="transcription" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
              <Mic className="mr-2 h-5 w-5" /> Transcription
            </TabsTrigger>
            <TabsTrigger value="video" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
              <Video className="mr-2 h-5 w-5" /> Video Call
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payment" className="mt-0">
            <PaymentForm />
          </TabsContent>
          <TabsContent value="chat" className="mt-0">
            <ChatInterface />
          </TabsContent>
          <TabsContent value="transcription" className="mt-0">
            <TranscriptionInterface />
          </TabsContent>
          <TabsContent value="video" className="mt-0">
            <VideoCallInterface />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
