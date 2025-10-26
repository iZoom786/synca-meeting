import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { User } from "@supabase/supabase-js";

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-in zoom-in duration-300">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-4xl">Welcome to Synca!</CardTitle>
          <CardDescription className="text-lg">
            Hi {displayName}, we're excited to have you here! 🎉
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              You've successfully signed in. Let's get started with your first workspace and start recording meetings!
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 text-left">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="font-semibold mb-2">Create Workspaces</h4>
                <p className="text-sm text-muted-foreground">
                  Organize your meetings into dedicated workspaces
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                <h4 className="font-semibold mb-2">Record & Transcribe</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time transcription powered by AI
                </p>
              </div>
              <div className="p-4 rounded-lg bg-success/5 border border-success/10">
                <h4 className="font-semibold mb-2">Smart Summaries</h4>
                <p className="text-sm text-muted-foreground">
                  Get AI-generated summaries and action items
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="font-semibold mb-2">Never Forget</h4>
                <p className="text-sm text-muted-foreground">
                  Searchable meeting history at your fingertips
                </p>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full text-lg"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
