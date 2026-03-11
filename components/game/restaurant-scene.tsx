'use client'

import { motion } from 'framer-motion'
import { Maria, Pablo, Julie, Carlos } from './characters'
import type { Expression } from './characters'

interface RestaurantSceneProps {
  highlightedCharacter?: 'maria' | 'pablo' | 'julie' | 'carlos' | null
  characterExpressions?: {
    maria?: Expression
    pablo?: Expression
    julie?: Expression
    carlos?: Expression
  }
  onCharacterClick?: (name: string) => void
  showAllCharacters?: boolean
}

type Expression = 'happy' | 'neutral' | 'worried' | 'excited'

export function RestaurantScene({
  highlightedCharacter,
  characterExpressions = {},
  onCharacterClick,
  showAllCharacters = true
}: RestaurantSceneProps) {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl">
      {/* Background - Restaurant Interior */}
      <svg
        viewBox="0 0 800 500"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Sky / Window */}
        <defs>
          <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFB347" />
            <stop offset="50%" stopColor="#FFCC80" />
            <stop offset="100%" stopColor="#FFF8E1" />
          </linearGradient>
          <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="100%" stopColor="#6B5344" />
          </linearGradient>
          <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="100%" stopColor="#F5E6D3" />
          </linearGradient>
        </defs>

        {/* Wall */}
        <rect x="0" y="0" width="800" height="350" fill="url(#wallGradient)" />

        {/* Window with sunset */}
        <rect x="300" y="40" width="200" height="150" fill="url(#sunsetSky)" rx="8" />
        <rect
          x="300"
          y="40"
          width="200"
          height="150"
          fill="none"
          stroke="#8B7355"
          strokeWidth="12"
          rx="8"
        />
        {/* Window panes */}
        <line x1="400" y1="40" x2="400" y2="190" stroke="#8B7355" strokeWidth="6" />
        <line x1="300" y1="115" x2="500" y2="115" stroke="#8B7355" strokeWidth="6" />

        {/* Decorative elements on wall */}
        {/* Picture frame 1 */}
        <rect x="80" y="60" width="80" height="60" fill="#DDD" stroke="#8B7355" strokeWidth="4" rx="2" />
        <rect x="88" y="68" width="64" height="44" fill="#E8B89D" />
        
        {/* Picture frame 2 */}
        <rect x="620" y="60" width="80" height="60" fill="#DDD" stroke="#8B7355" strokeWidth="4" rx="2" />
        <rect x="628" y="68" width="64" height="44" fill="#A8D8A8" />

        {/* Hanging light fixtures */}
        <line x1="200" y1="0" x2="200" y2="80" stroke="#2D3436" strokeWidth="2" />
        <ellipse cx="200" cy="90" rx="30" ry="20" fill="#FFE4B5" />
        <ellipse cx="200" cy="95" rx="25" ry="15" fill="#FFD700" opacity="0.3" />

        <line x1="600" y1="0" x2="600" y2="80" stroke="#2D3436" strokeWidth="2" />
        <ellipse cx="600" cy="90" rx="30" ry="20" fill="#FFE4B5" />
        <ellipse cx="600" cy="95" rx="25" ry="15" fill="#FFD700" opacity="0.3" />

        {/* Floor */}
        <rect x="0" y="350" width="800" height="150" fill="url(#floorGradient)" />

        {/* Floor tiles pattern */}
        {[...Array(9)].map((_, i) => (
          <line
            key={`vline-${i}`}
            x1={i * 100}
            y1="350"
            x2={i * 100}
            y2="500"
            stroke="#5D4037"
            strokeWidth="2"
            opacity="0.3"
          />
        ))}

        {/* Tables */}
        {/* Table 1 - Left */}
        <ellipse cx="150" cy="380" rx="60" ry="20" fill="#D4A574" />
        <rect x="140" y="380" width="20" height="60" fill="#8B7355" />
        
        {/* Table 2 - Right */}
        <ellipse cx="650" cy="380" rx="60" ry="20" fill="#D4A574" />
        <rect x="640" y="380" width="20" height="60" fill="#8B7355" />

        {/* Counter / Bar in back */}
        <rect x="50" y="280" width="250" height="70" fill="#6B4423" rx="4" />
        <rect x="50" y="270" width="250" height="15" fill="#8B5A2B" rx="2" />
        
        {/* Pizza oven suggestion */}
        <ellipse cx="700" cy="300" rx="50" ry="40" fill="#8B4513" />
        <ellipse cx="700" cy="295" rx="35" ry="25" fill="#2D3436" />
        <motion.ellipse
          cx="700"
          cy="295"
          rx="25"
          ry="15"
          fill="#FF6B35"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Checkered tablecloths on tables */}
        <pattern id="checkers" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="#D64933" />
          <rect x="5" y="5" width="5" height="5" fill="#D64933" />
        </pattern>
      </svg>

      {/* Characters positioned in the scene */}
      {showAllCharacters && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-around items-end px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Maria
              expression={characterExpressions.maria || 'happy'}
              isHighlighted={highlightedCharacter === 'maria'}
              onClick={() => onCharacterClick?.('maria')}
              size="md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Pablo
              expression={characterExpressions.pablo || 'neutral'}
              isHighlighted={highlightedCharacter === 'pablo'}
              onClick={() => onCharacterClick?.('pablo')}
              size="md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Julie
              expression={characterExpressions.julie || 'excited'}
              isHighlighted={highlightedCharacter === 'julie'}
              onClick={() => onCharacterClick?.('julie')}
              size="md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Carlos
              expression={characterExpressions.carlos || 'neutral'}
              isHighlighted={highlightedCharacter === 'carlos'}
              onClick={() => onCharacterClick?.('carlos')}
              size="md"
            />
          </motion.div>
        </div>
      )}

      {/* Warm ambient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/10 via-transparent to-amber-100/20 pointer-events-none" />
    </div>
  )
}
