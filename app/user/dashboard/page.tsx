'use client';

import Error from "@/app/components/Error/page";
import Loading from "@/app/components/Loading/page";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { FolderOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Workspace = {
  id: string;
  name: string;
  creatorId: string;
};

export default function CreatorDashboard() {
  const session = useSession();
  const params = useSearchParams();
  const name = params.get("name");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWorkspace() {
      if (name === session?.data?.user?.name) {
        setLoading(true);
        setError(false);
        try {
          const response = await fetch("/api/user", { method: "GET" });
          const data = await response.json();

          if (!data.success) {
            setError(true);
            return;
          }
          setWorkspaces(data.workspaces);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching workspaces:", err);
          setError(true);
        } 
      } else {
        setError(true);
      }
    }

    fetchWorkspace();
  }, [params,session]);

  if (loading) {
    return <Loading />;
  }

  if (error || session?.data?.user?.name !== name) {
    return <Error />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">My Workspaces</h1>
        <Button
          asChild
          className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-semibold py-2 px-4 rounded shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/creator/new-workspace">Create New Workspace</Link>
        </Button>
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
                  <Link href={`/creator/workspace/${workspace.id}`}>Open Workspace</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
