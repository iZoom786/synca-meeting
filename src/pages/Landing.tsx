import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, FileText, FolderOpen, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Synca
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
          <Button onClick={() => navigate("/auth")}>
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Meeting Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Never miss a
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {" "}meeting detail{" "}
            </span>
            again
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Synca automatically transcribes your meetings in real-time, extracts action items, 
            and organizes everything into smart workspaces for instant recall.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Transcription</h3>
            <p className="text-muted-foreground">
              Crystal-clear audio-to-text conversion as your meeting happens. Never scramble to take notes again.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Summaries</h3>
            <p className="text-muted-foreground">
              AI automatically extracts key points, decisions, and action items from every meeting.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
              <FolderOpen className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-2">Organized Workspaces</h3>
            <p className="text-muted-foreground">
              Keep all your meetings organized in folders with persistent memory and easy search.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-primary to-accent text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to transform your meetings?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who never miss important meeting details.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")} className="text-lg px-8">
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2025 Synca. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;