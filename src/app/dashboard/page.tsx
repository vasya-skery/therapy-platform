'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === 'therapist') {
        router.replace('/dashboard/therapist')
      } else {
        router.replace('/dashboard/client')
      }
    } else if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [user, profile, loading, router])

  return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      Завантаження...
    </div>
  )
}
