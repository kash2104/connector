"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import ErrorComp from "@/app/components/ErrorComp";
import Loading from "@/app/components/Loading/page";
import { useSession } from "next-auth/react";
import { Input } from "../../ui/input";
import { pre, video } from "motion/react-client";

type WorkspaceType = {
  id: string;
  name: string;
  videos: {
    id: string;
    title: string;
    videoUrl: string;
  }[];
  creator: { id: string; email: string; name: string };
};

type EditorWorkspacePageProps = {
  workspaceId: string;
};

export default function EditorWorkspacePage({
  workspaceId,
}: EditorWorkspacePageProps) {
  const [workspace, setWorkspace] = useState<WorkspaceType | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{
    title: string;
    url: string;
  } | null>(null);

  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);
  const session = useSession();
  const [code, setCode] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const formData = new FormData();

  useEffect(() => {
    const fetchWorkspace = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/workspace?workspaceId=${workspaceId}`,
          { method: "GET" }
        );
        const data = await response.json();

        if (!response.ok || data.success === false) {
          setError(true);
          setCode(data.status);
          setMessage(data.message);
          return;
        }

        setWorkspace(data.workspace);
      } catch (error) {
        setError(true);
        setCode("500");
        setMessage("Internal Server Error. Try again!");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId, session]);

  useEffect(() => {
    if (!isAddVideoDialogOpen) {
      setNewVideoTitle("");
      setVideoFile(null);
    }
  }, [isAddVideoDialogOpen]);

  const handleAddVideo = async () => {
    setIsAddVideoDialogOpen(true);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmitNewVideo = async (event: React.FormEvent) => {
    event.preventDefault();

    formData.append("video", videoFile as File);
    formData.append("title", newVideoTitle.trim());
    if (!newVideoTitle.trim() || !videoFile) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/workspace/video/add-video?workspaceId=${workspaceId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (!response.ok || data.success === false) {
        setError(true);
        setCode(data.status);
        setMessage(data.message);
        return;
      }
      const presignedUrls = data.presignedurls;
      const totalParts = data.totalParts;
      const uploadId = data.uploadId;
      const partSize = data.partSize;
      const fileSize = data.fileSize;
      const parts: { ETag: string; PartNumber: number }[] = [];
      for (let i = 0; i < totalParts; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, fileSize);
        const chunk = videoFile.slice(start, end);
        const presignedUrl = presignedUrls[i];

        const response = await fetch(presignedUrl, {
          method: "PUT",
          body: chunk,
          headers: {
            "Content-Type": videoFile.type,
          },
        });
        // console.log(response);
        if (!response.ok) {
          throw new Error(`Failed to upload part ${i + 1}`);
        }
        const etag = response.headers.get("ETag");
        // console.log(etag);
        if (etag) {
          parts.push({ ETag: etag, PartNumber: i + 1 });
        }
      }

      const completeUploadResponse = await fetch(
        `/api/workspace/video/complete-video?workspaceId=${workspaceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newVideoTitle.trim(),
            uploadId: uploadId,
            parts: parts,
          }),
        }
      );

      const uploadData = await completeUploadResponse.json();
      if (!completeUploadResponse.ok || uploadData.success === false) {
        setError(true);
        setCode(uploadData.status);
        setMessage(uploadData.message);
        return;
      }

      setWorkspace((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          videos: [
            ...prev.videos,
            {
              id: uploadData.video.id,
              title: newVideoTitle,
              videoUrl: uploadData.video.videoUrl,
            },
          ],
        };
      });
    } catch (error) {
      console.error("Failed to add video:", error);
      setError(true);
    } finally {
      setIsAddVideoDialogOpen(false);
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorComp code={code as string} message={message as string} />;
  }

  if (!workspace || loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{workspace.name}</h1>
          <p className="text-sm text-gray-400">
            Creator: {workspace?.creator.name}
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleAddVideo}
          className="w-full sm:w-auto bg-[#38BDF8] hover:bg-[#0EA5E9] text-white"
        >
          Add Video
        </Button>
      </div>

      {/* Videos Section */}
      <Card className="bg-[#1E293B] border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspace.videos.map((video) => (
              <div
                key={video.id}
                className="bg-[#0F172A] p-4 rounded-md space-y-3"
              >
                <div className="relative aspect-video">
                  <div
                    className="relative rounded-md cursor-pointer bg-gray-400 overflow-hidden"
                    style={{ aspectRatio: "16 / 9" }}
                  ></div>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute inset-0 w-full h-full bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={() =>
                      setPreviewVideo({
                        title: video.title,
                        url: video.videoUrl,
                      })
                    }
                  >
                    <Play className="w-12 h-12 text-white" />
                  </Button>
                </div>
                <h3 className="text-white font-semibold truncate">
                  {video.title}
                </h3>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog component */}
      <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
        <DialogContent className="bg-[#1E293B] border-[#334155] text-white sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>{previewVideo?.title}</DialogTitle>
          </DialogHeader>
          {previewVideo && (
            <div className="aspect-video">
              <video src={previewVideo.url} controls className="w-full h-full">
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddVideoDialogOpen}
        onOpenChange={setIsAddVideoDialogOpen}
      >
        <DialogContent className="bg-[#1E293B] border-[#334155] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Video</DialogTitle>
            <DialogDescription>
              The video will be added to the workspace
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitNewVideo} className="space-y-4 mt-4">
            <div>
              <label htmlFor="video-title" className="text-[#38BDF8]">
                Video Title
              </label>
              <Input
                type="text"
                id="video-title"
                placeholder="Video Title"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                className="bg-[#0F172A] border-[#334155] text-white"
              />
            </div>

            <div>
              <label htmlFor="video-file" className="text-[#38BDF8]">
                Choose Video File
              </label>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                // className="bg-[#0F172A] border-[#334155] text-white"
                className="bg-[#0F172A] border-[#334155] text-[#38BDF8] mt-1 file:bg-[#38BDF8] file:text-[#0F172A] file:border-0 file:rounded-md file:px-2 file:py-[0.75] file:mr-2 hover:file:bg-[#0EA5E9]"
              />
            </div>

            <Button
              type="submit"
              disabled={!newVideoTitle || !videoFile}
              className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white"
            >
              Add Video
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
