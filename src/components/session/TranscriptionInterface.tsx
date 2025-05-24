
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { transcribeConsultation } from "@/ai/flows/transcribe-consultation";
import { summarizeConsultation } from "@/ai/flows/summarize-consultation";
import { Mic, StopCircle, FileText, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TranscriptionInterface() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For transcription
  const [error, setError] = useState<string | null>(null); // For transcription error
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const startRecording = async () => {
    setError(null);
    setTranscript("");
    setSummary("");
    setSummaryError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          setIsLoading(true);
          if (audioChunksRef.current.length === 0) {
            setError("No audio data recorded. Please try speaking closer to the microphone.");
            setIsLoading(false);
            setIsRecording(false);
            toast({ title: "Recording Error", description: "No audio was captured.", variant: "destructive" });
            return;
          }

          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || "audio/webm" });
          
          const reader = new FileReader();
          reader.onloadend = async () => {
            const audioDataUri = reader.result as string;
            try {
              const result = await transcribeConsultation({ audioDataUri });
              setTranscript(result.transcription);
              toast({ title: "Transcription Complete", description: "Audio successfully transcribed.", className: "bg-green-600 text-white dark:bg-green-700 dark:text-white"});
            } catch (err) {
              console.error("Transcription error:", err);
              setError("Failed to transcribe audio. The AI service might be unavailable or the audio format is not supported. Please try again.");
              toast({ title: "Transcription Error", description: "Could not transcribe the audio.", variant: "destructive" });
            } finally {
              setIsLoading(false);
            }
          };
          reader.onerror = () => {
            setError("Failed to read audio data.");
            setIsLoading(false);
            toast({ title: "File Read Error", description: "Could not process the recorded audio.", variant: "destructive" });
          };
          reader.readAsDataURL(audioBlob);
          
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({ title: "Recording Started", description: "Microphone is now active. Speak clearly." });
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Could not access microphone. Please ensure it's enabled in your browser settings and not in use by another application.");
        toast({ title: "Microphone Access Error", description: "Failed to access microphone. Check permissions.", variant: "destructive" });
      }
    } else {
      setError("Audio recording is not supported by your browser. Please use a modern browser like Chrome or Firefox.");
      toast({ title: "Unsupported Browser", description: "Audio recording not supported.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false); 
  };

  const handleSummarize = async () => {
    if (!transcript || isSummarizing || isLoading) return; // also check isLoading for transcription
    setIsSummarizing(true);
    setSummaryError(null);
    setSummary("");
    try {
      const result = await summarizeConsultation({ consultationText: transcript });
      setSummary(result.summary);
      toast({ title: "Summarization Complete", description: "Transcript successfully summarized.", className: "bg-green-600 text-white dark:bg-green-700 dark:text-white" });
    } catch (err) {
      console.error("Summarization error:", err);
      setSummaryError("Failed to summarize transcript. Please try again.");
      toast({ title: "Summarization Error", description: "Could not summarize the transcript.", variant: "destructive" });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-border">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-primary">
            <FileText className="h-7 w-7"/> Consultation Transcript
        </CardTitle>
        <CardDescription>
          Record your consultation for an AI-powered transcription. This can help with understanding and record-keeping.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Transcription Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {!isRecording ? (
            <Button onClick={startRecording} disabled={isLoading || isSummarizing} className="w-full sm:flex-1 text-base py-3">
              <Mic className="mr-2 h-5 w-5" /> Start Recording
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive" disabled={isLoading || isSummarizing} className="w-full sm:flex-1 text-base py-3">
              <StopCircle className="mr-2 h-5 w-5" /> Stop Recording & Transcribe
            </Button>
          )}
          {(isLoading || isSummarizing) && (
            <div className="flex items-center gap-2 text-muted-foreground pt-2 sm:pt-0">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-base">
                  {isLoading ? "Processing audio..." : isSummarizing ? "Summarizing transcript..." : "Processing..."} Please wait.
                </span>
            </div>
          )}
        </div>
        <div className="pt-2">
            <Label htmlFor="transcript" className="text-lg mb-2 block font-medium">Transcript:</Label>
            <Textarea
              id="transcript"
              placeholder={isRecording ? "Recording in progress... Stop recording to see transcript." : isLoading ? "Transcription in progress..." : "Your transcript will appear here after recording and processing."}
              value={transcript}
              readOnly
              rows={12}
              className="bg-background/50 shadow-inner text-base p-4 rounded-md leading-relaxed"
            />
        </div>

        {transcript && !isLoading && (
          <div className="pt-2 space-y-4">
            <Button 
              onClick={handleSummarize} 
              disabled={isSummarizing || !transcript || isLoading}
              className="w-full sm:w-auto text-base py-3"
            >
              {isSummarizing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Summarizing...</>
              ) : (
                <><FileText className="mr-2 h-5 w-5" /> Summarize Transcript</>
              )}
            </Button>

            {summaryError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Summarization Error</AlertTitle>
                <AlertDescription>{summaryError}</AlertDescription>
              </Alert>
            )}

            {summary && (
              <div className="pt-2">
                <Label htmlFor="summary" className="text-lg mb-2 block font-medium">Summary:</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-background/50 shadow-inner">
                  <pre id="summary" className="text-sm whitespace-pre-wrap break-words">
                    {summary}
                  </pre>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
            Note: For best results, ensure a quiet environment and speak clearly into your microphone. Transcription and summarization accuracy may vary.
        </p>
      </CardFooter>
    </Card>
  );
}
