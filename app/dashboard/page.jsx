'use client'

import styles from '../../styles/dashboard.module.css'
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import Nav from '../components/Nav';
import { BsHouses, BsCurrencyDollar } from "react-icons/bs";


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

    // Calculate total mortgage and total rent
    let totalMortgageAmount = 0; 
    let totalRentAmount = 0
    let profitSum = 0
    properties.forEach(property => {
        if (property.mortgage_amount !== '') {
            totalMortgageAmount += parseInt(property.mortgage_amount);
        }
        if (property.rent_amount !== '') {
            totalRentAmount += parseInt(property.rent_amount);
        }
    })
    profitSum += totalRentAmount - totalMortgageAmount;

    return ( 
        <main className={styles.container}>
            <div className={styles.wrapper}>
                <Nav />
                <div className={styles.contentContainer}>
                    <div className={styles.content}>
                        <h2 className={styles.overView}>Overview</h2>
                        <div className={styles.overviewContainer}>
                            <div className={styles.overviewCard}>
                                <div className={styles.overviewCardContent}>
                                    <BsHouses className={styles.overviewCardIcon} />
                                    <div>
                                        <h3 className={styles.overviewCardTitle}>Total Properties</h3>
                                        <p className={styles.overviewCardP}>{properties.length} Units</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.overviewCard}>
                                <div className={styles.overviewCardContent}>
                                    <BsCurrencyDollar className={styles.overviewCardIcon} />
                                    <div>
                                        <h3 className={styles.overviewCardTitle}>Monthly Profit</h3>
                                        <p className={styles.overviewCardP}>{profitSum < 0 ? `- $ ${Math.abs(parseInt(profitSum, 10))}` : `$ ${profitSum}`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.overviewCard}>
                                <div className={styles.overviewCardContent}>
                                    <img className={styles.overviewIcon} src="/rent_icon.svg" alt=""/>
                                    <div>
                                        <h3 className={styles.overviewCardTitle}>Rent Collection</h3>
                                        <p className={styles.overviewCardP}>{properties.length} Overdue</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ul className={styles.ul}>
                            {properties.map(property => (
                                <li className={styles.li} key={property.id}>
                                    <div className={styles.propertyContainer}>
                                        <div className={styles.imageContainer}>
                                            <img className={styles.image} src={property.property_image} alt='' width='100%' />
                                        </div>
                                        <div className={styles.propertyContent}>
                                            <p className={styles.address}>
                                                {property.street}
                                            </p>
                                            <p className={styles.address}>
                                                {property.city}, {property.state} {property.zip}
                                            </p>
                                            <p className={styles.homeType}>{property.home_type}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
     );
}
 
export default Dashboard;