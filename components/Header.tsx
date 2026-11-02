'use client'
import { useState } from 'react'
import Link from './Link'
export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="folio-header">
      <Link className="wordmark" href="/" aria-label="Raviteja Manchala home">
        <span className="brand-bracket">[</span> RM <span className="brand-bracket">]</span>
      </Link>
      <button
        className="menu-button"
        aria-expanded={open}
        aria-controls="folio-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close −' : 'Menu +'}
      </button>
      <nav
        id="folio-nav"
        aria-label="Main navigation"
        className={open ? 'folio-nav open' : 'folio-nav'}
      >
        {[
          ['/#work', 'Selected work'],
          ['/#about', 'About'],
          ['/blog', 'Writing'],
        ].map(([href, title]) => (
          <Link href={href} key={href} onClick={() => setOpen(false)}>
            {title}
          </Link>
        ))}
        <a href="mailto:raviteja0024@gmail.com" className="contact-link">
          Let’s talk ↗
        </a>
      </nav>
    </header>
  )
}
