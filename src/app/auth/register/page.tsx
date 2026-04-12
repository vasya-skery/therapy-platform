'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import styles from '../login/page.module.css'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'client' | 'therapist'>('client')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signUp(email, password, fullName, role)
      setEmailSent(true)
    } catch (err: any) {
      setError(err.message || 'Registration error')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Check your email</h1>
          <p className={styles.subtitle}>
            We sent a confirmation link to <strong>{email}</strong>.
            <br />
            Please click the link to verify your email.
          </p>
          <Link href="/auth/login" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block', textAlign: 'center' }}>
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Registration</h1>
        <p className={styles.subtitle}>Create your account</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.field}>
            <label>Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>

          <div className={styles.field}>
            <label>I want to use the platform as:</label>
            <div className={styles.roleSelect}>
              <button
                type="button"
                className={`${styles.roleButton} ${role === 'client' ? styles.active : ''}`}
                onClick={() => setRole('client')}
              >
                <span className={styles.roleIcon}>🧑‍💼</span>
                <span>Client</span>
                <span className={styles.roleDesc}>Looking for a therapist</span>
              </button>
              <button
                type="button"
                className={`${styles.roleButton} ${role === 'therapist' ? styles.active : ''}`}
                onClick={() => setRole('therapist')}
              >
                <span className={styles.roleIcon}>🧠</span>
                <span>Therapist</span>
                <span className={styles.roleDesc}>Provide therapy services</span>
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link href="/auth/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
