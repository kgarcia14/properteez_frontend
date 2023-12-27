'use client'

import { useState, useEffect } from "react";

const Dashboard = () => {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const checkForCookies = () => {
            if (!document.cookie) {
                location.assign('/login')
            } else {
                const userId = document.cookie.split(';')[0].split('=')[1]
                const email = document.cookie.split(';')[1].split('=')[1]

                setUserId(userId);
                setEmail(email);
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
        
                const results = await res.json();
                console.log(results)
                setProperties(results.data.properties)
            }
        }
        
        getAllProperties();
    }, [userId]);

    if (loading) {
        return <div>Authenticating...</div>
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