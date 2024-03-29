'use client'

import { useState } from 'react';
import Link from 'next/link';
import Logo from '../components/Logo';
import Loading from '../components/Loading';


const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (loading) {
        const loadingString = process.env.NODE_ENV === 'development' ? 'Registering User...' : 'Registering user, please sit tight...'
        return <Loading loadingString={loadingString} />
    }
    
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);

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
            <div className='login-signup-container'>
                <div className='login-signup-wrapper'>
                    <Logo />
                    <h2 className='login-signup-header'>Sign Up</h2>
                    <p className='login-signup-subheader'>Enter your email and password to sign up.</p>
                    <form className='login-signup-form' onSubmit={handleCreateUser} >
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
                            <span className="email-error"></span>
                        </label>
                        <label>
                            Password
                            <input 
                            type='password' 
                            name='password' 
                            value={password}
                            placeholder='Enter your password'
                            onChange = {(e) => setPassword(e.target.value)}
                            required />
                        </label>
                        <button className='login-signup-button'>Sign Up</button>
                    </form>
                    <p className='login-signup-button-subheader'>Already have an account? <Link className='login-signup-link' href='/'>Log In</Link></p> 
                </div>
            </div>
        </main>
     );
}
 
export default Signup;