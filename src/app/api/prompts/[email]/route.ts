import { pool } from "../../db";
import { NextRequest,NextResponse } from "next/server";

async function selectPrompts(
  email: string,
) {
  return new Promise((resolve, reject) => {
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
  });
}

async function deletePrompts(
  id: string,
) {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM prompts WHERE id = $1;",
      [id],
      (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve("prompt deleted");
        }
      }
    );
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ email: string }>}) {
  try{
    const email = (await params).email
    const data: any = await selectPrompts(email);
    if(data.rows.length>0){
        return Response.json({prompts:data.rows})
    }else{
      return NextResponse.json({error:`No record found`},{status:404})
    }
  }catch(error:any){
    console.error('Error:', error); // Return an error response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ email: string }>}) {
  try{
    const email = (await params).email
    const data: any = await deletePrompts(email);
    if(data){
        return Response.json({message:data})
    }else{
      return NextResponse.json({error:`No record found`},{status:404})
    }
  }catch(error:any){
    console.error('Error:', error); // Return an error response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}