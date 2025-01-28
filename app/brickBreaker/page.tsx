'use client'
import dynamic from 'next/dynamic'

// Dynamically import the component with ssr: false to disable SSR for this component
const BrickBreakerSVG = dynamic(() => import('../../components/bricks/BrickBreakerSVG'), {
  ssr: false,
})

export default function Page() {
  return (
    <>
      <BrickBreakerSVG />
    </>
  )
}
