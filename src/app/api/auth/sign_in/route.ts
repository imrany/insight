import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken"
import { NextResponse } from 'next/server';
import { pool } from "../../db";

const generateUserToken=(id:string)=>{
    return sign({id},`${process.env.JWT_SECRET}`,{
        expiresIn:'10d'
    })
};

async function selectUser(
    email: string,
) {
    return new Promise((resolve, reject) => {
      pool.query(
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
            if(data.rows[0]){
                if (data.rows[0].email&&await compare(password,data.rows[0].password)) {
                    return Response.json({
                        msg:`Welcome ${data.rows[0].username}`,
                        data:{
                            username:data.rows[0].username,
                            email:data.rows[0].email,
                            photo:data.rows[0].photo,
                            token:generateUserToken(data.rows[0].id)
                        }
                    })
                }else if(await compare(password,data.rows[0].password)===false){
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