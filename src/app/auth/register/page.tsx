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
  const { signUp } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signUp(email, password, fullName, role)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Помилка реєстрації')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Реєстрація</h1>
        <p className={styles.subtitle}>Створіть свій акаунт</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.field}>
            <label>Повне ім&apos;я</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Олександр Петренко"
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
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Мінімум 6 символів"
              minLength={6}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Як ви плануєте використовувати платформу?</label>
            <div className={styles.roleSelect}>
              <button
                type="button"
                className={`${styles.roleButton} ${role === 'client' ? styles.active : ''}`}
                onClick={() => setRole('client')}
              >
                <span className={styles.roleIcon}>🧑‍💼</span>
                <span>Клієнт</span>
                <span className={styles.roleDesc}>Шукаю терапевта</span>
              </button>
              <button
                type="button"
                className={`${styles.roleButton} ${role === 'therapist' ? styles.active : ''}`}
                onClick={() => setRole('therapist')}
              >
                <span className={styles.roleIcon}>🧠</span>
                <span>Терапевт</span>
                <span className={styles.roleDesc}>Надаю послуги</span>
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Завантаження...' : 'Зареєструватися'}
          </button>
        </form>

        <p className={styles.footer}>
          Вже маєте акаунт? <Link href="/auth/login">Увійти</Link>
        </p>
      </div>
    </div>
  )
}
