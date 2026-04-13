"use client"

import { useEffect, useRef, useState } from 'react'

type WherebyCallProps = {
  roomUrl: string
  onLeave?: () => void
}

export default function WherebyCall({ roomUrl, onLeave }: WherebyCallProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'participant_left') {
        onLeave?.()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onLeave])

  if (!roomUrl) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        background: '#f3f4f6',
        borderRadius: '12px',
      }}>
        <p style={{ color: '#6b7280' }}>Немає посилання для дзвінка</p>
      </div>
    )
  }

  return (
    <iframe
      ref={iframeRef}
      src={roomUrl}
      allow="camera; microphone; fullscreen; display-capture"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        border: 'none',
        borderRadius: '12px',
      }}
    />
  )
}