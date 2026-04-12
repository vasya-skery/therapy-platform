'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Appointment, Conversation, Message } from '@/lib/types'
import styles from './page.module.css'

export default function ClientDashboard() {
  const { user, profile, signOut, loading: authLoading } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'appointments' | 'messages'>('appointments')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
    if (user) {
      fetchAppointments()
      fetchConversations()
    }
  }, [user, authLoading])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      const interval = setInterval(() => fetchMessages(selectedConversation.id), 5000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  async function fetchAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        profiles:therapist_id (id, full_name, avatar_url)
      `)
      .eq('client_id', user?.id)
      .order('scheduled_at', { ascending: false })

    if (data) setAppointments(data)
    setLoading(false)
  }

  async function fetchConversations() {
    const { data } = await supabase
      .from('conversations')
      .select(`
        *,
        profiles:therapist_id (id, full_name, avatar_url)
      `)
      .or(`client_id.eq.${user?.id},therapist_id.eq.${user?.id}`)
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

  async function updateAppointmentStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id)
    fetchAppointments()
  }

  if (authLoading || !profile) return <div className={styles.loading}>Завантаження...</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>OpenYourMind</Link>
        <div className={styles.userMenu}>
          <span>{profile.full_name}</span>
          <button onClick={signOut}>Вийти</button>
        </div>
      </header>

      <main className={styles.main}>
        <h1>Кабінет клієнта</h1>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'appointments' ? styles.active : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            📅 Записи
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'messages' ? styles.active : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            💬 Повідомлення
          </button>
        </div>

        {activeTab === 'appointments' && (
          <div className={styles.section}>
            {loading ? (
              <p>Завантаження...</p>
            ) : appointments.length === 0 ? (
              <div className={styles.empty}>
                <p>У вас поки що немає записів</p>
                <Link href="/therapists" className={styles.link}>Знайти терапевта</Link>
              </div>
            ) : (
              <div className={styles.appointmentsList}>
                {appointments.map((apt) => (
                  <div key={apt.id} className={styles.appointmentCard}>
                    <div className={styles.appointmentInfo}>
                      <h3>{apt.profiles?.full_name || 'Терапевт'}</h3>
                      <p>{new Date(apt.scheduled_at).toLocaleString('uk-UA')}</p>
                      <span className={`${styles.status} ${styles[apt.status]}`}>{apt.status}</span>
                    </div>
                    <div className={styles.appointmentActions}>
                      {apt.status === 'pending' && (
                        <>
                          <button onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}>
                            Підтвердити
                          </button>
                          <button onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}>
                            Скасувати
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <Link href={`/therapists/${apt.therapist_id}`}>Перейти до сесії</Link>
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
                <p className={styles.noMessages}>Немає активних чатів</p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    className={`${styles.conversationItem} ${selectedConversation?.id === conv.id ? styles.active : ''}`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className={styles.convAvatar}>
                      {conv.profiles?.avatar_url ? (
                        <img src={conv.profiles.avatar_url} alt="" />
                      ) : (
                        <span>{(conv.profiles?.full_name || 'T').charAt(0)}</span>
                      )}
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
                      <div
                        key={msg.id}
                        className={`${styles.message} ${msg.sender_id === user?.id ? styles.sent : styles.received}`}
                      >
                        <p>{msg.content}</p>
                        <span>{new Date(msg.created_at).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendMessage} className={styles.chatInput}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Введіть повідомлення..."
                    />
                    <button type="submit">Надіслати</button>
                  </form>
                </>
              ) : (
                <div className={styles.noChat}>
                  <p>Виберіть чат зліва</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
