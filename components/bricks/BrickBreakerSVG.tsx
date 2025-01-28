'use client'
import React, { useState, useEffect, useRef } from 'react'

const BrickBreakerSVG: React.FC = () => {
  // Game dimensions
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth - 100)
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight - 300)

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth - 100)
      setWindowHeight(window.innerHeight - 300)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Game settings
  const columns = (windowWidth - 400) / 40
  const rows = 6
  const brickWidth = 40
  const brickHeight = 40
  const brickPadding = 5
  const brickOffsetTop = 100
  const brickOffsetLeft = 100
  const paddleWidth = 150
  const paddleHeight = 20
  const ballRadius = 18

  // Game state
  const ballX = useRef(windowWidth / 2)
  const ballY = useRef(windowHeight - 38)
  const ballDX = useRef(2)
  const ballDY = useRef(-2)
  const paddleX = useRef((windowWidth - paddleWidth) / 2)

  const [bricks, setBricks] = useState(
    Array.from({ length: columns }, (_, c) =>
      Array.from({ length: rows }, (_, r) => ({
        id: `${c}-${r}`, // Unique ID for each brick
        x: c * (brickWidth + brickPadding) + brickOffsetLeft,
        y: r * (brickHeight + brickPadding) + brickOffsetTop,
      }))
    )
  )

  const [hiddenBricks, setHiddenBricks] = useState<string[]>([]) // Track hidden brick IDs
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [isRunning, setIsRunning] = useState(false)

  // Paddle movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        paddleX.current = Math.min(paddleX.current + 40, windowWidth - paddleWidth)
      } else if (e.key === 'ArrowLeft') {
        paddleX.current = Math.max(paddleX.current - 40, 0)
      } else if (e.code === 'Space') {
        setIsRunning((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [windowWidth, paddleWidth])

  // Game loop
  useEffect(() => {
    if (!isRunning) return

    const gameLoop = setInterval(() => {
      const nextX = ballX.current + ballDX.current
      const nextY = ballY.current + ballDY.current

      // Wall collisions
      if (nextX > windowWidth - ballRadius || nextX < ballRadius) {
        ballDX.current *= -1
      }
      if (nextY < ballRadius) {
        ballDY.current *= -1
      }

      // Paddle collision
      if (
        nextY > windowHeight - paddleHeight - ballRadius &&
        nextX > paddleX.current &&
        nextX < paddleX.current + paddleWidth
      ) {
        ballDY.current *= -1
      }

      // Brick collisions
      let collisionDetected = false
      setBricks((prevBricks) =>
        prevBricks.map((column) =>
          column.map((brick) => {
            if (
              !collisionDetected &&
              !hiddenBricks.includes(brick.id) && // Check if brick is already hidden
              ballX.current + ballRadius >= brick.x &&
              ballX.current - ballRadius <= brick.x + brickWidth &&
              ballY.current + ballRadius >= brick.y &&
              ballY.current - ballRadius <= brick.y + brickHeight
            ) {
              console.log('Collision detected with brick ID:', brick.id)

              // Determine collision side and apply deflection
              const hitFromTop = ballY.current + ballRadius < brick.y + brickHeight / 2
              const hitFromBottom = ballY.current - ballRadius > brick.y + brickHeight / 2
              const hitFromLeft = ballX.current + ballRadius < brick.x + brickWidth / 2
              const hitFromRight = ballX.current - ballRadius > brick.x + brickWidth / 2

              if (hitFromTop || hitFromBottom) ballDY.current *= -1
              if (hitFromLeft || hitFromRight) ballDX.current *= -1

              setScore((prev) => prev + 10) // Increment score
              setHiddenBricks((prev) => [...prev, brick.id]) // Add brick ID to hiddenBricks
              collisionDetected = true
            }
            return brick
          })
        )
      )

      // Ball falls below paddle
      if (nextY > windowHeight - ballRadius) {
        setLives((prev) => prev - 1)
        if (lives > 1) {
          ballX.current = windowWidth / 2
          ballY.current = windowHeight - 38
          ballDX.current = 2
          ballDY.current = -2
        } else {
          setIsRunning(false)
          setLives(3)
          setScore(0)
          setHiddenBricks([]) // Reset hidden bricks on game over
        }
      }

      ballX.current = nextX
      ballY.current = nextY
    }, 10)

    return () => clearInterval(gameLoop)
  }, [isRunning, bricks, hiddenBricks, score, lives, windowWidth, windowHeight])

  return (
    <div className="ml-[50px]  mt-6 h-[calc(100vh-180px)]">
      <div
        style={{ width: windowWidth }}
        className="score-card absolute flex w-['100%'] justify-between gap-4 p-4"
      >
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="text-seondary-500  font-pixelify text-xl font-bold font-semibold capitalize leading-6 sm:block"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <span className="font-pixelify  text-xl font-bold font-semibold capitalize leading-6 text-primary-500 sm:block">
          Score: {score}
        </span>
        <span className="font-pixelify  text-xl font-bold font-semibold capitalize leading-6 text-primary-500 sm:block">
          Lives: {lives}
        </span>
      </div>
      <svg width={windowWidth} height={windowHeight} style={{ border: '1px solid black' }}>
        <circle cx={ballX.current} cy={ballY.current} r={ballRadius} fill="#D7713B" />
        <rect
          x={paddleX.current}
          y={windowHeight - paddleHeight}
          width={paddleWidth}
          height={paddleHeight}
          fill="#111111"
        />
        {/* Bricks */}
        {bricks.map((column, cIdx) =>
          column.map(
            (brick) =>
              !hiddenBricks.includes(brick.id) && ( // Render only bricks not in hiddenBricks
                <rect
                  key={brick.id}
                  x={brick.x}
                  y={brick.y}
                  width={brickWidth}
                  height={brickHeight}
                  fill="#111111"
                />
              )
          )
        )}
      </svg>
    </div>
  )
}

export default BrickBreakerSVG
