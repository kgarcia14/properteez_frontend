'use client'

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Nav from '../../components/Nav';
import Loading from '../../components/Loading';

const EditProperty = ({params}) => {
    const [loading, setLoading] = useState(true)
    const [property, setProperty] = useState('');
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
    const [leaseStart, setLeaseStart] = useState('');
    const [leaseEnd, setLeaseEnd] = useState('');
    const [rentAmount, setRentAmount] = useState('');
    const [rentStatus, setRentStatus] = useState('');
    const [propertyImage, setPropertyImage] = useState('');

     //format date input
     const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    }

    useEffect(() => {
        const checkForCookies = () => {
            if (!Cookies.get('id')) {
                location.assign('/')
            } else {
                setUserId(Cookies.get('id'));
                setLoading(false);

                const getPropertyById = async () => {
                    const res = await fetch(process.env.NODE_ENV === 'development' ? 
                    `http://localhost:3333/properties/propertyInfo/${params.propertyId}` : `https://properteezapi.kurtisgarcia.dev/properties/propertyInfo/${params.propertyId}`, {
                        credentials: 'include',
                    });
            
                    const results = await res.json();
                    console.log(results.data.property);
                    setProperty(results.data.property);
                    setLoading(false);
                }
        
                getPropertyById();
            }
        }

        checkForCookies();
    }, []);

    const handleEditProperty = async (e) => {
        e.preventDefault();

        if (!Cookies.get('id')) {
            location.assign('/')
        }
    }

    if (loading) {
        const loadingString = 'Loading Content...'
        return <Loading loadingString={loadingString} />
    }

    return (
        <>
            <Nav />
            {!property ? 'Property does not exist!!!' 
                : 
                <div>editProperty - {property.id} - {property.street}</div>
            }
        </>
    )
}

export default EditProperty;