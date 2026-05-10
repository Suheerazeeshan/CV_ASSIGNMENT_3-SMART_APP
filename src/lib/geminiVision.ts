/** Optional multimodal call — requires VITE_GEMINI_API_KEY and network. */

import { generateGeminiContent } from './geminiGenerate'

/** Model reply on success, or a detailed error string on failure (never null). */
export async function geminiDescribeImage(
  mimeType: string,
  base64Data: string,
  prompt: string,
): Promise<string> {
  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
  }

  try {
    const result = await generateGeminiContent(body)
    if (!result.ok) return result.message
    return result.text
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return `Unexpected error calling Gemini: ${msg}`
  }
}
