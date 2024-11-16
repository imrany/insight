import {genSalt, hash} from "bcryptjs";
import { sign } from "jsonwebtoken"
import { pool } from "../../db";
import { NextResponse } from 'next/server';

const generateUserToken=(id:string)=>{
    return sign({id},`${process.env.JWT_SECRET}`,{
        expiresIn:'10d'
    })
};

async function insertUser(
    username: string,
    email: string,
    hashedPassword: string
) {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
        [username, email, hashedPassword],
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
    try {
        const { username, password, email } = await req.json();
        if (username && email && password) {
            const salt = await genSalt(10);
            const hashedPassword = await hash(password, salt);

            // Wait for the insert operation to complete
            const data: any = await insertUser(username, email, hashedPassword);

            console.log(data);
            return NextResponse.json({
                msg: `Welcome ${data[0].username}`,
                data: {
                    username: data[0].username,
                    email: data[0].email,
                    photo: data[0].photo,
                    token: generateUserToken(data[0].id),
                },
            });
        } else {
            return NextResponse.json({ error: "Enter all the required fields" }, { status: 408 });
        }
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        if(error.message.includes('UNIQUE')){
            return NextResponse.json({ error: `This user has an account` }, { status: 408 });
        }else{
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
