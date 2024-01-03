'use client'

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/properteez_logo.png';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (Cookies.get('id')) {
            location.assign('/dashboard')
          }
    }, [])

    const handleLoginUser = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:4444/login' : 'https://properteezapi.kurtisgarcia.dev/login', {
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
            
            if (response.user) {
                location.assign('/dashboard')
            }
            
            setEmail('');
            setPassword('');

            console.log(JSON.stringify({user_email: email, user_password: password}));
        } catch (err) {
            console.log(err);
        }
    }

    return ( 
        <main>
            <div className='login-signup-container'>
                <div className='login-signup-wrapper'>
                    <Image className='login-signup-logo' src={logo} alt='properteez logo' width={100} />
                    <h2 className='login-signup-header'>Log In</h2>
                    <p className='login-signup-subheader'>Enter your email and password to access your dashboard.</p>
                    <form className='login-signup-form' onSubmit={handleLoginUser} >
                        <label>
                            Email
                            <input 
                            type='email' 
                            name='email' 
                            value={email}
                            onChange = {(e) => setEmail(e.target.value)}
                            required  />
                            <div>
                                <p className='email-error'></p>
                            </div>
                        </label>
                        <label>
                            Password
                            <input 
                            type='password' 
                            name='password' 
                            value={password}
                            onChange = {(e) => setPassword(e.target.value)}
                            required />
                        </label>
                        <button className='login-signup-button'>Log In</button>
                    </form>
                    <p className="login-signup-button-subheader">Don&apos;t have an account? <Link className="login-signup-link" href="/signup">Sign Up</Link></p>  
                </div>
            </div>
        </main>
     );
}
 
export default Login;
