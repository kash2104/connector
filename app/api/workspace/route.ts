import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { deleteFromCloud } from "@/lib/config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);
    
        if(!session?.user){
            return NextResponse.json(
                {success: false, message:"Unauthorized"},
                {status: 401}
            )
        }
        
        
        const workspaceId = req.nextUrl.searchParams.get("workspaceId");
        const workspace = await prisma.workspace.findUnique({
            where:{
                id: workspaceId as string
            },
            include:{
                videos: true,
                editors: true
            }
        })

        if(!workspace){
            return NextResponse.json(
                {success: false, message: "Workspace not found"},
                {status:401}
            )
        }
        
    
        return NextResponse.json(
            {success: true, message: "Got the workspace", workspace: workspace},
            {status: 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {success:false, message:"Error while getting worskpaces"},
            {status: 500}
        )
    }
}

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user?.id){
            return NextResponse.json(
                {success:false, message:"Unauthorized"},
                {status:401}
            )
        }
        
        const user = await prisma.creator.findUnique({
            where:{
                email: session?.user?.email
            }
        })

        if(!user){
            return NextResponse.json(
                {success:false, message:"not a creator"},
                {status:401}
            )
        }

        const data = await req.json();

        //create workspace
        const workspace = await prisma.workspace.create({
            data:{
                name:data.name,
                creatorId: user?.id as string
            }
        })

        return NextResponse.json(
            {success:true, workspace},
            {status:200}
        )

        
    } catch (error:any) {
        if(error.message === "Unauthenticated Request"){
            return NextResponse.json(
                {success:false, message:"Unauthorized"},
                {status:401}
            )
        }

        return NextResponse.json(
            { success: false, message: `An unexpected error occurred: ${error.message}` },
            { status: 500 }
        )
    }
}

export async function DELETE(req:NextRequest){
    try {
        const workspaceId = req.nextUrl.searchParams.get("workspaceId");
    
        const session = await getServerSession(authOptions);
    
        if(!session?.user?.id){
            return NextResponse.json(
                {success:false, message:"Unauthorized"},
                {status:401}
            )
        }
        
        const user = await prisma.creator.findUnique({
            where:{
                id: session?.user?.id
            }
        })

        if(!user){
            return NextResponse.json(
                {success:false, message:"not a creator"},
                {status:401}
            )
        }
    
        if(!workspaceId){
            return NextResponse.json(
                {success:false, message:"workspaceId is required"},
                {status:401}
            )
        }
    
        const workspace = await prisma.workspace.findUnique({
            where:{
                id:workspaceId
            },
            include:{
                editors:true,
                videos:true,
            }
        })

        if(workspace?.creatorId !== session?.user?.id){
            return NextResponse.json(
                {success:false, message:"Unauthorized to delete the workspace"},
                {status:403}
            )
        }
    
        //delete the videos in the workspace i.e. delete workspace.videos from db as well as cloud
        for(const video of workspace.videos){
            const videopart = video.videoUrl.split("/");
            const videoid = videopart[videopart.length - 1].split(".")[0];
            const videopublicId = `Connector/videos/${videoid}`;
            await deleteFromCloud(videopublicId, "video");

            const thumbnailpart = video.thumbnailUrl.split("/");
            const thumbnailid = thumbnailpart[thumbnailpart.length - 1].split(".")[0];
            const thumbnailpublicId = `Connector/thumbnails/${thumbnailid}`;
            await deleteFromCloud(thumbnailpublicId, "image");

            await prisma.video.delete({
                where:{
                    id: video.id
                }
            })
        }
        //remove the workspace from the editors of that workspace i.e. editor.workspaces array
        for(const editor of workspace.editors){
            await prisma.editor.update({
                where:{
                    id: editor.id
                },
                data:{
                    workspaces:{
                        disconnect:{
                            id: workspaceId
                        }
                    }
                }
            })
        }
    
        //delete the workspace
        await prisma.workspace.delete({
            where:{
                id:workspaceId
            }
        })

        return NextResponse.json(
            {status:true, message: "Workspace deleted successfully"},
            {status:200}
        )
        
    } catch (error: any) {
        console.error("Error deleting space:", error)
        return NextResponse.json(
          { success: false, message: `Error deleting space: ${error.message}` },
          { status: 500 }
        )
    }
}