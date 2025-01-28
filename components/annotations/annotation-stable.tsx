// import React, { useState, useEffect } from 'react'

// interface Label {
//   id: string
//   labelName: string
//   color: string
// }

// interface Annotation {
//   xmin: number
//   ymin: number
//   xmax: number
//   ymax: number
//   id: string
//   labelId: string
// }

// interface ImageData {
//   id: string
//   image: string
//   annotations: Annotation[]
// }

// interface Dataset {
//   images: ImageData[]
//   labels: Label[]
// }

// type ResizeHandle =
//   | 'top'
//   | 'bottom'
//   | 'left'
//   | 'right'
//   | 'topLeft'
//   | 'topRight'
//   | 'bottomLeft'
//   | 'bottomRight'
//   | null

// const AnnotationToolStable: React.FC<{ dataset: Dataset }> = ({ dataset }) => {
//   const [annotations, setAnnotations] = useState<Annotation[]>(dataset.images[0].annotations)
//   const [selectedLabel, setSelectedLabel] = useState<string | null>(dataset.labels[0].id)
//   const [newBox, setNewBox] = useState<{
//     x: number
//     y: number
//     width: number
//     height: number
//   } | null>(null)
//   const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null)
//   const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
//   const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null)
//   const [isPanning, setIsPanning] = useState(false)
//   const [initialBox, setInitialBox] = useState<Annotation | null>(null)
//   const [isDrawingEnabled, setIsDrawingEnabled] = useState(false)
//   const [kickedAnnotation, setKickedAnnotation] = useState<string | null>(null)
//   const [isResizing, setIsResizing] = useState(false)
//   const [position, setPosition] = useState({ x: 0, y: 0 })
//   const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
//   const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
//   const [scale, setScale] = useState(1)
//   const containerRef = React.useRef<HTMLDivElement>(null)
//   const imageRef = React.useRef<HTMLImageElement>(null)

//   useEffect(() => {
//     const updateContainerSize = () => {
//       if (containerRef.current) {
//         setContainerSize({
//           width: containerRef.current.clientWidth,
//           height: containerRef.current.clientHeight,
//         })
//       }
//     }

//     updateContainerSize()
//     window.addEventListener('resize', updateContainerSize)
//     return () => window.removeEventListener('resize', updateContainerSize)
//   }, [])

//   useEffect(() => {
//     const img = new Image()
//     img.src = dataset.images[0].image
//     img.onload = () => {
//       setImageSize({
//         width: img.width,
//         height: img.height,
//       })
//     }
//   }, [dataset.images])

//   useEffect(() => {
//     const handleGlobalMouseUp = () => {
//       setDragStart(null)
//       setResizeHandle(null)
//       setIsPanning(false)
//       setInitialBox(null)
//       setKickedAnnotation(null)
//       setIsResizing(false)
//     }

//     window.addEventListener('mouseup', handleGlobalMouseUp)
//     return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
//   }, [])

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'Delete' || e.key === 'Backspace') {
//         console.log(selectedAnnotation)
//         e.preventDefault()
//         if (selectedAnnotation) {
//           handleDelete(selectedAnnotation.id)
//         }
//       }
//       if (e.key === 'n') {
//         e.preventDefault()
//         setIsDrawingEnabled(true)
//         setNewBox(null)
//         setSelectedAnnotation(null)
//       }
//       if (e.key === 'Escape') {
//         setNewBox(null)
//         setIsDrawingEnabled(false)
//         setSelectedAnnotation(null)
//       }
//     }

//     const handleWheel = (e: WheelEvent) => {
//       if (e.ctrlKey || e.metaKey) {
//         e.preventDefault()
//         const delta = e.deltaY > 0 ? -0.1 : 0.1

//         // Get mouse position relative to container
//         const rect = containerRef.current?.getBoundingClientRect()
//         if (!rect) return

//         const mouseX = e.clientX - rect.left
//         const mouseY = e.clientY - rect.top

//         setScale((prevScale) => {
//           const newScale = Math.min(Math.max(prevScale + delta, 1), 4)

//           // Calculate position adjustments to keep mouse point fixed
//           const mouseImageX = (mouseX - position.x) / prevScale
//           const mouseImageY = (mouseY - position.y) / prevScale

//           const newX = mouseX - mouseImageX * newScale
//           const newY = mouseY - mouseImageY * newScale

//           // Apply boundaries
//           const maxX = 0
//           const maxY = 0
//           const minX = containerSize.width - imageSize.width * newScale
//           const minY = containerSize.height - imageSize.height * newScale

//           setPosition({
//             x: Math.min(maxX, Math.max(minX, newX)),
//             y: Math.min(maxY, Math.max(minY, newY)),
//           })

//           return newScale
//         })
//       }
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     window.addEventListener('wheel', handleWheel, { passive: false })
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown)
//       window.removeEventListener('wheel', handleWheel)
//     }
//   }, [selectedAnnotation, position, containerSize, imageSize])

//   const getImageCoordinates = (clientX: number, clientY: number) => {
//     if (!containerRef.current) return { x: 0, y: 0 }

//     const rect = containerRef.current.getBoundingClientRect()
//     const x = (clientX - rect.left - position.x) / scale
//     const y = (clientY - rect.top - position.y) / scale

//     return { x, y }
//   }

//   const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isDrawingEnabled || isPanning || resizeHandle) return

//     const { x, y } = getImageCoordinates(e.clientX, e.clientY)

//     if (!newBox) {
//       setNewBox({ x, y, width: 0, height: 0 })
//       e.stopPropagation()
//     } else {
//       const newAnnotation: Annotation = {
//         xmin: Math.min(newBox.x, x),
//         ymin: Math.min(newBox.y, y),
//         xmax: Math.max(newBox.x, x),
//         ymax: Math.max(newBox.y, y),
//         id: `new-${Date.now()}`,
//         labelId: selectedLabel || 'unknown',
//       }

//       // Ensure annotation is within image bounds
//       if (newAnnotation.xmax > imageSize.width) newAnnotation.xmax = imageSize.width
//       if (newAnnotation.ymax > imageSize.height) newAnnotation.ymax = imageSize.height
//       if (newAnnotation.xmin < 0) newAnnotation.xmin = 0
//       if (newAnnotation.ymin < 0) newAnnotation.ymin = 0

//       setAnnotations((prev) => [...prev, newAnnotation])
//       setNewBox(null)
//       setSelectedAnnotation(newAnnotation)
//       setIsDrawingEnabled(false)
//       e.stopPropagation()
//     }
//   }

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (newBox) {
//       const { x, y } = getImageCoordinates(e.clientX, e.clientY)

//       setNewBox((prev) =>
//         prev
//           ? {
//               ...prev,
//               width: Math.min(Math.max(x - prev.x, 0), imageSize.width - prev.x),
//               height: Math.min(Math.max(y - prev.y, 0), imageSize.height - prev.y),
//             }
//           : null
//       )
//       e.stopPropagation()
//     }

//     if (isPanning && !isDrawingEnabled) {
//       const deltaX = e.movementX
//       const deltaY = e.movementY

//       // Calculate new position
//       let newX = position.x + deltaX
//       let newY = position.y + deltaY

//       // Calculate boundaries
//       const scaledImageWidth = imageSize.width * scale
//       const scaledImageHeight = imageSize.height * scale

//       // Prevent image from going outside container bounds
//       newX = Math.min(0, Math.max(newX, containerSize.width - scaledImageWidth))
//       newY = Math.min(0, Math.max(newY, containerSize.height - scaledImageHeight))

//       setPosition({ x: newX, y: newY })
//     }
//   }

//   const handleDelete = (id: string) => {
//     setAnnotations((prev) => prev.filter((ann) => ann.id !== id))
//     if (selectedAnnotation?.id === id) {
//       setSelectedAnnotation(null)
//     }
//   }

//   const handleLabelChange = (id: string, newLabelId: string) => {
//     setAnnotations((prev) =>
//       prev.map((ann) => (ann.id === id ? { ...ann, labelId: newLabelId } : ann))
//     )
//   }

//   const handleResize = (e: React.MouseEvent, annotation: Annotation) => {
//     e.stopPropagation()
//     if (!resizeHandle || isDrawingEnabled) return

//     const { x: currentX, y: currentY } = getImageCoordinates(e.clientX, e.clientY)

//     if (!initialBox) {
//       setInitialBox(annotation)
//       return
//     }

//     const startX = dragStart ? dragStart.x : currentX
//     const startY = dragStart ? dragStart.y : currentY
//     const deltaX = currentX - startX
//     const deltaY = currentY - startY

//     setAnnotations((prev) => {
//       let newAnnotations = [...prev]
//       const index = newAnnotations.findIndex((ann) => ann.id === annotation.id)
//       if (index === -1) return prev

//       let newBox = { ...initialBox }

//       switch (resizeHandle) {
//         case 'topLeft':
//           newBox.xmin = Math.max(0, Math.min(initialBox.xmin + deltaX, newBox.xmax - 10))
//           newBox.ymin = Math.max(0, Math.min(initialBox.ymin + deltaY, newBox.ymax - 10))
//           break
//         case 'topRight':
//           newBox.xmax = Math.min(
//             imageSize.width,
//             Math.max(initialBox.xmax + deltaX, newBox.xmin + 10)
//           )
//           newBox.ymin = Math.max(0, Math.min(initialBox.ymin + deltaY, newBox.ymax - 10))
//           break
//         case 'bottomLeft':
//           newBox.xmin = Math.max(0, Math.min(initialBox.xmin + deltaX, newBox.xmax - 10))
//           newBox.ymax = Math.min(
//             imageSize.height,
//             Math.max(initialBox.ymax + deltaY, newBox.ymin + 10)
//           )
//           break
//         case 'bottomRight':
//           newBox.xmax = Math.min(
//             imageSize.width,
//             Math.max(initialBox.xmax + deltaX, newBox.xmin + 10)
//           )
//           newBox.ymax = Math.min(
//             imageSize.height,
//             Math.max(initialBox.ymax + deltaY, newBox.ymin + 10)
//           )
//           break
//         case 'top':
//           newBox.ymin = Math.max(0, Math.min(initialBox.ymin + deltaY, newBox.ymax - 10))
//           break
//         case 'bottom':
//           newBox.ymax = Math.min(
//             imageSize.height,
//             Math.max(initialBox.ymax + deltaY, newBox.ymin + 10)
//           )
//           break
//         case 'left':
//           newBox.xmin = Math.max(0, Math.min(initialBox.xmin + deltaX, newBox.xmax - 10))
//           break
//         case 'right':
//           newBox.xmax = Math.min(
//             imageSize.width,
//             Math.max(initialBox.xmax + deltaX, newBox.xmin + 10)
//           )
//           break
//       }

//       newAnnotations[index] = newBox
//       return newAnnotations
//     })
//   }

//   const ResizeHandle = ({ position, cursor }: { position: string; cursor: string }) => (
//     <div
//       className="absolute h-3 w-3 rounded-full border-2 border-blue-500 bg-white"
//       style={{
//         ...getHandlePosition(position),
//         cursor: cursor,
//         transform: 'translate(-50%, -50%)',
//         zIndex: 10,
//       }}
//       onMouseDown={(e) => {
//         if (isDrawingEnabled) return
//         e.stopPropagation()
//         e.preventDefault()
//         setResizeHandle(position as ResizeHandle)
//         setIsResizing(true)
//         const { x: startX, y: startY } = getImageCoordinates(e.clientX, e.clientY)
//         setDragStart({ x: startX, y: startY })
//       }}
//     />
//   )

//   const getHandlePosition = (position: string) => {
//     switch (position) {
//       case 'topLeft':
//         return { left: '0%', top: '0%' }
//       case 'topRight':
//         return { left: '100%', top: '0%' }
//       case 'bottomLeft':
//         return { left: '0%', top: '100%' }
//       case 'bottomRight':
//         return { left: '100%', top: '100%' }
//       case 'top':
//         return { left: '50%', top: '0%' }
//       case 'bottom':
//         return { left: '50%', top: '100%' }
//       case 'left':
//         return { left: '0%', top: '50%' }
//       case 'right':
//         return { left: '100%', top: '50%' }
//       default:
//         return {}
//     }
//   }

//   return (
//     <div className="my-5 mt-20 flex h-screen w-full flex-row">
//       <div
//         ref={containerRef}
//         className="relative flex-grow overflow-hidden border border-gray-300 bg-gray-100"
//       >
//         <div className="absolute left-2 top-2 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
//           {isDrawingEnabled ? 'Drawing Mode (ESC to cancel)' : "Press 'n' to start drawing"}
//         </div>
//         <div className="absolute right-2 top-2 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
//           Zoom: {Math.round(scale * 100)}%
//         </div>
//         <div
//           style={{
//             transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
//             transformOrigin: '0 0',
//             width: 'fit-content',
//             height: 'fit-content',
//             position: 'absolute',
//           }}
//           onMouseUp={() => {
//             setDragStart(null)
//             setResizeHandle(null)
//             setIsPanning(false)
//             setInitialBox(null)
//             setKickedAnnotation(null)
//             setIsResizing(false)
//           }}
//           onMouseMove={handleMouseMove}
//         >
//           <img
//             ref={imageRef}
//             id="annotationImage"
//             src={dataset.images[0].image}
//             alt="Annotatable"
//             onClick={handleImageClick}
//             onMouseDown={(e) => {
//               if (!isDrawingEnabled) {
//                 setIsPanning(true)
//                 e.preventDefault()
//               }
//             }}
//             draggable={false}
//             style={{
//               cursor: isDrawingEnabled ? 'crosshair' : resizeHandle ? 'grabbing' : 'grab',
//               userSelect: 'none',
//               WebkitUserSelect: 'none',
//             }}
//           />
//           {annotations.map((ann) => (
//             <div
//               key={ann.id}
//               className={`absolute border ${selectedAnnotation?.id === ann.id ? 'border-[3px] border-dotted border-green-500' : ''}`}
//               style={{
//                 left: `${ann.xmin}px`,
//                 top: `${ann.ymin}px`,
//                 width: `${ann.xmax - ann.xmin}px`,
//                 height: `${ann.ymax - ann.ymin}px`,
//                 borderColor:
//                   dataset.labels.find((label) => label.id === ann.labelId)?.color || 'red',
//                 backgroundColor: `${dataset.labels.find((label) => label.id === ann.labelId)?.color}20`,
//                 cursor: isDrawingEnabled ? 'crosshair' : resizeHandle ? 'grabbing' : 'grab',
//                 pointerEvents: isDrawingEnabled ? 'none' : 'auto',
//               }}
//               onMouseDown={(e) => {
//                 if (isDrawingEnabled) return
//                 if (isResizing) return
//                 e.stopPropagation()
//                 setSelectedAnnotation(ann)
//                 const { x: startX, y: startY } = getImageCoordinates(e.clientX, e.clientY)
//                 setDragStart({ x: startX, y: startY })
//                 setInitialBox(ann)
//               }}
//               onMouseMove={(e) => {
//                 if (isDrawingEnabled) return
//                 if (resizeHandle) {
//                   handleResize(e, ann)
//                   return
//                 }
//                 if (!dragStart || selectedAnnotation?.id !== ann.id || !initialBox) return

//                 const { x: currentX, y: currentY } = getImageCoordinates(e.clientX, e.clientY)

//                 const deltaX = currentX - dragStart.x
//                 const deltaY = currentY - dragStart.y

//                 setAnnotations((prev) =>
//                   prev.map((annotation) => {
//                     if (annotation.id === ann.id) {
//                       // Calculate new positions
//                       let newXmin = initialBox.xmin + deltaX
//                       let newYmin = initialBox.ymin + deltaY
//                       let newXmax = initialBox.xmax + deltaX
//                       let newYmax = initialBox.ymax + deltaY

//                       // Ensure annotation stays within image bounds
//                       if (newXmin < 0) {
//                         newXmax -= newXmin
//                         newXmin = 0
//                       }
//                       if (newYmin < 0) {
//                         newYmax -= newYmin
//                         newYmin = 0
//                       }
//                       if (newXmax > imageSize.width) {
//                         newXmin -= newXmax - imageSize.width
//                         newXmax = imageSize.width
//                       }
//                       if (newYmax > imageSize.height) {
//                         newYmin -= newYmax - imageSize.height
//                         newYmax = imageSize.height
//                       }

//                       return {
//                         ...annotation,
//                         xmin: newXmin,
//                         ymin: newYmin,
//                         xmax: newXmax,
//                         ymax: newYmax,
//                       }
//                     }
//                     return annotation
//                   })
//                 )
//               }}
//             >
//               <span
//                 className="absolute -top-6 rounded bg-black px-1 text-xs text-white"
//                 style={{
//                   backgroundColor:
//                     dataset.labels.find((label) => label.id === ann.labelId)?.color || 'black',
//                 }}
//               >
//                 {dataset.labels.find((label) => label.id === ann.labelId)?.labelName}
//               </span>
//               {selectedAnnotation?.id === ann.id && (
//                 <>
//                   <ResizeHandle position="topLeft" cursor="nw-resize" />
//                   <ResizeHandle position="topRight" cursor="ne-resize" />
//                   <ResizeHandle position="bottomLeft" cursor="sw-resize" />
//                   <ResizeHandle position="bottomRight" cursor="se-resize" />
//                   <ResizeHandle position="top" cursor="n-resize" />
//                   <ResizeHandle position="bottom" cursor="s-resize" />
//                   <ResizeHandle position="left" cursor="w-resize" />
//                   <ResizeHandle position="right" cursor="e-resize" />
//                 </>
//               )}
//             </div>
//           ))}
//           {newBox && (
//             <div
//               className="absolute border border-blue-500 bg-blue-500 bg-opacity-20"
//               style={{
//                 left: `${newBox.x}px`,
//                 top: `${newBox.y}px`,
//                 width: `${newBox.width}px`,
//                 height: `${newBox.height}px`,
//                 pointerEvents: 'none',
//                 zIndex: 1000,
//               }}
//             />
//           )}
//         </div>
//       </div>
//       <div className="h-full w-1/5 overflow-auto border-l border-gray-300 bg-gray-50 px-4">
//         <div className="sticky top-0 flex flex-wrap space-x-2 bg-gray-50 py-3">
//           <h2 className="mb-2 w-full text-lg font-bold">Active Label</h2>
//           {dataset.labels.map((label) => (
//             <div key={label.id} className="mb-2 flex items-center">
//               <button
//                 className={`rounded px-2 py-1 text-xs ${
//                   selectedLabel === label.id
//                     ? 'bg-blue-700 text-white'
//                     : 'bg-gray-200 text-gray-800'
//                 }`}
//                 onClick={() => setSelectedLabel(label.id)}
//               >
//                 {label.labelName}
//               </button>
//             </div>
//           ))}
//         </div>

//         <h2 className="mb-2 mt-4 text-lg font-bold">Labels</h2>
//         <div>
//           {annotations.map((ann) => (
//             <div
//               key={ann.id}
//               className={`mb-2 flex items-center justify-between rounded border text-sm ${
//                 ann.id === selectedAnnotation?.id ? 'bg-gray-100' : ''
//               }`}
//               onClick={() => setSelectedAnnotation(ann)}
//             >
//               <div className="flex w-full items-center justify-between space-x-2">
//                 <select
//                   value={ann.labelId}
//                   onChange={(e) => handleLabelChange(ann.id, e.target.value)}
//                   className="ml-3 w-full rounded border-0 bg-transparent px-1 text-xs"
//                 >
//                   {dataset.labels.map((label) => (
//                     <option key={label.id} value={label.id}>
//                       {label.labelName}
//                     </option>
//                   ))}
//                 </select>
//                 <button
//                   className="rounded bg-red-500 px-2 py-1 text-xs text-white"
//                   onClick={() => handleDelete(ann.id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AnnotationToolStable
