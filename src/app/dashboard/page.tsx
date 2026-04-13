'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth/login')
      } else {
        router.replace('/dashboard/client')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <p>User: {user?.email}</p>
      <p>Profile: {JSON.stringify(profile)}</p>
      <p>Error: {error}</p>
      <button onClick={() => router.reload()}>Reload</button>
    </div>
  )
}
