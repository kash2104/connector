'use client'
import CreatorDashboard from "@/app/components/Creator/Dashboard";
import EditorDashboard from "@/app/components/Editor/Dashboard";
import Error from "@/app/components/ErrorComp";
import Loading from "@/app/components/Loading/page";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Dashboard() {
  const { data: session } = useSession();
      const [error, setError] = useState(true);
      const [role, setRole] = useState("");
      const [name, setName] = useState<string|null>(null);

      const params = useParams();
      useEffect(() => {
          if (params.name) {
            const {name} = params;
              const decodedName = decodeURIComponent(name as string);
              setName(decodedName);
          }
      }, [params]);
  
      useEffect(() => {
          if (session) {
              setError(false);
              setRole(session.user.role);
          }
      }, [session]);

      if(!name){
        return(
          <div>
            <Loading/>
          </div>
        )
      }
  
      if(error){
          return(
              <div>
                  <Error code="401" message="Please login!!"/>
              </div>
          )
      }
  return(
    <div>
      {role === "CREATOR" ? <CreatorDashboard userName={name} /> : <EditorDashboard userName={name}/>}
    </div>
  )
}