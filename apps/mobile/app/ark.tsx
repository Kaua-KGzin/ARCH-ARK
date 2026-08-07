import { useState, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useGameStore } from '../store/useGameStore'
import { generateArkAnalysis, generateArkResponse } from '@arch-ark/shared'

const TYPE_COLORS: Record<string, string> = {
  warning: 'text-orange-400',
  recommendation: 'text-blue-400',
  praise: 'text-green-400',
  analysis: 'text-gray-300',
  quest: 'text-yellow-400',
}

export default function ArkScreen() {
  const { character, missions, stats, arkMessages, addArkMessage } = useGameStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<ScrollView>(null)

  const allMessages = arkMessages.length === 0
    ? generateArkAnalysis(character, missions, stats)
    : arkMessages

  function handleSend() {
    if (!input.trim()) return

    const userMsg = {
      id: Math.random().toString(36).substring(2),
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    addArkMessage(userMsg)

    const response = generateArkResponse(input.trim(), character, missions)
    setTimeout(() => {
      addArkMessage(response)
      scrollRef.current?.scrollToEnd({ animated: true })
    }, 500)

    setInput('')
  }

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1a1a2e]">
          <View>
            <Text className="text-white font-black text-lg">🤖 ARK</Text>
            <Text className="text-gray-500 text-xs">Sistema de Inteligência Artificial</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="text-gray-400 text-lg">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          <View className="pt-4">
            {allMessages.map(msg => (
              <View
                key={msg.id}
                className={`mb-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <View
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-[#0d0d1a] border border-[#1a1a2e]'
                  }`}
                >
                  {msg.role === 'ark' && (
                    <Text className={`text-xs font-bold mb-1 ${TYPE_COLORS[msg.type || 'analysis']}`}>
                      {msg.type === 'warning' ? '⚠️ Alerta' :
                       msg.type === 'recommendation' ? '💡 Recomendação' :
                       msg.type === 'praise' ? '🌟 Elogio' :
                       msg.type === 'quest' ? '⚔️ Missão' : '📊 Análise'}
                    </Text>
                  )}
                  <Text className="text-white text-sm leading-5">{msg.content}</Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View className="h-4" />
        </ScrollView>

        {/* Input */}
        <View className="px-4 pb-4 flex-row gap-2 border-t border-[#1a1a2e] pt-3">
          <TextInput
            className="flex-1 bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl px-4 py-3 text-white text-sm"
            placeholder="Pergunte ao ARK..."
            placeholderTextColor="#4b5563"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={handleSend}
            className="bg-blue-600 rounded-xl px-4 items-center justify-center"
          >
            <Text className="text-white font-bold">→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
