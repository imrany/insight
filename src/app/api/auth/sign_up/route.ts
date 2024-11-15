import {genSalt, hash} from "bcryptjs";
import { sign } from "jsonwebtoken"
import { db } from "../../db";
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
      db.run(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
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
                msg: `Welcome ${data.rows[0].username}`,
                data: {
                    username: data.rows[0].username,
                    email: data.rows[0].email,
                    photo: data.rows[0].photo,
                    token: generateUserToken(data.rows[0].id),
                },
            });
        } else {
            return NextResponse.json({ error: "Enter all the required fields" }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
