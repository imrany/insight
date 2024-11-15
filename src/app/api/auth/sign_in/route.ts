import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken"
import { NextResponse } from 'next/server';
import { db } from "../../db";

const generateUserToken=(id:string)=>{
    return sign({id},`${process.env.JWT_SECRET}`,{
        expiresIn:'10d'
    })
};

async function selectUser(
    email: string,
) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM users WHERE email = $1;",
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

export async function POST(req: Request) {
    try{
        const { password,email } = await req.json()
        if(email&&password){
            // Wait for the insert operation to complete
            const data: any = await selectUser(email);
            if(data[0]){
                if (data[0].email&&await compare(password,data[0].password)) {
                    return Response.json({
                        msg:`Welcome ${data[0].username}`,
                        data:{
                            username:data[0].username,
                            email:data[0].email,
                            photo:data[0].photo,
                            token:generateUserToken(data[0].id)
                        }
                    })
                }else if(await compare(password,data[0].password)===false){
                    return NextResponse.json({error:'You have enter the wrong password'},{status:401})
                }
            }else{
                return NextResponse.json({error:`Account associated with email ${email} does not exist!`},{status:404})
            }
        }else{
            return Response.json({error:"Enter all the required fields"})
        }
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}