'use client'

import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import Link from 'next/link'

const Dashboard = () => {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [cookies, setCookies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);
    
    useEffect(() => {
        const checkForCookies = () => {
            if (!document.cookie) {
                location.assign('/login')
            } else {
                const userId = document.cookie.split(';')[0].split('=')[1];
                const email = document.cookie.split(';')[1].split('=')[1];
                const cookies = document.cookie.split('; ');

                setUserId(userId);
                setEmail(email);
                setCookies(cookies);
                setLoading(false);
            }
        }

        checkForCookies();
    }, []);

    useEffect(() => {
        const getAllProperties = async () => {
            if (userId) {
                const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/properties/${userId}` : `https://properteezapi.kurtisgarcia.dev/properties/${userId}`, {
                    credentials: 'include',
                });

                if (res.status === 403) {
                    const refreshTokenRes = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:4444/refreshToken' : 'https://properteezapi.kurtisgarcia.dev/refreshToken', {
                        method: 'POST',
                        credentials: 'include'
                    });

                    console.log(refreshTokenRes);

                    if (refreshTokenRes.status === 400) {
                        const logoutRes = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:4444/logout' : 'https://properteezapi.kurtisgarcia.dev/logout', {
                            method: 'DELETE',
                            credentials: 'include'
                        })

                        Cookies.remove('email')
                        Cookies.remove('id')
                        location.assign('/login')
                    } else {
                        const refreshResults = await refreshTokenRes.json();
                        console.log(refreshResults);
                    }
                } else {
                    const results = await res.json();
                    console.log(results)

                    setProperties(results.data.properties);
                }
            }
        }
        
        getAllProperties();
    }, [userId]);

    if (loading) {
        return <div>Checking Authentication...</div>
    }

    return ( 
        <main>
            <div>Dashboard</div>
            <p>email: {email}</p>
            <p>user id: {userId}</p>
            <ul>
                {properties.map(property => (
                    <li key={property.id}>
                        {property.street}
                    </li>
                ))}
            </ul>
        </main>
     );
}
 
export default Dashboard;