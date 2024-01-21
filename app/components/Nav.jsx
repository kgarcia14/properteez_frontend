'use client'

import Cookies from 'js-cookie';
import styles from '../../styles/Nav.module.css'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle,NavbarMenu, NavbarMenuItem} from "@nextui-org/navbar";
import {Link} from "@nextui-org/link";
import {Button} from "@nextui-org/button";
import { FaPlus } from "react-icons/fa6";
import Logo from './Logo';
import { useState } from "react";

const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoutBtn, setLogoutBtn] = useState(true);
    const [confirmLogoutBtn, setConfirmLogoutBtn] = useState(false);

    
    const handleLogout = () => {
        setLogoutBtn(false)
        setConfirmLogoutBtn(true)
    }

    const cancelLogout = () => {
        setLogoutBtn(true)
        setConfirmLogoutBtn(false)
    }

    const handleConfirmLogout = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(process.env.NODE_ENV === 'development' ? 'http://localhost:4444/logout' : 'https://properteezapi.kurtisgarcia.dev/logout', {
                method: 'DELETE',
                credentials: 'include',
            });
            console.log(res);
            
            location.assign('/');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Navbar className={styles.navbar} onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent className={styles.navbarWrapper}>
                <NavbarBrand className="sm:hidden">
                    <Logo className={styles.logo} />
                </NavbarBrand>
                <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="sm:hidden" onClick={cancelLogout}/>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <div className={styles.desktopNavbarContent}>
                    <Logo className={styles.logo} />
                    <Link className={styles.addPropertyBtn} href="/addProperty"><FaPlus className={styles.plusIcon} />Add Property</Link>
                    <Link className={styles.mobileNavLink} href="/dashboard">Dashboard</Link>
                    <Link className={styles.mobileNavLink} href="/properties">Properties</Link>
                    <Link className={styles.mobileNavLink} href="/tasks">Tasks</Link>
                    <Button className={logoutBtn ? styles.logoutBtn : styles.hidden} onClick={handleLogout}><img className={styles.logoutIcon} src="/logout_icon.svg" alt="" />Log out</Button>
                    <Button className={confirmLogoutBtn ? styles.confirmLogoutBtn : styles.hidden} onClick={handleConfirmLogout}>Confirm Logout</Button>
                </div>
            </NavbarContent>

            <NavbarMenu className={styles.navbarMenu}>
                <Link className={styles.addPropertyBtn} href="/addProperty"><FaPlus className={styles.plusIcon} />Add Property</Link>
                <Link className={styles.mobileNavLink} href="/dashboard">Dashboard</Link>
                <Link className={styles.mobileNavLink} href="/properties">Properties</Link>
                <Link className={styles.mobileNavLink} href="/tasks">Tasks</Link>
                <Button className={logoutBtn ? styles.logoutBtn : styles.hidden} onClick={handleLogout}><img className={styles.logoutIcon} src="/logout_icon.svg" alt="" />Log out</Button>
                <Button className={confirmLogoutBtn ? styles.confirmLogoutBtn : styles.hidden} onClick={handleConfirmLogout}>Confirm Logout</Button>
            </NavbarMenu>
        </Navbar>
    )
}

export default Nav;