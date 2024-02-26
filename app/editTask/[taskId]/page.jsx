'use client'

import styles from '../../../styles/editTask.module.css'
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Nav from '../../components/Nav';
import Loading from '../../components/Loading';

const EditTask = ({params}) => {
    const [loading, setLoading] = useState(true);
    const [userExists, setUserExists] = useState(false);
    const [properties, setProperties] = useState(null);
    const [task, setTask] = useState(null);
    const [taskLocation, setTaskLocation] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [taskComplete, setTaskComplete] = useState(false);

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
            const getTaskById = async () => {
                const res = await fetch(process.env.NODE_ENV === 'development' ? 
                `http://localhost:3333/tasks/taskDetails/${params.taskId}` : `https://properteezapi.kurtisgarcia.dev/tasks/taskDetails/${params.taskId}`, {
                    credentials: 'include',
                });
        
                const results = await res.json();
                console.log(results.data.task);
                const taskDetails = results.data.task;

                if (task === undefined) {
                    location.assign('/dashboard')
                } else {
                    setTask(taskDetails);
                }
            }
    
            getTaskById();
        }
    }, [userExists]);

    useEffect(() => {
        if (task) {
            console.log(task)
    
            setTaskLocation(task.location);
            setTaskTitle(task.title);
            setTaskDescription(task.description);
            setTaskStatus(task.status);
            setTaskComplete(task.complete);
    
            setLoading(false)
        }
    }, [task])

    const handleEditTask = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/validateUser` : `https://properteezapi.kurtisgarcia.dev/validateUser`, {
            credentials: 'include',
        });

        if (res.status === 200) {
            try {
                const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:4444/tasks/${params.taskId}` : `https://properteezapi.kurtisgarcia.dev/tasks/${params.taskId}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'task_location': taskLocation,
                        'task_title': taskTitle,
                        'task_description': taskDescription,
                        'task_status': taskStatus,
                        'task_complete': taskComplete
                    }),
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

                        console.log(logoutRes)

                        Cookies.remove('email')
                        location.assign('/')
                    } else {
                        const refreshResults = await refreshTokenRes.json();
                        console.log(refreshResults);

                        const retryRes = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:4444/tasks/${params.taskId}` : `https://properteezapi.kurtisgarcia.dev/tasks/${params.taskId}`, {
                            method: 'PUT',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                'task_location': taskLocation,
                                'task_title': taskTitle,
                                'task_description': taskDescription,
                                'task_status': taskStatus,
                                'task_complete': taskComplete
                            }),
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
                        <form className={styles.form} onSubmit={handleEditTask}>
                            <div className={styles.taskDetailsWrapper}>
                                <h2 className={styles.heading}>Task Details</h2>
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
                            <button className={styles.button}>Confirm Edit</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default EditTask;