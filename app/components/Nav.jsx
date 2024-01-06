'use client'
import styles from '../../styles/Nav.module.css'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle,NavbarMenu, NavbarMenuItem} from "@nextui-org/navbar";
import {Link} from "@nextui-org/link";
import {Button} from "@nextui-org/button";
import Logo from './Logo';
import { useState } from "react";

const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        "addProperty"
    ];

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="sm:hidden"
                />
                <NavbarBrand>
                    <Logo className={styles.logo} />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                <Link color="foreground" href="/addProperty">
                    Add Property
                </Link>
                <Link color="foreground" href="#">
                    Features
                </Link>
                </NavbarItem>
                <NavbarItem isActive>
                <Link href="#" aria-current="page">
                    Customers
                </Link>
                </NavbarItem>
                <NavbarItem>
                <Link color="foreground" href="#">
                    Integrations
                </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                    <Link
                    color={
                        index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                    }
                    className="w-full"
                    href={'/' + item}
                    size="lg"
                    >
                    {item}
                    </Link>
                </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    )
}

export default Nav;