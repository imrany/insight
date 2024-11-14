"use client";
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Header() {
  return (
    <>
        <header className="font-[family-name:var(--font-geist-sans)] z-10 w-screen flex items-center justify-center">
            <nav className="flex justify-between items-center border-b-[1px] border-dashed border-[var(--primary-01)] w-screen py-2 px-4">
                <Link href="/welcome" className="flex gap-2 text-[var(--primary-01)] font-semibold">
                    insight.ai
                </Link>
                
                <div className="flex gap-2">
                    <Button variant="link" className="hover:text-[var(--primary-01)]" asChild>
                        <Link href="/sign-in">
                            Resources
                        </Link>
                    </Button>
                    <Button variant="link" className="hover:text-[var(--primary-01)]" asChild>
                        <Link href="/sign-in">
                            Contact us
                        </Link>
                    </Button>
                    <Button variant="ghost" className="hover:text-[var(--primary-01)]" asChild>
                        <Link href="/sign-in">
                            Sign in
                        </Link>
                    </Button>
                    <Button className="bg-[var(--primary-01)] hover:bg-[var(--primary-01)]" asChild>
                        <Link href="/sign-up">
                            Get Started
                        </Link>
                    </Button>
                </div>
            </nav>
        </header>
    </>
  );
}