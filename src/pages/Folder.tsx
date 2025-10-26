import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Mic, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Meeting {
  id: string;
  title: string;
  summary: string | null;
  status: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
}

const Folder = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [folder, setFolder] = useState<any>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolder();
    fetchMeetings();
  }, [folderId]);

  const fetchFolder = async () => {
    const { data, error } = await supabase
      .from("folders")
      .select("*, workspaces(*)")
      .eq("id", folderId)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load folder",
        variant: "destructive",
      });
      navigate("/dashboard");
    } else {
      setFolder(data);
    }
  };

  const fetchMeetings = async () => {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("folder_id", folderId)
      .order("started_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load meetings",
        variant: "destructive",
      });
    } else {
      setMeetings(data || []);
    }
    setLoading(false);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const startNewMeeting = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("meetings")
      .insert([{
        folder_id: folderId,
        user_id: user.id,
        title: `Meeting ${new Date().toLocaleDateString()}`,
        status: "in_progress",
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to start meeting",
        variant: "destructive",
      });
    } else {
      navigate(`/meeting/${data.id}`);
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
              onClick={() => navigate(`/workspace/${folder?.workspace_id}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{folder?.name || "Loading..."}</h1>
              <p className="text-sm text-muted-foreground">{folder?.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Meetings</h2>
            <p className="text-muted-foreground">View and manage your meeting recordings</p>
          </div>
          <Button onClick={startNewMeeting} className="gap-2">
            <Mic className="w-4 h-4" />
            Start Recording
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : meetings.length === 0 ? (
          <Card className="text-center p-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No meetings yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your first meeting recording
            </p>
            <Button onClick={startNewMeeting}>
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <Card
                key={meeting.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:border-primary"
                onClick={() => navigate(`/meeting/${meeting.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{meeting.title}</CardTitle>
                        <Badge variant={meeting.status === "completed" ? "default" : "secondary"}>
                          {meeting.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {meeting.summary || "No summary available"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(meeting.started_at).toLocaleString()}
                    </div>
                    {meeting.duration_seconds && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {formatDuration(meeting.duration_seconds)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Folder;