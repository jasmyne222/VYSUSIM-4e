'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface DecisionCardProps {
  id: string
  text: string
  description?: string
  icon?: React.ReactNode
  isSelected?: boolean
  isDisabled?: boolean
  consequence?: string
  onClick?: () => void
  index?: number
}

export function DecisionCard({
  text,
  description,
  icon,
  isSelected = false,
  isDisabled = false,
  consequence,
  onClick,
  index = 0
}: DecisionCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
        'flex items-start gap-3',
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
          : 'border-border bg-card hover:border-primary/50 hover:bg-card/80',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Selection indicator */}
      <motion.div
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center',
          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
        )}
        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            <Check className="w-4 h-4 text-primary-foreground" />
          </motion.div>
        )}
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <p className="font-medium text-foreground leading-relaxed">{text}</p>
        </div>
        
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}

        {/* Consequence reveal on selection */}
        {isSelected && consequence && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 text-sm text-muted-foreground italic"
          >
            {consequence}
          </motion.p>
        )}
      </div>

      {/* Glow effect when selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/5 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}

interface DecisionGroupProps {
  title?: string
  description?: string
  children: React.ReactNode
}

export function DecisionGroup({ title, description, children }: DecisionGroupProps) {
  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  )
}
