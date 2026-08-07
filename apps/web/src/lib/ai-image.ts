export interface GeneratedImage {
  id: string
  prompt: string
  url: string
  authorName: string
  createdAt: string
  likes: number
  category: string
}

const IMAGE_CACHE_KEY = 'arch_ark_ai_image_cache'

export function getCachedImages(): GeneratedImage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(IMAGE_CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function saveCachedImages(images: GeneratedImage[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(images))
  } catch (e) {
    console.error('Failed to save images cache', e)
  }
}

export async function generateAIImage(prompt: string, category: string = 'avatar'): Promise<GeneratedImage> {
  const sanitizedPrompt = encodeURIComponent(prompt.trim())
  const seed = Math.floor(Math.random() * 100000)

  // Utiliza Pollinations.ai & Unsplash como motor gratuito de geração dinâmica por IA sem limites do Spark Plan
  const imageUrl = `https://pollinations.ai/p/${sanitizedPrompt}?width=800&height=800&seed=${seed}&nologo=true`

  const newImage: GeneratedImage = {
    id: `img_${Date.now()}_${seed}`,
    prompt: prompt.trim(),
    url: imageUrl,
    authorName: 'Monarca AI',
    createdAt: new Date().toISOString(),
    likes: Math.floor(Math.random() * 15) + 1,
    category,
  }

  const existing = getCachedImages()
  saveCachedImages([newImage, ...existing])

  return newImage
}

export const DEMO_FEED_IMAGES: GeneratedImage[] = [
  {
    id: 'demo_1',
    prompt: 'Shadow Monarch Jinwoo glowing purple armor cybernetic solo leveling style',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    authorName: 'System Core',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 142,
    category: 'character',
  },
  {
    id: 'demo_2',
    prompt: 'Futuristic Cyberpunk Monarch Fortress glowing cyan neon lights dungeon core',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    authorName: 'Ark Assistant',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 89,
    category: 'dungeon',
  },
  {
    id: 'demo_3',
    prompt: 'Legendary Monarch Sword infused with celestial dark blue flames high detail',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
    authorName: 'Shadow Hunter',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    likes: 215,
    category: 'relic',
  },
]
