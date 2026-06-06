import { Equipment, InventoryItem, Item } from '../types/game'

export const REWARD_ITEMS: Record<string, Item> = {
  knowledgeScroll: {
    id: 'scroll-knowledge',
    name: 'Pergaminho do Conhecimento',
    description: '+20% XP por 1 hora',
    rarity: 'uncommon',
    type: 'scroll',
    icon: '📜',
    goldValue: 150,
    xpBonus: 20,
  },
  strengthScroll: {
    id: 'scroll-strength',
    name: 'Pergaminho da Força',
    description: '+5 Força temporariamente',
    rarity: 'rare',
    type: 'scroll',
    icon: '📜',
    goldValue: 300,
    attributeBonus: { strength: 5 },
  },
  energyPotion: {
    id: 'potion-energy',
    name: 'Poção de Energia',
    description: 'Restaura disposição, +10% XP',
    rarity: 'common',
    type: 'consumable',
    icon: '⚗️',
    goldValue: 50,
    xpBonus: 10,
  },
  disciplineMedal: {
    id: 'medal-discipline',
    name: 'Medalha da Disciplina',
    description: 'Prova de 7 dias consecutivos',
    rarity: 'rare',
    type: 'relic',
    icon: '🏅',
    slot: 'artifact',
    goldValue: 500,
    attributeBonus: { discipline: 4, focus: 2 },
  },
  warriorRelic: {
    id: 'relic-warrior',
    name: 'Relíquia do Guerreiro',
    description: '+10 Força e Resistência',
    rarity: 'epic',
    type: 'relic',
    icon: '🗡️',
    slot: 'artifact',
    goldValue: 1000,
    attributeBonus: { strength: 10, resistance: 10 },
  },
  hunterJacket: {
    id: 'equipment-hunter-jacket',
    name: 'Jaqueta de Caçador Rank E',
    description: 'Equipamento inicial emitido pelo Sistema.',
    rarity: 'common',
    type: 'equipment',
    icon: '🥋',
    slot: 'chest',
    goldValue: 120,
    attributeBonus: { resistance: 2, vitality: 2, discipline: 1 },
  },
  trainingGloves: {
    id: 'equipment-training-gloves',
    name: 'Luvas de Treino Arcano',
    description: '+3 Força, +2 Foco',
    rarity: 'uncommon',
    type: 'equipment',
    icon: '🥊',
    slot: 'gloves',
    goldValue: 260,
    attributeBonus: { strength: 3, focus: 2 },
  },
  focusBand: {
    id: 'equipment-focus-band',
    name: 'Faixa do Foco Absoluto',
    description: '+4 Inteligência, +4 Foco',
    rarity: 'rare',
    type: 'equipment',
    icon: '🎗️',
    slot: 'head',
    goldValue: 420,
    attributeBonus: { intelligence: 4, focus: 4 },
  },
}

export function createInventoryItem(item: Item, acquiredAt: string = new Date().toISOString()): InventoryItem {
  return {
    ...item,
    id: `${item.id}-${Math.random().toString(36).substring(2, 9)}`,
    acquiredAt,
    isEquipped: false,
  }
}

export function createStarterLoadout(acquiredAt: string = new Date().toISOString()): {
  inventory: InventoryItem[]
  equipment: Equipment
} {
  const jacket = createInventoryItem(REWARD_ITEMS.hunterJacket, acquiredAt)
  const equippedJacket = { ...jacket, isEquipped: true }

  return {
    inventory: [equippedJacket],
    equipment: { chest: equippedJacket },
  }
}

