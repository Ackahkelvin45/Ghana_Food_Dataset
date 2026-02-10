'use client'

import Image from "next/image"
import { motion } from "framer-motion"
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

interface CompletedProps {
  handleNavigation: (page: number, direction?: number) => void
}

function Completed({ handleNavigation }: CompletedProps) {
  const { width, height } = useWindowSize()
  return (
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center items-center w-full max-w-3xl bg-white shadow-sm border border-gray-100 rounded-lg px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12"
    >
        <Confetti width={width} height={height} />
      <div className="flex flex-col items-center text-center">
        {/* Success icon */}
     
        {/* Finish illustration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative h-60  w-full  mb-8"
        >
          <Image
            src="/finish.png"
            alt="Submission complete"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl sm:text-2xl md:text-3xl font-google font-semibold text-gray-900 mb-3"
        >
          You&apos;re all done!
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-base font-raleway text-gray-600 mb-2 max-w-md"
        >
          Thank you for contributing to the Ghanaian Food Image Dataset.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-sm font-raleway text-gray-500 mb-10 max-w-md"
        >
          Your images and information will help researchers and developers build better food recognition systems.
        </motion.p>

        {/* CTA: Submit more or go home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => handleNavigation(1, -1)}
            className="px-8 py-3 rounded-md font-google font-medium text-white bg-[#ee7c2b] hover:bg-[#d66a1f] transition-colors shadow-sm"
          >
            Submit another image
          </button>
          <a
            href="/"
            className="px-8 py-3 rounded-md font-google font-medium text-center border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to home
          </a>
        </motion.div>
      </div>
    </motion.div>
    
  )
}

export default Completed
