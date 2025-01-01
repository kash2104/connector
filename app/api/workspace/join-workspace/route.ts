import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user?.id){
            return NextResponse.json(
                {success:false, message:"Unauthorized"},
                {status:401}
            )
        }

        const user = await prisma.editor.findUnique({
            where:{
                id: session?.user?.id
            },
            include:{
                workspaces:true
            }

        })

        if(!user){
            return NextResponse.json(
                {success:false, message:"not a editor"},
                {status:401}
            )
        }

        const data = await req.json();

        const workspace = await prisma.workspace.findUnique({
            where:{
                id:data.workspaceId
            },
            include:{
                editors:true
            }
        })

        if(!workspace){
            return NextResponse.json(
                {success:false, message:"Workspace not found"},
                {status:404}
            )
        }

        const exisitingMember = workspace.editors.some((p) => p.id === user.id);
        
        if(exisitingMember){
            return NextResponse.json(
                {success:false, message:"Already a member"},
                {status:400}
            )
        }

        await prisma.workspace.update({
            where:{
                id:workspace.id
            },
            data:{
                editors:{
                    connect:{
                        id:user.id
                    }
                }
            }
        })

        
        return NextResponse.json(
            {success:true, message:"Joined the workspace", workspace:workspace},
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