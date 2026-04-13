'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth/login')
      } else if (profile?.role === 'therapist') {
        router.replace('/dashboard/therapist')
      } else {
        router.replace('/dashboard/client')
      }
    }
  }, [user, profile, loading, router])

  return (
    <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
      Loading...
    </div>
  )
}
