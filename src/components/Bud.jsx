export default function Bud({ size = 16, opacity = 0.7 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24"
            style={{ opacity, display: 'inline-block' }} xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="10" rx="5" ry="6" fill="#f0b8c0" />
            <ellipse cx="8" cy="12" rx="4" ry="5" fill="#eab0b8" transform="rotate(-20 8 12)" />
            <ellipse cx="16" cy="12" rx="4" ry="5" fill="#eab0b8" transform="rotate(20 16 12)" />
            <circle cx="12" cy="10" r="3" fill="#d88090" />
            <rect x="11" y="16" width="2" height="6" rx="1" fill="#9ab882" />
            <ellipse cx="9" cy="20" rx="3" ry="2" fill="#b0cc98" transform="rotate(-30 9 20)" />
        </svg>
    )
}