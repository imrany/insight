"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

export default function SignUp() {
  return (
    <div className="flex font-[family-name:var(--font-geist-sans)] items-center flex-col h-screen w-screen  bg-gradient-to-t from-blue-100/20 dark:from-blue-900/5">
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
        <div className="md:w-[500px] w-[90vw] flex items-center rounded-none h-screen shadow-none border-x-[1px] border-dashed border-x-[var(--primary-01)]">
            <Card className="w-full rounded-none shadow-none border-y-[1px] border-dashed border-y-[var(--primary-01)]">
                <CardHeader>
                    <CardTitle className="text-3xl font-semibold text-[var(--primary-01)]">Get Started!</CardTitle>
                    <CardDescription>Get started by creating an account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email" className="text-[var(--primary-01)] font-semibold">Email</Label>
                                <Input id="email" type="email" placeholder="example@gmail.com" className="border-[var(--primary-01)] outline-[1px] active:outline-[var(--primary-01)] focus:border-[var(--primary-01)] outline-[var(--primary-01)]" required/>
                            </div>
                            <Button type="submit" className="h-[40px] bg-[var(--primary-01)] hover:bg-[var(--primary-01)]">Continue</Button>
                            <p className="text-sm text-gray-500 text-center">Or sign up with</p>
                            <div className="flex flex-col space-y-1.5">
                                <Button type="button" className="h-[40px]" variant="outline">
                                    <Image alt="" src="/google.png" width={18} height={18} priority/>
                                    <span>Sign up with Google</span>
                                </Button>
                            </div>
                            <div className="flex gap-1 text-gray-600 items-center justify-center md:text-sm text-xs">
                                <p>{`Do you have an account?`}</p>
                                <Button variant="link" className="text-[var(--primary-01)] md:text-sm text-xs" asChild>
                                    <Link href="/sign-in">Sign in</Link>
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}