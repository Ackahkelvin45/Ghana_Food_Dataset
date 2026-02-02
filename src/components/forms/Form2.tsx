'use client'

import { ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

interface Form2Props {
  handleNavigation: (page: number, direction?: number) => void
  direction?: number 
}

function Form2({ handleNavigation, direction = 1 }: Form2Props) {
  const [dishName, setDishName] = useState('')
  const [mainImages, setMainImages] = useState<any[]>([])
  const [additionalImages, setAdditionalImages] = useState<any[]>([])
  const [confirmation, setConfirmation] = useState<string>('')

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

  // Load saved data from sessionStorage on mount
  useEffect(() => {
    const savedDishName = sessionStorage.getItem('dishName')
    const savedConfirmation = sessionStorage.getItem('form2_confirmation')
    if (savedDishName) setDishName(savedDishName)
    if (savedConfirmation) setConfirmation(savedConfirmation)
  }, [])

  // Helper function to convert FilePond file to base64 ImageFile
  const convertFileToImageFile = async (fileItem: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (fileItem.file) {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            url: reader.result as string, // base64 data URL
            filename: fileItem.filename || fileItem.file.name || 'image.jpg',
            size: fileItem.file.size,
            mimeType: fileItem.file.type
          })
        }
        reader.onerror = reject
        reader.readAsDataURL(fileItem.file)
      } else {
        // If file is already processed
        resolve({
          url: fileItem.getFileEncodeBase64String ? fileItem.getFileEncodeBase64String() : '',
          filename: fileItem.filename || 'image.jpg',
          size: fileItem.size,
          mimeType: fileItem.type
        })
      }
    })
  }

  const handleMainImagesUpdate = async (fileItems: any[]) => {
    setMainImages(fileItems)
    
    // Convert files to base64 and store in sessionStorage
    try {
      const imageFiles = await Promise.all(
        fileItems.map((item: any) => convertFileToImageFile(item))
      )
      sessionStorage.setItem('form2_mainImages_base64', JSON.stringify(imageFiles))
    } catch (error) {
      console.error('Error converting main images:', error)
    }
  }

  const handleAdditionalImagesUpdate = async (fileItems: any[]) => {
    setAdditionalImages(fileItems)
    
    // Convert files to base64 and store in sessionStorage
    try {
      const imageFiles = await Promise.all(
        fileItems.map((item: any) => convertFileToImageFile(item))
      )
      sessionStorage.setItem('form2_additionalImages_base64', JSON.stringify(imageFiles))
    } catch (error) {
      console.error('Error converting additional images:', error)
    }
  }

  const handleFoodSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setDishName(value)
    sessionStorage.setItem('dishName', value)
  }

  const handleConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log('onChange fired, value:', value)
    setConfirmation(value)
    sessionStorage.setItem('form2_confirmation', value)
  }

  const handleRadioClick = (value: string) => {
    console.log('onClick fired, value:', value)
    setConfirmation(value)
    sessionStorage.setItem('form2_confirmation', value)
  }

  const handleContinue = () => {
    // Save current state before navigation
    if (confirmation) {
      sessionStorage.setItem('form2_confirmation', confirmation)
    }
    handleNavigation(3, 1)
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
        <h3 className="text-2xl  font-google font-semibold mb-4">Image Submission</h3>
        <p className="text-sm text-gray-700 font-raleway mb-6">
          Please upload a clear photograph of the food item you are contributing. You may upload an additional angle to improve the quality of the dataset. Ensure that the images do not contain people, body parts, personal belongings, or identifiable locations. This helps protect privacy and maintain dataset quality.
        </p>

        {/* Name of the dish */}
        <div  className="mb-6 font-raleway">
          <label className="block text-sm font-medium mb-2">
            Name of the dish <span className="text-red-500">*</span>
          </label>
          <select
            value={dishName}
            onChange={handleFoodSelection}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b] bg-white"
            required
          >
            <option value="">Select a dish</option>
            <option value="Yam">Yam</option>
            <option value="Plantain (boiled)">Plantain (boiled)</option>
            <option value="Kenkey">Kenkey</option>
            <option value="Banku">Banku</option>
            <option value="Kokonte">Kokonte</option>
            <option value="Fufu">Fufu</option>
            <option value="Jollof">Jollof</option>
            <option value="Plain Rice">Plain Rice</option>
            <option value="Waakye">Waakye</option>
            <option value="Bread">Bread</option>
            <option value="Koko">Koko</option>
            <option value="Beans (Gob3)">Beans (Gob3)</option>
          </select>
        </div>

        {/* Main photo upload */}
        <div className="mb-6 font-raleway relative z-0">
          <label className="block text-sm font-medium mb-2">
            Please upload a clear photograph of the food item. <span className="text-red-500">*</span>
          </label>
        
          <FilePond
            files={mainImages}
            onupdatefiles={handleMainImagesUpdate}
            allowMultiple={true}
            maxFiles={5}
            {...({ maxFileSize: "10MB" } as any)}
            acceptedFileTypes={['image/*']}
            labelIdle='<span class="filepond--label-action">Browse</span> or drag & drop your image here'
            name="mainImages"
            credits={false}
            stylePanelLayout="compact"
            styleButtonRemoveItemPosition="right"
            styleButtonProcessItemPosition="right"
          />
        </div>

        {/* Additional angle upload */}
        <div className="mb-6 font-raleway relative z-0">
          <label className="block text-sm font-medium mb-2">
            Please upload an additional angle of the same food
          </label>
        
          <FilePond
            files={additionalImages}
            onupdatefiles={handleAdditionalImagesUpdate}
            allowMultiple={true}
            maxFiles={5}
            {...({ maxFileSize: "10MB" } as any)}
            acceptedFileTypes={['image/*']}
            labelIdle='<span class="filepond--label-action">Browse</span> or drag & drop your images here'
            name="additionalImages"
            credits={false}
            stylePanelLayout="compact"
            styleButtonRemoveItemPosition="right"
            styleButtonProcessItemPosition="right"
          />
        </div>

        {/* Confirmation */}
        <div className="mb-6 font-raleway relative z-10">
          <label className="block text-sm font-medium mb-3">
           Please confirm that no person or part of a person appears in the image. <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="confirmation-yes"
                name="confirmation-form2"
                value="yes"
                checked={confirmation === 'yes'}
                onChange={handleConfirmationChange}
                onClick={() => handleRadioClick('yes')}
                className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b] cursor-pointer"
                required
              />
              <label htmlFor="confirmation-yes" className="text-sm cursor-pointer" onClick={() => handleRadioClick('yes')}>
                Yes
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="confirmation-no"
                name="confirmation-form2"
                value="no"
                checked={confirmation === 'no'}
                onChange={handleConfirmationChange}
                onClick={() => handleRadioClick('no')}
                className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b] cursor-pointer"
                required
              />
              <label htmlFor="confirmation-no" className="text-sm cursor-pointer" onClick={() => handleRadioClick('no')}>
                No
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full  font-google flex-row flex mt-10 justify-center gap-5">
        <button
          onClick={() => handleNavigation(1, -1)}
          className="w-full font-medium text-center flex flex-row justify-center items-center gap-2 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={handleContinue}
          disabled={!dishName || !confirmation || mainImages.length === 0}
          className="w-full font-medium flex flex-row justify-center items-center text-white gap-2 py-2 rounded-md bg-[#ee7c2b] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d66a1f] transition-colors"
        >
          Continue
          <ArrowRight strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  )
}

export default Form2