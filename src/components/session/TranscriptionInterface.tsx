
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { transcribeConsultation } from "@/ai/flows/transcribe-consultation";
import { summarizeConsultation } from "@/ai/flows/summarize-consultation";
import { generateFollowUpSuggestions, type GenerateFollowUpSuggestionsOutput } from "@/ai/flows/generate-follow-up-suggestions";
import { Mic, StopCircle, FileText, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


export default function TranscriptionInterface() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [followUpSuggestions, setFollowUpSuggestions] = useState<GenerateFollowUpSuggestionsOutput['suggestions']>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const startRecording = async () => {
    setTranscriptError(null);
    setTranscript("");
    setSummary("");
    setSummaryError(null);
    setFollowUpSuggestions([]);
    setSuggestionsError(null);

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
          setIsLoadingTranscript(true);
          if (audioChunksRef.current.length === 0) {
            setTranscriptError("No audio data recorded. Please try speaking closer to the microphone.");
            setIsLoadingTranscript(false);
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
              setTranscriptError("Failed to transcribe audio. The AI service might be unavailable or the audio format is not supported. Please try again.");
              toast({ title: "Transcription Error", description: "Could not transcribe the audio.", variant: "destructive" });
            } finally {
              setIsLoadingTranscript(false);
            }
          };
          reader.onerror = () => {
            setTranscriptError("Failed to read audio data.");
            setIsLoadingTranscript(false);
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
        setTranscriptError("Could not access microphone. Please ensure it's enabled in your browser settings and not in use by another application.");
        toast({ title: "Microphone Access Error", description: "Failed to access microphone. Check permissions.", variant: "destructive" });
      }
    } else {
      setTranscriptError("Audio recording is not supported by your browser. Please use a modern browser like Chrome or Firefox.");
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
    if (!transcript || isSummarizing || isLoadingTranscript) return;
    setIsSummarizing(true);
    setSummaryError(null);
    setSummary("");
    setFollowUpSuggestions([]); // Clear previous suggestions
    setSuggestionsError(null);
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

  const handleGenerateSuggestions = async () => {
    if (!summary || isGeneratingSuggestions || isSummarizing || isLoadingTranscript) return;
    setIsGeneratingSuggestions(true);
    setSuggestionsError(null);
    setFollowUpSuggestions([]);
    try {
      const result = await generateFollowUpSuggestions({ consultationSummary: summary });
      setFollowUpSuggestions(result.suggestions);
      toast({ title: "Suggestions Generated", description: "Follow-up suggestions are ready.", className: "bg-green-600 text-white dark:bg-green-700 dark:text-white" });
    } catch (err) {
      console.error("Suggestion generation error:", err);
      setSuggestionsError("Failed to generate follow-up suggestions. Please try again.");
      toast({ title: "Suggestion Error", description: "Could not generate suggestions.", variant: "destructive" });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const anyLoading = isLoadingTranscript || isSummarizing || isGeneratingSuggestions;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-border">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-primary">
            <FileText className="h-7 w-7"/> Consultation Transcript & AI Insights
        </CardTitle>
        <CardDescription>
          Record, transcribe, summarize, and get AI-powered follow-up suggestions for your consultation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {transcriptError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Transcription Error</AlertTitle>
            <AlertDescription>{transcriptError}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {!isRecording ? (
            <Button onClick={startRecording} disabled={anyLoading} className="w-full sm:flex-1 text-base py-3">
              <Mic className="mr-2 h-5 w-5" /> Start Recording
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive" disabled={isLoadingTranscript} className="w-full sm:flex-1 text-base py-3">
              <StopCircle className="mr-2 h-5 w-5" /> Stop Recording & Transcribe
            </Button>
          )}
          {(isLoadingTranscript || isSummarizing || isGeneratingSuggestions) && (
            <div className="flex items-center gap-2 text-muted-foreground pt-2 sm:pt-0">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-base">
                  {isLoadingTranscript ? "Transcribing..." : isSummarizing ? "Summarizing..." : isGeneratingSuggestions ? "Generating suggestions..." : "Processing..."}
                </span>
            </div>
          )}
        </div>
        <div className="pt-2">
            <Label htmlFor="transcript" className="text-lg mb-2 block font-medium">Transcript:</Label>
            <Textarea
              id="transcript"
              placeholder={isRecording ? "Recording in progress... Stop recording to see transcript." : isLoadingTranscript ? "Transcription in progress..." : "Your transcript will appear here after recording and processing."}
              value={transcript}
              readOnly
              rows={10}
              className="bg-background/50 shadow-inner text-base p-4 rounded-md leading-relaxed"
            />
        </div>

        {transcript && !isLoadingTranscript && (
          <div className="pt-2 space-y-4">
            <Button 
              onClick={handleSummarize} 
              disabled={isSummarizing || !transcript || isLoadingTranscript || isGeneratingSuggestions}
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

            {summary && !isSummarizing && (
              <div className="pt-2">
                <Label htmlFor="summary" className="text-lg mb-2 block font-medium">Summary:</Label>
                <ScrollArea className="h-[150px] w-full rounded-md border p-4 bg-background/50 shadow-inner">
                  <pre id="summary" className="text-sm whitespace-pre-wrap break-words">
                    {summary}
                  </pre>
                </ScrollArea>
                
                <Button 
                  onClick={handleGenerateSuggestions} 
                  disabled={isGeneratingSuggestions || !summary || isSummarizing || isLoadingTranscript}
                  className="w-full sm:w-auto text-base py-3 mt-4"
                >
                  {isGeneratingSuggestions ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Suggestions...</>
                  ) : (
                    <><Sparkles className="mr-2 h-5 w-5" /> Get AI Follow-up Suggestions</>
                  )}
                </Button>
              </div>
            )}

            {suggestionsError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Suggestion Generation Error</AlertTitle>
                <AlertDescription>{suggestionsError}</AlertDescription>
              </Alert>
            )}

            {followUpSuggestions.length > 0 && !isGeneratingSuggestions && (
              <div className="pt-4">
                <h3 className="text-lg mb-2 block font-medium">AI Follow-up Suggestions:</h3>
                 <Accordion type="single" collapsible className="w-full">
                  {followUpSuggestions.map((suggestion, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-base hover:no-underline">
                        <div className="flex items-center gap-2">
                           <Sparkles className="h-4 w-4 text-accent" /> 
                           {suggestion.title}
                        </div>
                       
                        </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pl-4 pb-3">
                        {suggestion.detail}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
            Note: For best results, ensure a quiet environment and speak clearly into your microphone. AI features provide general information and are not a substitute for professional medical advice.
        </p>
      </CardFooter>
    </Card>
  );
}
