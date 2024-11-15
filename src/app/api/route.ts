import { GoogleGenerativeAI } from "@google/generative-ai";
import * as marked from "marked";
import { db } from "./db";

// Access your API key as an environment variable (see "Set up your API key" above)
let apiKey:any=process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// SELECT * FROM users ORDER BY created_at ASC;
export async function GET(request: Request) {
    // db.all(`SELECT location.location_name, location.location_state, COUNT(appliances.name) AS appliances,  SUM(appliances.quantity) AS total_quantity,  SUM( appliances.watts) AS total_watts, SUM(appliances.hours) AS total_hours FROM appliances INNER JOIN location ON appliances.location_name=location.location_name WHERE location.location_name=appliances.location_name GROUP BY location.location_name, location.location_state;` , (error , data) => {
    //     if(error){
    //         console.log({error:error})
    //         res.send({error:error})
    //     }else{
    //         let locations=[]
    //         data.forEach(({
    //             location_name,
    //             location_state,
    //             consumption,
    //             appliances,
    //             total_hours,
    //             total_quantity,
    //             total_watts
    //         })=>{
    //             let item={
    //                 location_name,
    //                 location_state,
    //                 consumption:(total_watts*total_hours)/24,
    //                 appliances
    //             }
    //             locations.push(item)
    //         })
    //         console.log(data);
    //         return Response.json({data:"Welcome to insight.ai api"})
    //     };
    // });
}

export async function POST(req: Request) {
    const { prompt,email } = await req.json()
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    db.run(`INSERT INTO prompts (prompt,response, email) VALUES ($1, $2, $3);
    `,[prompt,marked.parse(response.text()),email] , (error:any , data:any) => {
        if(error){
            console.log({error:error})
            return Response.json({error:error})
        }else{
            return Response.json({message:"Prompt added successful"})
        }
    })
    

    let promptResponse={
        prompt,
        text: marked.parse(response.text())
    }

    return Response.json(promptResponse)
}