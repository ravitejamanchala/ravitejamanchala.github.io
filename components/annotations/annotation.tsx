/* eslint-disable */
import React, { useState, useEffect } from 'react'

interface Label {
  id: string
  labelName: string
  color: string
}

interface Annotation {
  xmin: number
  ymin: number
  xmax: number
  ymax: number
  id: string
  labelId: string
}

interface ImageData {
  id: string
  image: string
  annotations: Annotation[]
}

interface Dataset {
  images: ImageData[]
  labels: Label[]
}

type ResizeHandle =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | null

interface SavedData {
  annotations: Annotation[]
  imageId: string
  timestamp: number
}

const AnnotationTool: React.FC<{ dataset: Dataset }> = ({ dataset }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [annotations, setAnnotations] = useState<Annotation[]>(dataset.images[0]?.annotations || [])
  const [selectedLabel, setSelectedLabel] = useState<string | null>(dataset.labels[0]?.id || null)
  const [newBox, setNewBox] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [initialBox, setInitialBox] = useState<Annotation | null>(null)
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false)
  const [kickedAnnotation, setKickedAnnotation] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(1)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const imageRef = React.useRef<HTMLImageElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [annotationsMap, setAnnotationsMap] = useState<{ [key: string]: Annotation[] }>({})

  useEffect(() => {
    const saved = localStorage.getItem('saved_annotations')
    if (saved) {
      const data = JSON.parse(saved)
      setAnnotationsMap(data.annotations)
    }
  }, [])

  useEffect(() => {
    if (imageSize.width > 0) {
      const currentImageId = dataset.images[currentImageIndex].id
      const saved = localStorage.getItem('saved_annotations')

      if (saved) {
        const data = JSON.parse(saved)
        setAnnotations(data.annotations[currentImageId] || [])
      }
    }
  }, [currentImageIndex, imageSize.width])

  useEffect(() => {
    if (annotations.length > 0 && imageSize.width > 0) {
      const currentImageId = dataset.images[currentImageIndex].id
      setAnnotationsMap((prev) => ({
        ...prev,
        [currentImageId]: annotations,
      }))
    }
  }, [annotations, currentImageIndex, imageSize.width])

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateContainerSize()
    window.addEventListener('resize', updateContainerSize)
    return () => window.removeEventListener('resize', updateContainerSize)
  }, [])

  useEffect(() => {
    const img = new Image()
    img.src = dataset.images[currentImageIndex].image
    img.onload = () => {
      setImageSize({
        width: img.width,
        height: img.height,
      })
      setIsLoading(false)
    }
  }, [dataset.images, currentImageIndex])

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDragStart(null)
      setResizeHandle(null)
      setIsPanning(false)
      setInitialBox(null)
      setKickedAnnotation(null)
      setIsResizing(false)
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        console.log(selectedAnnotation)
        e.preventDefault()
        if (selectedAnnotation) {
          handleDelete(selectedAnnotation.id)
        }
      }
      if (e.key === 'n') {
        e.preventDefault()
        setIsDrawingEnabled(true)
        setNewBox(null)
        setSelectedAnnotation(null)
      }
      if (e.key === 'Escape') {
        setNewBox(null)
        setIsDrawingEnabled(false)
        setSelectedAnnotation(null)
      }
      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (selectedAnnotation) {
          const newAnnotation: Annotation = {
            ...selectedAnnotation,
            id: `new-${Date.now()}`,
            xmin: selectedAnnotation.xmin + 5,
            ymin: selectedAnnotation.ymin + 5,
            xmax: selectedAnnotation.xmax + 5,
            ymax: selectedAnnotation.ymax + 5,
          }
          setAnnotations((prev) => [...prev, newAnnotation])
          setSelectedAnnotation(newAnnotation)
        }
      }
      if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setSelectedAnnotation(annotations[0])
      }
      if (e.key === 'ArrowUp' && selectedAnnotation) {
        e.preventDefault()
        const moveAmount = e.shiftKey ? 10 : 1
        moveSelectedAnnotation(0, -moveAmount)
      }
      if (e.key === 'ArrowDown' && selectedAnnotation) {
        e.preventDefault()
        const moveAmount = e.shiftKey ? 10 : 1
        moveSelectedAnnotation(0, moveAmount)
      }
      if (e.key === 'ArrowLeft' && selectedAnnotation) {
        e.preventDefault()
        const moveAmount = e.shiftKey ? 10 : 1
        moveSelectedAnnotation(-moveAmount, 0)
      }
      if (e.key === 'ArrowRight' && selectedAnnotation) {
        e.preventDefault()
        const moveAmount = e.shiftKey ? 10 : 1
        moveSelectedAnnotation(moveAmount, 0)
      }
      if (e.key === 'c' && (e.ctrlKey || e.metaKey) && selectedAnnotation) {
        e.preventDefault()
        localStorage.setItem('copiedAnnotation', JSON.stringify(selectedAnnotation))
      }
      if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        const copied = localStorage.getItem('copiedAnnotation')
        if (copied) {
          const copiedAnnotation = JSON.parse(copied)
          const newAnnotation: Annotation = {
            ...copiedAnnotation,
            id: `new-${Date.now()}`,
            xmin: copiedAnnotation.xmin + 10,
            ymin: copiedAnnotation.ymin + 10,
            xmax: copiedAnnotation.xmax + 10,
            ymax: copiedAnnotation.ymax + 10,
          }
          setAnnotations((prev) => [...prev, newAnnotation])
          setSelectedAnnotation(newAnnotation)
        }
      }
      if (e.key === '[' || (e.key === 'ArrowLeft' && e.altKey)) {
        e.preventDefault()
        setCurrentImageIndex((prev) => Math.max(0, prev - 1))
      }
      if (e.key === ']' || (e.key === 'ArrowRight' && e.altKey)) {
        e.preventDefault()
        setCurrentImageIndex((prev) => Math.min(dataset.images.length - 1, prev + 1))
      }
      if (e.key === 'h') {
        setShowShortcuts((prev) => !prev)
      }

      if (e.key === 'r') {
        setScale(1)
        setPosition({ x: 0, y: 0 })
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        const data = {
          annotations: {
            ...annotationsMap,
            [dataset.images[currentImageIndex].id]: annotations,
          },
          timestamp: Date.now(),
        }
        localStorage.setItem('saved_annotations', JSON.stringify(data))
        console.log('Annotations saved')
      }

      // Add number key shortcuts for label selection
      const num = parseInt(e.key)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && num >= 1 && num <= 9) {
        e.preventDefault()
        const labelIndex = num - 1
        if (labelIndex < dataset.labels.length) {
          const newLabelId = dataset.labels[labelIndex].id
          if (selectedAnnotation) {
            // If annotation is selected, change its label
            handleLabelChange(selectedAnnotation.id, newLabelId)
          } else {
            // Otherwise, change the selected label for new annotations
            setSelectedLabel(newLabelId)
          }
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1

        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        setScale((prevScale) => {
          const minScale = getScaleFactor()
          const maxScale = 4
          const newScale = Math.min(Math.max(prevScale + delta, minScale), maxScale)

          const mouseImageX = (mouseX - position.x) / prevScale
          const mouseImageY = (mouseY - position.y) / prevScale

          const newX = mouseX - mouseImageX * newScale
          const newY = mouseY - mouseImageY * newScale

          const maxX = 0
          const maxY = 0
          const minX = containerSize.width - imageSize.width * newScale
          const minY = containerSize.height - imageSize.height * newScale

          setPosition({
            x: Math.min(maxX, Math.max(minX, newX)),
            y: Math.min(maxY, Math.max(minY, newY)),
          })

          return newScale
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [
    selectedAnnotation,
    position,
    containerSize,
    imageSize,
    annotations,
    currentImageIndex,
    dataset.images.length,
  ])

  useEffect(() => {
    if (containerSize.width > 0 && imageSize.width > 0) {
      const initialScale = getScaleFactor()
      setScale(initialScale)

      const scaledWidth = imageSize.width * initialScale
      const scaledHeight = imageSize.height * initialScale

      setPosition({
        x: (containerSize.width - scaledWidth) / 2,
        y: (containerSize.height - scaledHeight) / 2,
      })
    }
  }, [containerSize.width, containerSize.height, imageSize.width, imageSize.height])

  const getScaleFactor = () => {
    if (containerSize.width > 0 && imageSize.width > 0) {
      if (imageSize.width > containerSize.width || imageSize.height > containerSize.height) {
        const scaleX = containerSize.width / imageSize.width
        const scaleY = containerSize.height / imageSize.height
        return Math.min(scaleX, scaleY)
      }
      return 1
    }
    return 1
  }

  const getImageCoordinates = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 }

    const rect = containerRef.current.getBoundingClientRect()
    const scaleFactor = getScaleFactor()

    const x = (clientX - rect.left - position.x) / scale / scaleFactor
    const y = (clientY - rect.top - position.y) / scale / scaleFactor

    return { x, y }
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingEnabled || isPanning || resizeHandle) return

    const { x, y } = getImageCoordinates(e.clientX, e.clientY)

    if (!newBox) {
      setNewBox({ x, y, width: 0, height: 0 })
      e.stopPropagation()
    } else {
      const newAnnotation: Annotation = {
        xmin: Math.min(newBox.x, x),
        ymin: Math.min(newBox.y, y),
        xmax: Math.max(newBox.x, x),
        ymax: Math.max(newBox.y, y),
        id: `new-${Date.now()}`,
        labelId: selectedLabel || 'unknown',
      }

      // Ensure annotation is within image bounds
      if (newAnnotation.xmax > imageSize.width) newAnnotation.xmax = imageSize.width
      if (newAnnotation.ymax > imageSize.height) newAnnotation.ymax = imageSize.height
      if (newAnnotation.xmin < 0) newAnnotation.xmin = 0
      if (newAnnotation.ymin < 0) newAnnotation.ymin = 0

      setAnnotations((prev) => [...prev, newAnnotation])
      setNewBox(null)
      setSelectedAnnotation(newAnnotation)
      setIsDrawingEnabled(false)
      e.stopPropagation()
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (newBox) {
      const { x, y } = getImageCoordinates(e.clientX, e.clientY)

      setNewBox((prev) =>
        prev
          ? {
              ...prev,
              width: Math.min(Math.max(x - prev.x, 0), imageSize.width - prev.x),
              height: Math.min(Math.max(y - prev.y, 0), imageSize.height - prev.y),
            }
          : null
      )
      e.stopPropagation()
    }

    if (isPanning && !isDrawingEnabled) {
      const deltaX = e.movementX
      const deltaY = e.movementY

      setPosition((prev) => {
        // Calculate boundaries based on current scale
        const maxX = 0
        const maxY = 0
        const minX = containerSize.width - imageSize.width * scale
        const minY = containerSize.height - imageSize.height * scale

        return {
          x: Math.min(maxX, Math.max(minX, prev.x + deltaX)),
          y: Math.min(maxY, Math.max(minY, prev.y + deltaY)),
        }
      })
    }
  }

  const handleDelete = (id: string) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id))
    if (selectedAnnotation?.id === id) {
      setSelectedAnnotation(null)
    }
  }

  const handleLabelChange = (id: string, newLabelId: string) => {
    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, labelId: newLabelId } : ann))
    )
  }

  const handleResize = (e: React.MouseEvent, annotation: Annotation) => {
    e.stopPropagation()
    if (!resizeHandle || isDrawingEnabled) return

    const { x: currentX, y: currentY } = getImageCoordinates(e.clientX, e.clientY)

    if (!initialBox) {
      setInitialBox(annotation)
      return
    }

    const startX = dragStart ? dragStart.x : currentX
    const startY = dragStart ? dragStart.y : currentY
    const deltaX = currentX - startX
    const deltaY = currentY - startY

    setAnnotations((prev) => {
      let newAnnotations = [...prev]
      const index = newAnnotations.findIndex((ann) => ann.id === annotation.id)
      if (index === -1) return prev

      let newBox = { ...initialBox }

      switch (resizeHandle) {
        case 'topLeft':
          newBox.xmin = Math.max(0, Math.min(initialBox.xmin + deltaX, newBox.xmax - 10))
          newBox.ymin = Math.max(0, Math.min(initialBox.ymin + deltaY, newBox.ymax - 10))
          break
        case 'topRight':
          newBox.xmax = Math.min(
            imageSize.width,
            Math.max(initialBox.xmax + deltaX, newBox.xmin + 10)
          )
          newBox.ymin = Math.max(0, Math.min(initialBox.ymin + deltaY, newBox.ymax - 10))
          break
        case 'bottomLeft':
          newBox.xmin = Math.max(0, Math.min(initialBox.xmin + deltaX, newBox.xmax - 10))
          newBox.ymax = Math.min(
            imageSize.height,
            Math.max(initialBox.ymax + deltaY, newBox.ymin + 10)
          )
          break
        case 'bottomRight':
          newBox.xmax = Math.min(
            imageSize.width,
            Math.max(initialBox.xmax + deltaX, newBox.xmin + 10)
          )
          newBox.ymax = Math.min(
            imageSize.height,
            Math.max(initialBox.ymax + deltaY, newBox.ymin + 10)
          )
          break
        case 'top':
          newBox.ymin = Math.max(0, Math.min(initialBox.ymin + deltaY, newBox.ymax - 10))
          break
        case 'bottom':
          newBox.ymax = Math.min(
            imageSize.height,
            Math.max(initialBox.ymax + deltaY, newBox.ymin + 10)
          )
          break
        case 'left':
          newBox.xmin = Math.max(0, Math.min(initialBox.xmin + deltaX, newBox.xmax - 10))
          break
        case 'right':
          newBox.xmax = Math.min(
            imageSize.width,
            Math.max(initialBox.xmax + deltaX, newBox.xmin + 10)
          )
          break
      }

      newAnnotations[index] = newBox
      return newAnnotations
    })
  }

  const ResizeHandle = ({ position, cursor }: { position: string; cursor: string }) => (
    <div
      className="absolute h-3 w-3 rounded-full border-2 border-blue-500 bg-white"
      style={{
        ...getHandlePosition(position),
        cursor: cursor,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
      onMouseDown={(e) => {
        if (isDrawingEnabled) return
        e.stopPropagation()
        e.preventDefault()
        setResizeHandle(position as ResizeHandle)
        setIsResizing(true)
        const { x: startX, y: startY } = getImageCoordinates(e.clientX, e.clientY)
        setDragStart({ x: startX, y: startY })
      }}
    />
  )

  const getHandlePosition = (position: string) => {
    switch (position) {
      case 'topLeft':
        return { left: '0%', top: '0%' }
      case 'topRight':
        return { left: '100%', top: '0%' }
      case 'bottomLeft':
        return { left: '0%', top: '100%' }
      case 'bottomRight':
        return { left: '100%', top: '100%' }
      case 'top':
        return { left: '50%', top: '0%' }
      case 'bottom':
        return { left: '50%', top: '100%' }
      case 'left':
        return { left: '0%', top: '50%' }
      case 'right':
        return { left: '100%', top: '50%' }
      default:
        return {}
    }
  }

  const moveSelectedAnnotation = (deltaX: number, deltaY: number) => {
    if (!selectedAnnotation) return

    setAnnotations((prev) =>
      prev.map((ann) => {
        if (ann.id === selectedAnnotation.id) {
          const newXmin = Math.max(
            0,
            Math.min(ann.xmin + deltaX, imageSize.width - (ann.xmax - ann.xmin))
          )
          const newYmin = Math.max(
            0,
            Math.min(ann.ymin + deltaY, imageSize.height - (ann.ymax - ann.ymin))
          )
          return {
            ...ann,
            xmin: newXmin,
            ymin: newYmin,
            xmax: newXmin + (ann.xmax - ann.xmin),
            ymax: newYmin + (ann.ymax - ann.ymin),
          }
        }
        return ann
      })
    )
  }

  // Sort annotations to prioritize selected label
  const sortedAnnotations = [...(annotations || [])].sort((a, b) => {
    if (a.labelId === selectedLabel && b.labelId !== selectedLabel) return -1
    if (a.labelId !== selectedLabel && b.labelId === selectedLabel) return 1
    return 0
  })

  const exportAnnotations = () => {
    const data = {
      imageId: dataset.images[0].id,
      annotations: annotations,
      labels: dataset.labels,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `annotations_${dataset.images[0].id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importAnnotations = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.imageId === dataset.images[0].id) {
            setAnnotations(data.annotations)
          }
        } catch (error) {
          console.error('Error importing annotations:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  // const handleFitToScreen = () => {
  //   setScale(containerSize.width / imageSize.width)
  //   setPosition({ x: 0, y: 0 })
  // }

  const getAspectRatio = () => {
    return imageSize.width / imageSize.height
  }

  const handleSave = () => {
    const currentImageId = dataset.images[currentImageIndex].id
    const newAnnotationsMap = {
      ...annotationsMap,
      [currentImageId]: annotations,
    }

    localStorage.setItem(
      'saved_annotations',
      JSON.stringify({
        annotations: newAnnotationsMap,
        timestamp: Date.now(),
      })
    )

    setAnnotationsMap(newAnnotationsMap)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg">Loading image and annotations...</div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex h-screen w-full flex-row">
      <div
        ref={containerRef}
        className="relative flex-grow overflow-hidden border border-gray-300 bg-gray-100"
      >
        <div className="absolute left-2 top-2 z-10 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
          {isDrawingEnabled ? 'Drawing Mode (ESC to cancel)' : "Press 'n' to start drawing"}
        </div>
        <div className="absolute right-2 top-2 z-10 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
          <div>Zoom: {Math.round(scale * 100)}%</div>
        </div>
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            width: imageSize.width,
            height: imageSize.height,
            position: 'absolute',
          }}
        >
          <img
            ref={imageRef}
            id="annotationImage"
            src={dataset.images[currentImageIndex].image}
            alt="Annotatable"
            style={{
              width: '100%',
              height: '100%',
              cursor: isDrawingEnabled ? 'crosshair' : resizeHandle ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
            onClick={handleImageClick}
            onMouseDown={(e) => {
              if (!isDrawingEnabled) {
                setIsPanning(true)
                e.preventDefault()
              }
            }}
            onMouseUp={() => {
              setDragStart(null)
              setResizeHandle(null)
              setIsPanning(false)
              setInitialBox(null)
              setKickedAnnotation(null)
              setIsResizing(false)
            }}
            onMouseMove={handleMouseMove}
            draggable={false}
          />
          {annotations &&
            annotations.map((ann) => (
              <div
                key={ann.id}
                className={`absolute border ${selectedAnnotation?.id === ann.id ? 'border-[3px] border-dotted border-green-500' : ''}`}
                style={{
                  left: `${ann.xmin}px`,
                  top: `${ann.ymin}px`,
                  width: `${ann.xmax - ann.xmin}px`,
                  height: `${ann.ymax - ann.ymin}px`,
                  borderColor:
                    dataset.labels.find((label) => label.id === ann.labelId)?.color || 'red',
                  backgroundColor: `${dataset.labels.find((label) => label.id === ann.labelId)?.color}20`,
                  cursor: isDrawingEnabled ? 'crosshair' : resizeHandle ? 'grabbing' : 'grab',
                  pointerEvents: isDrawingEnabled ? 'none' : 'auto',
                }}
                onMouseDown={(e) => {
                  if (isDrawingEnabled) return
                  if (isResizing) return
                  e.stopPropagation()
                  setSelectedAnnotation(ann)
                  const { x: startX, y: startY } = getImageCoordinates(e.clientX, e.clientY)
                  setDragStart({ x: startX, y: startY })
                  setInitialBox(ann)
                }}
                onMouseMove={(e) => {
                  if (isDrawingEnabled) return
                  if (resizeHandle) {
                    handleResize(e, ann)
                    return
                  }
                  if (!dragStart || selectedAnnotation?.id !== ann.id || !initialBox) return

                  const { x: currentX, y: currentY } = getImageCoordinates(e.clientX, e.clientY)

                  const deltaX = currentX - dragStart.x
                  const deltaY = currentY - dragStart.y

                  setAnnotations((prev) =>
                    prev.map((annotation) => {
                      if (annotation.id === ann.id) {
                        // Calculate new positions
                        let newXmin = initialBox.xmin + deltaX
                        let newYmin = initialBox.ymin + deltaY
                        let newXmax = initialBox.xmax + deltaX
                        let newYmax = initialBox.ymax + deltaY

                        // Ensure annotation stays within image bounds
                        if (newXmin < 0) {
                          newXmax -= newXmin
                          newXmin = 0
                        }
                        if (newYmin < 0) {
                          newYmax -= newYmin
                          newYmin = 0
                        }
                        if (newXmax > imageSize.width) {
                          newXmin -= newXmax - imageSize.width
                          newXmax = imageSize.width
                        }
                        if (newYmax > imageSize.height) {
                          newYmin -= newYmax - imageSize.height
                          newYmax = imageSize.height
                        }

                        return {
                          ...annotation,
                          xmin: newXmin,
                          ymin: newYmin,
                          xmax: newXmax,
                          ymax: newYmax,
                        }
                      }
                      return annotation
                    })
                  )
                }}
              >
                <span
                  className="absolute -top-6 rounded bg-black px-1 text-xs text-white"
                  style={{
                    backgroundColor:
                      dataset.labels.find((label) => label.id === ann.labelId)?.color || 'black',
                  }}
                >
                  {dataset.labels.find((label) => label.id === ann.labelId)?.labelName}
                </span>
                {selectedAnnotation?.id === ann.id && (
                  <>
                    <ResizeHandle position="topLeft" cursor="nw-resize" />
                    <ResizeHandle position="topRight" cursor="ne-resize" />
                    <ResizeHandle position="bottomLeft" cursor="sw-resize" />
                    <ResizeHandle position="bottomRight" cursor="se-resize" />
                    <ResizeHandle position="top" cursor="n-resize" />
                    <ResizeHandle position="bottom" cursor="s-resize" />
                    <ResizeHandle position="left" cursor="w-resize" />
                    <ResizeHandle position="right" cursor="e-resize" />
                  </>
                )}
              </div>
            ))}
          {newBox && (
            <div
              className="absolute border border-blue-500 bg-blue-500 bg-opacity-20"
              style={{
                left: `${newBox.x}px`,
                top: `${newBox.y}px`,
                width: `${newBox.width}px`,
                height: `${newBox.height}px`,
                pointerEvents: 'none',
                zIndex: 1000,
              }}
            />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-4 bg-black bg-opacity-50 px-4 py-2 text-white">
          <button
            className="rounded p-1 hover:bg-gray-700"
            onClick={() => setCurrentImageIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentImageIndex === 0}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <input
            type="range"
            min={0}
            max={dataset.images.length - 1}
            value={currentImageIndex}
            onChange={(e) => setCurrentImageIndex(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
          />
          <button
            className="rounded p-1 hover:bg-gray-700"
            onClick={() =>
              setCurrentImageIndex((prev) => Math.min(dataset.images.length - 1, prev + 1))
            }
            disabled={currentImageIndex === dataset.images.length - 1}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="min-w-[60px] text-center text-sm">
            {currentImageIndex + 1} / {dataset.images.length}
          </span>
        </div>
      </div>
      <div className="h-full w-1/5 overflow-auto border-l border-gray-300 bg-gray-50 px-4">
        {/* Labels Section */}
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-bold">Labels</h2>
          <div className="flex flex-wrap gap-2">
            {dataset.labels.map((label) => (
              <button
                key={label.id}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all
                  ${
                    selectedLabel === label.id
                      ? 'text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                style={{
                  backgroundColor: selectedLabel === label.id ? label.color : undefined,
                }}
                onClick={() => setSelectedLabel(label.id)}
              >
                {label.labelName}
              </button>
            ))}
          </div>
        </div>

        {/* Annotations List */}
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-bold">Annotations</h2>
          <div className="space-y-2">
            {sortedAnnotations.map((ann) => (
              <div
                key={ann.id}
                className={`cursor-pointer rounded-lg  px-4 transition-all
                  ${ann.id === selectedAnnotation?.id ? 'ring-2 ring-primary-500' : ''}
                  ${ann.labelId === selectedLabel ? '' : 'border-gray-200'}
                  hover:shadow-sm
                `}
                onClick={() => setSelectedAnnotation(ann)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={{
                      backgroundColor: dataset.labels.find((l) => l.id === ann.labelId)?.color,
                    }}
                  />
                  <select
                    value={ann.labelId}
                    onChange={(e) => handleLabelChange(ann.id, e.target.value)}
                    className="flex-1 border-none bg-transparent text-sm focus:ring-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {dataset.labels.map((label) => (
                      <option key={label.id} value={label.id}>
                        {label.labelName}
                      </option>
                    ))}
                  </select>
                  <button
                    className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(ann.id)
                    }}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showShortcuts && <ShortcutOverlay onClose={() => setShowShortcuts(false)} />}
    </div>
  )
}

const ShortcutOverlay = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="max-w-2xl rounded-lg bg-white p-6">
      <h2 className="mb-4 text-xl font-bold">Keyboard Shortcuts</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="mb-2 font-semibold">Navigation</h3>
          <ul className="space-y-1">
            <li>
              <kbd>Alt + ←/→</kbd> or <kbd>[/]</kbd> Previous/Next image
            </li>
            <li>
              <kbd>f</kbd> Fit to screen
            </li>
            <li>
              <kbd>r</kbd> Reset zoom/position
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Annotation</h3>
          <ul className="space-y-1">
            <li>
              <kbd>n</kbd> New box
            </li>
            <li>
              <kbd>Esc</kbd> Cancel drawing
            </li>
            <li>
              <kbd>Delete</kbd> Delete selected
            </li>
            <li>
              <kbd>Ctrl + d</kbd> Duplicate selected
            </li>
          </ul>
        </div>
      </div>
      <button className="mt-4 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
)

export default AnnotationTool
