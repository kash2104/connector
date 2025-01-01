export default function Error({code, message}:{code:string, message: string}) {
    if(code === ""){
      code = "500"
    }

    if(message === ""){
      message = "Internal Server Error. Please try again later."
    }
    
    return (
      <div className="bg-[#0F172A] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#38BDF8] mb-2">{code}</h1>
          <p className="text-xl text-white">{message}</p>
        </div>
      </div>
    )
  }
  
  