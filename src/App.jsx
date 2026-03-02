import { useState, useEffect } from 'react'
import './App.css'
import Rose from './components/Rose'
import Bud from './components/Bud'
import Sparkle from './components/Sparkle'
import Letter from './components/Letter'

import { db } from './firebase'
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, where } from "firebase/firestore"

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`

export default function App() {
  const [currentMenu, setCurrentMenu] = useState('main')
  const [isOpen, setIsOpen] = useState(false)
  const [sparkles, setSparkles] = useState([])

  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    const q = query(
      collection(db, "guestbook"),
      orderBy("id", "desc") // 일단 정렬만 먼저 해봅니다.
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgData = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      }));

      const visibleMessages = msgData.filter(msg => msg.isDeleted !== true);
      setMessages(visibleMessages);
    });

    return () => unsubscribe();
  }, []);

  // 1. 화면 크기에 따른 스케일 비율 상태 추가
  const [scale, setScale] = useState(1)
  // 2. 창 크기가 변할 때마다 가로/세로를 모두 고려하여 스케일 계산
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth
      const currentHeight = window.innerHeight

      // 가로 비율 (봉투 너비 550px 기준)
      const scaleByWidth = (currentWidth - 40) / 550
      // 세로 비율 (편지지가 솟아오르는 전체 높이 약 650px 기준)
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

  const handleAddMessage = async (newName, newText, newPassword) => {
    // 숫자가 아니면 등록 거부
    if (isNaN(newPassword)) {
      alert("비밀번호는 숫자만 입력 가능합니다.");
      return;
    }

    const now = new Date()
    const date = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`

    try {
      await addDoc(collection(db, "guestbook"), {
        id: Date.now(),
        name: newName,
        text: newText,
        password: newPassword,
        date: date,
        isDeleted: false
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // 수정 함수
  const onEditMessage = async (docId, originalPassword, currentText) => {
    const inputPassword = prompt("비밀번호를 입력하세요 (숫자)");

    if (inputPassword === String(originalPassword)) {
      const newText = prompt("수정할 내용을 입력하세요", currentText);

      if (newText && newText !== currentText) {
        try {
          await updateDoc(doc(db, "guestbook", docId), {
            text: newText,
            inputPassword: inputPassword
          });
          alert("수정되었습니다.");
        } catch (e) {
          console.error("수정 중 오류 발생: ", e);
          alert("수정 권한이 없습니다.");
        }
      }
    } else if (inputPassword !== null) {
      alert("비밀번호가 일치하지 않습니다.");
    }
  }

  // 삭제 함수 (숫자 체크 포함)
  const onDeleteMessage = async (docId, originalPassword) => {
    const inputPassword = prompt("비밀번호를 입력하세요.");

    if (inputPassword) {
      try {
        await updateDoc(doc(db, "guestbook", docId), {
          isDeleted: true,
          inputPassword: inputPassword // 서버 규칙에서 대조할 값
        });
        alert("삭제되었습니다.");
      } catch (e) {
        alert("비밀번호가 일치하지 않습니다.");
      }
    }
  }

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
            onAddMessage={handleAddMessage}
            onDeleteMessage={onDeleteMessage}
            onEditMessage={onEditMessage}
          />

          {/* 3. 봉투 앞면 — SVG 플랩으로 완벽한 스케일링 대응 */}

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

          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 18, pointerEvents: 'none' }}>
            <line x1="0" y1="0" x2={cx} y2={cy} stroke="rgba(170,140,100,0.22)" strokeWidth="0.8" style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 0.3s ease-out' }} />
            <line x1={W} y1="0" x2={cx} y2={cy} stroke="rgba(170,140,100,0.22)" strokeWidth="0.8" style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 0.3s ease-out' }} />
            <line x1="0" y1={H} x2={cx} y2={cy} stroke="rgba(170,140,100,0.20)" strokeWidth="0.8" />
            <line x1={W} y1={H} x2={cx} y2={cy} stroke="rgba(170,140,100,0.20)" strokeWidth="0.8" />
          </svg>

          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: isOpen ? 19 : 24, pointerEvents: 'none',
            transformOrigin: 'top center',
            transform: isOpen ? 'rotateX(165deg)' : 'rotateX(0deg)',
            transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1)',
            filter: 'drop-shadow(0 4px 5px rgba(140,100,60,0.12))',
          }}>
            <svg style={{ width: '100%', height: '100%' }}>
              <polygon points={`0,0 ${cx},${Math.round(cy * 1.52)} ${W},0`} fill="rgba(248, 238, 224, 0.97)" />
            </svg>
          </div>

          <svg style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 25, pointerEvents: 'none',
            opacity: isOpen ? 0 : 1, transition: 'opacity 0.3s ease-out'
          }}>
            <line x1="0" y1="0" x2={cx} y2={Math.round(cy * 1.52)} stroke="rgba(170,140,100,0.28)" strokeWidth="0.8" />
            <line x1={W} y1="0" x2={cx} y2={Math.round(cy * 1.52)} stroke="rgba(170,140,100,0.28)" strokeWidth="0.8" />
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