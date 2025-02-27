"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ReusableHeroProps {
  badge: string;
  title: string;
  highlightedWord: string;
  description: string;
  objectives?: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  imageSrc: string;
  imageAlt: string;
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  secondaryButtonProps?: {
    href: string;
    text: string;
  };
}

export default function ReusableHero({
  badge,
  title,
  highlightedWord,
  description,
  objectives,
  imageSrc,
  imageAlt,
  features,
}: ReusableHeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-100 via-white to-blue-100 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
              >
                {badge}
              </motion.span>
              
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1E78C2]"
                >
                  {title}{" "}
                  <span className="text-blue-600 relative">
                    {highlightedWord}
                  </span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="space-y-4">
                    {objectives && (
                      <div
                        className="text-lg text-gray-600 prose prose-blue max-w-none prose-p:leading-relaxed prose-headings:text-gray-900"
                        dangerouslySetInnerHTML={{ __html: objectives }}
                      />
                    )}
                    <div
                      className="text-lg text-[#481640]"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-8"
            >
              <div className="aspect-[2/1] relative">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-contain rounded-lg shadow-lg"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {features && features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
