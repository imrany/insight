import { GoogleGenerativeAI } from "@google/generative-ai";
import * as marked from "marked";
import { pool } from "./db";
import { NextResponse } from "next/server";

const apiKey:any=process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function insertPrompt(
    prompt: string,
    response: any,
    email: string
) {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO prompts (prompt,response, email) VALUES ($1, $2, $3);",
        [prompt,response, email],
        (error: any, data: any) => {
          if (error) {
            reject(error);
          } else {
            pool.query(
              "SELECT * FROM prompts WHERE email = $1 ORDER BY created_at ASC;",
              [email],
              (error: any, data: any) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(data);
                }
              }
            );
          }
        }
      );
    });
}

export async function POST(req: Request) {
    try{
        const { prompt,email } = await req.json()
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text:any=marked.parse(response.text())

        const data: any = await insertPrompt(prompt,text.replace(/<[^>]+>/g, ''),email);
        return Response.json({
            message:"Prompt added successful",
            prompts:data.rows
        })

    }catch(error:any){
        console.error('Error:', error); // Return an error response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}