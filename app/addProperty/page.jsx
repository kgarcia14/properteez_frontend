'use client'

import styles from '../../styles/addProperty.module.css'
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Nav from '../components/Nav';
import Loading from '../components/Loading';

const AddProperty = () => {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
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
    const [leaseTerm, setLeaseTerm] = useState('');
    const [rentAmount, setRentAmount] = useState('');
    const [rentStatus, setRentStatus] = useState('');
    const [propertyImage, setPropertyImage] = useState('');

    const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

    useEffect(() => {
        const checkForCookies = () => {
            if (!Cookies.get('id')) {
                location.assign('/')
            } else {
                setUserId(Cookies.get('id'));
                setLoading(false);
            }
        }

        checkForCookies();
    }, []);

    const handleAddProperty = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const formData = new FormData();

            // Append form fields to the FormData object
            formData.append('user_id', userId);
            formData.append('street', street);
            formData.append('city', city);
            formData.append('state', state);
            formData.append('zip', zip);
            formData.append('home_type', homeType);
            formData.append('mortgage_amount', mortgageAmount);
            formData.append('vacancy', vacancy);
            formData.append('renter_name', renterName);
            formData.append('renter_number', renterNumber);
            formData.append('renter_email', renterEmail);
            formData.append('lease_term', leaseTerm);
            formData.append('rent_amount', rentAmount);
            formData.append('rent_status', rentStatus);

            // Append the image file to the FormData object
            formData.append('property_image', propertyImage);

            const res = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:4444/properties/' : 'https://properteezapi.kurtisgarcia.dev/properties/', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            console.log(res)
            console.log(propertyImage.name)

            if (res.ok) {
                location.assign('/dashboard')
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (loading) {
        const loadingString = 'Adding Property...'
        return <Loading loadingString={loadingString} />
    }

    return (
        <main className={styles.main}>
            <div>
                <Nav />
            </div>
            <h2>Add Property</h2>
            <form className={styles.form} onSubmit={handleAddProperty}>
                <h2>Property Info</h2>
                <label className={styles.label}>
                    Steet
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
                        <option value="">Select State</option>
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
                        <option value="">Select Type</option>
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
                <label className={styles.fileLabel}>
                    Upload Image
                    <input className={styles.fileInput} 
                    type="file"
                    name="propertyImage"
                    onChange= {(e) => setPropertyImage(e.target.files[0])} 
                    hidden/>
                </label>
                <span className={propertyImage === '' ? styles.span : styles.hidden}>No file selected</span>
                <span className={propertyImage !== '' ? styles.span : styles.hidden}>{propertyImage.name}</span>
                
                <h2>Renter Info</h2>
                <label className={styles.label}>
                    Vacancy
                    <select
                    className={styles.select} 
                    type="text"
                    name="vacancy"
                    value= {vacancy}
                    onChange= {(e) => setVacancy(e.target.value)}>
                        <option value="">Select Vacancy</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Vacant">Vacant</option>
                    </select>
                </label>
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
                    type="text"
                    name="renterNumber"
                    value= {renterNumber}
                    onChange= {(e) => setRenterNumber(e.target.value)} />
                </label>
                <label className={styles.label}>
                    Renter Email
                    <input className={styles.input} 
                    type="text"
                    name="renterEmail"
                    value= {renterEmail}
                    onChange= {(e) => setRenterEmail(e.target.value)} />
                </label>
                <label className={styles.label}>
                    Lease Start Date
                    <input className={styles.input} 
                    type="date"
                    name="leaseTerm"
                    value= {leaseTerm}
                    onChange= {(e) => setLeaseTerm(e.target.value)} />
                </label>
                {/* <label className={styles.label}>
                    Lease End Date
                    <input className={styles.input} 
                    type="date"
                    name="leaseTerm"
                    value= {leaseTerm}
                    onChange= {(e) => setLeaseTerm(e.target.value)} />
                </label> */}
                <label className={styles.label}>
                    Rent Amount
                    <input className={styles.input} 
                    type="text"
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
                        <option value="">Select Rent Status</option>
                        <option value="Current">Current</option>
                        <option value="Past Due">Past Due</option>
                    </select>
                </label>
                <button className={styles.button}>Submit Property</button>
            </form>
        </main>
    )
}

export default AddProperty;