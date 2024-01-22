'use client'

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Logo from './components/Logo';
import Loading from './components/Loading';


const Login = () => {
    const [email, setEmail] = useState('demo123@properteez.dev');
    const [password, setPassword] = useState('demo123');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('')

    if (Cookies.get('isLoggedIn')) {
        useEffect(() => {
            const validateUser = async () => {
                const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/validateUser` : `https://properteezapi.kurtisgarcia.dev/validateUser`, {
                    credentials: 'include',
                });
                console.log(res)
    
                if (res.status === 200) {
                    location.assign('/dashboard');
                }
            }
    
            validateUser();
        }, []);
    }

    
    const handleLoginUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        
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
            console.log(res)
            
            const response = await res.json();
            console.log(response);
            
            if (res.status === 201) {
                location.assign('/dashboard');
                setEmail('');
                setPassword('');
            }
            
            if (res.status === 404) {
                setEmailError('User does not exist!');
                setPasswordError('');
                setEmail('');
                setPassword('');
                setLoading(false);
            }

            if (res.status === 408) {
                setPasswordError('Password is incorrect!');
                setEmailError('')
                setLoading(false);
                setPassword('');
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    if (loading) {
        const loadingString = 'Authenticating, please sit tight...'
        return <Loading loadingString={loadingString} />
    }

    return ( 
        <main>
            <div className='login-signup-container'>
                <div className='login-signup-wrapper'>
                    <Logo />
                    <h2 className='login-signup-header'>Log In</h2>
                    <p className='login-signup-subheader'>Enter your email and password to access your account.</p>
                    <form className='login-signup-form' onSubmit={handleLoginUser} >
                        <label>
                            Email
                            <input 
                            type='email' 
                            name='email' 
                            value={email}
                            placeholder='Enter your email'
                            onChange = {(e) => setEmail(e.target.value)}
                            required  
                            />
                            <span className="email-error-message">{emailError}</span>
                        </label>
                        <label>
                            Password
                            <input 
                            type='password' 
                            name='password' 
                            value={password}
                            placeholder='Enter your password'
                            onChange = {(e) => setPassword(e.target.value)}
                            required 
                            />
                            <span className="password-error-message">{passwordError}</span>
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
