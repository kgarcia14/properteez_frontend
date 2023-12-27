'use client'

import { useState, useEffect } from "react";

const Dashboard = () => {
    
    useEffect(() => {
        const getAllProperties = async () => {
            const userId = document.cookie.split(';')[0].split('=')[1]
            
            const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/properties/${userId}` : `https://properteezapi.kurtisgarcia.dev/properties/${userId}`, {
                credentials: 'include',
            });
    
            const results = await res.json();
            console.log(results)
        }
        
        getAllProperties();
    }, []);

    return ( 
        <main>
            <div>Dashboard</div>
        </main>
     );
}
 
export default Dashboard;