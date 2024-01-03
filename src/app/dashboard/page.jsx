'use client'

import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import Link from 'next/link';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);
    
    useEffect(() => {
        const checkForCookies = () => {
            if (!Cookies.get('id')) {
                location.assign('/')
            } else {
                setUserId(Cookies.get('id'));
                setEmail(Cookies.get('email'));
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

                        console.log(logoutRes)

                        Cookies.remove('email')
                        Cookies.remove('id')
                        location.assign('/')
                    } else {
                        const refreshResults = await refreshTokenRes.json();
                        console.log(refreshResults);

                        const retryRes = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/properties/${userId}` : `https://properteezapi.kurtisgarcia.dev/properties/${userId}`, {
                        credentials: 'include',
                        });
                        console.log(retryRes);
                        const results = await retryRes.json();
                        console.log(results);
                        setProperties(results.data.properties);
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
            <Navbar />
            <div>Dashboard</div>
            <p>email: {email}</p>
            <p>user id: {userId}</p>
            <ul>
                {properties.map(property => (
                    <li key={property.id}>
                        <p>{property.street}</p>
                        <p>{property.city}</p>
                        <p>{property.state}</p>
                        <p>{property.zip}</p>
                        <img src={property.property_image} alt='' width='150px' />
                    </li>
                ))}
            </ul>
        </main>
     );
}
 
export default Dashboard;