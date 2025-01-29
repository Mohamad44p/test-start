"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface SafeAnimationProps {
  imageUrl: string | null;
  index: number;
  currentIndex: number;
}

export function SafeAnimation({ imageUrl, index, currentIndex }: SafeAnimationProps) {
  return (
    <AnimatePresence initial={false} custom={currentIndex}>
      {currentIndex === index && (
        <motion.div
          key={index}
          custom={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="w-full aspect-square max-w-md mx-auto relative"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Safeguard illustration"
              fill
              className="rounded-lg object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

