import { useState, useEffect } from 'react'
import './App.css'
import Rose from './components/Rose'
import Bud from './components/Bud'
import Sparkle from './components/Sparkle'
import Letter from './components/Letter'
import { useGuestbook } from './hooks/useGuestbook'

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`

export default function App() {
  const [currentMenu, setCurrentMenu] = useState('main')
  const [isOpen, setIsOpen] = useState(false)
  const [sparkles, setSparkles] = useState([])

  // 1. [교체] 복잡했던 모든 로직이 이 한 줄로 끝납니다!
  const { messages, addMessage, editMessage, deleteMessage } = useGuestbook();

  // 2. [유지] 화면 크기 조절 로직 (이건 아직 필요해요)
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

  // 3. [유지] 스파클 효과 로직
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
    <div className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at 40% 40%, #fff0f3 0%, #fff8f9 40%, #f6eaec 100%)',
        overflow: 'hidden',
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* 배경 장미 장식 */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {[
          { top: '15%', left: '18%', size: 52, op: 0.52, rot: -20 },
          { top: '12%', right: '20%', size: 44, op: 0.50, rot: 30 },
          { bottom: '16%', left: '22%', size: 48, op: 0.51, rot: 15 },
          { bottom: '14%', right: '18%', size: 54, op: 0.53, rot: -10 },
          { top: '45%', left: '12%', size: 38, op: 0.58, rot: 45 },
          { top: '42%', right: '14%', size: 38, op: 0.58, rot: -45 },
        ].map((r, i) => (
          <div key={i} style={{ position: 'absolute', top: r.top, bottom: r.bottom, left: r.left, right: r.right }}>
            <Rose size={r.size} opacity={r.op} rotate={r.rot} />
          </div>
        ))}
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
        {/* 스파클 오버레이 */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none', overflow: 'hidden' }}>
          {sparkles.map(s => (
            <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, animation: 'sparkleFade 1.2s ease-out forwards' }}>
              <Sparkle size={s.size} color="#dfc090" />
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', width: '100%', height: '100%' }}>

          {/* 1. 봉투 뒷면 */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(248, 238, 224, 0.97)',
            backgroundImage: NOISE,
            backgroundBlendMode: 'multiply',
            boxShadow: '0 12px 50px rgba(160,120,80,0.20), 0 2px 10px rgba(0,0,0,0.09)',
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
            <polygon points={`${W},0 ${cx},${cy} ${W},${H}`} fill="rgba(248, 238, 224, 0.97)" />
          </svg>

          {/* 왼쪽 플랩 (오른쪽 덮음) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none', filter: 'drop-shadow(3px 0 3px rgba(140,100,60,0.09))' }}>
            <polygon points={`0,0 ${cx},${cy} 0,${H}`} fill="rgba(248, 238, 224, 0.97)" />
          </svg>

          {/* 아래쪽 플랩 (양옆 덮음) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 21, pointerEvents: 'none', filter: 'drop-shadow(0 -2px 3px rgba(140,100,60,0.11))' }}>
            <polygon points={`0,${H} ${cx},${cy} ${W},${H}`} fill="rgba(248, 238, 224, 0.97)" />
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

                fill="rgba(248, 238, 224, 0.97)"

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