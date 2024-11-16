
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound(){
    return(
        <main className="flex h-screen overflow-x-hidden flex-col">
            <Header/>
                <div 
                    style={{opacity: 1, filter: "blur(0px)"}} 
                    className="overflow-x-hidden bg-gradient-to-t from-blue-100/20 dark:from-blue-900/5 flex h-full w-full flex-grow flex-col justify-center items-center font-[family-name:var(--font-geist-sans)]"
                >
                    <svg 
                        aria-hidden
                        className="pointer-events-none [z-index:-1] absolute inset-0 h-full w-full fill-blue-500/50 stroke-blue-500/50 [mask-image:linear-gradient(to_top,_#ffffffad,_transparent)] opacity-[.30]" 
                        style={{visibility: "visible"}}
                    >
                        <defs>
                            <pattern id=":Rs57qbt6ja:" width={20} height={20} patternUnits="userSpaceOnUse" x="-1" y="-1">
                                <path d="M.5 20V.5H20" fill="none" strokeDasharray="0"></path>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" strokeWidth="0" fill="url(#:Rs57qbt6ja:)"></rect>
                    </svg>
                    <div className="h-[60vh] overflow-x-hidden flex flex-col justify-center items-center gap-4">
                        <p className="text-2xl text-[var(--primary-01)]">Page Not Found</p>
                        <p className="text-5xl text-[var(--primary-01)]">404</p>
                        <div className="text-center md:w-[400px] w-[80vw] text-sm text-gray-600 font-[family-name:var(--font-geist-mono)]">
                            <p>{"Oops, the page you are looking for doesn't exist."}</p>
                            <Button variant="link" className="underline text-[var(--primary-01)]">
                                <Link href="/">Return</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            <Footer/>
        </main>
    )
}