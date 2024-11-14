"use client"
import Body from "@/components/body"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Hero from "@/components/hero"

export default function Home() {
  return(
    <main className="flex min-h-screen overflow-x-hidden flex-col items-center justify-start">
      <Header/>
      <Hero/>
      <Body/>
      <Footer/>
    </main>
  )
}