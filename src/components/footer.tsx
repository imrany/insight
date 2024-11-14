import { Copyright } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function Footer(){
    return(
        <footer className="flex max-md:flex-col bg-[var(--primary-01)] justify-center md:justify-between w-screen h-[300px] py-12 px-6 max-md:gap-y-8 md:px-12 text-sm font-[family-name:var(--font-geist-mono)] text-white">
            <div className="flex flex-col gap-1">
                <p>Insight.ai</p>
                <p className="flex gap-2 items-center text-xs">
                    <Copyright className="w-[15px] h-[15px]"/>
                    <span>2024 Copyright All rights reserved</span>
                </p>
            </div>
            <div className="flex gap-2 justify-center md:justify-between">
                <div className="flex flex-col items-start justify-start max-md:w-[80vw] w-[200px] gap-2">
                    <p className="text-lg">Product</p>
                    <div className="flex flex-col items-start gap-2">
                        <Button className="text-white bg-none m-0 p-0" variant={"link"} asChild>
                            <Link href="/">
                                Get Started
                            </Link>
                        </Button>
                        <Button className="text-white bg-none m-0 p-0" variant={"link"} asChild>
                            <Link href="/">
                                Sign In
                            </Link>
                        </Button>
                        <Button className="text-white bg-none m-0 p-0" variant={"link"} asChild>
                            <a href="https://github.com/imrany/insight" className="flex items-center justify-center gap-2" target="_blank" rel="noopener noreferrer">
                                Github <span>↗</span>
                            </a>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-start max-md:w-[80vw] w-[200px] justify-start gap-2">
                    <p className="text-lg">Social</p>
                    <div className="flex flex-col items-start gap-2">
                        <Button className="text-white bg-none m-0 p-0" variant={"link"} asChild>
                            <a href="https://x.com/matano_imran" className="flex items-center justify-center gap-2" target="_blank" rel="noopener noreferrer">
                                Twitter <span>↗</span>
                            </a>
                        </Button>
                        <Button className="text-white bg-none m-0 p-0" variant={"link"} asChild>
                            <a href="https://instagram.com/its_imrany" className="flex items-center justify-center gap-2" target="_blank" rel="noopener noreferrer">
                                Instagram <span>↗</span>
                            </a>
                        </Button>
                        <Button className="text-white bg-none m-0 p-0" variant={"link"} asChild>
                            <a href="https://discord.gg/imrany" className="flex items-center justify-center gap-2" target="_blank" rel="noopener noreferrer">
                                Discord <span>↗</span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    )
}