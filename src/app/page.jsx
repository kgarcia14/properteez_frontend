import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import Cookies from 'js-cookies'

export default function Home() {
  if (Cookies.get('id')) {
    location.assign('/dashboard')
  }
  
  return (
    <main>
      <div>App Page</div>
      <h3><Link href="/signup">Signup</Link></h3>
      <h3><Link href="/login">Log in</Link></h3>
    </main>
  )
}
