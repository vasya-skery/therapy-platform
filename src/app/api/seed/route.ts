import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const testPassword = 'test123456'

  const therapists = [
    { email: 'sarah@therapist.com', name: 'Dr. Sarah Johnson', specialization: ['anxiety', 'depression'], experience: 10, price: 80 },
    { email: 'michael@therapist.com', name: 'Dr. Michael Chen', specialization: ['trauma', 'PTSD'], experience: 15, price: 100 },
    { email: 'emma@therapist.com', name: 'Dr. Emma Williams', specialization: ['relationships', 'family'], experience: 8, price: 70 },
    { email: 'david@therapist.com', name: 'Dr. David Brown', specialization: ['stress', 'work'], experience: 12, price: 90 },
    { email: 'lisa@therapist.com', name: 'Dr. Lisa Martinez', specialization: ['anxiety', 'depression'], experience: 6, price: 60 },
  ]

  const topics = [
    { nameUk: 'Тривожність', nameEn: 'Anxiety', slug: 'anxiety' },
    { nameUk: 'Депресія', nameEn: 'Depression', slug: 'depression' },
    { nameUk: 'Стресс', nameEn: 'Stress', slug: 'stress' },
    { nameUk: 'Травма', nameEn: 'Trauma', slug: 'trauma' },
    { nameUk: 'Відносини', nameEn: 'Relationships', slug: 'relationships' },
    { nameUk: 'Сімʼя', nameEn: 'Family', slug: 'family' },
    { nameUk: 'Карʼєра', nameEn: 'Career', slug: 'career' },
    { nameUk: 'Самооцінка', nameEn: 'Self-esteem', slug: 'self-esteem' },
  ]

  try {
    for (const t of therapists) {
      const { data: existing } = await supabase.auth.admin.listUsers()
      const userExists = existing?.users.some(u => u.email === t.email)
      
      if (!userExists) {
        const { data, error } = await supabase.auth.admin.createUser({
          email: t.email,
          password: testPassword,
          email_confirm: true
        })
        
        if (data?.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: t.email,
            full_name: t.name,
            role: 'therapist'
          })
          
          await supabase.from('therapist_profiles').upsert({
            id: data.user.id,
            specialization: t.specialization,
            approaches: ['CBT', 'Gestalt'],
            education: ['University of Psychology'],
            experience_years: t.experience,
            languages: ['English'],
            price_per_session: t.price,
            currency: 'USD',
            session_duration: 50,
            bioEn: `I am a licensed therapist with ${t.experience} years of experience helping people overcome ${t.specialization.join(', ')}.`,
            is_verified: true,
            is_available: true,
            rating: 4.5 + Math.random() * 0.5,
            review_count: Math.floor(Math.random() * 50) + 10
          })
        }
      }
    }

    await supabase.from('topics').upsert(topics, { onConflict: 'slug' })

    const { data: { users } } = await supabase.auth.admin.listUsers()
    const therapistUsers = users?.filter(u => u.email?.includes('@therapist.com')) || []
    
    if (therapistUsers.length > 0) {
      const clientUsers = users?.filter(u => u.email === 'test@openyourmind.app')
      const clientId = clientUsers?.[0]?.id

      if (clientId) {
        const conv = await supabase.from('conversations').select('*').eq('client_id', clientId).maybeSingle()
        
        if (!conv) {
          const therapistId = therapistUsers[0].id
          const { data: conversation } = await supabase.from('conversations').insert({
            client_id: clientId,
            therapist_id: therapistId,
            last_message_at: new Date().toISOString()
          }).select().maybe()

          if (conversation?.[0]) {
            await supabase.from('messages').insert([
              {
                conversation_id: conversation[0].id,
                sender_id: clientId,
                content: 'Hello, I need help with anxiety issues',
                is_read: true,
                created_at: new Date(Date.now() - 3600000).toISOString()
              },
              {
                conversation_id: conversation[0].id,
                sender_id: therapistId,
                content: 'Hello! I would be happy to help you. Can you tell me more about what you are experiencing?',
                is_read: true,
                created_at: new Date(Date.now() - 1800000).toISOString()
              },
              {
                conversation_id: conversation[0].id,
                sender_id: clientId,
                content: 'I have been feeling overwhelmed lately...',
                is_read: false,
                created_at: new Date().toISOString()
              }
            ])
          }
        }
      }
    }

    return NextResponse.json({ 
      message: 'Seed completed',
      therapists: therapists.length,
      topics: topics.length
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}