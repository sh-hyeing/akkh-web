export default function Sparkle({ size = 12, color = '#ffbaf0', style: s = {} }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20"
            style={{ ...s, display: 'inline-block' }} xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0 L11.2 8.8 L20 10 L11.2 11.2 L10 20 L8.8 11.2 L0 10 L8.8 8.8 Z" fill={color} />
        </svg>
    )
}