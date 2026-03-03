// components/EnvelopeFlaps.jsx
import React from 'react';
import { motion } from 'framer-motion';

// 공통 스타일링을 위한 헬퍼 (중복 제거)
const flapSvgStyle = "absolute inset-0 w-full h-full pointer-events-none";

export const RightFlap = ({ W, H, cx, cy, color, zIndex }) => (
    <svg className={flapSvgStyle} style={{ zIndex, filter: 'drop-shadow(-1px 0 1px rgba(140,100,60,0.05))' }}>
        <polygon points={`${W},0 ${cx},${cy} ${W},${H}`} fill={color} stroke="#5D4037" strokeWidth="1" strokeOpacity="0.15" />
    </svg>
);

export const LeftFlap = ({ W, H, cx, cy, color, zIndex }) => (
    <svg className={flapSvgStyle} style={{ zIndex, filter: 'drop-shadow(3px 0 3px rgba(140,100,60,0.09))' }}>
        <polygon points={`0,0 ${cx},${cy} 0,${H}`} fill={color} stroke="#5D4037" strokeWidth="1" strokeOpacity="0.15" />
    </svg>
);

export const BottomFlap = ({ W, H, cx, cy, color, zIndex }) => (
    <svg className={flapSvgStyle} style={{ zIndex, filter: 'drop-shadow(0 -2px 3px rgba(140,100,60,0.11))' }}>
        <polygon points={`0,${H} ${cx},${cy} ${W},${H}`} fill={color} stroke="#5D4037" strokeWidth="1" strokeOpacity="0.15" />
    </svg>
);

export const TopFlap = ({ W, cx, cy, color, zIndex, isOpen }) => (
    /* 수정 전: <div style={{ ... }}> */
    <motion.div
        initial={false} // 초기 렌더링 시 애니메이션 방지
        animate={{
            rotateX: isOpen ? 165 : 0,
            zIndex: isOpen ? 19 : zIndex,
        }}
        transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1], // 기존 cubic-bezier와 동일
        }}
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            transformOrigin: 'top center',
            filter: 'drop-shadow(0 4px 5px rgba(140,100,60,0.12))',
            transformStyle: 'preserve-3d', // 3D 성능 최적화
        }}
    >
        <svg className="w-full h-full absolute inset-0">
            <path
                d={`M 0 0 L ${cx - 80} ${Math.round(cy * 1.15)} C ${cx - 20} ${Math.round(cy * 1.52)}, ${cx + 20} ${Math.round(cy * 1.52)}, ${cx + 80} ${Math.round(cy * 1.15)} L ${W} 0`}
                fill={color}
                stroke="#5D4037"
                strokeWidth="1"
                strokeOpacity="0.2"
            />
        </svg>
    </motion.div>
    /* 수정 후: </motion.div> */
);