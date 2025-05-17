'use client';

import ErrorComp from "@/app/components/ErrorComp";
import Loading from "@/app/components/Loading/page";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { FolderOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Workspace = {
  id: string;
  name: string;
  creatorId: string;
};

type CreatorDashboardProps = {
  userName : string
}

export default function CreatorDashboard({userName}:CreatorDashboardProps) {
  const session = useSession();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWorkspace() {
      if (userName === session?.data?.user?.name) {
        setLoading(true);
        setError(false);
        try {
          const response = await fetch(`/api/user`, { method: "GET" });
          const data = await response.json();

          if (!data.success) {
            setError(true);
            return;
          }
          setWorkspaces(data.workspaces);
          setLoading(false);
        } catch (err) {
          // console.error("Error fetching workspaces:", err);
          setError(true);
        } 
      } else {
        setError(true);
      }
    }

    fetchWorkspace();
  }, [userName,session]);

  //creatiing a new workspace
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateWorkspace = async(event: React.FormEvent) => {
    event.preventDefault();
    if(!newWorkspaceName.trim()) return;

    setIsCreating(true);
    let data;
    try {
      const response = await fetch(
        '/api/workspace',
        {
          method: 'POST', 
          body: JSON.stringify({name: newWorkspaceName.trim()}), 
          headers: {'Content-Type': 'application/json'}
        })

        data = await response.json();

        setWorkspaces([...workspaces, data.workspace])
        setNewWorkspaceName('')
        setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating workspace:", error);
      setError(true);
    }finally{
      setIsCreating(false)
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (error || session?.data?.user?.name !== userName) {
    return <ErrorComp code="401" message="Unauthorized"/>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">My Workspaces</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-semibold py-2 px-4 rounded shadow-lg hover:shadow-xl transition-all duration-300">
              {/* <PlusCircle className="w-5 h-5 mr-2" /> */}
              Create New Workspace
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1E293B] border-[#334155] text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Create New Workspace</DialogTitle>
              <DialogDescription className="text-center">
                Enter a name for your new workspace
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWorkspace} className="space-y-4 mt-4">
              <Input
                type="text"
                placeholder="Workspace Name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="bg-[#0F172A] border-[#334155] text-white"
              />
              <Button 
                type="submit" 
                disabled={isCreating} 
                className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-semibold py-2 px-4 rounded shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isCreating ? 'Creating...' : 'Create Workspace'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {workspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className="bg-[#1E293B] border-none shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <FolderOpen className="w-16 h-16 text-[#38BDF8] mb-4" />
                <h2 className="text-xl font-semibold text-white mb-4">{workspace.name}</h2>
                <Button
                  asChild
                  className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-semibold py-2 px-4 rounded shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href={`/user/workspace/${workspace.id}`}>Open Workspace</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
