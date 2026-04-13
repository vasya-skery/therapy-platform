'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { TherapistWithProfile, Review } from '@/lib/types'
import styles from './page.module.css'

export default function TherapistPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [therapist, setTherapist] = useState<TherapistWithProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [bookingType, setBookingType] = useState<'video' | 'chat' | 'phone'>('video')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchTherapist()
      fetchReviews()
    }
  }, [params.id])

  async function fetchTherapist() {
    const { data, error } = await supabase
      .from('therapist_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .eq('id', params.id)
      .single()

    if (data) setTherapist(data)
    setLoading(false)
  }

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (id, full_name, avatar_url)
      `)
      .eq('therapist_id', params.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) setReviews(data)
  }

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      router.push('/auth/login')
      return
    }

    setBookingLoading(true)
    const scheduledAt = new Date(`${bookingDate}T${bookingTime}`).toISOString()

    const { error } = await supabase.from('appointments').insert({
      client_id: user.id,
      therapist_id: params.id,
      scheduled_at: scheduledAt,
      type: bookingType,
      duration: therapist?.session_duration || 50,
      price: therapist?.price_per_session || 0,
      currency: therapist?.currency || 'UAH',
      status: 'pending'
    })

    if (!error) {
      setBookingSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/client')
      }, 2000)
    }
    setBookingLoading(false)
  }

  if (loading) return <div className={styles.loading}>Завантаження...</div>
  if (!therapist) return <div className={styles.error}>Терапевта не знайдено</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/therapists" className={styles.back}>← Назад</Link>
        <Link href="/" className={styles.logo}>OpenYourMind</Link>
      </header>

      <main className={styles.main}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            {therapist.profiles?.avatar_url ? (
              <img src={therapist.profiles.avatar_url} alt={therapist.profiles.full_name || ''} />
            ) : (
              <span>{therapist.profiles?.full_name?.charAt(0) || 'T'}</span>
            )}
          </div>

          <div className={styles.info}>
            <div className={styles.nameRow}>
              <h1>{therapist.profiles?.full_name || 'Терапевт'}</h1>
              {therapist.is_verified && <span className={styles.verified}>✓ Верифіковано</span>}
            </div>
            <p className={styles.specialization}>{therapist.specialization?.join(', ')}</p>
            
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>★ {therapist.rating.toFixed(1)}</span>
                <span className={styles.statLabel}>{therapist.review_count} відгуків</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{therapist.experience_years} років</span>
                <span className={styles.statLabel}>досвіду</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{therapist.price_per_session} {therapist.currency}</span>
                <span className={styles.statLabel}>за сесію</span>
              </div>
            </div>

            <p className={styles.bio}>{therapist.bioEn || therapist.bioUk}</p>

            <div className={styles.section}>
              <h3>Підходи</h3>
              <div className={styles.tags}>
                {therapist.approaches?.map((a, i) => (
                  <span key={i} className={styles.tag}>{a}</span>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3>Освіта</h3>
              <ul className={styles.list}>
                {therapist.education?.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h3>Мови</h3>
              <p>{therapist.languages?.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <h3>Записатися на сесію</h3>
            <p className={styles.price}>{therapist.price_per_session} {therapist.currency}</p>
            <p className={styles.duration}>{therapist.session_duration} хвилин</p>

            {!bookingSuccess ? (
              <form onSubmit={handleBooking} className={styles.bookingForm}>
                <div className={styles.field}>
                  <label>Тип сесії</label>
                  <div className={styles.typeButtons}>
                    {(['video', 'chat', 'phone'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`${styles.typeBtn} ${bookingType === type ? styles.active : ''}`}
                        onClick={() => setBookingType(type)}
                      >
                        {type === 'video' && '📹'}
                        {type === 'chat' && '💬'}
                        {type === 'phone' && '📞'}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Дата</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Час</label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={styles.bookBtn} disabled={bookingLoading}>
                  {bookingLoading ? 'Бронювання...' : 'Записатися'}
                </button>
              </form>
            ) : (
              <div className={styles.success}>
                <span>✓</span>
                <p>Запис успішно створено!</p>
                <p>Перенаправляємо вас...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <section className={styles.reviews}>
        <h2>Відгуки</h2>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>Поки що немає відгуків</p>
        ) : (
          <div className={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.review}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewerName}>{review.profiles?.full_name}</span>
                  <span className={styles.reviewRating}>★ {review.rating}</span>
                </div>
                <p>{review.commentUk}</p>
                <span className={styles.reviewDate}>
                  {new Date(review.created_at).toLocaleDateString('uk-UA')}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
