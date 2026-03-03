import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion 추가
import './App.css'
import { RightFlap, LeftFlap, BottomFlap, TopFlap } from './components/EnvelopeFlaps';
import Letter from './components/Letter'
import { useGuestbook } from './hooks/useGuestbook'
import backgroundImage from "./assets/background2.jpg";
import RibbonLoader from './components/RibbonLoader'

export default function App() {
  const ENVELOPE_CONF = {
    WIDTH: 550,
    HEIGHT: 380,
    PADDING_X: 40,
    PADDING_Y: 60,
    SCALE_BASE_HEIGHT: 650,
    SPARKLE_INTERVAL: 320,
    LOADER_TIMEOUT: 5000,
    COLORS: {
      BG_MAIN: '#f6f1eb',
      ENVELOPE_BACK: '#ded6cb',
      ENVELOPE_FLAP: '#e4ddd3',
      STROKE: '#5D4037',
      SHADOW: 'rgba(140, 100, 60, 0.20)',
    },
    Z_INDEX: {
      LOADER: 50,
      ENVELOPE_WRAP: 1,
      ENVELOPE_BACK: 10,
      LETTER: 15,
      FLAP_RIGHT: 19,
      FLAP_LEFT: 20,
      FLAP_BOTTOM: 21,
      FLAP_TOP: 24,
    }
  };

  const { WIDTH: W, HEIGHT: H, COLORS, Z_INDEX, PADDING_X, PADDING_Y, SCALE_BASE_HEIGHT } = ENVELOPE_CONF;
  const cx = W / 2;
  const cy = H / 2;

  const [isOpen, setIsOpen] = useState(false)
  const { messages, addMessage, editMessage, deleteMessage } = useGuestbook();
  const [scale, setScale] = useState(1)
  const [progress, setProgress] = useState(0)
  const [appReady, setAppReady] = useState(false)

  // 반응형 스케일 계산
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth
      const currentHeight = window.innerHeight
      const scaleByWidth = (currentWidth - PADDING_X) / W;
      const scaleByHeight = (currentHeight - PADDING_Y) / SCALE_BASE_HEIGHT;
      setScale(Math.min(1, scaleByWidth, scaleByHeight))
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [W, PADDING_X, PADDING_Y, SCALE_BASE_HEIGHT])

  // 로딩 및 이미지 프리로드 로직
  useEffect(() => {
    let isMounted = true;
    const img = new Image()
    img.src = backgroundImage

    const finishLoading = () => {
      if (isMounted) setAppReady(true);
    };

    const forceShow = setTimeout(finishLoading, ENVELOPE_CONF.LOADER_TIMEOUT);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          if (img.complete) finishLoading();
          return 100
        }
        return prev + (prev > 90 ? 1 : Math.floor(Math.random() * 10 + 2));
      })
    }, 100)

    img.onload = () => {
      if (progress >= 100) finishLoading();
    }

    return () => {
      isMounted = false;
      clearInterval(timer);
      clearTimeout(forceShow);
    }
  }, [backgroundImage, progress, ENVELOPE_CONF.LOADER_TIMEOUT])

  return (
    /* 최상위 부모 div: 전체 화면을 감싸 에러를 방지합니다. */
    <div className="min-h-screen w-full flex items-center justify-center p-4 pb-[10vh] md:pb-0"
      style={{
        backgroundColor: COLORS.BG_MAIN,
        overflow: 'hidden',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: 'relative',
      }}
    >
      {/* 1. 로딩 화면 (Framer Motion 적용) */}
      <AnimatePresence>
        {!appReady && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed', inset: 0, zIndex: Z_INDEX.LOADER,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#ffffff',
            }}>
            <RibbonLoader progress={progress > 100 ? 100 : progress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. 배경 레이어 */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.4
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #fde9ff 0%, #ffbff2 50%, #ffffff 100%)',
          mixBlendMode: 'overlay', opacity: 0.2
        }} />
      </div>

      {/* 3. 메인 봉투 (Framer Motion 적용) */}
      <motion.div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        animate={{ scale: scale }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        style={{
          position: 'relative',
          width: `${W}px`,
          height: `${H}px`,
          zIndex: Z_INDEX.ENVELOPE_WRAP,
          cursor: 'pointer',
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          flexShrink: 0
        }}
      >
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          filter: 'drop-shadow(0 20px 35px rgba(72, 66, 72, 0.4))'
        }}>
          {/* 봉투 내부 구성 요소 */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: COLORS.ENVELOPE_BACK,
              zIndex: Z_INDEX.ENVELOPE_BACK
            }} />

            <Letter
              isOpen={isOpen}
              messages={messages}
              onAddMessage={addMessage}
              onDeleteMessage={deleteMessage}
              onEditMessage={editMessage}
            />

            <RightFlap W={W} H={H} cx={cx} cy={cy} color={COLORS.ENVELOPE_FLAP} zIndex={Z_INDEX.FLAP_RIGHT} />
            <LeftFlap W={W} H={H} cx={cx} cy={cy} color={COLORS.ENVELOPE_FLAP} zIndex={Z_INDEX.FLAP_LEFT} />
            <BottomFlap W={W} H={H} cx={cx} cy={cy} color={COLORS.ENVELOPE_FLAP} zIndex={Z_INDEX.FLAP_BOTTOM} />
            <TopFlap W={W} cx={cx} cy={cy} color={COLORS.ENVELOPE_FLAP} zIndex={Z_INDEX.FLAP_TOP} isOpen={isOpen} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}