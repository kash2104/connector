import s3Client from "@/lib/config";
import prisma from "@/lib/db";
import { CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const bucketName = process.env.BUCKET_NAME;

interface Part {
  ETag: string;
  PartNumber: number;
}

export async function POST(req: NextRequest) {
  try {
    let { title, uploadId, parts } = await req.json();

    const params = {
      Bucket: bucketName,
      Key: title,
      UploadId: uploadId,

      MultipartUpload: {
        Parts: parts.map((part: Part, index: number) => ({
          ETag: part.ETag,
          PartNumber: part.PartNumber,
        })),
      },
    };

    const command = new CompleteMultipartUploadCommand(params);
    const multipartcomplete = await s3Client.send(command);

    if (!multipartcomplete) {
      return NextResponse.json(
        { status: false, message: "Error completing multipart upload" },
        { status: 500 }
      );
    }
    const workspaceId = req.nextUrl.searchParams.get("workspaceId");
    const newVideo = await prisma.video.create({
      data: {
        title: title,
        workspaceId: workspaceId as string,
        videoUrl: "",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Video upload completed successfully",
        video: newVideo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in complete-video route:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
