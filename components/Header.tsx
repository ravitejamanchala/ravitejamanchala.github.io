'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isAnnotation = pathname === '/annotation'
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const headerClass = `flex items-center w-full justify-between px-4 py-2 transition-all duration-900  ${
    !isScrolled
      ? 'fixed top-0 z-50 bg-transparent my-4'
      : 'backdrop-blur-[18px] bg-[#78787824] sticky top-0 z-50 shadow-sm '
  }`
  if (!isAnnotation)
    return (
      <header className={headerClass}>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="font-pixelify text-2xl text-3xl font-bold font-semibold capitalize leading-6 text-primary-500 sm:block">
              MANCHALA
              <br />
              RAVITEJA
            </div>
          </div>
        </Link>
        <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
          <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`block font-medium ${
                    isHomePage && !isScrolled
                      ? 'text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400'
                      : 'text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400'
                  }`}
                >
                  {link.title}
                </Link>
              ))}
          </div>
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </header>
    )
}

export default Header
