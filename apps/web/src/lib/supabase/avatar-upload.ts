import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Client = SupabaseClient<Database>

const MAX_AVATAR_BYTES = 3 * 1024 * 1024
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Formato não suportado. Use PNG, JPG, WEBP ou GIF.'
  if (file.size > MAX_AVATAR_BYTES) return 'Imagem muito grande (máx. 3MB).'
  return null
}

/** Sobe a foto em avatars/{userId}/avatar.<ext> (upsert) e devolve a URL pública. */
export async function uploadAvatar(supabase: Client, userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type,
  })
  if (error) throw error

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  // Cache-busting: o path é sempre o mesmo (upsert), então força o navegador a
  // buscar a versão nova em vez de servir a imagem antiga do cache.
  return `${data.publicUrl}?v=${Date.now()}`
}

export async function removeAvatar(supabase: Client, userId: string, avatarUrl: string) {
  const ext = avatarUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'png'
  const { error } = await supabase.storage.from('avatars').remove([`${userId}/avatar.${ext}`])
  if (error) throw error
}
