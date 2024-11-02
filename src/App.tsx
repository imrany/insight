import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import Layout from '@/components/Layout';
import NotFound from './pages/NotFound';
import NotSupported from './pages/NotSupported';
import Welcome from "./pages/Welcome";
import Main from './pages/Main';
import List from './pages/List';
import { GlobalContext } from "./context";

function App() {
    const [isSupported,setIsSupported]=useState(true)
    const [voiceInput,setVoiceInput]=useState("")
    const API_URL=`https://gemmie.onrender.com`

    let recognition = 
        window.SpeechRecognition || window.webkitSpeechRecognition; 
    if(recognition){
        recognition = new recognition();   
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log("Ready to listen")
        }

        recognition.addEventListener('result', (e:any) => { 
            /*const transcript = Array.from(e.results) 
                .map(result => result[0]) 
                .map(result => result.transcript) 
                .join('') 
             */    
            const result=e.results
            const transcript=result[result.length-1][result[0].length-1].transcript.toUpperCase()
            const update=transcript.includes('.')?transcript.replace('.',''):transcript;
            setVoiceInput(update); 
            recognition.stop()
        }); 
          
        //if (speech) { 
            //recognition.start(); 
          //  setInterval(()=>{
            //    recognition.addEventListener('end', recognition.start)
            //},10); 
        //} 

        recognition.onend = ()=> {
            console.log("Speech recognition ended")
        }

        recognition.onerror =(e:any)=>{
            console.error(e.error)
        }
    }else {
        console.error('Speech recognition not supported');
    }

    window.onresize=function(){
        screen.width>1080?setIsSupported(false):setIsSupported(true)
    }

    useEffect(()=>{
        screen.width>1080?setIsSupported(false):setIsSupported(true)
    },[screen.width])
    return (
        <>
            {isSupported?(
                <BrowserRouter>
                    <GlobalContext.Provider value={{ API_URL, voiceInput }}>
                        <Routes>
                            <Route path="/welcome" element={<Welcome/>}/>
                            {/*<Route path="/create" element={!isAuth?<CreateAccount />:<Navigate to="/"/>} />*/}
                            {/*<Route path="/" element={isAuth?<Layout />:<Navigate to="/welcome"/>}>*/}
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Main />} />
                                <Route path="/list" element={<List />} />
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </GlobalContext.Provider>
                </BrowserRouter>
            ):(
                <NotSupported/>
            )}
        </>
    )
}

export default App
