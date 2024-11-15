import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken"
import { db } from "../../db";

const generateUserToken=(id:string)=>{
    return sign({id},`${process.env.JWT_SECRET}`,{
        expiresIn:'10d'
    })
};

export async function POST(req: Request) {
    const { password,email } = await req.json()
    if(email&&password){
        db.all('SELECT * FROM users WHERE email = $1',[email],async (error:any,results:any)=>{
            if(error){
                console.log(error)
                return Response.json({error:'Failed to sign in, try again!'})
            }else{
                if(results.rows[0]){
                    if (results.rows[0].email&&await compare(password,results.rows[0].password)) {
                        return Response.json({
                            msg:`Welcome ${results.rows[0].username}`,
                            data:{
                                username:results.rows[0].username,
                                email:results.rows[0].email,
                                photo:results.rows[0].photo,
                                token:generateUserToken(results.rows[0].id)
                            }
                        })
                    }else if(await compare(password,results.rows[0].password)===false){
                       return Response.json({error:'You have enter the wrong password'})
                    }
                }else{
                    return Response.json({error:`Account associated with email ${email} does not exist!`})
                }
            }
        })
    }else{
        return Response.json({error:"Enter all the required fields"})
    }
}