'use client'

import { useState } from "react";


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleCreateUser = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://properteez.onrender.com/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    user_email: email, 
                    user_password: password 
                }),
            }); 

            console.log(res.headers)
            
            const response = await res.json();
            console.log(response);
            
            // if (response.results) {
            //     location.assign('/dashboard')
            // }

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
                    <button>Register</button>
                </form>
            </div>
        </main>
     );
}
 
export default Register;