'use client'

import { useState } from "react";
import Link from 'next/link'


const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleCreateUser = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:4444/register' : 'https://properteezapi.kurtisgarcia.dev/register', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    user_email: email, 
                    user_password: password 
                }),
            });
            
            const response = await res.json();
            console.log(response);
            
            if (response.results) {
                location.assign('/dashboard')
            }

            const errorMessage = document.querySelector('.email-error');
            
            if (res.status !== 201) {

                if (response.message.includes('email exists!')) {
                    errorMessage.innerText = 'Email exists! Try a new one.'
                }

            } else {
                errorMessage.innerText = '';
                setEmail('');
                setPassword('');
            }

            console.log(JSON.stringify({user_email: email, user_password: password}));
        } catch (err) {
            console.log(err);
        }
    }

    return ( 
        <main>
            <div>
                <h2>Sign Up</h2>
                <h3><Link href="/login">Log in</Link></h3>
                <form onSubmit={handleCreateUser}>
                    <label>
                        Email
                        <input 
                        type="email" 
                        name="email" 
                        value={email}
                        onChange = {(e) => setEmail(e.target.value)}
                        required  />
                        <div>
                            <p className="email-error"></p>
                        </div>
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
                    <button>Sign Up</button>
                </form>
            </div>
        </main>
     );
}
 
export default Signup;