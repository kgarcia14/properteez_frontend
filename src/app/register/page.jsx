'use client'

import { useState } from "react";


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const createUser = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:4444/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    user_email: email, 
                    user_password: password 
                }),
            })
            console.log(res)
        } catch (err) {
            console.log(err)
        }
        console.log(JSON.stringify({user_email: email, user_password: password}));

        setEmail('');
        setPassword('');
    }

    return ( 
        <main>
            <div>
                <h2>Sign Up</h2>
                <form onSubmit={createUser}>
                    <label>
                        Email
                        <input 
                        type="email" 
                        name="email" 
                        value={email}
                        onChange = {(e) => setEmail(e.target.value)}
                        required  />
                    </label>
                    <label>
                        Password
                        <input 
                        type="password" 
                        name="password" 
                        value={password}
                        onChange = {(e) => setPassword(e.target.value)}
                        required />
                    </label>
                    <button>Create Account</button>
                </form>
            </div>
        </main>
     );
}
 
export default Register;