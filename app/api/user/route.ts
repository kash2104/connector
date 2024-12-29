import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
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

        let user;

        if(session?.user?.role === "CREATOR"){
            
            user = await prisma.creator.findUnique({
                where:{
                    id: session?.user?.id
                },
                include:{
                   workspaces: true
                }
            })
        }
        else{
            user = await prisma.editor.findUnique({
                where:{
                    id: session?.user?.id
                },
                include:{
                   workspaces: true
                }
            })
        }
    
    
        if(!user){
            return NextResponse.json(
                {success: false, message: "No such user found"},
                {status: 401}
            )
        }
    
        return NextResponse.json(
            {success: true, message: "Got all workspaces of the user", workspaces:user.workspaces},
            {status: 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {success:false, message:"Error while getting worskpaces of user"},
            {status: 500}
        )
    }
}