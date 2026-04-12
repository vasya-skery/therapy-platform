'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Appointment, Conversation, Message, Review, TherapistProfile } from '@/lib/types'
import styles from './page.module.css'

export default function TherapistDashboard() {
  const { user, profile, signOut, loading: authLoading } = useAuth()
  const router = useRouter()
  const [therapistProfile, setTherapistProfile] = useState<TherapistProfile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'appointments' | 'messages' | 'profile'>('appointments')
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    bioUk: '',
    specialization: '',
    approaches: '',
    education: '',
    price_per_session: 0,
    experience_years: 0,
    languages: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'therapist')) {
      router.push('/dashboard/client')
    }
    if (user && profile?.role === 'therapist') {
      fetchTherapistProfile()
      fetchAppointments()
      fetchConversations()
      fetchReviews()
    }
  }, [user, authLoading, profile])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      const interval = setInterval(() => fetchMessages(selectedConversation.id), 5000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  async function fetchTherapistProfile() {
    const { data } = await supabase
      .from('therapist_profiles')
      .select('*')
      .eq('id', user?.id)
      .single()

    if (data) {
      setTherapistProfile(data)
      setProfileForm({
        bioUk: data.bioUk || '',
        specialization: data.specialization?.join(', ') || '',
        approaches: data.approaches?.join(', ') || '',
        education: data.education?.join(', ') || '',
        price_per_session: data.price_per_session || 0,
        experience_years: data.experience_years || 0,
        languages: data.languages?.join(', ') || 'Ukrainian'
      })
    }
    setLoading(false)
  }

  async function fetchAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        profiles:client_id (id, full_name, avatar_url)
      `)
      .eq('therapist_id', user?.id)
      .order('scheduled_at', { ascending: false })

    if (data) setAppointments(data)
  }

  async function fetchConversations() {
    const { data } = await supabase
      .from('conversations')
      .select(`
        *,
        profiles:client_id (id, full_name, avatar_url)
      `)
      .eq('therapist_id', user?.id)
      .order('last_message_at', { ascending: false })

    if (data) setConversations(data)
  }

  async function fetchMessages(conversationId: string) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)
  }

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (id, full_name)
      `)
      .eq('therapist_id', user?.id)
      .order('created_at', { ascending: false })

    if (data) setReviews(data)
  }

  async function updateAppointmentStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id)
    fetchAppointments()
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || !user) return

    await supabase.from('messages').insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content: newMessage.trim()
    })

    await supabase.from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', selectedConversation.id)

    setNewMessage('')
    fetchMessages(selectedConversation.id)
    fetchConversations()
  }

  async function saveProfile() {
    const { error } = await supabase
      .from('therapist_profiles')
      .update({
        bioUk: profileForm.bioUk,
        specialization: profileForm.specialization.split(',').map(s => s.trim()),
        approaches: profileForm.approaches.split(',').map(s => s.trim()),
        education: profileForm.education.split(',').map(s => s.trim()),
        price_per_session: profileForm.price_per_session,
        experience_years: profileForm.experience_years,
        languages: profileForm.languages.split(',').map(s => s.trim())
      })
      .eq('id', user?.id)

    if (!error) {
      setEditingProfile(false)
      fetchTherapistProfile()
    }
  }

  if (authLoading || !profile) return <div className={styles.loading}>Завантаження...</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Clarity</Link>
        <div className={styles.userMenu}>
          <span>{profile.full_name}</span>
          <button onClick={signOut}>Вийти</button>
        </div>
      </header>

      <main className={styles.main}>
        <h1>Кабінет терапевта</h1>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{appointments.length}</span>
            <span className={styles.statLabel}>Всього записів</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{appointments.filter(a => a.status === 'confirmed').length}</span>
            <span className={styles.statLabel}>Майбутні</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>★ {therapistProfile?.rating.toFixed(1) || '0.0'}</span>
            <span className={styles.statLabel}>Рейтинг</span>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'appointments' ? styles.active : ''}`} onClick={() => setActiveTab('appointments')}>
            📅 Записи
          </button>
          <button className={`${styles.tab} ${activeTab === 'messages' ? styles.active : ''}`} onClick={() => setActiveTab('messages')}>
            💬 Повідомлення
          </button>
          <button className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`} onClick={() => setActiveTab('profile')}>
            👤 Профіль
          </button>
        </div>

        {activeTab === 'appointments' && (
          <div className={styles.section}>
            {loading ? (
              <p>Завантаження...</p>
            ) : appointments.length === 0 ? (
              <p className={styles.empty}>Немає записів</p>
            ) : (
              <div className={styles.appointmentsList}>
                {appointments.map((apt) => (
                  <div key={apt.id} className={styles.appointmentCard}>
                    <div className={styles.appointmentInfo}>
                      <h3>{apt.profiles?.full_name || 'Клієнт'}</h3>
                      <p>{new Date(apt.scheduled_at).toLocaleString('uk-UA')}</p>
                      <span className={`${styles.status} ${styles[apt.status]}`}>{apt.status}</span>
                    </div>
                    <div className={styles.appointmentActions}>
                      {apt.status === 'pending' && (
                        <>
                          <button onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}>Підтвердити</button>
                          <button onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}>Скасувати</button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <button onClick={() => updateAppointmentStatus(apt.id, 'completed')}>Завершити</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className={styles.chatSection}>
            <div className={styles.conversationsList}>
              {conversations.length === 0 ? (
                <p className={styles.noMessages}>Немає чатів</p>
              ) : (
                conversations.map((conv) => (
                  <button key={conv.id} className={`${styles.conversationItem} ${selectedConversation?.id === conv.id ? styles.active : ''}`} onClick={() => setSelectedConversation(conv)}>
                    <div className={styles.convAvatar}>
                      <span>{(conv.profiles?.full_name || 'C').charAt(0)}</span>
                    </div>
                    <span>{conv.profiles?.full_name || 'Чат'}</span>
                  </button>
                ))
              )}
            </div>

            <div className={styles.chatWindow}>
              {selectedConversation ? (
                <>
                  <div className={styles.chatHeader}>
                    <span>{selectedConversation.profiles?.full_name}</span>
                  </div>
                  <div className={styles.messagesList}>
                    {messages.map((msg) => (
                      <div key={msg.id} className={`${styles.message} ${msg.sender_id === user?.id ? styles.sent : styles.received}`}>
                        <p>{msg.content}</p>
                        <span>{new Date(msg.created_at).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendMessage} className={styles.chatInput}>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Введіть повідомлення..." />
                    <button type="submit">Надіслати</button>
                  </form>
                </>
              ) : (
                <div className={styles.noChat}><p>Виберіть чат</p></div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className={styles.section}>
            {editingProfile ? (
              <div className={styles.profileForm}>
                <div className={styles.field}>
                  <label>Біо (українською)</label>
                  <textarea value={profileForm.bioUk} onChange={(e) => setProfileForm({ ...profileForm, bioUk: e.target.value })} rows={4} />
                </div>
                <div className={styles.field}>
                  <label>Спеціалізація (через кому)</label>
                  <input type="text" value={profileForm.specialization} onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>Підходи (через кому)</label>
                  <input type="text" value={profileForm.approaches} onChange={(e) => setProfileForm({ ...profileForm, approaches: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>Освіта (через кому)</label>
                  <input type="text" value={profileForm.education} onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Ціна за сесію (UAH)</label>
                    <input type="number" value={profileForm.price_per_session} onChange={(e) => setProfileForm({ ...profileForm, price_per_session: Number(e.target.value) })} />
                  </div>
                  <div className={styles.field}>
                    <label>Років досвіду</label>
                    <input type="number" value={profileForm.experience_years} onChange={(e) => setProfileForm({ ...profileForm, experience_years: Number(e.target.value) })} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Мови (через кому)</label>
                  <input type="text" value={profileForm.languages} onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })} />
                </div>
                <div className={styles.formActions}>
                  <button onClick={() => setEditingProfile(false)} className={styles.cancelBtn}>Скасувати</button>
                  <button onClick={saveProfile} className={styles.saveBtn}>Зберегти</button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.profileHeader}>
                  <div className={styles.avatar}>
                    <span>{profile.full_name?.charAt(0) || 'T'}</span>
                  </div>
                  <div>
                    <h2>{profile.full_name}</h2>
                    <p>{profile.email}</p>
                    {therapistProfile?.is_verified && <span className={styles.verified}>✓ Верифіковано</span>}
                  </div>
                  <button onClick={() => setEditingProfile(true)} className={styles.editBtn}>Редагувати</button>
                </div>
                <div className={styles.profileGrid}>
                  <div className={styles.profileItem}>
                    <label>Спеціалізація</label>
                    <p>{therapistProfile?.specialization?.join(', ') || '-'}</p>
                  </div>
                  <div className={styles.profileItem}>
                    <label>Підходи</label>
                    <p>{therapistProfile?.approaches?.join(', ') || '-'}</p>
                  </div>
                  <div className={styles.profileItem}>
                    <label>Ціна</label>
                    <p>{therapistProfile?.price_per_session} {therapistProfile?.currency}</p>
                  </div>
                  <div className={styles.profileItem}>
                    <label>Досвід</label>
                    <p>{therapistProfile?.experience_years} років</p>
                  </div>
                </div>
                <div className={styles.profileBio}>
                  <label>Біо</label>
                  <p>{therapistProfile?.bioUk || 'Не заповнено'}</p>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'appointments' && reviews.length > 0 && (
          <div className={styles.reviews}>
            <h2>Відгуки</h2>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <span>{review.profiles?.full_name}</span>
                  <span>★ {review.rating}</span>
                </div>
                <p>{review.commentUk}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
