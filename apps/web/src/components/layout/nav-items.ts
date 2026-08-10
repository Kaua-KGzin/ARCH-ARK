export interface NavItem {
  href: string
  label: string
  icon: string
  /** Shown in the mobile bottom bar; everything else lives behind "Mais". */
  primary?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '⚡', primary: true },
  { href: '/missions', label: 'Missões', icon: '📋', primary: true },
  { href: '/dungeons', label: 'Dungeons', icon: '🏰', primary: true },
  { href: '/ark', label: 'ARK IA', icon: '🤖', primary: true },
  { href: '/character', label: 'Personagem', icon: '👤' },
  { href: '/skills', label: 'Habilidades', icon: '✨' },
  { href: '/gallery', label: 'Galeria IA', icon: '🖼️' },
  { href: '/inventory', label: 'Inventário', icon: '🎒' },
  { href: '/loja', label: 'Loja', icon: '🏪' },
  { href: '/achievements', label: 'Conquistas', icon: '🏆' },
  { href: '/ranking', label: 'Ranking', icon: '📊' },
]
