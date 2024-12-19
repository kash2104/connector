"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export function Appbar(){
    const session = useSession();
    return (
        <div>
            {session.data?.user && <button onClick={() => signOut()}>
                logout
                </button>}

                {!session.data?.user && <button onClick={() => signIn()}>
                Login with google
                </button>}
            
        </div>
    )
}