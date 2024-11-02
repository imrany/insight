import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import Layout from './pages/Layout';
import NotFound from './pages/NotFound';
import NotSupported from './pages/NotSupported';
import LandingPage from "./pages/LandingPage";
import Main from './pages/Main';
import List from './pages/List';
import { GlobalContext } from "./context";

function App() {
    const API_URL=``

  

    useEffect(()=>{
        screen.width>1080?setIsSupported(false):setIsSupported(true)
    },[screen.width])
    return (
        <>
            {isSupported?(
                <BrowserRouter>
                    <GlobalContext.Provider value={{ API_URL }}>
                        <Routes>
                            <Route path="/welcome" element={!isAuth?<Main/>:<Navigate to="/"/>}/>
                            {/*<Route path="/create" element={!isAuth?<CreateAccount />:<Navigate to="/"/>} />*/}
                            <Route path="/" element={isAuth?<Layout />:<Navigate to="/welcome"/>}>
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
