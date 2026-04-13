import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

async function createWherebyRoom() {
  const subdomain = process.env.WHEREBY_SUBDOMAIN || 'therapy-platform'
  
  const roomName = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const roomUrl = `https://${subdomain}.whereby.com/${roomName}?embed`

  return { roomUrl, roomName }
}

export async function POST(request: Request) {
  try {
    const { appointmentId } = await request.json()

    const supabase = createClient(supabaseUrl, serviceKey || supabaseAnonKey, { auth: { persistSession: false } })

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single()

    if (error || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const { roomUrl, roomName } = await createWherebyRoom()

    const { error: updateError } = await supabase
      .from('appointments')
      .update({ 
        meeting_url: roomUrl,
        status: 'confirmed' 
      })
      .eq('id', appointmentId)

    if (updateError) {
      console.error('Failed to update appointment:', updateError)
    }

    return NextResponse.json({ 
      roomUrl,
      roomName,
      embedUrl: `https://${process.env.WHEREBY_SUBDOMAIN || 'therapy-platform'}.whereby.com/${roomName}`
    })
  } catch (error: any) {
    console.error('Whereby room error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}