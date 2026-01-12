'use client'
import Link from 'next/link'

function NavBar() {
  return (
    <div className="w-full font-google absolute sticky top-0 border-b  border-gray-200 z-50 shadow-sm bg-gray-50 px-10 py-5 flex justify-between ">
        <Link href="/" className="font-semibold text-xl">Ghana Food Dataset</Link>


        <div className="justify-between font-raleway font-semibold  gap-5 flex ">
           <Link href="/contribute">Contribute</Link >

           <span>Guidelines</span>
           <span>Why Contribute?</span>
        </div>
    </div>
  )
}

export default NavBar