'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface VyvyBotProps {
  message?: string
  expression?: 'happy' | 'thinking' | 'excited' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  showSpeechBubble?: boolean
  onMessageComplete?: () => void
}

export function VyvyBot({
  message,
  expression = 'happy',
  size = 'md',
  showSpeechBubble = true,
  onMessageComplete
}: VyvyBotProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isBlinking, setIsBlinking] = useState(false)

  const sizeMap = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 180, height: 180 }
  }

  const { width, height } = sizeMap[size]

  // Typewriter effect
  useEffect(() => {
    if (!message) {
      setDisplayedText('')
      return
    }

    setDisplayedText('')
    let index = 0
    const interval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        onMessageComplete?.()
      }
    }, 30)

    return () => clearInterval(interval)
  }, [message, onMessageComplete])

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(blinkInterval)
  }, [])

  const eyeVariants = {
    open: { scaleY: 1 },
    closed: { scaleY: 0.1 }
  }

  const bodyBounce = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  const getExpressionEyes = () => {
    switch (expression) {
      case 'excited':
        return { leftEye: '>', rightEye: '<' }
      case 'thinking':
        return { leftEye: 'o', rightEye: '?' }
      default:
        return { leftEye: null, rightEye: null }
    }
  }

  const { leftEye, rightEye } = getExpressionEyes()

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Speech Bubble - Professional Vysual style */}
      <AnimatePresence>
        {showSpeechBubble && message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="relative max-w-sm rounded-lg bg-card px-4 py-3 text-card-foreground shadow-md border border-border/80"
          >
            <p className="text-sm leading-relaxed">{displayedText}</p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-card border-r border-b border-border/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Owl Body */}
      <motion.div
        variants={bodyBounce}
        animate="animate"
        style={{ width, height }}
        className="relative"
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Body - Warm orange owl */}
          <motion.ellipse
            cx="60"
            cy="70"
            rx="45"
            ry="40"
            className="fill-primary"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Belly */}
          <ellipse
            cx="60"
            cy="78"
            rx="30"
            ry="28"
            className="fill-secondary"
          />

          {/* Left Wing */}
          <motion.path
            d="M15 60 Q10 80 25 95 Q35 85 30 65 Z"
            className="fill-primary/80"
            animate={expression === 'excited' ? { rotate: [-5, 5, -5] } : {}}
            transition={{ duration: 0.3, repeat: expression === 'excited' ? Infinity : 0 }}
            style={{ transformOrigin: '25px 75px' }}
          />

          {/* Right Wing */}
          <motion.path
            d="M105 60 Q110 80 95 95 Q85 85 90 65 Z"
            className="fill-primary/80"
            animate={expression === 'excited' ? { rotate: [5, -5, 5] } : {}}
            transition={{ duration: 0.3, repeat: expression === 'excited' ? Infinity : 0 }}
            style={{ transformOrigin: '95px 75px' }}
          />

          {/* Head feathers / ears */}
          <path
            d="M30 35 Q35 15 45 30 Q40 25 35 32 Z"
            className="fill-primary"
          />
          <path
            d="M90 35 Q85 15 75 30 Q80 25 85 32 Z"
            className="fill-primary"
          />

          {/* Left Eye white */}
          <circle cx="42" cy="50" r="16" className="fill-card" />
          {/* Right Eye white */}
          <circle cx="78" cy="50" r="16" className="fill-card" />

          {/* Left Pupil */}
          {leftEye ? (
            <text x="42" y="55" textAnchor="middle" className="fill-foreground text-lg font-bold">
              {leftEye}
            </text>
          ) : (
            <motion.ellipse
              cx="44"
              cy="50"
              rx="6"
              ry="8"
              className="fill-foreground"
              variants={eyeVariants}
              animate={isBlinking ? 'closed' : 'open'}
            />
          )}

          {/* Right Pupil */}
          {rightEye ? (
            <text x="78" y="55" textAnchor="middle" className="fill-foreground text-lg font-bold">
              {rightEye}
            </text>
          ) : (
            <motion.ellipse
              cx="76"
              cy="50"
              rx="6"
              ry="8"
              className="fill-foreground"
              variants={eyeVariants}
              animate={isBlinking ? 'closed' : 'open'}
            />
          )}

          {/* Beak */}
          <path
            d="M60 58 L54 70 L60 67 L66 70 Z"
            className="fill-accent"
          />

          {/* Feet */}
          <ellipse cx="48" cy="108" rx="8" ry="4" className="fill-accent" />
          <ellipse cx="72" cy="108" rx="8" ry="4" className="fill-accent" />
        </svg>
      </motion.div>
    </div>
  )
}
