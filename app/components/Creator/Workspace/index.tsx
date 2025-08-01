"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Upload, UserMinus, Play } from "lucide-react";
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

type WorkspaceType = {
  id: string;
  name: string;
  videos: {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    description: string;
    tags: string[];
  }[];
  editors: { id: string; email: string; name: string }[];
};

type CreatorWorkspacePageProps = {
  workspaceId: string;
};

export default function CreatorWorkspacePage({
  workspaceId,
}: CreatorWorkspacePageProps) {
  const [workspace, setWorkspace] = useState<WorkspaceType | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{
    title: string;
    url: string;
  } | null>(null);
  const [isUploadConfirmOpen, setIsUploadConfirmOpen] = useState(false);
  const [uploadingVideoId, setUploadingVideoId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [videourl, setVideoUrl] = useState<string | null>(null);
  // const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [isWorkspaceDeleteConfirmOpen, setIsWorkspaceDeleteConfirmOpen] =
    useState(false);
  const session = useSession();
  const [code, setCode] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/workspace?workspaceId=${workspaceId}`,
          { method: "GET" },
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
  }, [setWorkspace, session]);

  const handleRemoveEditor = async (editorId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workspace/remove-editor`, {
        method: "DELETE",
        body: JSON.stringify({
          workspaceId: workspace?.id,
          editorId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setWorkspace((prev) => ({
          ...prev!,
          editors: prev!.editors.filter((editor) => editor.id !== editorId),
        }));
      }
    } catch (error) {
      console.error("Failed to remove editor:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmedDelete = async () => {
    setLoading(true);
    if (!deletingVideoId || !videourl) return;
    try {
      const videoPart = videourl?.split("/");
      const videoid = videoPart?.[videoPart.length - 1].split(".")[0];
      const videoPublicId = `Connector/videos/${videoid}`;


      const response = await fetch(
        `/api/workspace/video/remove-video?workspaceId=${workspaceId}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            videoId: deletingVideoId,
            videoPublicId: videoPublicId,
          }),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        if (!workspace || !workspace.videos) {
          console.error("Workspace or videos missing:", workspace);
          return;
        }
        setWorkspace((prev) => ({
          ...prev!,
          videos: prev!.videos.filter((video) => video.id !== deletingVideoId),
        }));
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
      setError(true);
    } finally {
      setIsDeleteConfirmOpen(false);
      setLoading(false);
    }
  };

  const router = useRouter();
  const handleConfirmedUpload = async () => {
    if (!uploadingVideoId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/workspace/video/upload-video`, {
        method: "POST",
        body: JSON.stringify({ videoId: uploadingVideoId }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // console.log("Video uploaded successfully");
        await handleConfirmedWorkspaceDelete();
        router.push(`/user/dashboard/${session?.data?.user?.name}`);
      }
    } catch (error) {
      console.error("Failed to upload video:", error);
      setError(true);
    } finally {
      setIsUploadConfirmOpen(false);
      setLoading(false);
    }
  };

  const handleConfirmedWorkspaceDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/workspace?workspaceId=${workspaceId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setWorkspace(null);
        router.push(`/user/dashboard/${session?.data?.user?.name}`);
      }
    } catch (error) {
      console.error("Failed to upload video:", error);
      setError(true);
    } finally {
      setIsWorkspaceDeleteConfirmOpen(false);
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
          <p className="text-sm text-gray-400">Workspace ID: {workspace.id}</p>
        </div>
        <Button
          variant="destructive"
          onClick={() => {
            setIsWorkspaceDeleteConfirmOpen(true);
          }}
          className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700"
        >
          Delete Workspace
        </Button>
      </div>

      {/* Editors Section */}
      <Card className="bg-[#1E293B] border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Editors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workspace.editors.map((editor) => (
              <div
                key={editor.id}
                className="flex items-center justify-between bg-[#0F172A] p-3 rounded-md"
              >
                <span className="text-white">{editor.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEditor(editor.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <UserMinus className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Videos Section */}
      <Card className="bg-[#1E293B] border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspace.videos.length > 0 &&
              workspace.videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-[#0F172A] p-4 rounded-md space-y-3"
                >
                  <div className="relative aspect-video">
                    <div className="relative rounded-md cursor-pointer bg-gray-400 overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                    </div>
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
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUploadingVideoId(video.id);
                        setIsUploadConfirmOpen(true);
                        setVideoUrl(video.videoUrl);
                        // setThumbnailUrl(video.thumbnailUrl)
                      }}
                      className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                    >
                      <Upload className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeletingVideoId(video.id);
                        setIsDeleteConfirmOpen(true);
                        setVideoUrl(video.videoUrl);
                        // setThumbnailUrl(video.thumbnailUrl)
                      }}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
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
      <Dialog open={isUploadConfirmOpen} onOpenChange={setIsUploadConfirmOpen}>
        <DialogContent className="bg-[#1E293B] border-[#334155] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Upload to YouTube</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-300 mt-2">
            Once the video is uploaded to{" "}
            <span className="text-red-600 font-semibold">
              YouTube as private
            </span>
            , this workspace will be deleted. Are you sure you want to proceed?
          </DialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsUploadConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmedUpload}
              className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white"
            >
              Confirm Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="bg-[#1E293B] border-[#334155] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Video Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-300 mt-2">
            This video will be permanently deleted and cannot be retrieved. Are
            you sure you want to proceed?
          </DialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmedDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isWorkspaceDeleteConfirmOpen}
        onOpenChange={setIsWorkspaceDeleteConfirmOpen}
      >
        <DialogContent className="bg-[#1E293B] border-[#334155] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Workspace Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-300 mt-2">
            This workspace and all its contents will be permanently deleted.
            This action cannot be undone. Are you sure you want to proceed?
          </DialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsWorkspaceDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmedWorkspaceDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Workspace
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
