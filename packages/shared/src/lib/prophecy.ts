import { Character } from '../types/game'

const PROPHECIES: string[] = [
  'Hoje, um portão de luz se abrirá diante de você. Atravesse-o com coragem — a recompensa além é maior que o medo.',
  'As sombras da procrastinação tentarão te envolver. Cada missão concluída é uma chama que as dissipa.',
  'A força não nasce do descanso, mas da luta. Um treino hoje vale mais que mil intenções amanhã.',
  'O conhecimento é a arma mais letal que existe. Afie sua mente e nenhum desafio resistirá.',
  'Sua sequência é sua lâmina. Proteja-a como se sua vida dependesse disso — porque depende.',
  'Os grandes caçadores não esperam a sorte. Eles criam oportunidades com disciplina e repetição.',
  'Um passo pequeno hoje é um salto colossal em um mês. Comece agora, Caçador.',
  'O sistema observa cada escolha sua. O que você fará hoje para que ele registre um feito lendário?',
  'Hábitos são feitiços lançados repetidamente. Escolha seus encantamentos com sabedoria.',
  'A mente pode criar monstros — ou matá-los. O foco é sua magia mais poderosa.',
  'Ninguém chega ao rank S sem atravessar o rank E. Honre sua jornada, um nível por vez.',
  'Hoje o inimigo não tem nome, mas tem rosto: a desculpa. Derrote-a antes do almoço.',
  'O ouro se gasta, o XP permanece. Invista em você — é o único investimento sem risco.',
  'Seus atributos não mentem. Onde você tem treinado? Fortaleça o que mais importa agora.',
  'A noite passada é história; o despertar de hoje é a página em branco. Escreva algo épico.',
  'Dungeons difíceis dão as melhores recompensas. Não fuja do desafio de hoje.',
  'A comparação é o veneno do caçador. Você só compete com a versão de ontem de si mesmo.',
  'Um guerreiro sábio sabe quando descansar. Mas nunca confunde descanso com fuga.',
  'O foco de 60 minutos vale mais que 6 horas de atenção dividida. Proteja sua concentração.',
  'Toda lenda começa com um primeiro passo desajeitado. O seu já foi dado — continue.',
  'O mana de um Mago se regenera, mas a disciplina não. Ela se constrói, um dia de cada vez.',
  'Você está a poucos dias de uma nova conquista. O sistema já sabe. E você?',
  'Hoje, escolha a dificuldade que te assusta um pouco. É ali que o XP extra mora.',
  'Seu eu do futuro está te observando com esperança. Não o decepcione.',
]

/** Profecia determinística do dia (fallback local quando o Gemini está indisponível). */
export function generateLocalProphecy(character: Character): string {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
  const base = PROPHECIES[dayOfYear % PROPHECIES.length]
  return `${base} ${character.name}, rank ${character.rank} — o Sistema aguarda sua jogada.`
}
