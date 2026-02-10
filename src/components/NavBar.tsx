'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="w-full font-google sticky top-0 border-b border-gray-200 z-50 shadow-sm bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-5">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="font-semibold text-lg sm:text-xl lg:text-2xl hover:text-gray-700 transition-colors"
            onClick={closeMenu}
          >
            Ghana Food Dataset
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center font-raleway font-semibold gap-6 lg:gap-8">
            <Link
              href="/contribute"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contribute
            </Link>
            <span className="text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
              Guidelines
            </span>
            <span className="text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
              Why Contribute?
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/contribute"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onClick={closeMenu}
              >
                Contribute
              </Link>
              <button
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onClick={closeMenu}
              >
                Guidelines
              </button>
              <button
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onClick={closeMenu}
              >
                Why Contribute?
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar