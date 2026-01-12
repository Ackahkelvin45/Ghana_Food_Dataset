import MutiStepLayout from "@/src/layout/MutiStepLayout";
import { Camera, FilePenLine, Scale } from "lucide-react";
import Image from "next/image";
import foodImage from "@/public/food2.jpg";
import foodImage2 from "@/public/food3.jpg";
import Link from "next/link";

export default function Home() {
   
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="px-6 md:px-20 lg:px-40 py-10 md:py-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="@container">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
              <div className="w-full lg:w-1/2 relative">
                <div 
                  className="w-[450px] bg-center bg-no-repeat aspect-square md:aspect-video lg:aspect-square bg-cover rounded-2xl shadow-2xl border-4 border-white dark:border-[#3d2c20]" 
                  style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYHo2StqIrXATY9A39Tcs6f8XVLhW7JdeFYJWGBH-dmftIJ26Nxe4QMFZcMHIPIhkE5dvIKWCVsKEd6sUjWVfgkSykXGafyr6y6a6LcbImqnioIRqE79D0cy0MsUvbaSBsSGoubaf-HWkNK4Amk3Z3hvlL02pQLCP8CxCUzLgPAZl9Po2Op-FpVKUuG-VSaSFFgnsTuxKEl1Ig3Ve_hs5ojN2Haa8_vBjhEGsfGl2Ciz7onJJTgVpak6abTv9Whbqn9q4cxAS8IlqO")'}}
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 right-6 bg-[#006b3f] text-white p-4 rounded-xl shadow-xl flex items-center gap-3 border-2 border-white">
                  <span className="text-[#FFD700] text-2xl">★</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Dataset</p>
                    <p className="text-lg font-black leading-none">10+ Classes</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-8 lg:w-1/2">
  <div className="flex flex-col gap-4">
    <h6 className="text-[#1b130d] font-google dark:text-white text-5xl md:text-3xl font-semibold leading-[1.1] tracking-[-0.04em]">
      Building Ghanaian Food Data for <span className="text-[#ee7c2b]">AI Research.</span>
    </h6>

    <p className="text-gray-700 font-raleway text-xl md:text-lg font-medium leading-relaxed max-w-[540px]">
      Contribute authentic Ghanaian food data for research purposes. Your input helps create high-quality, locally tailored datasets used to train machine learning models and advance African-focused AI innovation.
    </p>
  </div>

  <div className="flex flex-col font-google sm:flex-row gap-4">
    <Link href="/contribute"  className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-[#ee7c2b] text-white text-base  font-semibold shadow-md  shadow-[#ee7c2b]/30 hover:bg-[#d96b20] transition-all">
      Contribute Research Data
    </Link>

    <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 border border-[#ee7c2b] dark:border-[#3d2c20] text-[#1b1816] dark:text-white text-lg font-bold hover:bg-white/50 dark:hover:bg-white/5 transition-all">
      Learn About the Research
    </button>
  </div>
</div>

            </div>
          </div>
        </div>
      </section>

      {/* Section: How it Works */}
      <section className="px-6 md:px-20 lg:px-40 py-16  mt-16 bg-white dark:bg-[#150d08]" id="how-it-works">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center items-center">
              <h2 className="text-[#1b130d] dark:text-white text-2xl md:text-4xl font-semibold font-google tracking-tight">Three simple steps to contribute</h2>
              <p className="text-gray-700 font-raleway text-base font-medium max-w-[600px]">
  The data you contribute is used strictly for research to develop Ghana-specific food datasets that support machine learning, computer vision, and AI innovation.
</p>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="flex flex-col gap-6 rounded-2xl border border-[#e7d9cf] dark:border-[#3d2c20] bg-white dark:bg-[#1b130d] p-8 group hover:border-[#ee7c2b] transition-colors">
                <div className="w-12 h-12 bg-[#ee7c2b]/10 text-[#ee7c2b] rounded-xl flex items-center justify-center group-hover:bg-[#ee7c2b] group-hover:text-white transition-all">
                  <Scale/>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#1b130d] font-google dark:text-white text-xl font-bold">1. Accept Terms</h3>
                  <p className="text-gray-700 font-raleway dark:text-gray-400 text-sm leading-relaxed">
                    Read and agree to our data privacy terms to ensure your data is used responsibly for open-access research.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col gap-6 rounded-2xl border border-[#e7d9cf] dark:border-[#3d2c20] bg-white dark:bg-[#1b130d] p-8 group hover:border-[#ee7c2b] transition-colors">
                <div className="w-12 h-12 bg-[#ee7c2b]/10 text-[#ee7c2b] rounded-xl flex items-center justify-center group-hover:bg-[#ee7c2b] group-hover:text-white transition-all">
                  <FilePenLine/>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#1b130d] font-google dark:text-white text-xl font-bold">2. Provide Details</h3>
                  <p className="text-gray-700 font-raleway dark:text-gray-400 text-sm leading-relaxed">
                    Tell us the name of the dish (e.g., Waakye, Red Red), its regional origin, and the key local ingredients used.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col gap-6 rounded-2xl border border-[#e7d9cf] dark:border-[#3d2c20] bg-white dark:bg-[#1b130d] p-8 group hover:border-[#ee7c2b] transition-colors">
                <div className="w-12 h-12 bg-[#ee7c2b]/10 text-[#ee7c2b] rounded-xl flex items-center justify-center group-hover:bg-[#ee7c2b] group-hover:text-white transition-all">
                  <Camera/>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#1b130d] font-google dark:text-white text-xl font-bold">3. Upload Photo</h3>
                  <p className="text-gray-700 font-raleway dark:text-gray-400 text-sm leading-relaxed">
                    Upload a clear, high-resolution photo of the dish to help train our computer vision models to recognize local textures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why Contribute */}
      <section className="px-6 md:px-20 lg:px-40 py-20 bg-[#faf8f6] dark:bg-[#1b130d]" id="why-contribute">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col gap-12 lg:flex-row items-center">
            <div className="lg:w-1/2 flex flex-col gap-6">
              <h2 className="text-[#1b130d] dark:text-white text-2xl md:text-5xl font-semibold font-google tracking-tight leading-tight">Why Your Contribution Matters</h2>
              <p className="text-gray-700 font-raleway dark:text-gray-400 text-lg font-medium leading-relaxed">
                Most AI models are trained on Western datasets. When you contribute, you&apos;re ensuring that Ghanaian food culture isn&apos;t left behind in the digital transformation.
              </p>
              <div className="space-y-6 mt-4">
                <div className="flex gap-4 items-center">
                  <div className="h-2 w-2 bg-gray-800 rounded-full">

                  </div>
                  <div>
                    <h4 className="text-[#1b130d] dark:text-white font-google font-semibold text-xl">Preserving Culture</h4>
                    <p className="text-gray-700 font-raleway dark:text-gray-400 text-base">Digitalizing traditional recipes and presentation styles for future generations.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="h-2 w-2 bg-gray-800 rounded-full"></div>
                  <div>
                    <h4 className="text-[#1b130d] dark:text-white font-semibold font-google  text-lg">AI Research</h4>
                    <p className="text-gray-700 font-raleway  dark:text-gray-400 text-base">Enabling computer vision to understand African dietary patterns for health apps.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="h-2 w-2 bg-gray-800 rounded-full"></div>
                  <div>
                    <h4 className="text-[#1b130d] dark:text-white font-semibold font-google  text-lg">Open Source</h4>
                    <p className="text-gray-700 font-raleway dark:text-gray-400 text-base">Built by the community, for the community. All data remains accessible to African researchers.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4 mt-12 lg:mt-0">
              <div className="w-full aspect-4/5 rounded-2xl shadow-lg overflow-hidden relative">
                <Image 
                  src={foodImage} 
                  alt="Traditional Ghanaian food" 
                  className="w-full h-full object-cover"
                  fill
                />
              </div>
              <div className="w-full aspect-4/5 rounded-2xl shadow-lg mt-8 overflow-hidden relative">
                <Image 
                  src={foodImage2} 
                  alt="Assorted Ghanaian dishes" 
                  className="w-full h-full object-cover"
                  fill
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="px-6 md:px-20 lg:px-40 py-10">
        <div className="max-w-[1280px] mx-auto bg-[#ee7c2b] rounded-4xl p-10 md:p-20 text-center relative overflow-hidden">
          {/* Decorative Shapes */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#FFD700]/20 rounded-full translate-x-20 translate-y-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-white  text-4xl md:text-4xl font-semibold font-google max-w-[700px]">Ready to share your favorite Ghanaian dish?</h2>
            <p className="text-white/90 text-xl font-medium font-raleway max-w-[500px]">Join other contributors across the country today to contribute to the Ghanaian Food Dataset.</p>
            <Link href="/contribute" className="bg-white text-[#ee7c2b] px-10 py-3 rounded-2xl text-xl font-semibold font-google hover:scale-105 transition-transform shadow-2xl">
              Contribute Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
