'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>Clarity</Link>
        
        <nav className={styles.nav}>
          <Link href="/therapists">Терапевти</Link>
          <Link href="/#about">Про нас</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/auth/login" className={styles.loginBtn}>Увійти</Link>
          <Link href="/therapists" className="btn-primary">Знайти терапевта</Link>
        </div>

        <button 
          className={styles.menuBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav>
            <Link href="/therapists">Терапевти</Link>
            <Link href="/#about">Про нас</Link>
            <Link href="/#faq">FAQ</Link>
            <Link href="/auth/login" className={styles.loginBtn}>Увійти</Link>
            <Link href="/therapists" className="btn-primary">Знайти терапевта</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
