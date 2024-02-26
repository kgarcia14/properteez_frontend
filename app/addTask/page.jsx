'use client'

import styles from '../../styles/addTask.module.css'
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Nav from '../components/Nav';
import Loading from '../components/Loading';

const AddTask = () => {
    const [loading, setLoading] = useState(true);
    const [userExists, setUserExists] = useState(false);
    const [properties, setProperties] = useState([])
    const [taskLocation, setTaskLocation] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStatus, setTaskStatus] = useState('');

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
                    const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/properties` : `https://properteezapi.kurtisgarcia.dev/properties`, {
                    credentials: 'include',
                    });

                    const results = await res.json();
                    console.log(results.data.properties);
                    setProperties(results.data.properties);

                    setUserExists(true);
                    setLoading(false)
                } else if (res.status === 403) {
                    location.assign('/dashboard');
                } else {
                    location.assign('/');
                }
            }
    
            validateUser();
        }
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/validateUser` : `https://properteezapi.kurtisgarcia.dev/validateUser`, {
            credentials: 'include',
        });

        if (res.status === 200) {
            try {
                const res = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:4444/tasks' : 'https://properteezapi.kurtisgarcia.dev/tasks', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'task_location': taskLocation,
                        'task_title': taskTitle,
                        'task_description': taskDescription,
                        'task_status': taskStatus
                    })
                });
                console.log(res)
    
                if (res.status === 201) {
                    location.assign('/tasks')
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

                        console.log(logoutRes);

                        location.assign('/');
                    } else {
                        const refreshResults = await refreshTokenRes.json();
                        console.log(refreshResults);

                        const retryRes = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:4444/tasks' : 'https://properteezapi.kurtisgarcia.dev/tasks', {
                            method: 'POST',
                            credentials: 'include',
                            body: formData,
                        });
                        console.log(retryRes);
                        const results = await retryRes.json();
                        console.log(results);

                        if (refreshTokenRes.status === 201) {
                            location.assign('/tasks')
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
        const loadingString = 'Loading...'
        return <Loading loadingString={loadingString} />
    }

    return (
        <main className={styles.container}>
            <div className={styles.wrapper}>
                <Nav />
                <div className={styles.formContainer}>
                    <div className={styles.formWrapper}>
                        <form className={styles.form} onSubmit={handleAddTask}>
                            <div className={styles.taskDetailsWrapper}>
                                <h2 className={styles.heading}>Property Details</h2>
                                <label className={styles.label}>
                                    Location
                                    <select
                                    className={styles.select} 
                                    type="text"
                                    name="taskLocation"
                                    value={taskLocation}
                                    onChange= {(e) => setTaskLocation(e.target.value)}
                                    required>
                                        <option value=""></option>
                                        <option value="General">General</option>
                                        {properties.map(property => (
                                            <option key={property.id} value={property.street}>{property.street}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className={styles.label}>
                                    Title
                                    <input className={styles.input} 
                                    type="text"
                                    name="taskTitle"
                                    value={taskTitle}
                                    onChange= {(e) => setTaskTitle(e.target.value)}
                                    required />
                                </label>
                                <label className={styles.label}>
                                    Description
                                    <input className={styles.input} 
                                    type="text"
                                    name="taskDescription"
                                    value={taskDescription}
                                    onChange= {(e) => setTaskDescription(e.target.value)}
                                    required />
                                </label>
                                <label className={styles.label}>
                                    Status
                                    <select
                                    className={styles.select} 
                                    type="text"
                                    name="taskStatus"
                                    value={taskStatus}
                                    onChange= {(e) => setTaskStatus(e.target.value)}
                                    required>
                                        <option value=""></option>
                                        <option value="Pending">Pending</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </label>
                            </div>
                            <button className={styles.button}>Add Task</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AddTask;