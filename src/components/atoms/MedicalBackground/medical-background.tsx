import { FC } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MedicalBackgroundProps {
  className?: string
  containerClassName?: string
}

export const MedicalBackground: FC<MedicalBackgroundProps> = ({
  className,
  containerClassName,
}) => {
  const waveVariants = {
    animate: {
      d: [
        "M0 50 C20 40, 40 60, 60 50 S80 40, 100 50",
        "M0 50 C20 60, 40 40, 60 50 S80 60, 100 50",
        "M0 50 C20 40, 40 60, 60 50 S80 40, 100 50",
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const rotateVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const floatVariants = {
    animate: {
      y: ["0%", "-30%", "0%"],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-[#0A0F1E]", containerClassName)}>
      {/* Base Layer - Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          filter: 'contrast(170%) brightness(900%)'
        }}
      />

      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 30% 30%, rgba(255, 106, 136, 0.4), transparent 70%)',
            'radial-gradient(circle at 70% 70%, rgba(106, 255, 175, 0.4), transparent 70%)',
            'radial-gradient(circle at 30% 70%, rgba(106, 136, 255, 0.4), transparent 70%)',
            'radial-gradient(circle at 30% 30%, rgba(255, 106, 136, 0.4), transparent 70%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Abstract Shapes */}
      <div className="absolute inset-0">
        {/* Rotating Hexagon Grid */}
        <motion.div
          variants={rotateVariants}
          animate="animate"
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(transparent 0%, transparent calc(50% - 1px), rgba(255, 255, 255, 0.1) 50%, transparent calc(50% + 1px), transparent 100%),
              linear-gradient(90deg, transparent 0%, transparent calc(50% - 1px), rgba(255, 255, 255, 0.1) 50%, transparent calc(50% + 1px), transparent 100%)
            `,
            backgroundSize: '60px 60px',
            opacity: 0.3,
            transformOrigin: 'center'
          }}
        />

        {/* Floating Elements */}
        <div className="absolute inset-0">
          {/* Abstract DNA */}
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="absolute left-[20%] top-[30%] w-40 h-40"
            style={{ filter: 'blur(1px)' }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <motion.path
                d="M20,50 Q50,20 80,50 T140,50"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="0.5"
                strokeDasharray="4 2"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6A88" />
                  <stop offset="100%" stopColor="#6A88FF" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Pulse Rings */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute right-[30%] top-[40%] w-32 h-32"
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#6AFFAF" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#6AFFAF" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="#6AFFAF" strokeWidth="0.5" />
            </svg>
          </motion.div>
        </div>

        {/* Animated Wave Pattern */}
        <div className="absolute inset-x-0 bottom-0">
          <svg width="100%" height="200" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              variants={waveVariants}
              animate="animate"
              fill="none"
              stroke="url(#wave-gradient)"
              strokeWidth="0.3"
              d="M0 50 C20 40, 40 60, 60 50 S80 40, 100 50"
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6A88FF" />
                <stop offset="50%" stopColor="#6AFFAF" />
                <stop offset="100%" stopColor="#FF6A88" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Glowing Orbs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(106, 255, 175, 0.2), transparent 70%)',
              filter: 'blur(40px)'
            }}
          />
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(255, 106, 136, 0.15), transparent 70%)',
              filter: 'blur(60px)'
            }}
          />
        </div>

        {/* Particle System */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/20"
              animate={{
                y: [0, -200, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 