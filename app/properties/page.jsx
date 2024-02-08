'use client'

import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import Nav from '../components/Nav';
import styles from '../../styles/properties.module.css'
import Loading from '../components/Loading';
import {useDisclosure} from "@nextui-org/react";
import PropertyModal from '../components/PropertyModal';
import Link from 'next/link';
import { MdOutlineAddHome } from "react-icons/md";

const Properties = () => {
    const [userExists, setUserExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedProperty, setSelectedProperty] = useState(null);
    
    useEffect(() => {
        if (!Cookies.get('isLoggedIn')) {
            fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:4444/logout' : 'https://properteezapi.kurtisgarcia.dev/logout', {
                method: 'DELETE',
                credentials: 'include'
            });

            location.assign('/');
        } else {
            const validateUser = async () => {
                const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/validateUser` : `https://properteezapi.kurtisgarcia.dev/validateUser`, {
                    credentials: 'include',
                });
    
                console.log(res)
    
                if (res.status === 200 || res.status === 403) {
                    setUserExists(true);
                } else {
                    location.assign('/');
                }
            }
    
            validateUser();
        }
    }, []);

    useEffect(() => {
        const getAllProperties = async () => {
            if (userExists) {
                const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/properties` : `https://properteezapi.kurtisgarcia.dev/properties`, {
                    credentials: 'include',
                });

                if (res.status === 403) {
                    const refreshTokenRes = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:4444/refreshToken' : 'https://properteezapi.kurtisgarcia.dev/refreshToken', {
                        method: 'POST',
                        credentials: 'include',
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

                        const retryRes = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:3333/properties' : 'https://properteezapi.kurtisgarcia.dev/properties', {
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
    }, [userExists]);

    if (loading) {
        const loadingString = 'Loading Content...'
        return <Loading loadingString={loadingString} />
    }

    const handlePropertyClick = (property) => {
        onOpen();  // Call onOpen function
        setSelectedProperty(property);
    };

    return ( 
        <main className={styles.container}>
            <div className={styles.wrapper}>
                <Nav />
                <div className={styles.contentContainer}>
                    <div className={styles.content}>
                    <div className={styles.propertiesAndAddPropertyWrapper}> 
                        <h2 className={styles.properties}>Properties <span className={styles.propertiesAmount}>({properties.length} Units)</span></h2>
                        <Link className={styles.addPropertyIcon} href='/addProperty'><MdOutlineAddHome /></Link>
                        <Link className={styles.addPropertyButton} href='/addProperty'><span className={styles.plus}>+</span> Add Property</Link>
                    </div>
                        <ul className={styles.ul}>
                            {properties.map(property => (
                                <li key={property.id} onClick={() => handlePropertyClick(property)}>
                                    <div className={styles.propertyContainer}>
                                        <div className={styles.imageContainer}>
                                            <img className={styles.image} src={property.property_image} alt='' width='100%' />
                                        </div>
                                        <div className={styles.propertyContent}>
                                            <div className={styles.addressWrapper}>
                                                <p className={styles.address}>
                                                    {property.street}<br/>
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
 
export default Properties;
