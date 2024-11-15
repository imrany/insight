"use client"
import { useEffect, useState } from 'react';
import { SidebarOpen, SidebarClose, Plus, Home, ChevronRight, Settings, LogOut, Router } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation';


export default function AppSidebar (){
  const router=useRouter()
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile,setIsMobile]=useState(false)
  const [data,setData]=useState({
    username:"",
    photo:"",
    token:""
  })

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  function checkScreen(){
    if(screen.width>768){
        setIsMobile(false)
    }else{
        setIsMobile(true)
    }
  }

  function checkData(){
    const stringifyData:any=localStorage.getItem("user-details")
    const parsedData:any=!stringifyData?data:JSON.parse(stringifyData)
    setData(parsedData)
  }

  if (typeof window !== 'undefined') {
    window.onresize=checkScreen
  }

  function logOut(){
    localStorage.clear()
    router.push("/")
  }

  useEffect(()=>{
    checkData()
    checkScreen()
  })
  return (
    <div className={`sidebar ${isOpen ? 'open ' : ''}`}>
        {isOpen?(
            <div className="pb-[20px] h-full pt-[10px] flex flex-col  bg-gradient-to-t from-blue-100/20 dark:from-blue-900/5 shadow-md shadow-gray-200">
                <div className="pb-2 border-b-[1px] flex justify-center">
                    <Button onClick={toggleSidebar} variant="ghost" className="text-[var(--primary-01)] hover:text-[var(--primary-01)] w-fit">
                        <SidebarOpen />
                    </Button>
                </div>
                <div className="my-4 w-full gap-y-4 flex flex-col items-center text-[var(--text-primary-02)]">
                    <Button variant="outline" className="w-[30px] h-[30px]">
                        <Plus className="text-2xl"/>
                    </Button>
                    <Button variant="outline" className="w-[30px] h-[30px]" asChild>
                        <Link href="/home">
                            <Home className="text-2xl"/>
                        </Link>
                    </Button>
                    <Button onClick={logOut} variant="outline" className="w-[30px] h-[30px]">
                        <LogOut className="text-2xl"/>
                    </Button>
                </div>
                <div className="mt-auto  flex justify-center">
                    <Avatar>
                        <AvatarImage src={data.photo} />
                        <AvatarFallback className='uppercase bg-gray-500'>{data.username.slice(0,2)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        ):(
            <>
                {isMobile?(
                    <div className="fixed top-0 bottom-0 left-0 w-screen z-20 bg-[var(--body-bg)]  bg-gradient-to-t from-blue-100/20 dark:from-blue-900/5 shadow-md shadow-gray-200">
                        <div className="pb-[20px] pt-[10px] h-full flex flex-col">
                            <Button onClick={toggleSidebar} variant="outline" className="mr-[20px] text-[var(--primary-01)] hover:text-[var(--primary-01)] w-fit ml-auto">
                                <SidebarClose />
                            </Button>
                            <div className="my-4 px-[8px] w-full flex-grow gap-y-1 flex flex-col items-center">
                                <div className='w-full gap-y-1 flex flex-col items-center flex-grow'>
                                    <Button onClick={toggleSidebar} variant="ghost" className='w-full'>
                                        <span className="flex items-center w-full text-gray-700">
                                            <span className="flex gap-2 items-center">
                                                <Plus className="w-[20px] h-[20px]"/>
                                                <Link href="/home">New chat</Link>
                                            </span>
                                        </span>
                                    </Button>
                                    <Button onClick={toggleSidebar} variant="ghost" className='w-full'>
                                        <span className="flex items-center w-full text-gray-700">
                                            <span className="flex gap-2 items-center">
                                                <Home className="w-[20px] h-[20px]"/>
                                                <Link href="/home">Home</Link>
                                            </span>
                                        </span>
                                    </Button>
                                    <Button onClick={()=>{
                                        toggleSidebar()
                                        logOut()
                                    }} variant="ghost" className='w-full'>
                                        <span className="flex items-center w-full text-gray-700">
                                            <span className="flex gap-2 items-center">
                                                <LogOut className="w-[20px] h-[20px]"/>
                                                <span>Sign out</span>
                                            </span>
                                        </span>
                                    </Button>
                                </div>

                                <Button onClick={toggleSidebar} variant="ghost" className='w-full h-fit mt-auto' asChild>
                                    <Link href="/home/settings" className="flex items-center w-full text-gray-700">
                                        <span className="flex gap-2 w-full items-center">
                                            <Avatar>
                                                <AvatarImage src={data.photo} />
                                                <AvatarFallback className='uppercase text-white bg-gray-500'>{data.username.slice(0,2)}</AvatarFallback>
                                            </Avatar>
                                            <span>{data.username}</span>
                                        </span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ):(
                    <div className="pb-[20px] pt-[10px] h-full flex flex-col  bg-gradient-to-t from-blue-100/20 dark:from-blue-900/5 shadow-md shadow-gray-200">
                        <Button onClick={toggleSidebar} variant="outline" className="mr-[20px] text-[var(--primary-01)] hover:text-[var(--primary-01)] w-fit ml-auto">
                            <SidebarClose />
                        </Button>
                        <div className="my-4 px-[8px] w-full flex-grow gap-y-1 flex flex-col items-center">
                            <div className='w-full gap-y-1 flex flex-col items-center flex-grow'>
                                <Button variant="ghost" className='w-full'>
                                    <span className="flex items-center w-full text-gray-700">
                                        <span className="flex gap-2 items-center">
                                            <Plus className="w-[20px] h-[20px]"/>
                                            <Link href="/home">New chat</Link>
                                        </span>
                                    </span>
                                </Button>
                                <Button variant="ghost" className='w-full'>
                                    <span className="flex items-center w-full text-gray-700">
                                        <span className="flex gap-2 items-center">
                                            <Home className="w-[20px] h-[20px]"/>
                                            <Link href="/home">Home</Link>
                                        </span>
                                    </span>
                                </Button>
                                <Button onClick={logOut} variant="ghost" className='w-full'>
                                    <span className="flex items-center w-full text-gray-700">
                                        <span className="flex gap-2 items-center">
                                            <LogOut className="w-[20px] h-[20px]"/>
                                            <span>Sign out</span>
                                        </span>
                                    </span>
                                </Button>
                            </div>

                            <Button variant="ghost" className='w-full h-fit mt-auto' asChild>
                                <Link href="/home/settings" className="flex items-center w-full text-gray-700">
                                    <span className="flex gap-2 w-full items-center">
                                        <Avatar>
                                            <AvatarImage src={data.photo} />
                                            <AvatarFallback className='uppercase text-white bg-gray-500'>{data.username.slice(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <span>{data.username}</span>
                                    </span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </>
        )}
    </div>
  );
};
