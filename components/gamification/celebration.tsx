"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CelebrationProps {
  show: boolean
  message: string
  points?: number
  type?: "success" | "achievement" | "level-up"
}

export function Celebration({ show, message, points, type = "success" }: CelebrationProps) {
  const [visible, setVisible] = useState(show)

  useEffect(() => {
    setVisible(show)
    if (show) {
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  const getBackgroundColor = () => {
    switch (type) {
      case "level-up":
        return "from-purple-500 to-pink-500"
      case "achievement":
        return "from-amber-500 to-orange-500"
      default:
        return "from-green-500 to-emerald-500"
    }
  }

  const getEmoji = () => {
    switch (type) {
      case "level-up":
        return "🎉"
      case "achievement":
        return "🏆"
      default:
        return "✨"
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className={`bg-gradient-to-r ${getBackgroundColor()} text-white px-8 py-4 rounded-2xl shadow-2xl`}>
            <div className="text-center">
              <div className="text-4xl mb-2">{getEmoji()}</div>
              <p className="text-lg font-bold">{message}</p>
              {points && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm mt-2 font-semibold">
                  +{points} Points
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Confetti component for extra celebration
export function Confetti() {
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((conf) => (
        <motion.div
          key={conf.id}
          initial={{ opacity: 1, y: -10 }}
          animate={{ opacity: 0, y: window.innerHeight + 10 }}
          transition={{ duration: conf.duration, delay: conf.delay, ease: "linear" }}
          className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
          style={{ left: `${conf.left}%` }}
        />
      ))}
    </div>
  )
}
