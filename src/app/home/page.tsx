"use client"
import { Button } from "@/components/ui/button"
import { Mic, Speech } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
    const [isAuth,setIsAuth]=useState(false)
    const router=useRouter()
    function checkAuth(){
        const stringifyData=localStorage.getItem("user-details")
        if(!stringifyData){
            router.push("/")
        }else{
            setIsAuth(true)
        }
    }

    useEffect(()=>{
        checkAuth()
    })
    return (
        <>
            {isAuth?(
                <main className="flex w-full h-full gap-6 flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <div>
                            <Speech className="w-[40px] h-[40px]"/>
                        </div>
                        <p className="md:text-3xl text-2xl text-[var(--primary-01)] font-semibold text-center">{`Speak to me, I'm listening`}</p>
                        <p className="text-gray-500 text-sm text-center">Click the microphone to start recording.</p>
                    </div>
                    <Button className="md:w-[50px] bg-[var(--primary-01)] hover:bg-[var(--primary-01)] md:h-[50px] w-[40px] h-[40px] rounded-[50px]">
                        <Mic className=""/>
                    </Button>
                </main>
            ):(
                <main className="fixed bg-[var(--body-bg)] top-0 bottom-0 right-0 left-0 z-30">
                    <div className="flex items-center justify-center w-screen h-screen">
                        <p>Loading, please wait...</p>
                    </div>
                </main>
            )}
        </>
    )
}