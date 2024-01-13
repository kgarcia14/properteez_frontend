'use client'

import styles from '../../styles/dashboard.module.css'
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import Nav from '../components/Nav';
import { BsHouses, BsCurrencyDollar } from "react-icons/bs";
import Loading from '../components/Loading';
import {useDisclosure} from "@nextui-org/react";
import PropertyModal from '../components/PropertyModal';


const Dashboard = () => {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedProperty, setSelectedProperty] = useState(null);
    
    useEffect(() => {
        const checkForCookies = () => {
            if (!Cookies.get('id')) {
                location.assign('/')
            } else {
                setUserId(Cookies.get('id'));
                setEmail(Cookies.get('email'));
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
                        setLoading(false);
                    }
                } else {
                    const results = await res.json();
                    console.log(results)

                    setProperties(results.data.properties);
                    setLoading(false);
                }
            }
        }
        
        getAllProperties();
    }, [userId]);

    if (loading) {
        return <Loading />
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

    // Calculate amount of overdue renters
    let pastDueRenters = [];
    let totalPastDueRenters = 0;
    properties.forEach(property => {
        if (property.rent_status === 'Past Due') {
            pastDueRenters.push(property.key)
        }
    })
    totalPastDueRenters = pastDueRenters.length;

    const handlePropertyClick = (property) => {
        onOpen();  // Call onOpen function
        setSelectedProperty(property);
        console.log(property);
    };

    return ( 
        <main className={styles.container}>
            <div className={styles.wrapper}>
                <Nav />
                <div className={styles.contentContainer}>
                    <div className={styles.content}>
                        <h2 className={styles.overview}>Overview</h2>
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
                                        <p className={styles.overviewCardP}>{totalPastDueRenters} Past Due</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ul className={styles.ul}>
                        <h2 className={styles.properties}>Properties</h2>
                            {properties.map(property => (
                                <li key={property.id}>
                                    <div className={styles.propertyContainer}>
                                        <div className={styles.imageContainer} onClick={() => handlePropertyClick(property)}>
                                            <img className={styles.image} src={property.property_image} alt='' width='100%' />
                                        </div>
                                        <div className={styles.propertyContent}>
                                            <div className={styles.addressWrapper}>
                                                <p className={styles.address}>
                                                    {property.street}
                                                </p>
                                                <p className={styles.address}>
                                                    {property.city}, {property.state} {property.zip}
                                                </p>
                                                <p className={styles.homeType}>{property.home_type}</p>
                                            </div>
                                            <div>
                                                <p className={property.rent_status === 'Past Due' ? `${styles.pastDueRentStatus}`
                                                    : property.rent_status === 'Current' ? `${styles.currentRentStatus}` 
                                                    : `${styles.neutralRentStatus}`}>
                                                    {property.rent_status !== '' ? property.rent_status : 'Vacant'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {/* Passing down props to display property details in separate modal component */}
                        <PropertyModal isOpen={isOpen} onClose={onOpenChange} property={selectedProperty} />
                    </div>
                </div>
            </div>
        </main>
     );
}
 
export default Dashboard;
