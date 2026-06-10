import { useState, useRef, useEffect } from 'react'
import { Animated, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useGameStore } from '../store/useGameStore'
import { generateArkAnalysis, generateId } from '@arch-ark/shared'
import { callArkAPI } from '../lib/ark-api'

const TYPE_COLORS: Record<string, string> = {
  warning: 'text-orange-400',
  recommendation: 'text-blue-400',
  praise: 'text-green-400',
  analysis: 'text-gray-300',
  quest: 'text-yellow-400',
}

const TYPE_LABEL: Record<string, string> = {
  warning: '⚠️ Alerta',
  recommendation: '💡 Recomendação',
  praise: '🌟 Elogio',
  analysis: '📊 Análise',
  quest: '⚔️ Missão',
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const anim = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -4, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      )

    const a1 = anim(dot1, 0)
    const a2 = anim(dot2, 150)
    const a3 = anim(dot3, 300)
    a1.start(); a2.start(); a3.start()
    return () => { a1.stop(); a2.stop(); a3.stop() }
  }, [dot1, dot2, dot3])

  return (
    <View className="items-start mb-3">
      <View className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-2xl px-4 py-3 flex-row items-center gap-1.5">
        <Text className="text-cyan-400 text-xs font-mono mr-1">ARK</Text>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400/70"
            style={{ transform: [{ translateY: dot }] }}
          />
        ))}
      </View>
    </View>
  )
}

export default function ArkScreen() {
  const { character, missions, stats, arkMessages, addArkMessage } = useGameStore()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  const displayMessages = arkMessages.length === 0
    ? generateArkAnalysis(character, missions, stats)
    : arkMessages

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')

    const userMsg = {
      id: generateId(),
      role: 'user' as const,
      content: text,
      timestamp: new Date().toISOString(),
    }

    // persist initial analysis before first real message
    if (arkMessages.length === 0) {
      const analysis = generateArkAnalysis(character, missions, stats)
      analysis.forEach(m => addArkMessage(m))
    }

    addArkMessage(userMsg)
    setIsLoading(true)

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50)

    try {
      const currentHistory = arkMessages.length === 0
        ? generateArkAnalysis(character, missions, stats)
        : arkMessages

      const response = await callArkAPI(text, character, missions, stats, currentHistory)
      addArkMessage(response)
    } catch (err) {
      addArkMessage({
        id: generateId(),
        role: 'ark',
        content: `Falha na conexão com o ARK. Erro: ${err instanceof Error ? err.message : 'desconhecido'}. Tente novamente, Caçador.`,
        timestamp: new Date().toISOString(),
        type: 'warning',
      })
    } finally {
      setIsLoading(false)
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
    }
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
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-black text-lg">🤖 ARK</Text>
              <View className="flex-row items-center gap-1 bg-cyan-900/30 border border-cyan-500/20 rounded-full px-2 py-0.5">
                <View className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-green-400'}`} />
                <Text className="text-cyan-400 text-xs font-mono">{isLoading ? 'processando' : 'online'}</Text>
              </View>
            </View>
            <Text className="text-gray-500 text-xs">nvidia/nemotron-3-ultra · OpenRouter</Text>
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
            {displayMessages.map(msg => (
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
                  {msg.role === 'ark' && msg.type && (
                    <Text className={`text-xs font-bold mb-1 ${TYPE_COLORS[msg.type]}`}>
                      {TYPE_LABEL[msg.type] ?? '📊 Análise'}
                    </Text>
                  )}
                  <Text className="text-white text-sm leading-5">{msg.content}</Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))}

            {isLoading && <TypingIndicator />}
          </View>
          <View className="h-4" />
        </ScrollView>

        {/* Input */}
        <View className="px-4 pb-4 flex-row gap-2 border-t border-[#1a1a2e] pt-3">
          <TextInput
            className="flex-1 bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl px-4 py-3 text-white text-sm"
            placeholder={isLoading ? 'ARK está processando...' : 'Pergunte ao ARK...'}
            placeholderTextColor="#4b5563"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={isLoading || !input.trim()}
            className={`rounded-xl px-4 items-center justify-center ${
              isLoading || !input.trim() ? 'bg-[#1a1a2e]' : 'bg-blue-600'
            }`}
          >
            {isLoading
              ? <ActivityIndicator size="small" color="#4b5563" />
              : <Text className="text-white font-bold">→</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
