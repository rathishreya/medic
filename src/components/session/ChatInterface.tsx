
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, UserCircle, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { chatWithDoctor } from "@/ai/flows/chat-doctor-flow";

interface Message {
  id: string;
  text: string;
  sender: "patient" | "doctor";
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! I'm Dr. GenAI. How can I help you today? Remember, I'm an AI assistant and cannot provide real medical diagnoses.", sender: "doctor", timestamp: new Date(Date.now() - 60000 * 5) },
    { id: "2", text: "Hi Doctor, I've been experiencing a persistent cough and some fatigue for the past week.", sender: "patient", timestamp: new Date(Date.now() - 60000 * 4) },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || isSending) return;

    setIsSending(true);
    const patientMessageContent = newMessage;
    const patientMessage: Message = {
      id: String(Date.now()),
      text: patientMessageContent,
      sender: "patient",
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, patientMessage];
    setMessages(updatedMessages);
    setNewMessage("");

    const historyForAIInput = messages.map(msg => ({ sender: msg.sender, text: msg.text }));

    try {
      const aiResponse = await chatWithDoctor({
        patientMessage: patientMessageContent,
        chatHistory: historyForAIInput,
      });

      if (aiResponse && aiResponse.doctorResponse) {
        const doctorReplyMessage: Message = {
          id: String(Date.now() + 1),
          text: aiResponse.doctorResponse,
          sender: "doctor",
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, doctorReplyMessage]);
      } else {
        const fallbackDoctorReply: Message = {
          id: String(Date.now() + 1),
          text: "I'm sorry, I couldn't process that. Please try again.",
          sender: "doctor",
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, fallbackDoctorReply]);
      }
    } catch (error) {
      console.error("Error calling chatWithDoctor flow:", error);
      const errorDoctorReply: Message = {
        id: String(Date.now() + 1),
        text: "Apologies, I'm experiencing a technical difficulty. Please try again later.",
        sender: "doctor",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorDoctorReply]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.children[0] as HTMLElement;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);
  

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-border">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-primary">
            <Stethoscope className="h-7 w-7" /> Chat with Dr. GenAI
        </CardTitle>
        <CardDescription>Communicate securely and effectively with your AI healthcare assistant.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100vh-380px)] min-h-[400px] max-h-[600px]">
        <ScrollArea className="flex-grow p-4 border rounded-md mb-4 bg-background/50 shadow-inner" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.sender === "patient" ? "justify-end" : ""
                }`}
              >
                {msg.sender === "doctor" && (
                  <Avatar className="h-9 w-9 border-2 border-accent">
                    <AvatarImage src="https://source.unsplash.com/random/40x40/?robot+doctor" data-ai-hint="robot doctor" />
                    <AvatarFallback><Stethoscope size={18}/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-xl shadow-md ${
                    msg.sender === "patient"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-muted-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className="text-xs opacity-80 mt-1.5 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === "patient" && (
                  <Avatar className="h-9 w-9 border-2 border-primary">
                     <AvatarImage src="https://source.unsplash.com/random/40x40/?person+portrait" data-ai-hint="person portrait" />
                    <AvatarFallback><UserCircle size={18}/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="flex gap-3 items-center pt-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow text-base py-3 h-auto"
            disabled={isSending}
          />
          <Button type="submit" size="lg" aria-label="Send message" className="px-5 py-3" disabled={isSending || newMessage.trim() === ""}>
            <Send className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

    