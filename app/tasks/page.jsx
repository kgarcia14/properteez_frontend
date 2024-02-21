'use client'

import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import {useDisclosure} from "@nextui-org/react";
import Nav from "../components/Nav";
import Loading from '../components/Loading';
import Link from 'next/link';
import styles from '../../styles/tasks.module.css';
import { FaCheck } from "react-icons/fa6";

const Tasks = () => {
    const [userExists, setUserExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        const getAllTasks = async () => {
            if (userExists) {
                const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:3333/tasks` : `https://properteezapi.kurtisgarcia.dev/tasks`, {
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

                        const retryRes = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:3333/tasks' : 'https://properteezapi.kurtisgarcia.dev/tasks', {
                        credentials: 'include',
                        });
                        console.log(retryRes);
                        const results = await retryRes.json();
                        console.log(results);
                        
                        setTasks(results.data.tasks);
                        setLoading(false);
                    }
                } else {
                    const results = await res.json();
                    console.log(results)

                    setTasks(results.data.tasks);
                    setLoading(false);
                }
            }
        }
        
        getAllTasks();
    }, [userExists]);

    if (loading) {
        const loadingString = 'Loading Content...'
        return <Loading loadingString={loadingString} />
    }

    return (
        <main className={styles.container}>
            <div className={styles.wrapper}>
                <Nav />
                <div className={styles.contentContainer}>
                    <div className={styles.content}>
                    <ul className={styles.ul}>
                        {tasks.map(task => (
                            <li key={task.id}>
                                <div className={styles.taskContainer}>
                                    <div className={styles.checkboxWrapper}>
                                        <FaCheck className={task.complete ? styles.checkIcon : styles.hidden}/>
                                    </div>
                                    <div className={styles.taskInfo}>
                                        <p>{task.title}</p>
                                        <p>{task.street}</p>
                                        <p>{task.description}</p>
                                    </div>
                                    <div>
                                        <p>{task.status}</p>
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
 
export default Tasks;