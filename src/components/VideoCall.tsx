"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

declare global {
  interface Window {
    DailyIframe: {
      createFrame: (frame: HTMLElement, options: {
        iframeStyle?: string
        showLeaveButton?: boolean
        showFullscreenButton?: boolean
        cssFile?: string
      }) => {
        join: (options: { url: string }) => Promise<void>
        leave: () => void
        on: (event: string, callback: () => void) => void
        destroy: () => void
      }
    }
  }
}

type VideoCallProps = {
  roomUrl: string
  onLeave?: () => void
}

export default function VideoCall({ roomUrl, onLeave }: VideoCallProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const callFrameRef = useRef<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomUrl || !containerRef.current) return

    const initCall = async () => {
      try {
        if (!window.DailyIframe) {
          const script = document.createElement('script')
          script.src = 'https://dailymotion.com/player-sdk/v1/daily-iframe.js'
          script.async = true
          script.onload = () => {
            createFrame()
          }
          script.onerror = () => {
            setError('Failed to load video call SDK')
          }
          document.body.appendChild(script)
        } else {
          createFrame()
        }
      } catch (err) {
        setError('Failed to initialize video call')
        console.error(err)
      }
    }

    const createFrame = () => {
      if (!window.DailyIframe || !containerRef.current) return

      const frame = window.DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '12px',
        },
        showLeaveButton: true,
        showFullscreenButton: true,
      })

      frame.on('leftMeeting', () => {
        if (callFrameRef.current) {
          callFrameRef.current.destroy()
          callFrameRef.current = null
        }
        onLeave?.()
      })

      callFrameRef.current = frame

      frame.join({ url: roomUrl })
        .then(() => setLoaded(true))
        .catch((err: Error) => {
          setError(err.message || 'Failed to join call')
        })
    }

    initCall()

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.leave()
        callFrameRef.current.destroy()
        callFrameRef.current = null
      }
    }
  }, [roomUrl, onLeave])

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        background: '#f3f4f6',
        borderRadius: '12px',
        color: '#dc2626',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>⚠️</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        background: '#f3f4f6',
        borderRadius: '12px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTopColor: '#4F46E5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#6b7280' }}>Загрузка відео-дзвінка...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    />
  )
}