"use client";
import { Button } from "@/components/ui/button";
import { Download, Expand, Mic, MoreHorizontal, Pause, Play, RefreshCcw, Speech, Square, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
  const { toast }=useToast()
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string|null>(null);
  const [isShowMoreId,setIsShowMoreId]=useState<string|null>(null)
  const [isLoading, setIsLoading] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);
  const [isRecording,setIsRecording]=useState(false)
  const [prompts, setPrompts] = useState<any>([]);
  const [userData,setUserData]=useState<any>([])
  const router = useRouter();
  function checkAuth() {
    const stringifyData: any = localStorage.getItem("user-details");
    if (!stringifyData) {
      router.push("/");
    }else{
      const stringifyData: any = localStorage.getItem("user-details");
      const parsedData: any = JSON.parse(stringifyData);
      setUserData(parsedData)
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

  function downloadAudioFile(id: string, response: string) {
    const base64data = localStorage.getItem(`speechAudio_${id}`);
    if (base64data) {
      const audioBlob = dataURLToBlob(base64data);
      const audioUrl = URL.createObjectURL(audioBlob);
      const link = document.createElement('a');
  
      link.href = audioUrl;
      // link.target="_blank"
      link.download = `${response.slice(0, 20)}.wav`;
      link.click();
  
      console.log("Audio file downloaded.");
    } else {
      console.error("No audio data found in localStorage for the given ID.");
      toast({
        variant: "destructive",
        description: "Failed to download. Listen to the full audio and try again!",
      });
    }
  }
  
  // Helper function to convert Base64 to Blob
  function dataURLToBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
  
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([ab], { type: mimeString });
  }
  
  function readAndStoreAudio(prompt: string, response: string, id: string) {
    const text = `${prompt} ${response}`;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1;
    speech.pitch = 1;
  
    // Create AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();
    const audioChunks: Blob[] = [];
  
    // Initialize MediaRecorder
    const mediaRecorder = new MediaRecorder(destination.stream);
  
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
  
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        localStorage.setItem(`speechAudio_${id}`, base64data);
        console.log(`Audio stored with ID: speechAudio_${id}`);
      };
    };
  
    //connect the speech synthesisto the audio context
    const source=audioContext.createMediaStreamSource(destination.stream)
    source.connect(audioContext.destination)

    // Start recording
    mediaRecorder.start();
  
    // Stop recording when the speech ends
    speech.onend = () => {
      mediaRecorder.stop();
      audioContext.close();
      setPlayingId(null)
    };
  
    // Handle pauses (optional)
    speech.onpause = () => {
      mediaRecorder.pause();
      console.log("Speech paused.");
    };

    speechSynthesis.speak(speech);
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

      const voiceInputs:string[]=[]
      recognition.addEventListener("result", (e: any) => {
        const result = e.results;
        const transcript =result[result.length - 1][result[0].length - 1].transcript.toLowerCase();
        const update = transcript.includes(".")? transcript.replace(".", ""): transcript;
        voiceInputs.push(update);
        recognition.stop();
      });

      recognition.onend = () => {
        const lastInput=voiceInputs.slice(voiceInputs.length-1, voiceInputs.length)[0]
        if(lastInput!==undefined){
          sendPrompts(lastInput);
          console.log(lastInput)
        }
        setIsRecording(false)
        console.log("Speech recognition ended");
      };

      recognition.onerror = (e: any) => {
        setIsRecording(false)
        console.error("Speech recognition error:", e.error);
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          toast({
            variant: "destructive",
            description: "Speech recognition permissions not granted",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Microphone issue",
            description: e.error,
          });
          window.location.reload()
        }
      };
    } else {
      toast({
        variant: "destructive",
        description: "Speech recognition not supported by the browser.",
      })
      console.error("Speech recognition not supported by the browser.");
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
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: parseRes.error,
        })
        setIsLoading(false);
      } else {
        console.log(parseRes.prompts);
        setPrompts(parseRes.prompts);
        setIsLoading(false);
        setTimeout(()=>{
          const id:string=parseRes.prompts[parseRes.prompts.length-1].id
          scrollToBottom(id)
        },500)
      }
    } catch (error: any) {
      console.log(error.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again" onClick={getPrompts}>Try again</ToastAction>,
      })
      setIsLoading(false);
    }
  }

  const togglePopover = (id: string) => {
    setOpenPopoverId((prev) => (prev === id ? null : id));
  };

  async function sendPrompts(prompt: string) {
    try {
      setIsMicDisabled(true)
      const stringifyData: any = localStorage.getItem("user-details");
      const parsedData: any = JSON.parse(stringifyData);

      const url = `/api`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: parsedData.email,
          prompt,
        }),
      });
      const parseRes = await response.json();
      if (parseRes.error) {
        setIsMicDisabled(false)
        console.log(parseRes.error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: parseRes.error,
        })
      } else {
        setIsMicDisabled(false)
        console.log(parseRes.prompts);
        setPrompts(parseRes.prompts);
        setTimeout(()=>{
          const id:string=parseRes.prompts[parseRes.prompts.length-1].id
          const lastPrompt:string=parseRes.prompts[parseRes.prompts.length-1].prompt
          const lastResponse:string=parseRes.prompts[parseRes.prompts.length-1].response
          scrollToBottom(id)
          readAndStoreAudio(lastPrompt,lastResponse,id)
        },500)
      }
    } catch (error: any) {
      setIsMicDisabled(false)
      console.log(error.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.massage,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  }

  async function handleDeletePrompt(id: string) {
    try {
      window.speechSynthesis.cancel();
      setIsLoading(true);
      togglePopover(id)
      const url = `/api/prompts/${id}`;
      const response = await fetch(url, {
        method: "DELETE"
      });
      const parseRes = await response.json();
      if (parseRes.error) {
        setIsLoading(false);
        console.log(parseRes.error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: parseRes.error,
        })
      } else {
        localStorage.removeItem(`speechAudio_${id}`)
        getPrompts()
      }
    } catch (error: any) {
      setIsLoading(false);
      togglePopover(id)
      console.log(error.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again" onClick={getPrompts}>Try again</ToastAction>,
      })
    }
  }

  const handlePlayPause = (prompt:string, response:string, id:string) => {
    if (playingId === id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
    } else {
      window.speechSynthesis.cancel();
      readAndStoreAudio(prompt,response,id)
      // textToSpeech(response);
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

  function scrollToBottom(id:string){
    const scrollTarget:any= document.getElementById(id);
    scrollTarget.scrollIntoView({
      behavior: 'smooth', // Smooth scrolling effect
      block: 'center',    // Align to the center of the viewport
    });
  }

  useEffect(() => {
    window.speechSynthesis.cancel();
    checkAuth();
    getPrompts();
  }, []);
  return (
    <>
      {isLoading === false ? (
          <main style={{opacity: 1, filter: "blur(0px)"}}  className=" bg-[var(--body-bg)] bg-gradient-to-t from-blue-100/20 dark:from-blue-900/5 flex w-full h-full gap-6 flex-col items-center justify-center">
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
          {prompts.length>0? (
            <>
              <ScrollArea className="h-full flex flex-col mb-[20px] gap-2 items-center justify-center md:px-[10px] md:w-[620px] w-[75vw] flex-grow">
                {prompts.map((prompt: any) => (
                  <div
                    onDoubleClick={()=>{
                      if(isShowMoreId===prompt.id){
                        setIsShowMoreId(null)
                      }else{
                        setIsShowMoreId(prompt.id)
                      }
                    }}
                    id={prompt.id}
                    key={prompt.id}
                    className={`flex my-4 p-4 ${checkEven(prompt.id)!=="even"?'bg-[#f07d30] text-white':'bg-[#f1ece8] text-gray-800'} rounded-[10px] shadow-[var(--shadow-default)] justify-center w-full`}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">{prompt.prompt}</p>
                      {isShowMoreId===prompt.id?(
                        <p className="text-xs font-[family-name:var(--font-geist-mono) leading-5">{prompt.response}</p>
                      ):(
                        <p className="text-xs font-[family-name:var(--font-geist-mono) pr-[10px]">{prompt.response.slice(0, 70)}</p>
                      )}
                    </div>
                    {isShowMoreId===prompt.id?(<></>):(
                      <div className="ml-auto flex flex-col gap-4 items-center h-full justify-between">
                        <Popover 
                          key={prompt.id}
                          open={openPopoverId === prompt.id}
                          onOpenChange={(isOpen) => {
                            setOpenPopoverId(isOpen ? prompt.id : null);
                          }}
                        >
                          <PopoverTrigger onClick={() => togglePopover(prompt.id)}>
                            <MoreHorizontal/>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 scale-90 font-[family-name:var(--font-geist-sans)]">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">More Actions</h4>
                                <p className="text-sm text-muted-foreground">
                                  Actions that can be done on this audio.
                                </p>
                              </div> 
                              <div className="grid gap-2">
                                <Button onClick={()=>{
                                    togglePopover(prompt.id)
                                    if(isShowMoreId===prompt.id){
                                      setIsShowMoreId(null)
                                    }else{
                                      setIsShowMoreId(prompt.id)
                                    }
                                  }} variant="outline" className="flex justify-start"
                                >
                                  <span className="flex items-center gap-1">
                                    <Expand/>
                                    <span>Expand</span>
                                  </span>
                                </Button>
                                <Button onClick={()=>{
                                    togglePopover(prompt.id)
                                    downloadAudioFile(prompt.id,prompt.response)
                                  }} variant="outline" className="flex justify-start"
                                >
                                  <span className="flex items-center gap-1">
                                    <Download/>
                                    <span>Download</span>
                                  </span>
                                </Button>
                                <Button onClick={()=>handleDeletePrompt(prompt.id)} variant="destructive" className="flex justify-start">
                                  <span className="flex items-center gap-1">
                                    <Trash/>
                                    <span>Delete</span>
                                  </span>
                                </Button>
                              </div>
                            </div> 
                          </PopoverContent>
                        </Popover>

                        <Button
                          onClick={() =>
                            handlePlayPause(prompt.prompt, prompt.response, prompt.id)
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
                    )}
                  </div>
                ))}
              </ScrollArea>
              <div className="fixed bg-[var(--body-bg)] rounded-[50px] right-8 bottom-10 z-10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button disabled={isMicDisabled}
                        onClick={() => {
                          try{
                            window.speechSynthesis.cancel();
                            setPlayingId(null);
                            if (typeof recognition !== "undefined") {
                              if(isRecording===false){
                                recognition.start();
                                setIsRecording(true)
                                toast({
                                  description: "Microphone is on, ask me a question",
                                })
                              }else{
                                recognition.stop()
                                setIsRecording(false)
                              }
                            }
                          }catch(error:any){
                            console.log(error)
                            toast({
                              variant: "destructive",
                              title: "Microphone issue",
                              description: "Failed to start microphone",
                              action: <ToastAction altText="Try again" onClick={()=>router.refresh()}>Try again</ToastAction>,
                            })
                          }
                        }}
                        className={`${isMicDisabled?"w-[150px] h-[40px] bg-black hover:bg-black":"w-[50px] h-[50px] bg-[var(--primary-01)] hover:bg-[var(--primary-01)]"} rounded-[50px]`}
                      >
                        {isRecording===false?(
                          <>
                            {!isMicDisabled?(<Mic/>):(
                              <span className="flex items-center gap-2">
                               <RefreshCcw className="spinner"/>
                               <span>responding</span>
                              </span>
                            )}
                          </>
                        ):(<Square strokeWidth={20}/>)}
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
-                  <Speech className="w-[40px] h-[40px]" />
-                </div>
                <p className="md:text-3xl max-md:w-[80%] text-2xl text-[var(--primary-01)] font-semibold text-center">
                  {`${userData.username}, it's great to see you`}
                </p>
                <p className="text-gray-500 text-sm text-center">
                  Click the microphone to start recording.
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button disabled={isMicDisabled}
                      onClick={() => {
                        try{
                          window.speechSynthesis.cancel();
                          setPlayingId(null);
                          if (typeof recognition !== "undefined") {
                            if(isRecording===false){
                              recognition.start();
                              setIsRecording(true)
                              toast({
                                description: "Microphone is on, ask me a question",
                              })
                            }else{
                              recognition.stop()
                              setIsRecording(false)
                            }
                          }
                        }catch(error:any){
                          console.log(error)
                          toast({
                            variant: "destructive",
                            title: "Microphone issue",
                            description: "Failed to start microphone",
                            action: <ToastAction altText="Try again" onClick={()=>router.refresh()}>Try again</ToastAction>,
                          })
                        }
                      }}
                      className={`${isMicDisabled?"w-[150px] h-[40px] bg-black hover:bg-black":"w-[50px] h-[50px] bg-[var(--primary-01)] hover:bg-[var(--primary-01)]"} rounded-[50px]`}
                      >
                        {isRecording===false?(
                          <>
                            {!isMicDisabled?(<Mic/>):(
                              <span className="flex items-center gap-2">
                               <RefreshCcw className="spinner"/>
                               <span>responding</span>
                             </span>
                            )}
                          </>
                        ):(<Square strokeWidth={20}/>)}
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
          <div className="flex flex-col items-center justify-center w-screen h-screen">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <RefreshCcw className="spinner w-[18px] h-[18px]"/>
              <p>Loading</p>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
