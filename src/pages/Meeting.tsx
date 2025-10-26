import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mic, Square, Loader2 } from "lucide-react";

const Meeting = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [meeting, setMeeting] = useState<any>(null);
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    fetchMeeting();
    fetchTranscripts();
  }, [meetingId]);

  const fetchMeeting = async () => {
    const { data, error } = await supabase
      .from("meetings")
      .select("*, folders(*, workspaces(*))")
      .eq("id", meetingId)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load meeting",
        variant: "destructive",
      });
      navigate("/dashboard");
    } else {
      setMeeting(data);
      if (data.status === "in_progress") {
        setIsRecording(true);
      }
    }
  };

  const fetchTranscripts = async () => {
    const { data } = await supabase
      .from("transcripts")
      .select("*")
      .eq("meeting_id", meetingId)
      .order("created_at", { ascending: true });

    if (data) {
      setTranscripts(data);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(5000); // Collect chunks every 5 seconds
      setIsRecording(true);

      toast({
        title: "Recording started",
        description: "Speak clearly for best transcription results",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setIsProcessing(true);

      // Simulate processing and update meeting status
      setTimeout(async () => {
        const { error } = await supabase
          .from("meetings")
          .update({
            status: "completed",
            ended_at: new Date().toISOString(),
          })
          .eq("id", meetingId);

        if (!error) {
          fetchMeeting();
          toast({
            title: "Recording completed",
            description: "Processing transcription...",
          });
        }
        setIsProcessing(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/folder/${meeting?.folder_id}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{meeting?.title}</h1>
                <Badge variant={meeting?.status === "completed" ? "default" : "secondary"}>
                  {meeting?.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Started {meeting?.started_at && new Date(meeting.started_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Recording Control */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recording Control</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            {isProcessing ? (
              <div className="text-center">
                <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Processing recording...</p>
              </div>
            ) : isRecording ? (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-lg font-semibold mb-4">Recording in progress</p>
                <Button onClick={stopRecording} variant="destructive" size="lg">
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              </div>
            ) : meeting?.status === "in_progress" ? (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                  <Mic className="w-12 h-12 text-primary" />
                </div>
                <p className="text-lg font-semibold mb-4">Ready to record</p>
                <Button onClick={startRecording} size="lg">
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">Meeting completed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transcript */}
        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            {transcripts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transcript available yet. Start recording to see live transcription.
              </p>
            ) : (
              <div className="space-y-4">
                {transcripts.map((transcript) => (
                  <div key={transcript.id} className="p-4 rounded-lg bg-muted">
                    {transcript.speaker && (
                      <p className="font-semibold text-sm mb-1">{transcript.speaker}</p>
                    )}
                    <p>{transcript.text}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Meeting;