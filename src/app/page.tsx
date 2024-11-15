"use client"
import Body from "@/components/body"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Hero from "@/components/hero"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router=useRouter()
  function checkAuth(){
    const stringifyData=localStorage.getItem("user-details")
    if(stringifyData){
        router.push("/home")
    }
  }

  useEffect(()=>{
    checkAuth()
  })
  return(
    <main className="flex min-h-screen overflow-x-hidden flex-col items-center justify-start">
      <Header/>
      <Hero/>
      <Body/>
      <Footer/>
    </main>
  )
}