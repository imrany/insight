"use client";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { ChevronRight, Home, LogIn, Mail, Menu, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

type LinkType={
    label:string,
    href:string,
    className?:string,
    variant:any,
    icon?:any
}

export default function Header() {
  const [isMobile,setIsMobile]=useState(false)
  const [open, setOpen] = useState(false); // Manage menu visibility

  const links:LinkType[]=[
    {
        label:"Resources",
        href:"/resources",
        className:"hover:text-[var(--primary-01)]",
        variant:"link"
    },
    {
        label:"Contact us",
        href:"mailto:imranmat254@gmail.com?subject=Mail from Insight.ai",
        className:"hover:text-[var(--primary-01)]",
        variant:"link"
    },
    {
        label:"Sign in",
        href:"/sign-in",
        className:"hover:text-[var(--primary-01)]",
        variant:"ghost"
    },
    {
        label:"Get Started",
        href:"/sign-up",
        className:"bg-[var(--primary-01)] hover:bg-[var(--primary-01)]",
        variant:"default"
    }
  ]

  const mobileLinks:LinkType[]=[
    {
        label:"Go to the home page",
        icon:(<Home className="text-[var(--primary-01)] w-[20px] h-[20px]"/>),
        href:"/",
        variant:"link"
    },
    {
        icon:(<LogIn className="text-[var(--primary-01)] w-[20px] h-[20px]"/>),
        label:"Sign in",
        href:"/sign-in",
        variant:"ghost"
    },
    {
        icon:(<Plus className="text-[var(--primary-01)] w-[20px] h-[20px]"/>),
        label:"More Resources",
        href:"/resources",
        variant:"link"
    },
  ]

  const handleClose = () => {
    setOpen(false); // Set open state to false to close the menu
  };

  
  function checkScreen(){
    if(screen.width>768){
        setIsMobile(false)
    }else{
        setIsMobile(true)
    }
  }

  if (typeof window !== 'undefined') {
    window.onresize=checkScreen
  }

  useEffect(()=>{
    checkScreen()
  })
  return (
    <>
        <header className="font-[family-name:var(--font-geist-sans)] bg-[var(--body-bg)] z-50 fixed top-0 left-0 right-0">
            <nav className="flex justify-between items-center border-b-[1px] border-dashed border-[var(--primary-01)] w-screen py-2 px-4 md:px-5">
                <Link href="/welcome" className="flex gap-2 text-[var(--primary-01)] font-semibold">
                    insight.ai
                </Link>
                
                {isMobile?(
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerTrigger asChild>
                            <Button variant="outline"  onClick={() => setOpen(true)}>
                                <Menu className="w-[500px] h-[50px] text-[var(--primary-01)]"/>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader className="none">
                                    <DrawerTitle hidden className="text-[var(--primary-01)]">Insight.ai</DrawerTitle>
                                    <DrawerDescription hidden className="text-gray-600">Menu</DrawerDescription>
                                </DrawerHeader>
                                <div className="flex flex-col gap-y-4 p-4 pb-0">
                                    {mobileLinks.map((link,index)=>(
                                        <Link key={index} href={link.href}>
                                            <Button onClick={handleClose} variant={link.variant} asChild>
                                                <span className="flex items-center w-full">
                                                    <span className="flex gap-2 items-center">
                                                        {link.icon}
                                                        <span>{link.label}</span>
                                                    </span>
                                                    <ChevronRight className="ml-auto w-[30px] h-[30px] text-[var(--primary-01)]"/>
                                                </span>
                                            </Button>
                                        </Link>
                                    ))}
                                    <a target="_blank" rel="noreferrer noopener" href="mailto:imranmat254@gmail.com?subject=Mail from Insight.ai">
                                        <Button onClick={handleClose} variant="link" asChild>
                                            <span className="flex items-center w-full">
                                                <span className="flex gap-2 items-center">
                                                    <Mail className="text-[var(--primary-01)] w-[20px] h-[20px]"/>
                                                    <span>Contact us</span>
                                                </span>
                                                <ChevronRight className="ml-auto w-[30px] h-[30px] text-[var(--primary-01)]"/>
                                            </span>
                                        </Button>
                                    </a>
                                </div>
                                <DrawerFooter>
                                    <Link href="/sign-up" className="w-full">
                                        <Button onClick={handleClose} variant="outline" className="border-[1px] w-full border-dashed border-[var(--primary-01)] text-[var(--primary-01)]">
                                            Get Started
                                        </Button>
                                    </Link>
                                    <DrawerClose asChild>
                                        <Button variant="ghost" onClick={handleClose} className="text-gray-600 hover:text-[var(--primary-01)]">Close Menu</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>
                ):(
                    <div id="desktop_nav" className="flex gap-2">
                        {links.map(link=>(
                            <Button key={link.href} variant={link.variant} className={link.className} asChild>
                                <Link href={link.href}>
                                    {link.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    </>
  );
}