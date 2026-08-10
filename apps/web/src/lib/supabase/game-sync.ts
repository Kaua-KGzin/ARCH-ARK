import type { SupabaseClient } from '@supabase/supabase-js'
import type { Character, GameState } from '@arch-ark/shared'
import type { Database, Tables, TablesInsert } from '@/types/database'

type CharacterRow = Tables<'characters'>
type Client = SupabaseClient<Database>

// Everything in GameState that isn't a top-level `character` field and isn't
// synced through its own table (arkMessages) lives in the `game_data` blob —
// same shape the Zustand store already persists locally, so the mapping is
// a straight pick/spread instead of a field-by-field rewrite.
type GameDataBlob = Pick<
  GameState,
  | 'missions'
  | 'inventory'
  | 'equipment'
  | 'achievements'
  | 'dungeons'
  | 'bosses'
  | 'skills'
  | 'titles'
  | 'stats'
  | 'isOnboarded'
  | 'lastDailyReset'
  | 'prophecy'
  | 'prophecyDate'
  | 'contentVersion'
>

export function rowToGameState(row: CharacterRow): Partial<GameState> {
  const blob = (row.game_data ?? {}) as Partial<GameDataBlob>
  const character: Character = {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    class: row.class as Character['class'],
    level: row.level,
    currentXp: row.current_xp,
    xpToNextLevel: row.xp_to_next_level,
    totalXp: row.total_xp,
    rank: row.rank as Character['rank'],
    rankPoints: row.rank_points,
    attributes: row.attributes as unknown as Character['attributes'],
    title: row.title,
    createdAt: row.created_at,
    streak: row.streak,
    longestStreak: row.longest_streak,
    lastActivityDate: row.last_activity_date,
    gold: row.gold,
    rankResetDate: row.rank_reset_date ?? undefined,
  }

  return {
    character,
    settings: (row.settings as unknown as GameState['settings']) ?? undefined,
    ...blob,
  }
}

export function stateToRow(userId: string, state: GameState): TablesInsert<'characters'> {
  const { character } = state
  const gameData: GameDataBlob = {
    missions: state.missions,
    inventory: state.inventory,
    equipment: state.equipment,
    achievements: state.achievements,
    dungeons: state.dungeons,
    bosses: state.bosses,
    skills: state.skills,
    titles: state.titles,
    stats: state.stats,
    isOnboarded: state.isOnboarded,
    lastDailyReset: state.lastDailyReset,
    prophecy: state.prophecy,
    prophecyDate: state.prophecyDate,
    contentVersion: state.contentVersion,
  }

  return {
    user_id: userId,
    name: character.name,
    avatar: character.avatar,
    class: character.class,
    level: character.level,
    current_xp: character.currentXp,
    xp_to_next_level: character.xpToNextLevel,
    total_xp: character.totalXp,
    rank: character.rank,
    rank_points: character.rankPoints,
    attributes: character.attributes,
    title: character.title,
    streak: character.streak,
    longest_streak: character.longestStreak,
    last_activity_date: character.lastActivityDate,
    gold: character.gold,
    rank_reset_date: character.rankResetDate ?? null,
    settings: state.settings,
    game_data: gameData,
  } as unknown as TablesInsert<'characters'>
}

export async function fetchCharacterRow(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function createCharacterRow(supabase: Client, userId: string, state: GameState) {
  const { error } = await supabase.from('characters').insert(stateToRow(userId, state))
  if (error) throw error
}

export async function saveCharacterRow(supabase: Client, userId: string, state: GameState) {
  const { error } = await supabase
    .from('characters')
    .update(stateToRow(userId, state))
    .eq('user_id', userId)
  if (error) throw error
}
