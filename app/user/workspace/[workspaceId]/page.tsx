'use client';

import CreatorWorkspacePage from "@/app/components/Creator/Workspace";
import EditorWorkspacePage from "@/app/components/Editor/Workspace";
import Error from "@/app/components/ErrorComp";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WorkspacePage() {
    const { data: session } = useSession();
    const [error, setError] = useState(true);
    const [role, setRole] = useState("");
    const [workspaceid, setWorkspaceId] = useState<string|null>(null);

    useEffect(() => {
        if (session) {
            setError(false);
            setRole(session.user.role);
        }
    }, [session]);

    const params = useParams();
    useEffect(() => {
        if (params.workspaceId) {
          const {workspaceId} = params;
            const decodedName = decodeURIComponent(workspaceId as string);
            setWorkspaceId(decodedName);
        }
    }, [params]);

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
                role === "CREATOR" ? <CreatorWorkspacePage workspaceId={workspaceid as string} /> : <EditorWorkspacePage workspaceId={workspaceid as string}/>
            }
        </div>
    );
}
