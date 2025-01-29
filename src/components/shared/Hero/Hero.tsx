"use client"

import { motion, AnimatePresence, useAnimation } from "framer-motion"
import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { RainbowButton } from "../../ui/rainbow-button"
import { Navbar } from "../Nav/Navbar"
import AnimatedNetworkBackground from "../Nav/AnimatedBackground"
import { useLanguage } from "@/context/LanguageContext"

const STEP_DURATION = 5000

interface HeroStepData {
  title_en: string
  title_ar: string
  tagline_en: string
  tagline_ar: string
  description_en: string
  description_ar: string
  color: string
  imageUrl: string
}

interface ProcessedStep {
  title: string
  tagline: string
  description: string
  color: string
  imageUrl: string
}

interface HeroProps {
  steps: Record<number, HeroStepData>
}

const Hero = ({ steps }: HeroProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [key, setKey] = useState(0)
  const controls = useAnimation()
  const progressControls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentLang } = useLanguage()

  const currentSteps: ProcessedStep[] = Object.values(steps).map((step) => ({
    title: currentLang === 'ar' ? step.title_ar : step.title_en,
    tagline: currentLang === 'ar' ? step.tagline_ar : step.tagline_en,
    description: currentLang === 'ar' ? step.description_ar : step.description_en,
    color: step.color,
    imageUrl: step.imageUrl,
  }))

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev + 1) % currentSteps.length)
    setKey((prev) => prev + 1)
  }, [currentSteps.length])

  useEffect(() => {
    const interval = setInterval(nextStep, STEP_DURATION)
    return () => clearInterval(interval)
  }, [nextStep])

  useEffect(() => {
    controls.start({
      backgroundColor: `${currentSteps[currentStep].color}10`,
      transition: { duration: 0.5, ease: "easeInOut" },
    })

    progressControls.set({ width: "0%" })
    progressControls.start({
      width: "100%",
      transition: { duration: STEP_DURATION / 1000, ease: "linear" },
    })
  }, [currentStep, controls, progressControls, currentSteps])

  const handleTabClick = (index: number) => {
    setCurrentStep(index)
    setKey((prev) => prev + 1)
  }

  const gradientStyle = {
    backgroundImage: `
      radial-gradient(circle at 50% -100px, ${currentSteps[currentStep].color}10, transparent 400px),
      radial-gradient(circle at 100% 50%, ${currentSteps[(currentStep + 1) % currentSteps.length].color}05, transparent 400px),
      radial-gradient(circle at 0% 100%, ${currentSteps[(currentStep + 2) % currentSteps.length].color}05, transparent 400px)
    `,
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden transition-all duration-500 ease-in-out ${
        currentLang === "ar" ? "rtl" : "ltr"
      }`}
      animate={{
        backgroundColor: `${currentSteps[currentStep].color}05`,
        transition: { duration: 0.5, ease: "easeInOut" },
      }}
      style={gradientStyle}
    >
      <AnimatedNetworkBackground color={currentSteps[currentStep].color} />
      <Navbar />
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-80px)] py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStep}-${currentLang}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block"
                >
                  <span
                    className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${currentSteps[currentStep].color}20`,
                      color: "#862996",
                    }}
                  >
                    {currentSteps[currentStep].tagline}
                  </span>
                </motion.div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="block bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${currentSteps[currentStep].color}, ${currentSteps[(currentStep + 1) % currentSteps.length].color})`,
                    }}
                  >
                    {currentSteps[currentStep].title}
                  </motion.span>
                  <span className="block mt-2">{currentLang === "ar" ? "حلول" : "Solutions"}</span>
                </h1>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-[#142451] leading-relaxed max-w-xl"
              >
                {currentSteps[currentStep].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-4"
              >
                <RainbowButton
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg shadow-current/20 hover:shadow-xl hover:shadow-current/30 transition-all duration-300"
                  style={{
                    backgroundColor: currentSteps[currentStep].color,
                    color: "white",
                  }}
                >
                  {currentLang === "ar" ? " ابدأ الآن " : " Get Started Now "}
                </RainbowButton>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <motion.div className="space-y-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.95, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.05, rotateY: 15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] rounded-2xl bg-white/50 shadow-xl overflow-hidden backdrop-blur-sm"
                style={{ boxShadow: `0 0 40px ${currentSteps[currentStep].color}30` }}
              >
                <Image
                  src={currentSteps[currentStep].imageUrl || "/placeholder.svg"}
                  alt={currentSteps[currentStep].title}
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to top, ${currentSteps[currentStep].color}20, transparent)`,
                  }}
                />
              </motion.div>
            </AnimatePresence>

            <div className="space-y-6">
              <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between gap-4">
                {currentSteps.map((step, index) => (
                  <motion.button
                    key={index}
                    className={`text-xs sm:text-sm font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 flex-grow md:flex-grow-0 ${
                      index === currentStep ? "text-white shadow-lg" : "bg-white/50 hover:bg-white/80"
                    }`}
                    style={{
                      backgroundColor: index === currentStep ? step.color : "transparent",
                      border: `2px solid ${step.color}`,
                      color: index === currentStep ? "white" : step.color,
                    }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: step.color,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTabClick(index)}
                  >
                    {step.title}
                  </motion.button>
                ))}
              </div>
              <motion.div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  key={key}
                  className="h-full"
                  style={{ backgroundColor: currentSteps[currentStep].color }}
                  initial={{ width: "0%" }}
                  animate={progressControls}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Hero

