import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Mic, FolderOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import CreateFolderDialog from "@/components/workspace/CreateFolderDialog";

interface Folder {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const Workspace = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workspace, setWorkspace] = useState<any>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  useEffect(() => {
    fetchWorkspace();
    fetchFolders();
  }, [workspaceId]);

  const fetchWorkspace = async () => {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", workspaceId)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load workspace",
        variant: "destructive",
      });
      navigate("/dashboard");
    } else {
      setWorkspace(data);
    }
  };

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load folders",
        variant: "destructive",
      });
    } else {
      setFolders(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{workspace?.name || "Loading..."}</h1>
              <p className="text-sm text-muted-foreground">{workspace?.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Folders</h2>
            <p className="text-muted-foreground">Organize your meetings by project or topic</p>
          </div>
          <Button onClick={() => setShowCreateFolder(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : folders.length === 0 ? (
          <Card className="text-center p-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No folders yet</h3>
            <p className="text-muted-foreground mb-4">
              Create a folder to start organizing your meetings
            </p>
            <Button onClick={() => setShowCreateFolder(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Folder
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <Card
                key={folder.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:border-primary"
                onClick={() => navigate(`/folder/${folder.id}`)}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <FolderOpen className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>{folder.name}</CardTitle>
                  <CardDescription>
                    {folder.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(folder.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        workspaceId={workspaceId!}
      />
    </div>
  );
};

export default Workspace;