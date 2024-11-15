"use client";
import { Button } from "@/components/ui/button";
import { Mic, Pause, Play, Speech } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [playingId, setPlayingId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState<any>([]);
  const router = useRouter();
  function checkAuth() {
    const stringifyData: any = localStorage.getItem("user-details");
    if (!stringifyData) {
      router.push("/");
    }
  }

  function textToSpeech(text: string) {
    // Create a new instance of SpeechSynthesisUtterance
    const speech = new SpeechSynthesisUtterance(text);

    // Set the voice, rate, pitch, and language if desired
    speech.lang = "en-US"; // You can change the language
    speech.rate = 1; // Speed (default is 1, range: 0.1 to 10)
    speech.pitch = 1; // Pitch (default is 1, range: 0 to 2)

    // Speak the text
    window.speechSynthesis.speak(speech);
  }

  let recognition: {
    new (): any;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    addEventListener: (arg0: string, arg1: (e: any) => void) => void;
    stop: () => void;
    onend: () => void;
    onerror: (e: any) => void;
    start: () => void;
  };
  if (typeof window !== "undefined") {
    recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (recognition) {
      recognition = new recognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        console.log("Ready to listen");
      };

      recognition.addEventListener("result", (e: any) => {
        const result = e.results;
        const transcript =
          result[result.length - 1][
            result[0].length - 1
          ].transcript.toUpperCase();
        const update = transcript.includes(".")
          ? transcript.replace(".", "")
          : transcript;
        console.log(update);
        sendPrompts(update);
        recognition.stop();
      });

      recognition.onend = () => {
        console.log("Speech recognition ended");
      };

      recognition.onerror = (e: any) => {
        console.error(e.error);
      };
    } else {
      console.error("Speech recognition not supported");
    }
  }

  async function getPrompts() {
    try {
      setIsLoading(true);
      const stringifyData: any = localStorage.getItem("user-details");
      const parsedData: any = JSON.parse(stringifyData);

      const url = `/api/prompts/${parsedData.email}`;
      const response = await fetch(url);
      const parseRes = await response.json();
      if (parseRes.error) {
        console.log(parseRes.error);
        setIsLoading(false);
      } else {
        console.log(parseRes.prompts);
        setPrompts(parseRes.prompts);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error.message);
      setIsLoading(false);
    }
  }

  async function sendPrompts(prompt: string) {
    try {
      const stringifyData: any = localStorage.getItem("user-details");
      const parsedData: any = JSON.parse(stringifyData);

      const url = `/api`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/jsonjson",
        },
        body: JSON.stringify({
          email: parsedData.email,
          prompt,
        }),
      });
      const parseRes = await response.json();
      if (parseRes.error) {
        console.log(parseRes.error);
      } else {
        console.log(parseRes.data);
        setPrompts(parseRes.data);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  const handlePlayPause = (id:string, response:string) => {
    if (playingId === id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
    } else {
      window.speechSynthesis.cancel();
      textToSpeech(response);
      setPlayingId(id);
    }
  };

  function checkEven(a:number){
    const c= a%2
    if(c===0){
        return "even"
    }
    return "odd"
  }

  useEffect(() => {
    checkAuth();
    getPrompts();
  }, []);
  return (
    <>
      {isLoading === false ? (
        <main className="flex w-full h-full gap-6 flex-col items-center justify-center">
          {prompts.length > 0 ? (
            <>
              <ScrollArea className="h-full flex flex-col gap-2 items-center justify-center md:w-[600px] w-[75vw] flex-grow">
                {prompts.map((prompt: any) => (
                  <div
                    key={prompt.id}
                    className={`flex my-4 p-4 ${checkEven(prompt.id)!=="even"?'bg-[#f07d30] text-white':'bg-[#f1ece8] text-gray-800'} rounded-[10px] shadow-[var(--shadow-default)] justify-center w-full`}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">{prompt.prompt}</p>
                      <p className="text-xs font-[family-name:var(--font-geist-mono)] pr-[50px]">
                        {prompt.response.slice(0, 70)}
                      </p>
                    </div>
                    <div className="ml-auto flex flex-col items-center justify-center">
                      <Button
                        onClick={() =>
                          handlePlayPause(prompt.id, prompt.response)
                        }
                        className="bg-white hover:bg-white w-[40px] h-[40px] text-black rounded-[50px]"
                      >
                        {playingId === prompt.id ? (
                          <Pause className="w-[30px] h-[30px]" />
                        ) : (
                          <Play className="w-[30px] h-[30px]" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="fixed right-8 bottom-10 z-10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          if (typeof recognition !== "undefined") {
                            recognition.start();
                          }
                        }}
                        className="md:w-[50px] bg-[var(--primary-01)] hover:bg-[var(--primary-01)] md:h-[50px] w-[40px] h-[40px] rounded-[50px]"
                      >
                        <Mic className="" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to record</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center gap-1">
                <div>
                  <Speech className="w-[40px] h-[40px]" />
                </div>
                <p className="md:text-3xl text-2xl text-[var(--primary-01)] font-semibold text-center">{`Speak to me, I'm listening`}</p>
                <p className="text-gray-500 text-sm text-center">
                  Click the microphone to start recording.
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        window.speechSynthesis.cancel();
                        if (typeof recognition !== "undefined") {
                          recognition.start();
                        }
                      }}
                      className="md:w-[50px] bg-[var(--primary-01)] hover:bg-[var(--primary-01)] md:h-[50px] w-[40px] h-[40px] rounded-[50px]"
                    >
                      <Mic className="" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to record</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </main>
      ) : (
        <main className="fixed bg-[var(--body-bg)] top-0 bottom-0 right-0 left-0 z-30">
          <div className="flex items-center justify-center w-screen h-screen">
            <p>Loading, please wait...</p>
          </div>
        </main>
      )}
    </>
  );
}
