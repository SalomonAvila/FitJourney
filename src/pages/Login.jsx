import React from 'react'
import { useState } from 'react';
import {client} from "../API/client"

function Login(){

    const [email,setEmail] = useState("");
    
    const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
            await client.auth.signInWithOtp({email})
        }catch(error){
            console.error(error)
        }
        
    };

    return(
        <div>

            <form onSubmit={handleSubmit}>

            <input type="email" name="email" placeholder="correo@site.com" id="" 
            onChange={(e) => setEmail(e.target.value)}/>
            <button>
                Send
            </button>

            </form>

        </div>
    )
};

export default Login;