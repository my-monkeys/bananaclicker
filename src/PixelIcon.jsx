export default function PixelIcon({ id, size = 20, style }) {
  return (
    <img
      src={`/icons/${id}.png`}
      width={size}
      height={size}
      alt={id}
      style={{ imageRendering: 'pixelated', display: 'block', flexShrink: 0, ...style }}
    />
  )
}
