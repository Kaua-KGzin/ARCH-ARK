import { Skill, Character } from '../types/game'

export const SYSTEM_SKILLS: Skill[] = [
  {
    id: 'sprint_master',
    name: 'Sprint do Monarca',
    description: '+15% de XP em missões de exercício físico.',
    icon: '⚡',
    type: 'passive',
    category: 'strength',
    requiredLevel: 2,
    isUnlocked: false,
    isEquipped: false,
    effect: {
      xpMultiplier: 1.15
    }
  },
  {
    id: 'hyper_focus',
    name: 'Foco Hiper-Dimensional',
    description: '+20% de XP em missões de estudo e leitura.',
    icon: '🧠',
    type: 'passive',
    category: 'intelligence',
    requiredLevel: 3,
    isUnlocked: false,
    isEquipped: false,
    effect: {
      xpMultiplier: 1.20
    }
  },
  {
    id: 'iron_will',
    name: 'Vontade de Ferro',
    description: '+10 em Disciplina e +10% bônus no Streak diário.',
    icon: '🛡️',
    type: 'passive',
    category: 'discipline',
    requiredLevel: 5,
    isUnlocked: false,
    isEquipped: false,
    effect: {
      statBonus: { discipline: 10 },
      streakBonusMultiplier: 1.1
    }
  },
  {
    id: 'shadow_extraction',
    name: 'Extração de Sombras',
    description: '+25% de Ouro obtido em todas as missões e masmorras.',
    icon: '👤',
    type: 'active',
    category: 'shadow',
    requiredLevel: 8,
    isUnlocked: false,
    isEquipped: false,
    effect: {
      goldMultiplier: 1.25
    }
  },
  {
    id: 'domain_expansion',
    name: 'Domínio do Sistema',
    description: '+15% XP e +15% Ouro em todas as atividades.',
    icon: '👑',
    type: 'active',
    category: 'shadow',
    requiredLevel: 12,
    isUnlocked: false,
    isEquipped: false,
    effect: {
      xpMultiplier: 1.15,
      goldMultiplier: 1.15
    }
  }
]

export function checkSkillUnlocks(character: Character, currentSkills: Skill[]): Skill[] {
  return currentSkills.map(skill => {
    if (skill.isUnlocked) return skill
    if (character.level >= skill.requiredLevel) {
      return { ...skill, isUnlocked: true }
    }
    return skill
  })
}
