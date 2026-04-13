import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const dailyApiKey = process.env.DAILY_API_KEY!

export const dynamic = 'force-dynamic'

async function createDailyRoom(roomName: string) {
  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${dailyApiKey}`,
    },
    body: JSON.stringify({
      name: roomName,
      privacy: 'private',
      properties: {
        exp: Math.floor(Date.now() / 1000) + 3600 * 24,
        enable_screenshare: true,
        enable_chat: true,
        enable_knocking: true,
        start_video_off: false,
        start_audio_off: false,
      },
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create Daily room')
  }
  
  return response.json()
}

export async function POST(request: Request) {
  if (!serviceKey || !dailyApiKey) {
    return NextResponse.json(
      { error: 'Service not configured' },
      { status: 500 }
    )
  }

  try {
    const { appointmentId } = await request.json()

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*, profiles:therapist_id(*)')
      .eq('id', appointmentId)
      .single()

    if (error || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const roomName = `session-${appointment.id.slice(0, 8)}`
    const room = await createDailyRoom(roomName)

    const { error: updateError } = await supabase
      .from('appointments')
      .update({ 
        meeting_url: room.url,
        status: 'confirmed' 
      })
      .eq('id', appointmentId)

    if (updateError) {
      console.error('Failed to update appointment:', updateError)
    }

    return NextResponse.json({ roomUrl: room.url })
  } catch (error: any) {
    console.error('Daily room error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}