import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function textToSpeech(text:string){
    let audioState:any=localStorage.getItem("audio")
    if(audioState==="unmute"||!audioState){
        // Create a new instance of SpeechSynthesisUtterance
        var speech = new SpeechSynthesisUtterance(text);

        // Set the voice, rate, pitch, and language if desired
        speech.lang = 'en-US'; // You can change the language
        speech.rate = 1; // Speed (default is 1, range: 0.1 to 10)
        speech.pitch = 1; // Pitch (default is 1, range: 0 to 2)

        // Speak the text
        window.speechSynthesis.speak(speech);
    }else{
        window.speechSynthesis.cancel()
    }
}
