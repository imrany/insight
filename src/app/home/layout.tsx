import React from 'react';
import AppSidebar from '@/components/app-sidebar';

export default function RootLayout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
  return (
    <div className="flex gap-2 w-screen h-screen font-[family-name:var(--font-geist-sans)]">
        <AppSidebar/>
        <div  className="flex-grow w-full md:p-[20px] max-md:pt-[20px]">
          {children}
        </div>
    </div>
  );
};
