/** Browser canvas helpers for teaching-style image analysis (no ML dependency). */

export function fitCanvasToImage(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  maxSide = 720,
): void {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}

export function cloneCanvas(source: HTMLCanvasElement): ImageData {
  const ctx = source.getContext('2d')
  if (!ctx) throw new Error('Canvas unsupported')
  return ctx.getImageData(0, 0, source.width, source.height)
}

export function putImageData(canvas: HTMLCanvasElement, data: ImageData): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.putImageData(data, 0, 0)
}

export function toGrayscale(data: ImageData): ImageData {
  const out = new ImageData(new Uint8ClampedArray(data.data), data.width, data.height)
  const d = out.data
  for (let i = 0; i < d.length; i += 4) {
    const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
    d[i] = d[i + 1] = d[i + 2] = y
    d[i + 3] = 255
  }
  return out
}

export function boxBlur(data: ImageData, radius = 2): ImageData {
  const w = data.width
  const h = data.height
  const src = data.data
  const tmp = new Float32Array(w * h)
  const out = new ImageData(w, h)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0
      let n = 0
      for (let dy = -radius; dy <= radius; dy++) {
        const yy = y + dy
        if (yy < 0 || yy >= h) continue
        for (let dx = -radius; dx <= radius; dx++) {
          const xx = x + dx
          if (xx < 0 || xx >= w) continue
          sum += src[(yy * w + xx) * 4]
          n++
        }
      }
      tmp[y * w + x] = sum / n
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0
      let n = 0
      for (let dy = -radius; dy <= radius; dy++) {
        const yy = y + dy
        if (yy < 0 || yy >= h) continue
        for (let dx = -radius; dx <= radius; dx++) {
          const xx = x + dx
          if (xx < 0 || xx >= w) continue
          sum += tmp[yy * w + xx]
          n++
        }
      }
      const v = Math.round(sum / n)
      const i = (y * w + x) * 4
      out.data[i] = out.data[i + 1] = out.data[i + 2] = v
      out.data[i + 3] = 255
    }
  }
  return out
}

function luminanceAt(data: ImageData, x: number, y: number): number {
  const i = (y * data.width + x) * 4
  return 0.299 * data.data[i] + 0.587 * data.data[i + 1] + 0.114 * data.data[i + 2]
}

export function sobelMagnitude(data: ImageData): ImageData {
  const w = data.width
  const h = data.height
  const gx = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ]
  const gy = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ]
  const gray = toGrayscale(data)
  const out = new ImageData(w, h)

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let sx = 0
      let sy = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const L = luminanceAt(gray, x + kx, y + ky)
          sx += gx[ky + 1][kx + 1] * L
          sy += gy[ky + 1][kx + 1] * L
        }
      }
      const mag = Math.min(255, Math.sqrt(sx * sx + sy * sy))
      const i = (y * w + x) * 4
      out.data[i] = out.data[i + 1] = out.data[i + 2] = mag
      out.data[i + 3] = 255
    }
  }
  return out
}

export function meanBrightness(data: ImageData): number {
  let s = 0
  const n = data.width * data.height
  for (let i = 0; i < data.data.length; i += 4) {
    s +=
      0.299 * data.data[i] +
      0.587 * data.data[i + 1] +
      0.114 * data.data[i + 2]
  }
  return n ? s / n : 0
}

export function edgeDensity(data: ImageData, thresh = 80): number {
  let strong = 0
  const n = data.width * data.height
  for (let i = 0; i < data.data.length; i += 4) {
    if (data.data[i] > thresh) strong++
  }
  return n ? strong / n : 0
}
