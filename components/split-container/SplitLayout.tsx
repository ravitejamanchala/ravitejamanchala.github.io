import React from 'react'
import './SplitLayout.css'

const SplitLayout: React.FC = () => {
  return (
    <div className="split-container">
      <div className="center"></div>
      <div className="split left">
        <div className="content font-bold uppercase">
          <h1 className="text-6xl text-primary-500">Designer</h1>
          <p>Creative, artistic, and full of ideas.</p>
        </div>
      </div>
      <div className="split right bg-primary-500">
        <div className="content font-pixelify font-bold uppercase">
          <h1 className="text-6xl text-orange"> &lt;Developer /&gt;</h1>
          <p className="text-gray-900">Logical, analytical, and efficient.</p>
        </div>
      </div>
    </div>
  )
}

export default SplitLayout
