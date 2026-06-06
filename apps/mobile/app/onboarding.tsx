import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CharacterClass } from '@arch-ark/shared'
import { useGameStore } from '../store/useGameStore'

const CLASSES: { id: CharacterClass; icon: string; desc: string }[] = [
  { id: 'Guerreiro', icon: '⚔️', desc: 'Força e Resistência' },
  { id: 'Mago', icon: '🔮', desc: 'Inteligência e Foco' },
  { id: 'Assassino', icon: '🗡️', desc: 'Foco e Disciplina' },
  { id: 'Monarca', icon: '👑', desc: 'Atributos balanceados' },
  { id: 'Arqueiro', icon: '🏹', desc: 'Precisão e Agilidade' },
  { id: 'Curandeiro', icon: '✨', desc: 'Vitalidade e Carisma' },
]

export default function OnboardingScreen() {
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null)
  const { setupCharacter } = useGameStore()

  function handleStart() {
    if (!name.trim() || !selectedClass) {
      Alert.alert('Atenção', 'Escolha um nome e uma classe para começar.')
      return
    }
    setupCharacter(name.trim(), selectedClass)
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="items-center pt-12 pb-8">
          <Text className="text-5xl mb-4">⚡</Text>
          <Text className="text-3xl font-black text-white text-center">ARCH ARK</Text>
          <Text className="text-sm text-gray-400 text-center mt-2">
            O sistema de Solo Leveling para a vida real
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-bold text-base mb-2">Seu nome de Caçador</Text>
          <TextInput
            className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl px-4 py-3 text-white text-base"
            placeholder="Digite seu nome..."
            placeholderTextColor="#4b5563"
            value={name}
            onChangeText={setName}
            maxLength={20}
          />
        </View>

        <View className="mb-8">
          <Text className="text-white font-bold text-base mb-3">Escolha sua Classe</Text>
          <View className="flex-row flex-wrap gap-3">
            {CLASSES.map(cls => (
              <TouchableOpacity
                key={cls.id}
                onPress={() => setSelectedClass(cls.id)}
                className={`flex-1 min-w-[45%] p-4 rounded-xl border-2 items-center ${
                  selectedClass === cls.id
                    ? 'bg-blue-900/40 border-blue-500'
                    : 'bg-[#0d0d1a] border-[#1a1a2e]'
                }`}
              >
                <Text className="text-3xl mb-1">{cls.icon}</Text>
                <Text className="text-white font-bold text-sm">{cls.id}</Text>
                <Text className="text-gray-400 text-xs text-center mt-0.5">{cls.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleStart}
          className={`py-4 rounded-xl items-center mb-8 ${
            name.trim() && selectedClass ? 'bg-blue-600' : 'bg-gray-800'
          }`}
        >
          <Text className="text-white font-black text-base">
            {name.trim() && selectedClass ? 'INICIAR JORNADA ⚡' : 'Preencha os dados acima'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
