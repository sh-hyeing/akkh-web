export default function Rose({ size = 32, opacity = 1, rotate = 0 }) {
    return (
        <svg
            width={size} height={size} viewBox="0 0 64 64"
            style={{ opacity, transform: `rotate(${rotate}deg)`, display: 'block', flexShrink: 0 }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <ellipse cx="18" cy="50" rx="8" ry="5" fill="#b8d4a0" transform="rotate(-40 18 50)" opacity="0.85" />
            <ellipse cx="46" cy="50" rx="8" ry="5" fill="#a8c490" transform="rotate(40 46 50)" opacity="0.85" />
            <rect x="30" y="38" width="3" height="16" rx="1.5" fill="#9ab882" opacity="0.8" />
            <ellipse cx="32" cy="28" rx="11" ry="9" fill="#f2c4c4" opacity="0.7" />
            <ellipse cx="22" cy="32" rx="9" ry="7" fill="#f0bcbc" opacity="0.7" transform="rotate(-20 22 32)" />
            <ellipse cx="42" cy="32" rx="9" ry="7" fill="#f0bcbc" opacity="0.7" transform="rotate(20 42 32)" />
            <ellipse cx="24" cy="22" rx="8" ry="6" fill="#f4c8c8" opacity="0.75" transform="rotate(-35 24 22)" />
            <ellipse cx="40" cy="22" rx="8" ry="6" fill="#f4c8c8" opacity="0.75" transform="rotate(35 40 22)" />
            <ellipse cx="32" cy="26" rx="8" ry="7" fill="#e8a8b0" opacity="0.8" />
            <ellipse cx="26" cy="28" rx="6" ry="5" fill="#e0a0a8" opacity="0.75" transform="rotate(-15 26 28)" />
            <ellipse cx="38" cy="28" rx="6" ry="5" fill="#e0a0a8" opacity="0.75" transform="rotate(15 38 28)" />
            <circle cx="32" cy="26" r="5" fill="#d08090" opacity="0.9" />
            <circle cx="32" cy="25" r="3" fill="#c07080" opacity="0.95" />
            <circle cx="31" cy="24" r="1.2" fill="#e8b0b8" opacity="0.9" />
        </svg>
    )
}