'use client'

import { motion } from 'framer-motion'

type CharacterRole = 'chef' | 'server' | 'new-hire' | 'manager'
type Expression = 'happy' | 'neutral' | 'worried' | 'excited'

interface CharacterProps {
  role: CharacterRole
  name: string
  expression?: Expression
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  isHighlighted?: boolean
  onClick?: () => void
}

const roleColors: Record<CharacterRole, { primary: string; secondary: string; accent: string }> = {
  chef: {
    primary: 'fill-[#D64933]', // Red chef
    secondary: 'fill-white',
    accent: 'fill-[#2D3436]'
  },
  server: {
    primary: 'fill-[#2D3436]', // Black vest
    secondary: 'fill-white',
    accent: 'fill-primary'
  },
  'new-hire': {
    primary: 'fill-[#6C5CE7]', // Purple
    secondary: 'fill-[#A29BFE]',
    accent: 'fill-[#2D3436]'
  },
  manager: {
    primary: 'fill-[#00B894]', // Teal
    secondary: 'fill-[#55EFC4]',
    accent: 'fill-[#2D3436]'
  }
}

const sizeMap = {
  sm: { width: 60, height: 100 },
  md: { width: 90, height: 150 },
  lg: { width: 130, height: 220 }
}

export function Character({
  role,
  name,
  expression = 'neutral',
  size = 'md',
  showName = true,
  isHighlighted = false,
  onClick
}: CharacterProps) {
  const colors = roleColors[role]
  const { width, height } = sizeMap[size]

  const getExpressionMouth = () => {
    switch (expression) {
      case 'happy':
        return 'M42 68 Q50 76 58 68'
      case 'worried':
        return 'M42 72 Q50 66 58 72'
      case 'excited':
        return 'M44 66 Q50 78 56 66 Z'
      default:
        return 'M44 70 L56 70'
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`relative rounded-full p-1 ${isHighlighted ? 'ring-4 ring-primary ring-offset-2' : ''}`}
        animate={isHighlighted ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1.5, repeat: isHighlighted ? Infinity : 0 }}
      >
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <motion.ellipse
            cx="50"
            cy="120"
            rx="30"
            ry="35"
            className={colors.primary}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Arms */}
          <ellipse cx="20" cy="105" rx="8" ry="15" className={colors.primary} />
          <ellipse cx="80" cy="105" rx="8" ry="15" className={colors.primary} />

          {/* Head */}
          <circle cx="50" cy="50" r="32" className="fill-[#FFEAA7]" />

          {/* Hair based on role */}
          {role === 'chef' && (
            <>
              {/* Chef hat */}
              <ellipse cx="50" cy="18" rx="28" ry="15" className="fill-white" />
              <rect x="28" y="18" width="44" height="20" className="fill-white" />
            </>
          )}
          {role === 'server' && (
            <path d="M25 40 Q30 15 50 12 Q70 15 75 40" className="fill-[#2D3436]" />
          )}
          {role === 'new-hire' && (
            <>
              <path d="M22 45 Q25 20 50 15 Q75 20 78 45" className={colors.secondary} />
              {/* Ponytail */}
              <ellipse cx="70" cy="35" rx="8" ry="15" className={colors.secondary} />
            </>
          )}
          {role === 'manager' && (
            <path d="M25 42 Q30 18 50 15 Q70 18 75 42" className="fill-[#636E72]" />
          )}

          {/* Eyes */}
          <motion.circle
            cx="38"
            cy="48"
            r="5"
            className="fill-[#2D3436]"
            animate={{ scaleY: expression === 'worried' ? 0.7 : 1 }}
          />
          <motion.circle
            cx="62"
            cy="48"
            r="5"
            className="fill-[#2D3436]"
            animate={{ scaleY: expression === 'worried' ? 0.7 : 1 }}
          />

          {/* Eye highlights */}
          <circle cx="36" cy="46" r="2" className="fill-white" />
          <circle cx="60" cy="46" r="2" className="fill-white" />

          {/* Eyebrows based on expression */}
          {expression === 'worried' && (
            <>
              <line x1="32" y1="38" x2="44" y2="42" stroke="#2D3436" strokeWidth="2" strokeLinecap="round" />
              <line x1="68" y1="38" x2="56" y2="42" stroke="#2D3436" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {/* Mouth */}
          <motion.path
            d={getExpressionMouth()}
            stroke="#2D3436"
            strokeWidth="2"
            strokeLinecap="round"
            fill={expression === 'excited' ? '#FF7675' : 'none'}
          />

          {/* Role-specific accessories */}
          {role === 'server' && (
            <>
              {/* Bow tie */}
              <path d="M40 82 L50 88 L60 82 L50 78 Z" className="fill-primary" />
            </>
          )}
          {role === 'manager' && (
            <>
              {/* Tie */}
              <path d="M46 82 L50 120 L54 82 Z" className={colors.primary} />
            </>
          )}

          {/* Legs */}
          <rect x="38" y="150" width="8" height="10" rx="2" className="fill-[#2D3436]" />
          <rect x="54" y="150" width="8" height="10" rx="2" className="fill-[#2D3436]" />
        </svg>
      </motion.div>

      {showName && (
        <motion.span
          className="text-sm font-medium text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {name}
        </motion.span>
      )}
    </motion.div>
  )
}

// Pre-configured characters for the game
export function Maria(props: Omit<CharacterProps, 'role' | 'name'>) {
  return <Character role="chef" name="Maria" {...props} />
}

export function Pablo(props: Omit<CharacterProps, 'role' | 'name'>) {
  return <Character role="server" name="Pablo" {...props} />
}

export function Julie(props: Omit<CharacterProps, 'role' | 'name'>) {
  return <Character role="new-hire" name="Julie" {...props} />
}

export function Carlos(props: Omit<CharacterProps, 'role' | 'name'>) {
  return <Character role="manager" name="Carlos" {...props} />
}
