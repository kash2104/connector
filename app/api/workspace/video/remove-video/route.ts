import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import s3Client from "@/lib/config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";


export async function DELETE(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user){
            return NextResponse.json(
                {success:false, message:"Unauthorized"},
                {status:401}
            )
        }

        if(session?.user?.role !== "CREATOR"){
            return NextResponse.json(
                {success:false, message:"You are not a creator"},
                {status:401}
            )
        }

        const workspaceId = req.nextUrl.searchParams.get("workspaceId");
        const workspace = await prisma.workspace.findUnique({
            where:{
                id: workspaceId as string
            },
            include:{
                videos: true
            }
        })

        if(!workspace){
            return NextResponse.json(
                {success:false, message:"Workspace not found"},
                {status:404}
            )
        }

        const data = await req.json();

        const video = await prisma.video.findUnique({
            where:{
                id: data.videoId as string
            }
        })

        const videoExists = workspace.videos.some((v) => v.id === video?.id);

        if(!videoExists){
            return NextResponse.json(
                {success:false, message:"Video not found in this workspace"},
                {status:404}
            )
        }

        const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: video?.title
        }
        const command = new DeleteObjectCommand(params);
        const videoDelete = await s3Client.send(command);
        
        if(!videoDelete){
            return NextResponse.json(
                {status:false, message:"Error deleting from cloud"},
                {status:500}
            )
        }

        await prisma.video.delete({
            where:{
                id: data.videoId
            }
        })

        return NextResponse.json(
            {success:true, message:"Video deleted successfully"},
            {status:200}
        )

    } catch (error: any) {
        
        return NextResponse.json(
            {success:false, message: `Error deleting video: ${error.message}`},
            {status:500}
        )
    }
}