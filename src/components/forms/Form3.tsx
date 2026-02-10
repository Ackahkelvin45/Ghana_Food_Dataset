'use client'

import { ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Form3Props {
  handleNavigation: (page: number, direction?: number) => void
  direction?: number 
}

function Form3({ handleNavigation, direction = 1 }: Form3Props) {
  const [dishName, setDishName] = useState('')
  const [formData, setFormData] = useState({
    stew: '',
    stewOther: '',
    extraItems: [] as string[],
    extraItemsOther: '',
    kokoItems: [] as string[],
    kokoItemsOther: '',
    soupContext: '',
    soupContextOther: '',
    pepper: [] as string[],
    pepperOther: '',
    breadType: '',
    breadTypeOther: '',
    breadServedWith: [] as string[],
    breadServedWithOther: '',
    gob3ServedWith: [] as string[],
    gob3ServedWithOther: '',
    proteinContext: [] as string[],
    proteinContextOther: ''
  })

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
    const storedDishName = sessionStorage.getItem('dishName')
    if (storedDishName) {
      setDishName(storedDishName)
    }
    
    // Load saved form data from sessionStorage
    const savedFormData = sessionStorage.getItem('form3_data')
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData))
      } catch (e) {
        console.error('Error loading form3 data:', e)
      }
    }
  }, [])

  const handleInputChange = (field: string, value: string | string[]) => {
    const updatedData = {
      ...formData,
      [field]: value
    }
    setFormData(updatedData)
    sessionStorage.setItem('form3_data', JSON.stringify(updatedData))
  }

  const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
    const updatedData = {
      ...formData,
      [field]: checked
        ? [...(formData[field as keyof typeof formData] as string[]), value]
        : (formData[field as keyof typeof formData] as string[]).filter(item => item !== value)
    }
    setFormData(updatedData)
    sessionStorage.setItem('form3_data', JSON.stringify(updatedData))
  }

  const handleContinue = () => {
    // Ensure data is saved before navigation
    sessionStorage.setItem('form3_data', JSON.stringify(formData))
    handleNavigation(4, 1)
  }

  const isRiceOrYamOrPlantain = ['Yam', 'Plantain (boiled)', 'Jollof', 'Plain Rice', 'Waakye'].includes(dishName)
  const isKoko = dishName === 'Koko'
  const isBankuOrFufuOrKokonteOrKenkey = ['Banku', 'Fufu', 'Kokonte', 'Kenkey'].includes(dishName)
  const isBankuOrKokonteOrKenkey = ['Banku', 'Kokonte', 'Kenkey'].includes(dishName)
  const isBread = dishName === 'Bread'
  const isGob3 = dishName === 'Beans (Gob3)'

  const stewOptions = ['Tomato', 'Kontomire', 'Garden Egg', 'Vegetable', 'Shito', 'Gravy', 'Cabbage', 'No stew']
  const extraItemsOptions = ['Salad', 'Spaghetti', 'Gari', 'Pepper', 'Avocado', 'fried plantain', 'None']
  const kokoOptions = ['Milk', 'Groundnuts', 'None']
  const soupContextOptions = ['Light Soup', 'Groundnut Soup', 'Palm Nut Soup', 'Okro Soup/Stew', 'Ayoyo', 'Okro', 'Ebunu Ebunu', 'None']
  const pepperOptions = ['Red Pepper', 'Green Pepper', 'Shito']
  const breadTypeOptions = ['Sugar Bread', 'Tea Bread', 'Wheat Bread', 'Brown Bread', 'Cake Bread', 'Coconut Bread']
  const breadServedWithOptions = ['Jam', 'Butter', 'Mangerine', 'None']
  const gob3ServedWithOptions = ['Fried Plantain', 'Fried Yam', 'Salad', 'Rice', 'None']
  const proteinOptions = ['Fish', 'Chicken', 'Turkey', 'Beef', 'Goat Meat', 'Boiled Egg', 'Friend Egg', 'Sausage', 'Gizzards', 'Cow meat', 'Pork', 'Snail', 'Shrimp', 'Wele', 'None']

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


      <div className="w-full mt-6 font-raleway">
        <h3 className="text-xl sm:text-2xl font-google font-semibold mb-4">{dishName} Information</h3>
        <p className="text-sm sm:text-base text-gray-700 mb-6">
          Provide information about the dish shown in the image. This helps researchers and developers understand the type of food, its ingredients, cultural background, and meal category. If you are unsure of any detail, you may leave optional questions blank or select "Do not know."
        </p>

        {/* Rice, Yam, Plantain Section */}
        {isRiceOrYamOrPlantain && (
          <>
            <div className="mb-6 font-raleway">
              <label className="block text-sm sm:text-base font-medium mb-3">
                Stew <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stewOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stew"
                      value={option}
                      checked={formData.stew === option}
                      onChange={(e) => handleInputChange('stew', e.target.value)}
                      className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-sm mb-1">Other:</label>
                <input
                  type="text"
                  value={formData.stewOther}
                  onChange={(e) => handleInputChange('stewOther', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                  placeholder="Specify other stew type"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm sm:text-base font-medium mb-3">
                Select any extra items or sides served with the food. Include anything that appears on the plate. <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {extraItemsOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.extraItems.includes(option)}
                      onChange={(e) => handleMultiSelectChange('extraItems', option, e.target.checked)}
                      className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-sm mb-1">Other:</label>
                <input
                  type="text"
                  value={formData.extraItemsOther}
                  onChange={(e) => handleInputChange('extraItemsOther', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                  placeholder="Specify other extra items"
                />
              </div>
            </div>
          </>
        )}

        {/* Koko Section */}
        {isKoko && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Koko Items <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {kokoOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kokoItems.includes(option)}
                    onChange={(e) => handleMultiSelectChange('kokoItems', option, e.target.checked)}
                    className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm mb-1">Other:</label>
              <input
                type="text"
                value={formData.kokoItemsOther}
                onChange={(e) => handleInputChange('kokoItemsOther', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                placeholder="Specify other items"
              />
            </div>
          </div>
        )}

        {/* Banku, Fufu, Kokonte, Kenkey Section */}
        {isBankuOrFufuOrKokonteOrKenkey && (
          <div className="mb-6">
            <label className="block text-sm sm:text-base font-medium mb-3">
              Soup Context <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {soupContextOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="soupContext"
                    value={option}
                    checked={formData.soupContext === option}
                    onChange={(e) => handleInputChange('soupContext', e.target.value)}
                    className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm mb-1">Other:</label>
              <input
                type="text"
                value={formData.soupContextOther}
                onChange={(e) => handleInputChange('soupContextOther', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                placeholder="Specify other soup context"
              />
            </div>
          </div>
        )}

        {/* Banku, Kokonte, Kenkey Pepper Section */}
        {isBankuOrKokonteOrKenkey && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Pepper <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {pepperOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.pepper.includes(option)}
                    onChange={(e) => handleMultiSelectChange('pepper', option, e.target.checked)}
                    className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm mb-1">Other:</label>
              <input
                type="text"
                value={formData.pepperOther}
                onChange={(e) => handleInputChange('pepperOther', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                placeholder="Specify other pepper type"
              />
            </div>
          </div>
        )}


        {/* Bread Section */}
        {isBread && (
          <>
            <div className="mb-6">
              <label className="block text-sm sm:text-base font-medium mb-3">
                Bread Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {breadTypeOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="breadType"
                      value={option}
                      checked={formData.breadType === option}
                      onChange={(e) => handleInputChange('breadType', e.target.value)}
                      className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-sm mb-1">Other:</label>
                <input
                  type="text"
                  value={formData.breadTypeOther}
                  onChange={(e) => handleInputChange('breadTypeOther', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                  placeholder="Specify other bread type"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm sm:text-base font-medium mb-3">
                Served with <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {breadServedWithOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.breadServedWith.includes(option)}
                      onChange={(e) => handleMultiSelectChange('breadServedWith', option, e.target.checked)}
                      className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-sm mb-1">Other:</label>
                <input
                  type="text"
                  value={formData.breadServedWithOther}
                  onChange={(e) => handleInputChange('breadServedWithOther', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                  placeholder="Specify other items served with"
                />
              </div>
            </div>
          </>
        )}

        {/* Gob3 Section */}
        {isGob3 && (
          <div className="mb-6">
            <label className="block text-sm sm:text-base font-medium mb-3">
              Served with <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gob3ServedWithOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.gob3ServedWith.includes(option)}
                    onChange={(e) => handleMultiSelectChange('gob3ServedWith', option, e.target.checked)}
                    className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm mb-1">Other:</label>
              <input
                type="text"
                value={formData.gob3ServedWithOther}
                onChange={(e) => handleInputChange('gob3ServedWithOther', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                placeholder="Specify other items served with"
              />
            </div>
          </div>
        )}

        {/* Protein Context - Not shown for Koko and Bread */}
        {!isKoko && !isBread && (
          <div className="mb-6 font-raleway">
            <label className="block text-sm sm:text-base font-semibold mb-3">
              Choose the protein, meat, or fish served with the food. Select all that appear in the image.
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 font-raleway font-medium">Protein / Meat</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {proteinOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.proteinContext.includes(option)}
                    onChange={(e) => handleMultiSelectChange('proteinContext', option, e.target.checked)}
                    className="w-4 h-4 text-[#ee7c2b] focus:ring-[#ee7c2b]"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm mb-1">Other:</label>
              <input
                type="text"
                value={formData.proteinContextOther}
                onChange={(e) => handleInputChange('proteinContextOther', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#ee7c2b]"
                placeholder="Specify other protein/meat"
              />
            </div>
          </div>
        )}
</div>
 


      <div className="w-full flex-col sm:flex-row flex font-google mt-8 sm:mt-10 justify-center gap-4 sm:gap-5">
        <button
          onClick={() => handleNavigation(2, -1)}
          className="w-full font-medium text-center flex flex-row justify-center items-center gap-2 py-3 sm:py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleContinue}
          className="w-full font-medium flex flex-row justify-center items-center text-white gap-2 py-3 sm:py-2 rounded-md bg-[#ee7c2b] hover:bg-[#d66a1f] transition-colors"
        >
          Continue
          <ArrowRight strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  )
}

export default Form3
