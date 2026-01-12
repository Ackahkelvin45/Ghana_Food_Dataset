'use client'

import { ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
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

  const handleMainImagesUpdate = (fileItems: any[]) => {
    setMainImages(fileItems)
  }

  const handleAdditionalImagesUpdate = (fileItems: any[]) => {
    setAdditionalImages(fileItems)
  }


const handleFoodSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {

  setDishName(e.target.value)
  sessionStorage.setItem('dishName', e.target.value)


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
        <div className="mb-6 font-raleway">
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
        <div className="mb-6 font-raleway">
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
        <div className="mb-6 font-raleway">
          <label className="block text-sm font-medium mb-3">
           Please confirm that no person or part of a person appears in the image. <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
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
          onClick={() => handleNavigation(3, 1)}
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