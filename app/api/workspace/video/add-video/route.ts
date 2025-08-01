import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { generateMultiPartPreSignedUrl, startMultipart } from "@/lib/config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const editor = await prisma.editor.findUnique({
      where: {
        id: session?.user?.id,
      },
      include: {
        workspaces: true,
      },
    });

    if (!editor) {
      return NextResponse.json(
        { success: false, message: "You are not an editor" },
        { status: 401 }
      );
    }

    const workspaceId = req.nextUrl.searchParams.get("workspaceId");

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId as string,
      },
      include: {
        editors: true,
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { success: false, message: "this workspace doesn't exists" },
        { status: 404 }
      );
    }

    const editorExists = workspace.editors.some((p) => p.id === editor.id);

    if (!editorExists) {
      return NextResponse.json(
        { success: false, message: "You are not an editor of this workspace" },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const video = formData.get("video") as File | null;
    const title = formData.get("title") as string;

    if (!video || !title) {
      return NextResponse.json(
        { success: false, message: "video or title is missing" },
        { status: 400 }
      );
    }

    // console.log(video.type);
    // const videoUploadDetails = await uploadVideoS3(video, title);
    const videoUploadDetails = await startMultipart(video, title);
    // console.log(videoUploadDetails.UploadId);

    const uploadId = videoUploadDetails.UploadId;
    const fileSize = video.size;
    const partSize = 10 * 1024 * 1024; // 10MB
    const totalParts = Math.ceil(fileSize / partSize);

    const presignedurls = await generateMultiPartPreSignedUrl(
      title,
      uploadId as string,
      totalParts
    );
    // console.log(presignedurls);

    // const newVideo = await prisma.video.create({
    //   data: {
    //     title: title,
    //     workspaceId: workspaceId as string,
    //     videoUrl: "",
    //   }
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Presigned URLs generated successfully",
        presignedurls: presignedurls,
        totalParts: totalParts,
        uploadId: uploadId,
        partSize: partSize,
        fileSize: fileSize,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding video presigned urls:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Error adding video presigned urls: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
