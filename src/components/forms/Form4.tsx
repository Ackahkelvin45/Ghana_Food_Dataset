'use client'

import { ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Form4Props {
  handleNavigation: (page: number, direction?: number) => void
  direction?: number
}

function Form4({ handleNavigation, direction = 1 }: Form4Props) {
  const [formData, setFormData] = useState({
    region: '',
    town: '',
    foodObtained: '',
    foodObtainedOther: ''
  })

  useEffect(() => {
    // Load saved form data from sessionStorage
    const savedFormData = sessionStorage.getItem('form4_data')
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData))
      } catch (e) {
        console.error('Error loading form4 data:', e)
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
    sessionStorage.setItem('form4_data', JSON.stringify(updatedData))
  }

  const handleContinue = () => {
    // Ensure data is saved before navigation
    sessionStorage.setItem('form4_data', JSON.stringify(formData))
    handleNavigation(5, 1)
  }

  const regionOptions = [
    'AHAFO',
    'ASHANTI',
    'BONO EAST',
    'BRONG AHAFO',
    'CENTRAL',
    'EASTERN',
    'GREATER ACCRA',
    'NORTH EAST',
    'NORTHERN',
    'OTI',
    'SAVANNAH',
    'UPPER EAST',
    'UPPER WEST',
    'VOLTA',
    'WESTERN',
    'WESTERN NORTH'
  ]

  const foodObtainedOptions = [
    'Home kitchen',
    'Restaurant',
    'Chop bar',
    'Street vendor',
    'School canteen'
  ]

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
        <h3 className="text-xl sm:text-2xl font-google font-semibold mb-4">Setting and Location</h3>
        <p className="text-base font-raleway text-gray-700 mb-6">
          Tell us where the food was obtained and where the photograph was taken. This information helps the dataset capture geographic and cultural diversity across different regions in Ghana. No specific address is required—only general location details.
        </p>

        {/* Region */}
        <div className="mb-6 font-raleway">
          <label className="block text-sm sm:text-base font-medium mb-3">
            Region <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.region}
            onChange={(e) => handleInputChange('region', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b] bg-white"
            required
          >
            <option value="">Select a region</option>
            {regionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Town/Community */}
        <div className="mb-6 font-raleway">
          <label className="block text-sm font-medium mb-2">
            Please state the town or community
          </label>
          <input
            type="text"
            value={formData.town}
            onChange={(e) => handleInputChange('town', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
            placeholder="Enter town or community name"
          />
        </div>

        {/* Where food was obtained */}
        <div className="mb-6 font-raleway">
          <label className="block text-sm sm:text-base font-medium mb-3">
            Where was this food obtained <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {foodObtainedOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="foodObtained"
                  value={option}
                  checked={formData.foodObtained === option}
                  onChange={(e) => handleInputChange('foodObtained', e.target.value)}
                  className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                  required
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
          <div className="mt-3">
            <label className="block text-sm mb-1">Other:</label>
            <input
              type="text"
              value={formData.foodObtainedOther}
              onChange={(e) => handleInputChange('foodObtainedOther', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
              placeholder="Specify other location"
            />
          </div>
        </div>
      </div>

      <div className="w-full font-google flex-col sm:flex-row flex mt-8 sm:mt-10 justify-center gap-4 sm:gap-5">
        <button
          onClick={() => handleNavigation(3, -1)}
          className="w-full font-medium text-center flex flex-row justify-center items-center gap-2 py-3 sm:py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        >

          Previous
        </button>
        <button
          onClick={handleContinue}
          disabled={!formData.region || !formData.foodObtained}
          className="w-full font-medium flex flex-row justify-center items-center text-white gap-2 py-3 sm:py-2 rounded-md bg-[#ee7c2b] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d66a1f] transition-colors"
        >
          Continue
          <ArrowRight strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  )
}

export default Form4
