import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest){
    try {

        const session = await getServerSession(authOptions);

        if(!session?.user?.id){
            return NextResponse.json(
                {success:false, message:"Unauthorized"},
                {status:401}
            )
        }

        const data = await req.json();

        const user = await prisma.user.findUnique({
            where:{
                email : session?.user?.email
            }
        })

        if(!user){
            return NextResponse.json(
                {success:false, message:"User not found"},
                {status:404}
            )
        }

        const updatedUser = await prisma.user.update({
            where:{
                email: session?.user?.email
            },
            data:{
                role: data.role
            }
        })

        if(data.role === "CREATOR"){

            const creator = await prisma.creator.upsert({
                where:{
                    email: session?.user?.email
                },
                update:{},
                create:{
                    email : session?.user?.email,
                    name: session?.user?.name,
                    id: session?.user?.id
                }
            })
        }
        else if(data.role === "EDITOR"){

            const editor = await prisma.editor.upsert({
                where:{
                    email: session?.user?.email
                },
                update:{},
                create:{
                    email : session?.user?.email,
                    name: session?.user?.name,
                    id: session?.user?.id
                }
            })
        }

        return NextResponse.json(
            {success:true, message:"Role updated"},
            {status:200}
        )


    } catch (error:any) {
        
        if (error.message === "Unauthenticated Request") {
            return NextResponse.json(
              { success: false, message: "You must be logged in" },
              { status: 401 }
            );
        }
      
          
        return NextResponse.json(
            { success: false, message: `An unexpected error occurred: ${error.message}` },
            { status: 500 }
        )
    }
}