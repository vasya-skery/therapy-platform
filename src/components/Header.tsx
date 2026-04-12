'use client'

import { useState } from 'react'
import styles from './Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>Clarity</a>
        
        <nav className={styles.nav}>
          <a href="/about">About</a>
          <a href="/approaches">Approaches</a>
          <a href="/for-therapists">For Therapists</a>
          <a href="/faq">FAQ</a>
        </nav>

        <div className={styles.actions}>
          <a href="/login" className={styles.loginBtn}>Log in</a>
          <button className="btn-primary">Find a therapist</button>
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
            <a href="/about">About</a>
            <a href="/approaches">Approaches</a>
            <a href="/for-therapists">For Therapists</a>
            <a href="/faq">FAQ</a>
            <a href="/login" className={styles.loginBtn}>Log in</a>
            <button className="btn-primary">Find a therapist</button>
          </nav>
        </div>
      )}
    </header>
  )
}
