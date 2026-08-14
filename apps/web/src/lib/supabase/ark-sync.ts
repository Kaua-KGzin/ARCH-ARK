import type { SupabaseClient } from '@supabase/supabase-js'
import type { ArkMessage } from '@arch-ark/shared'
import type { Database, Tables } from '@/types/database'

type Client = SupabaseClient<Database>
type ArkMessageRow = Tables<'ark_messages'>

const HISTORY_LIMIT = 200

function rowToArkMessage(row: ArkMessageRow): ArkMessage {
  return {
    id: row.id,
    role: row.role as ArkMessage['role'],
    content: row.content,
    timestamp: row.created_at,
    type: (row.type as ArkMessage['type']) ?? undefined,
  }
}

export async function fetchArkMessages(supabase: Client, userId: string): Promise<ArkMessage[]> {
  const { data, error } = await supabase
    .from('ark_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(HISTORY_LIMIT)
  if (error) throw error
  return (data ?? []).map(rowToArkMessage)
}

export async function saveArkMessage(supabase: Client, userId: string, message: ArkMessage) {
  const { error } = await supabase.from('ark_messages').insert({
    id: message.id,
    user_id: userId,
    role: message.role,
    content: message.content,
    type: message.type ?? null,
    created_at: message.timestamp,
  })
  if (error) throw error
}
