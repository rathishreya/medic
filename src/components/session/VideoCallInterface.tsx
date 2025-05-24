
"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VideoCallInterface() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const { toast } = useToast();
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera/mic:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera/Microphone Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings to use video call.',
        });
      }
    };

    getCameraPermission();

    return () => {
      // Cleanup: stop tracks when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const toggleMute = () => {
    if (streamRef.current) {
        const audioTracks = streamRef.current.getAudioTracks();
        if (audioTracks.length > 0) {
            audioTracks[0].enabled = !audioTracks[0].enabled;
            setIsMuted(!audioTracks[0].enabled);
        }
    }
  };

  const toggleVideo = () => {
     if (streamRef.current) {
        const videoTracks = streamRef.current.getVideoTracks();
        if (videoTracks.length > 0) {
            videoTracks[0].enabled = !videoTracks[0].enabled;
            setIsVideoOff(!videoTracks[0].enabled);
        }
    }
  };

  const handleEndCall = () => {
    // In a real app, this would signal the end of the call to the other party
    // and clean up WebRTC connections. Here, we just stop the local media.
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasCameraPermission(null); // Reset permission to allow re-trying if needed or show initial state
    toast({
        title: "Call Ended",
        description: "The video call has been disconnected.",
    });
    // Potentially redirect or change UI state further
  };


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-border">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-primary">
          <Video className="h-7 w-7" /> Video Consultation
        </CardTitle>
        <CardDescription>Your local video preview. Ensure your camera and microphone are enabled.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full bg-muted rounded-md overflow-hidden shadow-inner relative">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          {isVideoOff && hasCameraPermission && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
              <VideoOff className="h-16 w-16 mb-2" />
              <p>Your camera is off</p>
            </div>
          )}
           {(hasCameraPermission === null && !streamRef.current) && ( // Loading state before permission is known
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <p className="text-muted-foreground">Initializing video...</p>
            </div>
          )}
        </div>

        {hasCameraPermission === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Camera & Microphone Access Required</AlertTitle>
            <AlertDescription>
              Video call functionality requires access to your camera and microphone.
              Please enable permissions in your browser settings and refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {hasCameraPermission && (
          <div className="flex justify-center items-center gap-3 sm:gap-4 pt-2">
            <Button onClick={toggleMute} variant={isMuted ? "destructive" : "outline"} size="icon" className="rounded-full w-12 h-12 sm:w-14 sm:h-14">
              {isMuted ? <MicOff className="h-6 w-6 sm:h-7 sm:w-7" /> : <Mic className="h-6 w-6 sm:h-7 sm:w-7" />}
              <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
            </Button>
            <Button onClick={toggleVideo} variant={isVideoOff ? "destructive" : "outline"} size="icon" className="rounded-full w-12 h-12 sm:w-14 sm:h-14">
              {isVideoOff ? <VideoOff className="h-6 w-6 sm:h-7 sm:w-7" /> : <Video className="h-6 w-6 sm:h-7 sm:w-7" />}
              <span className="sr-only">{isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}</span>
            </Button>
            <Button onClick={handleEndCall} variant="destructive" size="icon" className="rounded-full w-12 h-12 sm:w-14 sm:h-14">
              <PhoneOff className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="sr-only">End Call</span>
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          This is a local preview. In a real session, you would see the other participant here.
        </p>
      </CardFooter>
    </Card>
  );
}
