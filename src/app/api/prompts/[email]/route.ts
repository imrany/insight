import { db } from "../../db";
import { NextRequest,NextResponse } from "next/server";

async function selectPrompts(
  email: string,
) {
  return new Promise((resolve, reject) => {
    db.all(
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
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ email: string }>}) {
  try{
    const email = (await params).email
    const data: any = await selectPrompts(email);
    if(data.length>0){
        return Response.json({
            msg:`Welcome ${data[0].username}`,
            data
        })
    }else{
      return NextResponse.json({error:`No record found`},{status:404})
    }
  }catch(error:any){
    console.error('Error:', error); // Return an error response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}