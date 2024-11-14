"use client"
import {
  Card,
  CardHeader,
} from "@/components/ui/card";
import { Brain, Mic, Speaker } from "lucide-react";

export default function Body() {
 const details=[
    {
        icon:(<Mic className="text-[var(--primary-01)] w-[18px] h-[18px]"/>),
        title:"Voice input",
        description:"Insight.ai only accepts voice prompts therefore you won't get tired typing."
    },
    {
        icon:(<Speaker className="text-[var(--primary-01)] w-[18px] h-[18px]"/>),
        title:"Speech response",
        description:"You would be able to save and listen to your responses."
    },
    {
        icon:(<Brain className="text-[var(--primary-01)] w-[18px] h-[18px]"/>),
        title:"Intelligent",
        description:"We used both Chatgpt and Gemini AI under the hood to provide a intelligent responses."
    }
 ]
  return (
    <div className="flex font-[family-name:var(--font-geist-sans)] flex-col w-screen border-[1px] border-dashed border-[var(--primary-01)] py-10 justify-center items-center max-md:py-8 md:px-3">
        <div className="flex flex-col items-center justify-center gap-1 mb-6">
            <p className="text-3xl font-semibold text-[var(--primary-01)]">Features</p>
            <p className="text-gray-600 text-sm">
                You would benefit from the following features:
            </p>
        </div>
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-col md:grid md:grid-cols-3">
                    {details.map((detail) => {
                        return (
                        <div
                            key={detail.title}
                            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                        >
                            <span className="leading-none flex items-center gap-1">
                                {detail.icon}
                                <span>{detail.title}</span>
                            </span>
                            <span className="text-sm max-w-[300px] text-gray-600 text-muted-foreground">
                                {detail.description}
                            </span>
                        </div>
                        )
                    })}
                </div>
            </CardHeader>
        </Card>
    </div>
  )
}
