'use client'
import { useState, type CSSProperties, type PointerEvent } from 'react'

export default function IdentityHero() {
  const [split, setSplit] = useState(50)
  function handleHover(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || event.buttons !== 0) return
    if ((event.target as HTMLElement).closest('.identity-control')) return
    if (document.activeElement?.id === 'identity-range') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const progress = (event.clientX - bounds.left) / bounds.width
    setSplit(Math.round(Math.max(5, Math.min(95, 95 - progress * 90))))
  }
  return (
    <section className="identity-hero" style={{ '--split': `${split}%` } as CSSProperties}>
      <div className="identity-meta">
        <span>
          <i /> AVAILABLE FOR SELECT COLLABORATIONS
        </span>
        <span>LONDON · CAMBRIDGE · EVERYWHERE</span>
      </div>
      <h1 className="identity-name">
        RAVITEJA
        <span>
          MANCHALA<span className="name-dot">.</span>
        </span>
      </h1>
      <div
        className="identity-stage"
        onPointerMove={handleHover}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse' && document.activeElement?.id !== 'identity-range')
            setSplit(50)
        }}
      >
        <div className="identity-orbit" aria-hidden="true" />
        <div className="identity-portrait">
          <div className="portrait-plane">
            <img src="/static/images/main-pixel.webp" alt="" className="portrait-pixel" />
            <img
              src="/static/images/main.webp"
              alt="Raviteja Manchala"
              className="portrait-human"
              fetchPriority="high"
            />
            <div className="portrait-divider" aria-hidden="true">
              <span>↔</span>
            </div>
          </div>
        </div>
        <div className="identity-role role-designer">
          <span>01 / THE CREATIVE SIDE</span>
          <h2>
            Designer<span>by instinct.</span>
          </h2>
          <p>
            I see the possibilities.
            <br />
            Then make them feel right.
          </p>
        </div>
        <div className="identity-role role-developer">
          <span>02 / THE ENGINEERING SIDE</span>
          <h2>
            &lt;Developer<span>by craft. /&gt;</span>
          </h2>
          <p>
            I connect the moving parts.
            <br />
            Then make them work beautifully.
          </p>
        </div>
        <div className="identity-control">
          <label htmlFor="identity-range">
            ONE MIND. TWO MODES. <span className="touch-instruction">DRAG TO EXPLORE</span>
            <span className="hover-instruction">HOVER TO EXPLORE</span>
          </label>
          <input
            id="identity-range"
            type="range"
            min="5"
            max="95"
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label="Reveal designer or developer portrait"
          />
        </div>
        <span className="floating-note note-one" aria-hidden="true">
          const curiosity = Infinity;
        </span>
        <span className="floating-note note-two" aria-hidden="true">
          a little art.
          <br />a lot of engineering.
        </span>
      </div>
      <div className="identity-bottom">
        <p>
          Software engineer. Founder. Creative thinker.
          <br />
          <span>10+ years turning “what if” into things people use.</span>
        </p>
        <a href="#work" className="identity-cta">
          ENTER MY WORLD <span>↓</span>
        </a>
      </div>
      <div
        className="skill-ticker"
        aria-label="React, TypeScript, Next.js, Python, applied AI, system design"
      >
        <div aria-hidden="true">
          {[0, 1].map((i) => (
            <span key={i}>
              REACT <b>✳</b> TYPESCRIPT <b>✳</b> NEXT.JS <b>✳</b> APPLIED AI <b>✳</b> SYSTEM
              DESIGN <b>✳</b> PYTHON <b>✳</b>{' '}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
