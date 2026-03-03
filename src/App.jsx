import { useState, useEffect } from 'react'
import './App.css'
import Sparkle from './components/Sparkle'
import Letter from './components/Letter'
import { useGuestbook } from './hooks/useGuestbook'
import backgroundImage from "./assets/background2.jpg";

export default function App() {
  const [currentMenu, setCurrentMenu] = useState('main')
  const [isOpen, setIsOpen] = useState(false)
  const [sparkles, setSparkles] = useState([])

  const { messages, addMessage, editMessage, deleteMessage } = useGuestbook();

  const [scale, setScale] = useState(1)
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth
      const currentHeight = window.innerHeight
      const scaleByWidth = (currentWidth - 40) / 550
      const scaleByHeight = (currentHeight - 60) / 650
      setScale(Math.min(1, scaleByWidth, scaleByHeight))
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isOpen) { setSparkles([]); return }
    const id = setInterval(() => {
      setSparkles(prev => [
        ...prev.slice(-8),
        { id: Date.now(), x: Math.random() * 100, y: Math.random() * 100, size: 8 + Math.random() * 10 }
      ])
    }, 320)
    return () => clearInterval(id)
  }, [isOpen])

  const W = 550, H = 380
  const cx = W / 2, cy = H / 2

  return (

    <div className="min-h-screen w-full flex items-center justify-center p-4 pb-[10vh] md:pb-0"
      style={{
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: 'relative',
      }}
    >
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.4
        }} />

        {/* 2. 핑크-주황 그라데이션 (실크 위에 overlay) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #fde9ff 0%, #ffbff2 50%, #ffffff 100%)',
          mixBlendMode: 'overlay', opacity: 0.2
        }} />

        <div style={{
          position: 'absolute', inset: 0,
        }} />
      </div>

      {/* 봉투 래퍼 */}
      <div
        style={{
          position: 'relative', width: `${W}px`, height: `${H}px`, zIndex: 1, cursor: 'pointer',
          transform: `perspective(1200px) scale(${scale})`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          flexShrink: 0
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >

        <div style={{ position: 'relative', width: '100%', height: '100%', filter: 'drop-shadow(0 20px 35px rgba(140, 100, 60, 0.20))' }}>

          {/* 1. 봉투 뒷면 */}
          <div style={{
            position: 'absolute', inset: 0,
            background: '#ded6cb',
            backgroundBlendMode: 'multiply',
            boxShadow: '0 12px 50px rgba(160,120,80,0.20), 0 4px 10px rgba(0,0,0,0.09)',
            zIndex: 10, transform: 'translateZ(0)',
          }}>
          </div>

          <Letter
            isOpen={isOpen}
            messages={messages}
            onAddMessage={addMessage}
            onDeleteMessage={deleteMessage}
            onEditMessage={editMessage}
          />

          {/* 오른쪽 플랩 (가장 아래) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 19, pointerEvents: 'none', filter: 'drop-shadow(-1px 0 1px rgba(140,100,60,0.05))' }}>
            <polygon points={`${W},0 ${cx},${cy} ${W},${H}`} fill="#e4ddd3" />
          </svg>

          {/* 왼쪽 플랩 (오른쪽 덮음) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none', filter: 'drop-shadow(3px 0 3px rgba(140,100,60,0.09))' }}>
            <polygon points={`0,0 ${cx},${cy} 0,${H}`} fill="#e4ddd3" />
          </svg>

          {/* 아래쪽 플랩 (양옆 덮음) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 21, pointerEvents: 'none', filter: 'drop-shadow(0 -2px 3px rgba(140,100,60,0.11))' }}>
            <polygon points={`0,${H} ${cx},${cy} ${W},${H}`} fill="#e4ddd3" />
          </svg>

          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: isOpen ? 19 : 24, pointerEvents: 'none',
            transformOrigin: 'top center',
            transform: isOpen ? 'rotateX(165deg)' : 'rotateX(0deg)',
            transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1)',
            filter: 'drop-shadow(0 4px 5px rgba(140,100,60,0.12))',
          }}>
            <svg style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>

              <path

                d={`M 0 0 L ${cx - 80} ${Math.round(cy * 1.15)} C ${cx - 20} ${Math.round(cy * 1.52)}, ${cx + 20} ${Math.round(cy * 1.52)}, ${cx + 80} ${Math.round(cy * 1.15)} L ${W} 0`}

                fill="#e4ddd3"

              />

            </svg>
          </div>

          <svg style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 25, pointerEvents: 'none',
            opacity: isOpen ? 0 : 1, transition: 'opacity 0.3s ease-out'
          }}>
          </svg>

        </div>
      </div>

      <style>{`
        @keyframes sparkleFade {
          0%   { opacity: 0; transform: scale(0.5) rotate(0deg); }
          40%  { opacity: 1; transform: scale(1.2) rotate(20deg); }
          100% { opacity: 0; transform: scale(0.8) rotate(45deg); }
        }
      `}</style>
    </div>
  )
}