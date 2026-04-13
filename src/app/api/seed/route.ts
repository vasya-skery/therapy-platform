import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!serviceKey) {
    return NextResponse.json({ error: 'Service key not configured in Vercel' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

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
    const { data: usersData } = await supabase.auth.admin.listUsers()
    const existingUsers = usersData?.users || []
    let createdTherapists = 0

    for (const t of therapists) {
      const userExists = existingUsers.some(u => u.email === t.email)
      
      if (!userExists) {
        const { data, error } = await supabase.auth.admin.createUser({
          email: t.email,
          password: testPassword,
          email_confirm: true
        })
        
        if (data?.user && !error) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: t.email,
            full_name: t.name,
            role: 'therapist'
          })
          
          const { error: tpError } = await supabase.from('therapist_profiles').upsert({
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
          
          if (tpError) {
            console.error('Therapist profile error:', tpError)
          } else {
            createdTherapists++
          }
        }
      } else {
        const user = existingUsers.find(u => u.email === t.email)
        if (user) {
          const { data: existingTp } = await supabase.from('therapist_profiles').select('id').eq('id', user.id).single()
          if (!existingTp) {
            const { error: tpError } = await supabase.from('therapist_profiles').upsert({
              id: user.id,
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
            if (!tpError) createdTherapists++
          }
        }
      }
    }

    const { data: allTopics } = await supabase.from('topics').select('slug')
    const existingSlugs = allTopics?.map(t => t.slug) || []
    const newTopics = topics.filter(t => !existingSlugs.includes(t.slug))
    
    if (newTopics.length > 0) {
      await supabase.from('topics').insert(newTopics)
    }

    return NextResponse.json({ 
      message: 'Seed completed',
      therapistsCreated: createdTherapists,
      topicsCount: topics.length
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}