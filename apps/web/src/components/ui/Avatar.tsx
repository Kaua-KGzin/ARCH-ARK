import { cn } from '@/lib/utils'

interface AvatarProps {
  avatarUrl?: string | null
  emoji: string
  alt: string
  /** Classes de tamanho/forma/borda do container (ex.: "w-10 h-10 rounded-full border ...") */
  className: string
  /** Classes de tamanho de fonte do emoji, quando não há avatarUrl */
  emojiClassName?: string
}

export function Avatar({ avatarUrl, emoji, alt, className, emojiClassName = 'text-xl' }: AvatarProps) {
  return (
    <div className={cn('flex items-center justify-center overflow-hidden flex-shrink-0', className)}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL de storage externa/variável, sem domínio fixo pra next/image
        <img src={avatarUrl} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className={emojiClassName}>{emoji}</span>
      )}
    </div>
  )
}
