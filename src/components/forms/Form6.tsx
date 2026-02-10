'use client'

import { ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useCreateSubmissionMutation } from "@/src/features/submissions/submissions.slice"
import type { SubmissionRequest, ImageFile } from "@/app/api/submissions/submissions.api"

interface Form6Props {
  handleNavigation: (page: number, direction?: number) => void
  direction?: number
}

function Form6({ handleNavigation, direction = 1 }: Form6Props) {
  const [confirmation, setConfirmation] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const {mutateAsync:createSubmission,isPending:isSubmitting} = useCreateSubmissionMutation()

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

  useEffect(() => {
    // Load saved confirmation from sessionStorage
    const savedConfirmation = sessionStorage.getItem('form6_confirmation')
    if (savedConfirmation) {
      setConfirmation(savedConfirmation)
    }
  }, [])


  const handleConfirmationChange = (value: string) => {
    setConfirmation(value)
    sessionStorage.setItem('form6_confirmation', value)
  }

  const handleSubmit = async () => {
    if (!confirmation) {
      setSubmitError('Please confirm the accuracy of your information')
      return
    }

    
    setSubmitError(null)

    try {
      // Collect all form data from sessionStorage
      const dishName = sessionStorage.getItem('dishName') || ''
      const form2Confirmation = sessionStorage.getItem('form2_confirmation') || ''
      const form3Data = JSON.parse(sessionStorage.getItem('form3_data') || '{}')
      const form4Data = JSON.parse(sessionStorage.getItem('form4_data') || '{}')
      const form5Data = JSON.parse(sessionStorage.getItem('form5_data') || '{}')

      // Get converted images from sessionStorage (already converted to base64 in Form2)
      const mainImages: ImageFile[] = []
      const additionalImages: ImageFile[] = []

      try {
        const storedMainImages = sessionStorage.getItem('form2_mainImages_base64')
        const storedAdditionalImages = sessionStorage.getItem('form2_additionalImages_base64')
        
        if (storedMainImages) {
          mainImages.push(...JSON.parse(storedMainImages))
        }
        if (storedAdditionalImages) {
          additionalImages.push(...JSON.parse(storedAdditionalImages))
        }
      } catch (e) {
        console.error('Error loading images:', e)
      }

      // Build submission request
      const submissionData: SubmissionRequest = {
        dishName,
        noPersonInImage: form2Confirmation === 'yes',
        mainImages: mainImages.length > 0 ? mainImages : undefined,
        additionalImages: additionalImages.length > 0 ? additionalImages : undefined,
        
        // Form3 data
        stew: form3Data.stew,
        stewOther: form3Data.stewOther,
        extraItems: form3Data.extraItems,
        extraItemsOther: form3Data.extraItemsOther,
        kokoItems: form3Data.kokoItems,
        kokoItemsOther: form3Data.kokoItemsOther,
        soupContext: form3Data.soupContext,
        soupContextOther: form3Data.soupContextOther,
        pepper: form3Data.pepper,
        pepperOther: form3Data.pepperOther,
        breadType: form3Data.breadType,
        breadTypeOther: form3Data.breadTypeOther,
        breadServedWith: form3Data.breadServedWith,
        breadServedWithOther: form3Data.breadServedWithOther,
        gob3ServedWith: form3Data.gob3ServedWith,
        gob3ServedWithOther: form3Data.gob3ServedWithOther,
        proteinContext: form3Data.proteinContext,
        proteinContextOther: form3Data.proteinContextOther,
        
        // Form4 data
        region: form4Data.region,
        town: form4Data.town,
        foodObtained: form4Data.foodObtained,
        foodObtainedOther: form4Data.foodObtainedOther,
        
        // Form5 data
        wantsAcknowledgement: form5Data.acknowledged === 'yes',
        acknowledgedName: form5Data.name,
        acknowledgedEmail: form5Data.email,
        acknowledgedPhone: form5Data.phone,
        
        // Form6 data
        accuracyConfirmed: confirmation === 'yes'
      }

      // Submit the data
      await createSubmission(submissionData)

      setSubmitSuccess(true)
      
      // Clear all sessionStorage data
      sessionStorage.removeItem('dishName')
      sessionStorage.removeItem('form2_confirmation')
      sessionStorage.removeItem('form2_mainImages')
      sessionStorage.removeItem('form2_additionalImages')
      sessionStorage.removeItem('form2_mainImages_base64')
      sessionStorage.removeItem('form2_additionalImages_base64')
      sessionStorage.removeItem('form3_data')
      sessionStorage.removeItem('form4_data')
      sessionStorage.removeItem('form5_data')
      sessionStorage.removeItem('form6_confirmation')
      sessionStorage.removeItem('page')

      // Navigate to completed page
      handleNavigation(7, 1)

    } catch (error: any) {
      console.error('Submission error:', error)
      setSubmitError(error?.message || 'Failed to submit. Please try again.')
    } 
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
        <h3 className="text-xl sm:text-2xl font-google font-semibold mb-4">Final Confirmation</h3>
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
                onChange={(e) => handleConfirmationChange(e.target.value)}
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
                onChange={(e) => handleConfirmationChange(e.target.value)}
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
                onChange={(e) => handleConfirmationChange(e.target.value)}
                className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                required
              />
              <span className="text-sm">Don't Know</span>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 flex flex-row font-raleway gap-2 bg-red-50 border border-red-200 rounded-md">
            <svg className="w-4 h-4 me-2 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="#dc2626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {submitError}
            </p>
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 flex flex-row font-raleway gap-2 bg-green-50 border border-green-200 rounded-md">
            <svg className="w-4 h-4 me-2 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="#16a34a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            <p className="text-sm text-green-800">
              <strong>Success!</strong> Thank you for contributing to the Ghanaian Food Image Dataset! Your submission has been recorded successfully. Redirecting...
            </p>
          </div>
        )}

        {/* Additional Information */}
        {!submitSuccess && (
          <div className="mb-6 p-4 flex flex-row font-raleway gap-2 bg-blue-50 border border-blue-200 rounded-md">
            <svg className="w-4 h-4 me-2 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="#1e40af" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <p className="text-sm text-blue-800">
              <strong>Thank you for your contribution!</strong> Your images and information will help researchers, developers, and innovators build better food recognition systems and nutrition estimation tools for Ghanaian cuisine.
            </p>
          </div>
        )}
      </div>

      <div className="w-full font-google flex-col sm:flex-row flex mt-8 sm:mt-10 justify-center gap-4 sm:gap-5">
        <button
          onClick={() => handleNavigation(5, -1)}
          className="w-full font-medium text-center flex flex-row justify-center items-center gap-2 py-3 sm:py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={!confirmation || isSubmitting || submitSuccess}
          className="w-full font-medium flex flex-row justify-center items-center text-white gap-2 py-3 sm:py-2 rounded-md bg-[#ee7c2b] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d66a1f] transition-colors"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : submitSuccess ? (
            'Submitted!'
          ) : (
            <>
              Submit Final
              <ArrowRight strokeWidth={1.5} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

export default Form6
