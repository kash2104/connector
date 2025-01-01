'use client'
import CreatorDashboard from "@/app/components/Creator/Dashboard/page";
import EditorDashboard from "@/app/components/Editor/Dashboard/page";
import Error from "@/app/components/Error/page";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function Dashboard(){
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
  return(
    <div>
      {role === "CREATOR" ? <CreatorDashboard /> : <EditorDashboard/>}
    </div>
  )
}