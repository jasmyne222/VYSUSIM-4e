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
  hrContext?: string
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
  hrContext,
  onClick,
  index = 0
}: DecisionCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={!isDisabled ? { scale: 1.01 } : {}}
      whileTap={!isDisabled ? { scale: 0.99 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200',
        'flex items-start gap-4',
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-sm',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Selection indicator - larger and clearer */}
      <motion.div
        className={cn(
          'flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center mt-0.5',
          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
        )}
        animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
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
          {icon && <span className="text-xl">{icon}</span>}
          <p className="font-semibold text-foreground text-base leading-relaxed">{text}</p>
        </div>
        
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}

        {/* HR Learning Context - shows when selected */}
        {isSelected && hrContext && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-2"
          >
            <span className="text-lg flex-shrink-0">💡</span>
            <p className="text-sm text-foreground/80 leading-relaxed">{hrContext}</p>
          </motion.div>
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

      {/* Selected label */}
      {isSelected && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded"
        >
          Selectionne
        </motion.span>
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
