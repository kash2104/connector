import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
                {success:false, message:"you are not a creator"},
                {status:401}
            )
        }

        const data = await req.json();

        if (!data.workspaceId || !data.editorId) {
            return NextResponse.json(
              { success: false, message: "Workspace ID or Editor ID missing" },
              { status: 400 }
            );
          }

        const workspace = await prisma.workspace.findUnique({
            where:{
                id: data.workspaceId as string
            },
            include:{
                editors:true
            }
        })

        if(!workspace){
            return NextResponse.json(
                {success: false, message: "workspace not found"},
                {status: 404}
            )
        }

        if(workspace.creatorId !== session?.user?.id){
            return NextResponse.json(
                {success: false, message: "you are not the creator of this workspace"},
                {status: 401}
            )
        }
        
        if(!workspace.editors.some((p) => p.id === data.editorId)){
            return NextResponse.json(
                {success: false, message: "editor not found"},
                {status: 404}
            )
        }

        await prisma.workspace.update({
            where:{
                id: data.workspaceId as string
            },
            data:{
                editors:{
                    disconnect:{
                        id: data.editorId
                    }
                }
            }
        })

        return NextResponse.json(
            {success: true, message: "editor removed successfully"},
            {status: 200}
        )


    } catch (error:any) {
        return NextResponse.json(
            {success: false, message: `Error occured while removing the editor, ${error.message}`},
            {status: 500}
        )
    }
}