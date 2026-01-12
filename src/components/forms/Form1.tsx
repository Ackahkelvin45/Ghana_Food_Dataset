'use client'

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface Form1Props {
  handleNavigation: (page: number, direction?: number) => void
  direction?: number 
}

function Form1({ handleNavigation, direction = 1 }: Form1Props) {
  const variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 300 : -300, 
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300, 
      opacity: 0
    })
  }

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="flex justify-center flex-col px-10 pt-10 pb-10 items-center w-full h-fit max-w-3xl bg-white shadow-sm border border-gray-100"
    >
      <div className="text-2xl font-google  text-left w-full font-semibold">
        Ghanaian Food Image Dataset Project
      </div>

      <div className="flex flex-col gap-3 text-sm font-raleway mt-6">
        <p>Thank you for helping build the Ghanaian Food Image Dataset.</p>
        <p>
          This project aims to collect high-quality photographs of Ghanaian dishes to support research, machine learning models, and digital innovation in food recognition and cultural documentation.
        </p>
        <p>
          By completing this form, you will upload images of Ghanaian dishes and provide basic information about the food, how it was prepared, and where the image was taken. Your submission will help create a publicly available dataset that researchers, developers, and innovators can use to build new technologies—including food classification systems, nutrition estimation tools, and AI-driven applications.
        </p>
        <p>This form takes <span className="font-semibold">2–3 minutes</span> to complete.</p>
        <p>Your participation is voluntary, and your images will be used strictly for research, education, and innovation under open-data principles.</p>
      </div>

      <div className="flex flex-col gap-3 w-full font-raleway mt-6">
        <p>1. Confirm you are at least 18 years old</p>
        <p>2. Confirm you have read the Participant Information Sheet</p>
        <p>3. Confirm your voluntary participation</p>
        <p>4. Confirm you understand your images will become part of an open dataset</p>
        <p>5. Confirm images may be used for research and innovation</p>
        <p>6. Confirm you agree to proceed</p>
      </div>

      <div className="w-full flex-row flex mt-10 justify-center gap-5">
        <div className="w-full  font-google font-medium text-center flex flex-row justify-center items-center gap-2 py-2 rounded-md border border-gray-300">
          NO
        </div>
        <button
          onClick={() => handleNavigation(2, 1)} 
          className="w-full font-medium  font-google flex flex-row justify-center items-center text-white gap-2 py-2 rounded-md bg-[#ee7c2b]"
        >
          Confirm and Continue
          <ArrowRight strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  )
}

export default Form1
