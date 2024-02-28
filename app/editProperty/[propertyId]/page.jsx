'use client'

import styles from '../../../styles/editProperty.module.css'
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Nav from '../../components/Nav';
import Loading from '../../components/Loading';

const EditProperty = ({params}) => {
    const [loading, setLoading] = useState(true)
    const [userExists, setUserExists] = useState(false)
    const [property, setProperty] = useState(null);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [homeType, setHomeType] = useState('');
    const [mortgageAmount, setMortgageAmount] = useState('');
    const [vacancy, setVacancy] = useState('');
    const [renterName, setRenterName] = useState('');
    const [renterNumber, setRenterNumber] = useState('');
    const [renterEmail, setRenterEmail] = useState('');
    const [leaseStart, setLeaseStart] = useState('');
    const [leaseEnd, setLeaseEnd] = useState('');
    const [rentAmount, setRentAmount] = useState('');
    const [rentStatus, setRentStatus] = useState('');
    const [propertyImage, setPropertyImage] = useState('');

     //format date input for submitting form (MM/DD/YYYY)
     const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    }

    //this coverts to a format the input with type="date" will accept (YYYY-MM-DD)
    const convertDateFormat = (dateString) => {
        const [month, day, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

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
    
                if (res.status === 200) {
                    setUserExists(true);
                } else if (res.status === 403) {
                    location.assign('/dashboard');
                } else {
                    location.assign('/');
                }
            }
    
            validateUser();
        }
    }, []);

    useEffect(() => {
        if (userExists) {
            const getPropertyById = async () => {
                const res = await fetch(process.env.NODE_ENV === 'development' ? 
                `http://localhost:3333/properties/propertyInfo/${params.propertyId}` : `https://properteezapi.kurtisgarcia.dev/properties/propertyInfo/${params.propertyId}`, {
                    credentials: 'include',
                });
        
                const results = await res.json();
                console.log(results.data.property);
                const propertyInfo = results.data.property;

                if (property === undefined) {
                    location.assign('/dashboard')
                } else {
                    setProperty(propertyInfo);
                }
            }
    
            getPropertyById();
        }
    }, [userExists]);

    useEffect(() => {
        if (property) {
            console.log(property)
    
            setStreet(property.street);
            setCity(property.city);
            setState(property.state);
            setZip(property.zip);
            setHomeType(property.home_type);
            setMortgageAmount(property.mortgage_amount);
            setVacancy(property.vacancy);
            setRenterName(property.renter_name);
            setRenterNumber(property.renter_number);
            setRenterEmail(property.renter_email);
            setLeaseStart(property.lease_start !== '' ? convertDateFormat(property.lease_start) : property.lease_start);
            setLeaseEnd(property.lease_end !== '' ? convertDateFormat(property.lease_end) : property.lease_end);
            setRentAmount(property.rent_amount);
            setRentStatus(property.rent_status);
    
            setLoading(false)
        }
    }, [property])

    const handleEditProperty = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/validateUser` : `https://properteezapi.kurtisgarcia.dev/validateUser`, {
            credentials: 'include',
        });

        if (res.status === 200) {
            try {
                const formData = new FormData();
    
                // Append form fields to the FormData object
                formData.append('street', street);
                formData.append('city', city);
                formData.append('state', state);
                formData.append('zip', zip);
                formData.append('home_type', homeType);
                formData.append('mortgage_amount', mortgageAmount === '' ? 0 : mortgageAmount);
                formData.append('vacancy', vacancy);
                // Append the image file to the FormData object
                formData.append('property_image', propertyImage);
    
                if (vacancy === "Occupied") {
                    formData.append('renter_name', renterName);
                    formData.append('renter_number', renterNumber);
                    formData.append('renter_email', renterEmail);
                    formData.append('lease_start', leaseStart === '' ? '' : formatDate(leaseStart));
                    formData.append('lease_end', leaseEnd === '' ? '' : formatDate(leaseEnd));
                    formData.append('rent_amount', rentAmount === '' ? 0 : rentAmount);
                    formData.append('rent_status', rentStatus);
                } else {
                    formData.append('renter_name', '');
                    formData.append('renter_number', '');
                    formData.append('renter_email', '');
                    formData.append('lease_start', '');
                    formData.append('lease_end', '');
                    formData.append('rent_amount', 0);
                    formData.append('rent_status', '');
                }
    
    
                const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:4444/properties/${params.propertyId}` : `https://properteezapi.kurtisgarcia.dev/properties/${params.propertyId}`, {
                    method: 'PUT',
                    credentials: 'include',
                    body: formData,
                });
                console.log(res)
                console.log(propertyImage.name)
    
                if (res.status === 201) {
                    location.assign('/dashboard')
                }

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
                        location.assign('/')
                    } else {
                        const refreshResults = await refreshTokenRes.json();
                        console.log(refreshResults);

                        const retryRes = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:4444/properties/${params.propertyId}` : `https://properteezapi.kurtisgarcia.dev/properties/${params.propertyId}`, {
                            method: 'PUT',
                            credentials: 'include',
                            body: formData,
                        });
                        console.log(retryRes);
                        const results = await retryRes.json();
                        console.log(results);

                        if (refreshTokenRes.status === 201) {
                            location.assign('/dashboard')
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
        } else if (res.status === 403) {
            location.assign('/dashboard');
        } else {
            location.assign('/');
        }
    }

    if (loading) {
        const loadingString = 'Loading Content...'
        return <Loading loadingString={loadingString} />
    }

    return (
        <main className={styles.container}>
            <div className={styles.wrapper}>
                <Nav />
                <div className={styles.formContainer}>
                    <div className={styles.formWrapper}>
                        <form className={styles.form} onSubmit={handleEditProperty}>
                            <div className={styles.propertyAndRenterDetailsWrapper}>
                                <div className={styles.propertyDetailsWrapper}>
                                    <h2 className={styles.heading}>Property Details</h2>
                                    <label className={styles.label}>
                                        Street
                                        <input className={styles.input} 
                                        type="text"
                                        name="street"
                                        value= {street}
                                        onChange= {(e) => setStreet(e.target.value)}
                                        required />
                                    </label>
                                    <label className={styles.label}>
                                        City
                                        <input className={styles.input} 
                                        type="text"
                                        name="city"
                                        value= {city}
                                        onChange= {(e) => setCity(e.target.value)}
                                        required />
                                    </label>
                                    <label className={styles.label}>
                                        State
                                        <select
                                        className={styles.select} 
                                        type="text"
                                        name="state"
                                        value= {state}
                                        onChange= {(e) => setState(e.target.value)}
                                        required>
                                            <option value=""></option>
                                            {states.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className={styles.label}>
                                        Zip
                                        <input className={styles.input} 
                                        type="text"
                                        name="zip"
                                        value= {zip}
                                        onChange= {(e) => setZip(e.target.value)}
                                        required />
                                    </label>
                                    <label className={styles.label}>
                                        Type of Home
                                        <select
                                        className={styles.select} 
                                        type="text"
                                        name="homeType"
                                        value= {homeType}
                                        onChange= {(e) => setHomeType(e.target.value)}
                                        required>
                                            <option value=""></option>
                                            <option value="Single Family">Single Family</option>
                                            <option value="Townhome">Townhome</option>
                                            <option value="Multi-Family">Multi-Family</option>
                                        </select>
                                    </label>
                                    <label className={styles.label}>
                                        Mortage Amount
                                        <input className={styles.input} 
                                        type="number"
                                        name="mortgageAmount"
                                        value= {mortgageAmount}
                                        onChange= {(e) => setMortgageAmount(e.target.value)} />
                                    </label>
                                    <label className={styles.label}>
                                        Vacancy
                                        <select
                                        className={styles.select} 
                                        type="text"
                                        name="vacancy"
                                        value= {vacancy}
                                        onChange= {(e) => setVacancy(e.target.value)} >
                                            <option value=""></option>
                                            <option value="Vacant">Vacant</option>
                                            <option value="Occupied">Occupied</option>
                                        </select>
                                    </label>
                                    <label className={styles.fileLabel}>
                                        Upload Image
                                        <input className={styles.fileInput} 
                                        type="file"
                                        name="propertyImage"
                                        onChange= {(e) => setPropertyImage(e.target.files[0] ? e.target.files[0] : '')} 
                                        hidden/>
                                    </label>
                                    <span className={propertyImage === '' ? styles.span : styles.hidden}>No file selected</span>
                                    <span className={propertyImage !== '' ? styles.span : styles.hidden}>{propertyImage.name}</span>
                                </div>
                                <div className={styles.renterDetailsWrapper}>
                                    {vacancy === 'Occupied' ? 
                                    <>
                                        <h2 className={styles.heading}>Renter Details</h2>
                                        <label className={styles.label}>
                                            Renter Name
                                            <input className={styles.input} 
                                            type="text"
                                            name="renterName"
                                            value= {renterName}
                                            onChange= {(e) => setRenterName(e.target.value)} />
                                        </label>
                                        <label className={styles.label}>
                                            Renter Number
                                            <input className={styles.input} 
                                            type="tel"
                                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                            placeholder="e.g. 123-456-7890"
                                            name="renterNumber"
                                            value= {renterNumber}
                                            onChange= {(e) => setRenterNumber(e.target.value)} />
                                        </label>
                                        <label className={styles.label}>
                                            Renter Email
                                            <input className={styles.input} 
                                            type="email"
                                            name="renterEmail"
                                            value= {renterEmail}
                                            onChange= {(e) => setRenterEmail(e.target.value)} />
                                        </label>
                                        <label className={styles.label}>
                                            Lease Start Date
                                            <input className={`${styles.input} ${styles.inputDate}`} 
                                            type="date"
                                            name="leaseStart"
                                            value= {leaseStart}
                                            onChange= {(e) => setLeaseStart(e.target.value)} />
                                        </label>
                                        <label className={styles.label}>
                                            Lease End Date
                                            <input className={`${styles.input} ${styles.inputDate}`} 
                                            type="date"
                                            name="leaseEnd"
                                            value= {leaseEnd}
                                            onChange= {(e) => setLeaseEnd(e.target.value)} />
                                        </label>
                                        <label className={styles.label}>
                                            Rent Amount
                                            <input className={styles.input} 
                                            type="number"
                                            name="rentAmount"
                                            value= {rentAmount}
                                            onChange= {(e) => setRentAmount(e.target.value)} />
                                        </label>
                                        <label className={styles.label}>
                                            Rent Status
                                            <select
                                            className={styles.select} 
                                            type="text"
                                            name="rentStatus"
                                            value= {rentStatus}
                                            onChange= {(e) => setRentStatus(e.target.value)}>
                                                <option value=""></option>
                                                <option value="Current">Current</option>
                                                <option value="Past Due">Past Due</option>
                                            </select>
                                        </label>
                                    </>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                            <button className={styles.button}>Confirm Edit</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default EditProperty;