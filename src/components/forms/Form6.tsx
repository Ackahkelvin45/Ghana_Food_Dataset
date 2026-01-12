'use client'

import { ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface Form6Props {
  handleNavigation: (page: number, direction?: number) => void
  direction?: number
}

function Form6({ handleNavigation, direction = 1 }: Form6Props) {
  const [confirmation, setConfirmation] = useState('')

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

  const handleSubmit = () => {
    // Here you would typically submit all form data
    alert('Thank you for contributing to the Ghanaian Food Image Dataset! Your submission has been recorded successfully.')

    // Reset to first form
    handleNavigation(1, -1)
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


      <div className="w-full mt-6">
        <h3 className="text-2xl  font-google font-semibold mb-4">Final Confirmation</h3>
        <p className="text-base font-raleway text-gray-700 mb-6">
          Please confirm that the information you provided is accurate and indicate whether you would like to submit more images. Thank you for contributing to the Ghanaian Food Image Dataset and supporting research and innovation.
        </p>

        {/* Confirmation Question */}
        <div className="mb-6">
          <label className="block text-base font-raleway font-medium mb-3">
            Please confirm that the information you have provided is accurate to the best of your knowledge? <span className="text-red-500">*</span>
          </label>
          <div className="flex  font-raleway flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="confirmation"
                value="yes"
                checked={confirmation === 'yes'}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                required
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="confirmation"
                value="no"
                checked={confirmation === 'no'}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                required
              />
              <span className="text-sm">No</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="confirmation"
                value="dontknow"
                checked={confirmation === 'dontknow'}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                required
              />
              <span className="text-sm">Don't Know</span>
            </label>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-6 p-4 flex flex-row  font-raleway  gap-2 bg-blue-50 border border-blue-200 rounded-md">
        <svg className="w-4 h-4 me-2 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="#1e40af" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>

          <p className="text-sm text-blue-800">
            <strong>Thank you for your contribution!</strong> Your images and information will help researchers, developers, and innovators build better food recognition systems and nutrition estimation tools for Ghanaian cuisine.
          </p>
        </div>
      </div>

      <div className="w-full font-google flex-row flex mt-10 justify-center gap-5">
        <button
          onClick={() => handleNavigation(5, -1)}
          className="w-full font-medium text-center flex flex-row justify-center items-center gap-2 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={!confirmation}
          className="w-full font-medium flex flex-row justify-center items-center text-white gap-2 py-2 rounded-md bg-[#ee7c2b] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d66a1f] transition-colors"
        >
          Submit Final
          <ArrowRight strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  )
}

export default Form6
