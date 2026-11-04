const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload"
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export function isImageUploadConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_IMGBB_API_KEY)
}

/**
 * Uploads directly from the browser to imgbb. The API key is a public,
 * client-side key by design, so the backend never proxies image bytes.
 */
export async function uploadImageToImgbb(file: File) {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!key) {
    throw new Error(
      "Image uploads are not configured. Add NEXT_PUBLIC_IMGBB_API_KEY or paste an image URL."
    )
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Choose a JPG, PNG, WebP, or GIF image.")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Choose an image smaller than 10 MB.")
  }

  const body = new FormData()
  body.append("image", file)

  const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    body,
  })

  if (!response.ok) {
    throw new Error("The image could not be uploaded. Please try again.")
  }

  const payload = (await response.json()) as {
    data?: { display_url?: string; url?: string }
  }
  const url = payload.data?.display_url ?? payload.data?.url
  if (!url) {
    throw new Error("The upload finished without an image URL.")
  }

  return url
}
