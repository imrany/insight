import { createContext } from 'react'

type Context={
    API_URL:string
}

export const GlobalContext=createContext<Context>({
    API_URL:""
})
