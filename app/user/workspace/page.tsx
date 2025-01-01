'use client';

import CreatorWorkspacePage from "@/app/components/Creator/Workspace/page";
import EditorWorkspacePage from "@/app/components/Editor/Workspace/page";
import Error from "@/app/components/Error/page";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function WorkspacePage() {
    const { data: session } = useSession();
    const [error, setError] = useState(true);
    const [role, setRole] = useState("");

    useEffect(() => {
        if (session) {
            setError(false);
            setRole(session.user.role);
        }
    }, [session]);

    if(error){
        return(
            <div>
                <Error code="401" message="Please login!!"/>
            </div>
        )
    }



    return (
        <div>
            {
                role === "CREATOR" ? <CreatorWorkspacePage /> : <EditorWorkspacePage/>
            }
        </div>
    );
}
