import Link from "next/link";
import { Button } from "./ui/button";

export default function Hero(){
    return(
        <div
            style={{opacity: 1, filter: "blur(0px)"}} 
            className="flex font-[family-name:var(--font-geist-sans)] gap-9 flex-col justify-center items-center mt-[53px] h-[70vh] w-screen bg-gradient-to-t from-blue-100/20 dark:from-blue-900/5"
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
            <div className="flex flex-col gap-3 text-center md:w-[480px] w-[90vw]">
                <p className="font-semibold md:text-4xl text-3xl text-[var(--primary-01)]">
                    Unlocking Human Potential With Generative AI. 
                </p>
                <p className="text-gray-600 text-sm font-[family-name:var(--font-geist-mono)]">
                    Insight.ai is an AI-powered virtual assistants that combines both Generative AI and Speech-to-Text for fast prompting.
                </p>
            </div>
            <div className="flex gap-2 max-md:flex-col">
                <Button className="bg-[var(--primary-01)] w-[130px] max-md:w-[80vw] hover:bg-[var(--primary-01)]" asChild>
                    <Link href="/sign-up">
                        Get Started
                    </Link>
                </Button>
                <Button variant="outline" className="hover:text-[var(--primary-01)] w-[130px] max-md:w-[80vw] border-[1px] border-dashed border-[var(--primary-01)]" asChild>
                    <Link href="/sign-in">
                        Sign in
                    </Link>
                </Button>
            </div>
        </div>
    )
}