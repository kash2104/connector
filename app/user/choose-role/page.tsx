'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserCircle, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import Loading from '@/app/components/Loading/page'
import Error from '@/app/components/ErrorComp'
import { useSession } from 'next-auth/react'
import { ShootingStars } from '@/app/components/ui/shooting-stars'
import { StarsBackground } from '@/app/components/ui/stars-background'

export default function ChooseRolePage() {
  const session = useSession();
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleRoleSelection = async(role: 'CREATOR' | 'EDITOR') => {
    setIsLoading(true)
    try {
        const response = await fetch(`/api/role`,{
            method: 'POST',
            body: JSON.stringify({role: role}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(response.ok){
            router.push(`/user/dashboard/${session?.data?.user?.name}`);
        }
        else{
            setError(true);
        }
        
    } catch (error) {
        console.error(error);
        setError(true);
    }finally{
        setIsLoading(false);
    }
  }

  if(isLoading){
    return <div><Loading/></div>
  }

  if(error){
    return <div><Error code="500" message="Internal Server Error!!"/></div>
  }

  return (
    <div className=" bg-[#0F172A] relative flex items-center justify-center px-4 py-20">
      <ShootingStars/>
      <StarsBackground/>
      <div className="max-w-4xl w-full space-y-8 relative">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Role</h1>
          <p className="text-xl text-gray-400">Select the role that best describes you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#1E293B] border-[#334155] hover:bg-[#2D3748] transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex justify-center items-center">
                <UserCircle className="w-8 h-8 mr-2 text-blue-400" />
                Creator
              </CardTitle>
              <CardDescription className="text-gray-400 text-md text-center">
                I create content and manage my channel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors duration-300 w-full"
                onClick={() => handleRoleSelection('CREATOR')}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Start Publishing'}
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-[#1E293B] border-[#334155] hover:bg-[#2D3748] transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex justify-center items-center">
                <Users className="w-8 h-8 mr-2 text-blue-400" />
                Editor
              </CardTitle>
              <CardDescription className="text-gray-400 text-md text-center">
                I edit videos for creators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors duration-300 w-full"
                onClick={() => handleRoleSelection('EDITOR')}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Start Editing'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

