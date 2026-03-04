// components/EnvelopeFlaps.jsx
import React from 'react';
import { motion } from 'framer-motion';
import wallTexture from '../assets/wall-texture.jpg';

const flapSvgStyle = "absolute inset-0 w-full h-full pointer-events-none";

const TexturePattern = ({ W, H, id, color = "#e0d8cb" }) => (
    <defs>
        <pattern
            id={id}
            patternUnits="userSpaceOnUse"
            width={W}
            height={H}
        >
            <rect width={W} height={H} fill={color} />

            <image
                href={wallTexture}
                xlinkHref={wallTexture} /* [추가된 코드] 구형 및 모바일 브라우저 호환성 강화 */
                x="0"
                y="0"
                width={W}
                height={H}
                preserveAspectRatio="xMidYMid slice"
                opacity="0.65"
                style={{ mixBlendMode: 'multiply' }}
            />
        </pattern>
    </defs>
);

export const RightFlap = ({ W, H, cx, cy, color, zIndex }) => (
    <svg className={flapSvgStyle} style={{ zIndex, filter: 'drop-shadow(-1px 0 1px rgba(140,100,60,0.05))' }}>
        <TexturePattern W={W} H={H} id="paperTexture-right" color={color} />
        <polygon
            points={`${W},0 ${cx},${cy} ${W},${H}`}
            fill="url(#paperTexture-right)"
            stroke="#5D4037"
            strokeWidth="1"
            strokeOpacity="0.15"
        />
    </svg>
);

export const LeftFlap = ({ W, H, cx, cy, color, zIndex }) => (
    <svg className={flapSvgStyle} style={{ zIndex, filter: 'drop-shadow(3px 0 3px rgba(140,100,60,0.09))' }}>
        {/* [수정 포인트] color 값을 전달합니다 */}
        <TexturePattern W={W} H={H} id="paperTexture-left" color={color} />
        <polygon
            points={`0,0 ${cx},${cy} 0,${H}`}
            fill="url(#paperTexture-left)"
            stroke="#5D4037"
            strokeWidth="1"
            strokeOpacity="0.15"
        />
    </svg>
);

export const BottomFlap = ({ W, H, cx, cy, color, zIndex }) => (
    <svg className={flapSvgStyle} style={{ zIndex, filter: 'drop-shadow(0 -2px 3px rgba(140,100,60,0.11))' }}>
        <TexturePattern W={W} H={H} id="paperTexture-bottom" color={color} />
        <polygon
            points={`0,${H} ${cx},${cy} ${W},${H}`}
            fill="url(#paperTexture-bottom)"
            stroke="#5D4037"
            strokeWidth="1"
            strokeOpacity="0.15"
        />
    </svg>
);

export const TopFlap = ({ W, H, cx, cy, color, zIndex, isOpen }) => (
    <>
        <svg
            width="1"
            height="1"
            className="absolute pointer-events-none"
            style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
        >
            <TexturePattern W={W} H={H} id="paperTexture-top" color={color} />
        </svg>

        <motion.div
            initial={false}
            animate={{
                rotateX: isOpen ? 165 : 0,
                zIndex: isOpen ? 19 : zIndex,
            }}
            transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
            }}
        >
            <svg
                className="w-full h-full absolute inset-0"
                style={{ filter: 'drop-shadow(0 4px 5px rgba(140,100,60,0.12))' }}
            >
                <path
                    d={`M 0 0 L ${cx - 80} ${Math.round(cy * 1.15)} C ${cx - 20} ${Math.round(cy * 1.52)}, ${cx + 20} ${Math.round(cy * 1.52)}, ${cx + 80} ${Math.round(cy * 1.15)} L ${W} 0`}
                    fill="url(#paperTexture-top)"
                    stroke="#5D4037"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                />
            </svg>
        </motion.div>
    </>
);