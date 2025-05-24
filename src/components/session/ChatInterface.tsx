
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, UserCircle, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  sender: "patient" | "doctor";
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! I'm Dr. Smith. How can I help you today?", sender: "doctor", timestamp: new Date(Date.now() - 60000 * 5) },
    { id: "2", text: "Hi Doctor, I've been experiencing a persistent cough and some fatigue for the past week.", sender: "patient", timestamp: new Date(Date.now() - 60000 * 4) },
    { id: "3", text: "I see. Can you tell me more about the cough? Is it dry or productive? Any fever?", sender: "doctor", timestamp: new Date(Date.now() - 60000 * 3) },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || isSending) return;

    setIsSending(true);
    const patientMessage: Message = {
      id: String(Date.now()),
      text: newMessage,
      sender: "patient",
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, patientMessage]);
    setNewMessage("");

    // Simulate doctor's reply
    setTimeout(() => {
      const doctorReplies = [
        "Understood. And how severe is the fatigue?",
        "Have you taken any medication for these symptoms?",
        "Are there any other symptoms I should be aware of, like a sore throat or body aches?",
        "Okay, please describe the cough in more detail.",
      ];
      const randomReply = doctorReplies[Math.floor(Math.random() * doctorReplies.length)];
      
      const doctorReplyMessage: Message = {
        id: String(Date.now() + 1),
        text: randomReply,
        sender: "doctor",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, doctorReplyMessage]);
      setIsSending(false);
    }, 1500 + Math.random() * 1000);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      // The direct child of ScrollArea is the Viewport
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
            <Stethoscope className="h-7 w-7" /> Chat with Dr. Smith
        </CardTitle>
        <CardDescription>Communicate securely and effectively with your healthcare provider.</CardDescription>
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
                    <AvatarImage src="https://placehold.co/40x40.png?text=Dr" data-ai-hint="doctor portrait" />
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
                     <AvatarImage src="https://placehold.co/40x40.png?text=Me" data-ai-hint="person portrait" />
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
