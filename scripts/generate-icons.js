import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { PALETTE, PIXEL_ARTS } from '../src/pixel-icons.js'

const SCALE = 16 // 8×8 → 128×128

// ── CRC32 ──────────────────────────────────────────────────────────────────
const CRC_TABLE = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
  CRC_TABLE[i] = c
}
function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (const byte of buf) crc = CRC_TABLE[(crc ^ byte) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

// ── PNG chunk ──────────────────────────────────────────────────────────────
function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])))
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf])
}

// ── Hex color → [r, g, b] ─────────────────────────────────────────────────
function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

// ── Generate PNG buffer from pixel art ────────────────────────────────────
function generatePng(art, scale) {
  const width  = 8 * scale
  const height = 8 * scale
  const pixels = new Uint8Array(width * height * 4)

  for (let y = 0; y < 8; y++) {
    const row = art[y]
    for (let x = 0; x < 8; x++) {
      const char = row[x]
      const transparent = char === '.' || !PALETTE[char]
      const [r, g, b] = transparent ? [0, 0, 0] : hexToRgb(PALETTE[char])
      const a = transparent ? 0 : 255

      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const idx = ((y * scale + sy) * width + (x * scale + sx)) * 4
          pixels[idx]     = r
          pixels[idx + 1] = g
          pixels[idx + 2] = b
          pixels[idx + 3] = a
        }
      }
    }
  }

  // Build scanlines (filter byte 0 = None per row)
  const raw = new Uint8Array(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0 // filter
    raw.set(pixels.subarray(y * width * 4, (y + 1) * width * 4), y * (1 + width * 4) + 1)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width,  0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8]  = 8 // bit depth
  ihdr[9]  = 6 // RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.from(raw))),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Main ──────────────────────────────────────────────────────────────────
mkdirSync('./public/icons', { recursive: true })

let count = 0
for (const [id, art] of Object.entries(PIXEL_ARTS)) {
  writeFileSync(`./public/icons/${id}.png`, generatePng(art, SCALE))
  console.log(`✓ ${id}.png`)
  count++
}

console.log(`\n${count} PNG générés dans public/icons/ (${SCALE * 8}×${SCALE * 8}px)`)
