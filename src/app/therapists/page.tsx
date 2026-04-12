'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { TherapistWithProfile, Topic } from '@/lib/types'
import styles from './page.module.css'

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<TherapistWithProfile[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchTopics()
    fetchTherapists()
  }, [])

  async function fetchTopics() {
    const { data } = await supabase.from('topics').select('*').order('nameUk')
    if (data) setTopics(data)
  }

  async function fetchTherapists() {
    let query = supabase
      .from('therapist_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .eq('is_available', true)

    if (search) {
      query = query.textSearch('bioUk', search)
    }

    const { data, error } = await query.order('rating', { ascending: false })
    
    if (data) {
      let filtered = data as TherapistWithProfile[]
      if (selectedTopic) {
        filtered = filtered.filter(t => t.specialization?.includes(selectedTopic))
      }
      setTherapists(filtered)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTherapists()
  }, [search, selectedTopic])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Clarity</Link>
        <nav className={styles.nav}>
          <Link href="/therapists">Терапевти</Link>
          <Link href="/auth/login">Увійти</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Знайдіть свого терапевта</h1>
          <p>Кваліфіковані спеціалісти готові допомогти</p>
        </div>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Пошук за іменем або спеціалізацією..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />

          <div className={styles.topics}>
            <button
              className={`${styles.topicBtn} ${!selectedTopic ? styles.active : ''}`}
              onClick={() => setSelectedTopic(null)}
            >
              Усі
            </button>
            {topics.map((topic) => (
              <button
                key={topic.id}
                className={`${styles.topicBtn} ${selectedTopic === topic.slug ? styles.active : ''}`}
                onClick={() => setSelectedTopic(topic.slug)}
              >
                {topic.nameUk}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Завантаження...</div>
        ) : therapists.length === 0 ? (
          <div className={styles.empty}>
            <p>Терапевтів не знайдено</p>
            <button onClick={() => { setSearch(''); setSelectedTopic(null) }}>
              Скинути фільтри
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {therapists.map((therapist) => (
              <Link 
                key={therapist.id} 
                href={`/therapists/${therapist.id}`}
                className={styles.card}
              >
                <div className={styles.avatar}>
                  {therapist.profiles?.avatar_url ? (
                    <img src={therapist.profiles.avatar_url} alt={therapist.profiles.full_name || ''} />
                  ) : (
                    <span>{therapist.profiles?.full_name?.charAt(0) || 'T'}</span>
                  )}
                </div>
                <div className={styles.info}>
                  <h3>{therapist.profiles?.full_name || 'Терапевт'}</h3>
                  {therapist.is_verified && <span className={styles.verified}>✓ Верифіковано</span>}
                  <p className={styles.specs}>
                    {therapist.specialization?.slice(0, 3).join(', ')}
                  </p>
                  <p className={styles.bio}>
                    {therapist.bioUk?.slice(0, 100)}...
                  </p>
                  <div className={styles.meta}>
                    <span className={styles.rating}>★ {therapist.rating.toFixed(1)}</span>
                    <span className={styles.price}>
                      {therapist.price_per_session} {therapist.currency}/сесія
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
