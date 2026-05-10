/** glTF binary container magic (little-endian), ASCII "glTF" reversed in LE layout per spec. */
const GLB_MAGIC = 0x46546c67

export type GlbCheck = { ok: true } | { ok: false; reason: string }

/**
 * Quick validation that a File is a real binary GLB (not JSON/text masquerading as .glb).
 * ChatGPT and similar tools often emit broken or non-binary “models”.
 */
export async function validateBinaryGlb(file: File): Promise<GlbCheck> {
  if (!file.size) {
    return { ok: false, reason: 'File is empty.' }
  }
  if (file.size < 28) {
    return { ok: false, reason: 'File is too small to be a valid GLB.' }
  }

  const buf = await file.slice(0, 64).arrayBuffer()
  const v = new DataView(buf)
  const magic = v.getUint32(0, true)
  if (magic !== GLB_MAGIC) {
    const head = new TextDecoder('utf-8', { fatal: false }).decode(buf.slice(0, 80)).trimStart()
    if (head.startsWith('{') || head.startsWith('<')) {
      return {
        ok: false,
        reason:
          'This file looks like JSON or HTML, not a binary GLB. ChatGPT cannot reliably produce real GLB bytes — export GLB from Blender / Meshmixer / your scanner, or use this project’s tooth.glb.',
      }
    }
    return {
      ok: false,
      reason:
        'Not a valid GLB (wrong file signature). Many “GPT” downloads are placeholders. Use a real .glb export or the bundled tooth.glb.',
    }
  }

  const version = v.getUint32(4, true)
  if (version !== 2) {
    return {
      ok: false,
      reason: `GLB version ${version} is not supported here (need glTF 2.0).`,
    }
  }

  const declaredLen = v.getUint32(8, true)
  if (declaredLen < 12 || declaredLen > file.size) {
    return {
      ok: false,
      reason:
        'GLB header says the file should be larger than it is (truncated download), or the header is corrupt.',
    }
  }

  return { ok: true }
}
