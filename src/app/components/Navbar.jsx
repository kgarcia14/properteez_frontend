import Link from "next/link";

const Navbar = () => {
    return (
        <main>
            <h2>Properteez Navbar</h2>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/addProperty">Add Property</Link>
            <button>logout</button>
        </main>
    )
}

export default Navbar;