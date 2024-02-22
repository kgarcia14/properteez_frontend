'use client'

import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import {useDisclosure} from "@nextui-org/react";
import Nav from "../components/Nav";
import Loading from '../components/Loading';
import Link from 'next/link';
import styles from '../../styles/tasks.module.css';
import { FaCheck } from "react-icons/fa6";
import { MdOutlineAddTask } from "react-icons/md";

const Tasks = () => {
    const [userExists, setUserExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [urgentTasks, setUrgentTasks] = useState([]);
    const [completeTasks, setCompleteTasks] = useState([]);
    const [movedToCompleted, setMovedToCompleted] = useState(false);
    const [movedFromCompleted, setMovedFromCompleted] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedTask, setSelectedTask] = useState(null);
    const [statusAll, setStatusAll] = useState(true);
    const [statusPending, setStatusPending] = useState(false);
    const [statusUrgent, setStatusUrgent] = useState(false);
    const [statusComplete, setStatusComplete] = useState(false);

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

    // task status filter functions
    let pendingTasksArr = [];
    let urgentTasksArr = [];
    let completeTasksArr = [];
    const getAlltasks = () => {
        setStatusAll(true);
        setStatusPending(false);
        setStatusUrgent(false);
        setStatusComplete(false);
    }
    const getPendingTasks = () => {
         for (let i = 0; i <= tasks.length - 1; i++) {
            if (tasks[i].status === 'Pending' && !tasks[i].complete) {
                pendingTasksArr.push(tasks[i]);
                console.log(pendingTasksArr);
                setPendingTasks(pendingTasksArr);
                console.log(pendingTasks)
            }
         }
         setStatusPending(true);
         setStatusAll(false);
         setStatusUrgent(false);
         setStatusComplete(false);
    }
    const getUrgentTasks = () => {
        for (let i = 0; i <= tasks.length - 1; i++) {
            if (tasks[i].status === 'Urgent' && !tasks[i].complete) {
                urgentTasksArr.push(tasks[i]);
                setUrgentTasks(urgentTasksArr);
                console.log(urgentTasks);
            }
        }
        setStatusUrgent(true);
        setStatusPending(false);
        setStatusAll(false);
        setStatusComplete(false);
    }
    const getCompleteTasks = () => {
        for (let i = 0; i <= tasks.length - 1; i++) {
            if (tasks[i].complete) {
                completeTasksArr.push(tasks[i]);
                setCompleteTasks(completeTasksArr);
            }
        }
        setStatusComplete(true);
        setStatusAll(false);
        setStatusPending(false);
        setStatusUrgent(false);
    }

    const markTaskComplete = async (task) => {
        setMovedToCompleted(true);
        setMovedFromCompleted(false);
        console.log(task);

        const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:4444/markTaskComplete/${task.id}` : `https://properteezapi.kurtisgarcia.dev/markTaskComplete/${task.id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        const results = await res.json();
        const updatedTask = results.data.task[0]

        // filtering the tasks to update tasks on frontend with updated tasks
        const updatedTasks = tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
        const updatedPendingTasks = pendingTasks.filter(task => task.id !== updatedTask.id);
        const updatedUrgentTasks = urgentTasks.filter(task => task.id !== updatedTask.id);
        const updatedCompleteTasks = completeTasks.filter(task => task.id !== updatedTask.id)

        setTasks(updatedTasks);
        setPendingTasks(updatedPendingTasks);
        setUrgentTasks(updatedUrgentTasks);
        setCompleteTasks(updatedCompleteTasks);
        setSelectedTask(task)

        setTimeout(() => {
            setMovedToCompleted(false);
        }, 1000)
    }

    const markTaskIncomplete = async (task) => {
        setMovedFromCompleted(true);
        setMovedToCompleted(false);
        console.log(task);

        const res = await fetch(process.env.NODE_ENV === 'development' ? `http://localhost:4444/markTaskIncomplete/${task.id}` : `https://properteezapi.kurtisgarcia.dev/markTaskIncomplete/${task.id}`, {
            method: 'PUT',
            credentials: 'include',
        });

        const results = await res.json();
        const updatedTask = results.data.task[0]

        // filtering the tasks to update tasks on frontend with updated tasks
        const updatedTasks = tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
        const updatedPendingTasks = pendingTasks.filter(task => task.id !== updatedTask.id);
        const updatedUrgentTasks = urgentTasks.filter(task => task.id !== updatedTask.id);
        const updatedCompleteTasks = completeTasks.filter(task => task.id !== updatedTask.id)

        setTasks(updatedTasks);
        setPendingTasks(updatedPendingTasks);
        setUrgentTasks(updatedUrgentTasks);
        setCompleteTasks(updatedCompleteTasks);
        setSelectedTask(task)

        setTimeout(() => {
            setMovedFromCompleted(false);
        }, 1000)
    }


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
                        <div className={styles.tasksAndAddTaskWrapper}> 
                            <h2 className={styles.tasks}>Tasks <span className={styles.tasksAmount}>({(statusPending ? pendingTasks : statusUrgent ? urgentTasks : statusComplete ? completeTasks : tasks).length} Tasks)</span></h2>
                        </div>
                        <div className={styles.taskStatusFilterContainer}> 
                            <ul className={styles.taskStatusFilterWrapper}>
                                <li className={`${styles.taskStatusFilterItem} ${statusAll ? styles.active : ''}`} onClick={getAlltasks}>All</li>
                                <li className={`${styles.taskStatusFilterItem} ${statusPending ? styles.active : ''}`} onClick={getPendingTasks}>Pending</li>
                                <li className={`${styles.taskStatusFilterItem} ${statusUrgent ? styles.active : ''}`} onClick={getUrgentTasks}>Urgent</li>
                                <li className={`${styles.taskStatusFilterItem} ${statusComplete ? styles.active : ''}`} onClick={getCompleteTasks}>Complete</li>
                            </ul>
                            <Link className={styles.addTaskIcon} href='/addTask'><MdOutlineAddTask /></Link>
                            <Link className={styles.addTaskButton} href='/addTask'><span className={styles.plus}>+</span> Add Task</Link>
                        </div>
                        <div className={movedToCompleted ? styles.movedTask : styles.hidden}>Moved To Completed!!!</div>
                        <div className={movedFromCompleted ? styles.movedTask : styles.hidden}>Moved From Completed...</div>
                        <ul className={styles.ul}>
                            {(statusPending ? pendingTasks : statusUrgent ? urgentTasks : statusComplete ? completeTasks : tasks).map(task => (
                                <li key={task.id}>
                                    <div className={styles.taskContainer}>
                                        <div className={styles.taskContent}>
                                            <div className={styles.checkboxWrapper} onClick={() => task.complete ? markTaskIncomplete(task) : markTaskComplete(task)}>
                                                <FaCheck className={task.complete ? styles.checkIcon : styles.hidden}/>
                                            </div>
                                            <div className={styles.taskDetailsWrapper}>
                                                <div className={styles.titleStreetDescriptionWrapper}>
                                                    <p className={styles.title}>{task.title}</p>
                                                    <p className={styles.street}>{task.street}</p>
                                                    <p className={styles.description}>{task.description}</p>
                                                </div>
                                                <div>
                                                    <p className={task.status === 'Urgent' && !task.complete ? `${styles.urgentStatus}`
                                                        : task.status === 'Pending' && !task.complete ? `${styles.pendingStatus}` 
                                                        : `${styles.completeStatus}`}>
                                                        {task.status !== '' && !task.complete ? task.status : 'Complete'}
                                                    </p>
                                                </div>
                                            </div>
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