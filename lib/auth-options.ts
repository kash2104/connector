import { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./db";
import { JWT } from "next-auth/jwt";


export const authOptions:NextAuthOptions = {
    // debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization:{
                params:{
                    scope:"openid profile email https://www.googleapis.com/auth/youtube.upload"
                }
            }
        })
    ],
    pages:{
        signIn: "/auth"
    },
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    session:{
        strategy: "jwt",
    },
    callbacks:{
       async signIn({account,profile}){
        //user -> email, id
        //account -> provider, access_token
        //profile -> email_verified, name,email

            try {
                // console.log("signIn",account);
                // console.log(profile);https://www.googleapis.com/auth/youtube.upload
                if(account?.provider === "google"){
                    const user = await prisma.user.findUnique({
                        where:{
                            email:profile?.email
                        }
                    })
        
                    if(!user){
                        const newUser = await prisma.user.create({
                            data:{
                                email:profile?.email as string,
                                name:profile?.name as string,
                                role: "USER"
                            }
                        })
                    }
                }
                return true;
                
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        async jwt({token, user,account}){
            //token -> name,email
            //user -> id, name,email
            //account -> access_token
            //profile -> name
            if(account){
                token = {
                    id: user?.id,
                    access_token: account?.access_token,
                    role: "USER",
                    email: user?.email,
                    name: user?.name,

                }
            }

            return token;
        },

        async session({session, token}:{session:Session, token:JWT}){
            try {
                // console.log(session);
                // console.log(token);
                const user = await prisma.user.findUnique({
                    where:{
                        email: token.email as string
                    }
                })
                
                if (user && token) {
                    session.user = {
                      id: token.id as string,
                      email: token.email as string,
                      name: user.name,
                      role: token.role as string,
                    };
                }

            } catch (error) {
                console.error(error);
                throw error;
            }
            return session;

        }
    }
}