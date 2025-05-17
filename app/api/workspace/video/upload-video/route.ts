import { authOptions } from "@/lib/auth-options";
import s3Client from "@/lib/config";
import prisma from "@/lib/db";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";


export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user){
            return NextResponse.json(
                {success:false, message:"Unauthorized"},
                {status:401}
            )
        }

        const creator = await prisma.creator.findUnique({
            where:{
                email: session?.user?.email
            },
            include:{
                workspaces: true
            }
        })

        if(!creator){
            return NextResponse.json(
                {success:false, message:"you are not a creator"},
                {status:401}
            )
        }

        const {videoId} = await req.json();
        const video = await prisma.video.findUnique({
            where:{
                id: videoId
            }
        })

        if(!video){
            return NextResponse.json(
                {success:false, message:"No such video found"},
                {status:404}
            )
        }

        const videoExists = creator.workspaces.find((w) => w.id === video.workspaceId);
        if(!videoExists){
            return NextResponse.json(
                {success:false, message:"Video not found creator workspace"},
                {status:404}
            )
        }

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: session?.user?.access_token,
            refresh_token: session?.user?.refresh_token
        })

        if(!oauth2Client){
            return NextResponse.json(
                {success:false, message:"Failed to authenticate with google. Login again"},
                {status:401}
            )
        }

        const youtube = google.youtube({
            version: "v3",
            auth: oauth2Client
        })

        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: video.title
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        video.videoUrl = url;

        const videoResponse = await fetch(video.videoUrl);
        if (!videoResponse.ok || !videoResponse.body) {
            return NextResponse.json(
                { success: false, message: "Failed to fetch video content" },
                { status: 500 }
            );
        }
        
        const readableStream = Readable.from(videoResponse.body as any);

        let result;
        try {
            result = await youtube.videos.insert({
                part: ["snippet", "status"],
                requestBody: {
                    snippet: {
                        title: video.title,
                    },
                    status: { privacyStatus: "private" },
                },
                media: {
                    body: readableStream,
                },
            });
        } catch (error:any) {
            return NextResponse.json(
                { success: false, message: `YouTube API video error: ${error.message}` },
                { status: 500 }
            );
        }

        if(!result){
            return NextResponse.json(
                {success:false, message:"Failed to upload video to youtube"},
                {status:500}
            )
        }

        await fetch(`${process.env.NEXTAUTH_URL}/api/workspace?workspace=${video.workspaceId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        return NextResponse.json(
            {success: true, message: "Video uploaded to youtube", result: result?.data},
            {status:200}
        )
        
    } catch (error:any) {
        return NextResponse.json(
            { success: false, message: `Error: ${error.message}` },
            { status: 500 }
        );
    }
}