'use client'

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const AddProperty = () => {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [mortgageAmount, setMortgageAmount] = useState('');
    const [vacancy, setVacancy] = useState('');
    const [renterName, setRenterName] = useState('');
    const [renterNumber, setRenterNumber] = useState('');
    const [renterEmail, setRenterEmail] = useState('');
    const [leaseTerm, setLeaseTerm] = useState('');
    const [rentAmount, setRentAmount] = useState('');
    const [rentStatus, setRentStatus] = useState('');
    const [propertyImage, setPropertyImage] = useState('');

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

        try {
            const formData = new FormData();

            // Append form fields to the FormData object
            formData.append('user_id', userId);
            formData.append('street', street);
            formData.append('city', city);
            formData.append('state', state);
            formData.append('zip', zip);
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
            
            if (res.ok) {
                location.assign('/dashboard')
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (loading) {
        return <div>Checking Authentication...</div>
    }

    return (
        <main>
            <h2>Add Property</h2>
            <form onSubmit={handleAddProperty}>
                <label>
                    Steet
                    <input 
                    type="text"
                    name="street"
                    value= {street}
                    onChange= {(e) => setStreet(e.target.value)}
                    required />
                </label>
                <label>
                    City
                    <input 
                    type="text"
                    name="city"
                    value= {city}
                    onChange= {(e) => setCity(e.target.value)}
                    required />
                </label>
                <label>
                    State
                    <input 
                    type="text"
                    name="state"
                    value= {state}
                    onChange= {(e) => setState(e.target.value)}
                    required />
                </label>
                <label>
                    Zip
                    <input 
                    type="text"
                    name="zip"
                    value= {zip}
                    onChange= {(e) => setZip(e.target.value)}
                    required />
                </label>
                <label>
                    Mortage Amount
                    <input 
                    type="text"
                    name="mortgageAmount"
                    value= {mortgageAmount}
                    onChange= {(e) => setMortgageAmount(e.target.value)} />
                </label>
                <label>
                    Vacancy
                    <select 
                    type="text"
                    name="vacancy"
                    value= {vacancy}
                    onChange= {(e) => setVacancy(e.target.value)}>
                        <option value="">Select Vacancy</option>
                        <option value="occupied">Occupied</option>
                        <option value="vacant">Vacant</option>
                    </select>
                </label>
                <label>
                    Renter Name
                    <input 
                    type="text"
                    name="renterName"
                    value= {renterName}
                    onChange= {(e) => setRenterName(e.target.value)} />
                </label>
                <label>
                    Renter Number
                    <input 
                    type="text"
                    name="renterNumber"
                    value= {renterNumber}
                    onChange= {(e) => setRenterNumber(e.target.value)} />
                </label>
                <label>
                    Renter Email
                    <input 
                    type="text"
                    name="renterEmail"
                    value= {renterEmail}
                    onChange= {(e) => setRenterEmail(e.target.value)} />
                </label>
                <label>
                    Lease Term
                    <input 
                    type="text"
                    name="leaseTerm"
                    value= {leaseTerm}
                    onChange= {(e) => setLeaseTerm(e.target.value)} />
                </label>
                <label>
                    Rent Amount
                    <input 
                    type="text"
                    name="rentAmount"
                    value= {rentAmount}
                    onChange= {(e) => setRentAmount(e.target.value)} />
                </label>
                <label>
                    Rent Status
                    <select 
                    type="text"
                    name="rentStatus"
                    value= {rentStatus}
                    onChange= {(e) => setRentStatus(e.target.value)}>
                        <option value="">Select Rent Status</option>
                        <option value="current">Current</option>
                        <option value="pastDue">Past Due</option>
                    </select>
                </label>
                <label>
                    Property Image
                    <input 
                    type="file"
                    name="propertyImage"
                    onChange= {(e) => setPropertyImage(e.target.files[0])} />
                </label>
                <button>Submit Property</button>
            </form>
        </main>
    )
}

export default AddProperty;