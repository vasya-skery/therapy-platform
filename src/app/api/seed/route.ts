import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
  }

  const testEmail = 'test@openyourmind.app'
  const testPassword = 'test123456'

  try {
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const testUser = existingUser?.users.find(u => u.email === testEmail)

    if (testUser) {
      return NextResponse.json({ message: 'Test user already exists', email: testEmail })
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    })

    if (error) throw error

    if (data.user) {
      await supabaseAdmin.from('profiles').upsert({
        id: data.user.id,
        email: testEmail,
        full_name: 'Test Admin',
        role: 'admin'
      })
    }

    return NextResponse.json({ 
      message: 'Test user created',
      email: testEmail,
      password: testPassword
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}