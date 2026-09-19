/**
 * 生成 PWA 图标（纯 Node 实现，无第三方依赖）
 * 运行：npm run icons
 *
 * 图案：暖色渐变底 + 白色碗 + 热气，风格与应用主视觉一致。
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const OUT_DIR = path.join(__dirname, '..', 'public', 'icons')

/* ----------------------------- PNG 编码 ----------------------------- */

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

function crc32(buffer) {
  let crc = -1
  for (let i = 0; i < buffer.length; i += 1) {
    crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ -1) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const typeBuffer = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0)
  return Buffer.concat([length, typeBuffer, data, crc])
}

function encodePng(width, height, rgba) {
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type: RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* ------------------------------ 形状 ------------------------------ */

const disc = (cx, cy, r) => (x, y) => (Math.hypot(x - cx, y - cy) <= r ? 1 : 0)

const halfDisc = (cx, cy, r) => (x, y) => (y >= cy && Math.hypot(x - cx, y - cy) <= r ? 1 : 0)

const roundedRect = (x0, y0, x1, y1, r) => (x, y) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return 0
  const dx = Math.min(x - x0, x1 - x)
  const dy = Math.min(y - y0, y1 - y)
  if (dx >= r || dy >= r) return 1
  const cx = x < x0 + r ? x0 + r : x1 - r
  const cy = y < y0 + r ? y0 + r : y1 - r
  return Math.hypot(x - cx, y - cy) <= r ? 1 : 0
}

/** 二次贝塞尔曲线采样成圆点链，用来画「热气」 */
function steamDots(x0, y0, x1, y1, x2, y2, radius) {
  const dots = []
  const steps = 34
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    const mt = 1 - t
    const x = mt * mt * x0 + 2 * mt * t * x1 + t * t * x2
    const y = mt * mt * y0 + 2 * mt * t * y1 + t * t * y2
    dots.push(disc(x, y, radius))
  }
  return dots
}

/* ---------------------------- 绘制实现 ---------------------------- */

const BG_START = [255, 162, 77]
const BG_END = [240, 70, 28]

function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * @param size    画布尺寸
 * @param radius  背景圆角（0 表示满幅直角，用于 Apple touch icon）
 * @param scale   图案缩放（maskable 需要留安全区）
 */
function drawIcon(size, { radius = 0.22, scale = 1, fullBleed = false } = {}) {
  const rgba = Buffer.alloc(size * size * 4)
  const ss = 3 // 3x3 超采样抗锯齿
  const t = (v) => 0.5 + (v - 0.5) * scale
  const sr = (v) => v * scale

  const shapes = []

  if (fullBleed) {
    shapes.push({ fn: () => 1, color: null })
  } else {
    shapes.push({ fn: roundedRect(0, 0, size, size, size * radius), color: null })
  }

  // 碗身
  shapes.push({ fn: halfDisc(t(0.5) * size, t(0.565) * size, sr(0.245) * size), color: [255, 255, 255] })
  // 碗沿
  shapes.push({
    fn: roundedRect(
      (t(0.5) - sr(0.285)) * size,
      t(0.515) * size,
      (t(0.5) + sr(0.285)) * size,
      t(0.565) * size,
      sr(0.028) * size
    ),
    color: [255, 255, 255],
  })
  // 热气
  ;[-1, 0, 1].forEach((offset) => {
    const x = t(0.5 + offset * 0.082) * size
    steamDots(
      x,
      t(0.44) * size,
      x + sr(0.035) * size,
      t(0.35) * size,
      x,
      t(0.26) * size,
      sr(0.023) * size
    ).forEach((fn) => shapes.push({ fn, color: [255, 255, 255], alpha: 0.85 }))
  })

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0

      for (const shape of shapes) {
        let coverage = 0
        for (let sy = 0; sy < ss; sy += 1) {
          for (let sx = 0; sx < ss; sx += 1) {
            coverage += shape.fn(x + (sx + 0.5) / ss, y + (sy + 0.5) / ss)
          }
        }
        coverage /= ss * ss
        if (coverage <= 0) continue

        let color = shape.color
        if (!color) {
          // 背景使用左上到右下的暖色渐变
          const k = Math.min(1, Math.max(0, (x / size + y / size) / 2))
          color = [lerp(BG_START[0], BG_END[0], k), lerp(BG_START[1], BG_END[1], k), lerp(BG_START[2], BG_END[2], k)]
        }

        const srcA = (shape.alpha ?? 1) * coverage
        const outA = srcA + a * (1 - srcA)
        if (outA <= 0) continue
        r = (color[0] * srcA + r * a * (1 - srcA)) / outA
        g = (color[1] * srcA + g * a * (1 - srcA)) / outA
        b = (color[2] * srcA + b * a * (1 - srcA)) / outA
        a = outA
      }

      const index = (y * size + x) * 4
      rgba[index] = Math.round(r)
      rgba[index + 1] = Math.round(g)
      rgba[index + 2] = Math.round(b)
      rgba[index + 3] = Math.round(a * 255)
    }
  }

  return encodePng(size, size, rgba)
}

/* ------------------------------ 输出 ------------------------------ */

const targets = [
  { file: 'icon-192.png', size: 192, options: {} },
  { file: 'icon-512.png', size: 512, options: {} },
  { file: 'icon-maskable-512.png', size: 512, options: { fullBleed: true, scale: 0.74 } },
  { file: 'apple-touch-icon.png', size: 180, options: { fullBleed: true } },
]

fs.mkdirSync(OUT_DIR, { recursive: true })
targets.forEach(({ file, size, options }) => {
  const png = drawIcon(size, options)
  fs.writeFileSync(path.join(OUT_DIR, file), png)
  console.log(`generated ${file} (${size}x${size}, ${(png.length / 1024).toFixed(1)} KB)`)
})
