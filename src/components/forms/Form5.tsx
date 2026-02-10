'use client'

import { ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface Form5Props {
  handleNavigation: (page: number, direction?: number) => void
  direction?: number
}

function Form5({ handleNavigation, direction = 1 }: Form5Props) {
  const [formData, setFormData] = useState({
    acknowledged: '',
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    // Load saved form data from sessionStorage
    const savedFormData = sessionStorage.getItem('form5_data')
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData))
      } catch (e) {
        console.error('Error loading form5 data:', e)
      }
    }
  }, [])

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

  const handleInputChange = (field: string, value: string) => {
    const updatedData = {
      ...formData,
      [field]: value
    }
    setFormData(updatedData)
    sessionStorage.setItem('form5_data', JSON.stringify(updatedData))
  }

  const handleContinue = () => {
    // Ensure data is saved before navigation
    sessionStorage.setItem('form5_data', JSON.stringify(formData))
    handleNavigation(6, 1)
  }

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="flex justify-center flex-col px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 lg:pb-10 items-center w-full h-fit max-w-3xl bg-white shadow-sm border border-gray-100"
    >
   

      <div className="w-full mt-6">
        <h3 className="text-xl sm:text-2xl font-google font-semibold mb-4">Optional Contributor Information</h3>
        <p className="text-base text-gray-700 font-raleway mb-6">
          You may choose to share your name or contact information if you want to be acknowledged as a contributor in publications or project updates. This section is completely optional and will not affect your ability to submit images.
        </p>

        {/* Acknowledgement Question */}
        <div className="mb-6">
          <label className="block text-base font-raleway font-medium mb-3">
            Would you like to be acknowledged as a contributor in project publications? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="acknowledged"
                value="yes"
                checked={formData.acknowledged === 'yes'}
                onChange={(e) => handleInputChange('acknowledged', e.target.value)}
                className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                required
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="acknowledged"
                value="no"
                checked={formData.acknowledged === 'no'}
                onChange={(e) => handleInputChange('acknowledged', e.target.value)}
                className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                required
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>

        {/* Conditional fields for acknowledgement */}
        {formData.acknowledged === 'yes' && (
          <>
            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-raleway font-semibold mb-2">
                Name for acknowledgement
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full placeholder:font-raleway  px-4 py-2 border placeholder:text-sm  border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="mb-6 font-raleway">
              <label className="block text-sm font-semibold mb-2">
                Email address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border placeholder:text-sm  border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                placeholder="Enter your email address"
              />
            </div>

            {/* Phone */}
            <div className="mb-6 font-raleway">
              <label className="block text-sm font-semibold mb-2">
                Phone number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 border placeholder:text-sm  border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                placeholder="Enter your phone number"
              />
            </div>
          </>
        )}
      </div>

      <div className="w-full font-google flex-col sm:flex-row flex mt-8 sm:mt-10 justify-center gap-4 sm:gap-5">
        <button
          onClick={() => handleNavigation(4, -1)}
          className="w-full font-medium text-center flex flex-row justify-center items-center gap-2 py-3 sm:py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleContinue}
          disabled={!formData.acknowledged}
          className="w-full font-medium flex flex-row justify-center items-center text-white gap-2 py-3 sm:py-2 rounded-md bg-[#ee7c2b] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d66a1f] transition-colors"
        >
          Continue
          <ArrowRight strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  )
}

export default Form5
