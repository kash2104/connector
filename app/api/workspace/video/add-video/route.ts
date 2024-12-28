import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { cloudConnect, uploadImage, uploadVideo } from "@/lib/config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user){
            return NextResponse.json(
                {success:false, message:"Unauthorized"},
                {status:401}
            )
        }

        const editor = await prisma.editor.findUnique({
            where:{
                id: session?.user?.id
            },
            include:{
                workspaces:true
            }
        })

        if(!editor){
            return NextResponse.json(
                {success:false, message: "You are not an editor"},
                {status:401}
            )
        }

        const workspaceId = req.nextUrl.searchParams.get("workspaceId");

        const workspace = await prisma.workspace.findUnique({
            where:{
                id: workspaceId as string
            },
            include:{
                editors: true
            }
        })

        if(!workspace){
            return NextResponse.json(
                {success:false, message: "this workspace doesn't exists"},
                {status:404}
            )
        }

        const editorExists = workspace.editors.some((p) => p.id === editor.id);

        if(!editorExists){
            return NextResponse.json(
                {success:false, message: "You are not an editor of this workspace"},
                {status: 500}
            )
        }

        const formData = await req.formData();
        
        const video = formData.get("video") as File | null;
        const thumbnail = formData.get("thumbnail") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const tagArray = formData.get("tags") as string;
        const tags = tagArray.split(',');
        // console.log(tagArray);
        // console.log(tags);

        // console.log(video);
        // console.log(thumbnail);
        // console.log(title);
        // console.log(description);
        // console.log(tagArray);
        // console.log(tags);


        if(!video || !title){
            return NextResponse.json(
                {success:false, message: "video or title is missing"},
                {status:400}
            )
        }
        
        await cloudConnect();

        const thumbnailUploadDetails = await uploadImage(thumbnail, process.env.CLOUD_THUMBNAIL_FOLDER);
        const videoUploadDetails = await uploadVideo(video, process.env.CLOUD_VIDEO_FOLDER);
    
        const newVideo = await prisma.video.create({
            data:{
                title: title,
                description: description,
                thumbnailUrl: thumbnailUploadDetails.secure_url,
                videoUrl: videoUploadDetails.secure_url,
                workspaceId: workspace.id,
                tags: tags,
                status: "PENDING"
            }
        })

        return NextResponse.json(
            {success:true, message:"Video added to workspace", newVideo},
            {status:200}
        )
    } catch (error: any) {
        console.error("Error adding video:", error)
        return NextResponse.json(
          { success: false, message: `Error adding video: ${error.message}` },
          { status: 500 }
        )
    }
}