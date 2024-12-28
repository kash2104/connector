import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { read } from "fs";
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

        const youtube = google.youtube({
            version: "v3",
            auth: oauth2Client
        })

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
                        description: video.description,
                        tags: video.tags,
                        thumbnails: { default: { url: video.thumbnailUrl } },
                    },
                    status: { privacyStatus: "public" },
                },
                media: {
                    body: readableStream,
                },
            });
        } catch (error:any) {
            return NextResponse.json(
                { success: false, message: `YouTube API error: ${error.message}` },
                { status: 500 }
            );
        }
       

        await prisma.video.update({
            where:{
                id: videoId
            },
            data:{
                status: "APPROVED"
            }
        })

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