/**
 * Scroll Follow Cursor Component
 *
 * Automatically scrolls the content when the user moves the cursor
 * Scroll speed increases towards the edges of the container
 *
 * @component
 */

'use client'

import { useEffect, useRef } from 'react'

interface ScrollFollowCursorProps {
  children: React.ReactNode
  className?: string
}

/**
 * Component that makes the container scroll automatically based on cursor position
 * When cursor is near top/bottom edges, scrolls in that direction
 */
export default function ScrollFollowCursor({ children, className = '' }: ScrollFollowCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrameId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const y = e.clientY - rect.top
      const x = e.clientX - rect.left

      // Check if cursor is inside the container
      if (
        x >= 0 &&
        x <= rect.width &&
        y >= 0 &&
        y <= rect.height
      ) {
        lastPosRef.current = { x, y }
      }
    }

    const scroll = () => {
      if (!container) return

      const rect = container.getBoundingClientRect()
      const { y } = lastPosRef.current

      // Calculate distance from top and bottom edges (scroll zones)
      const edgeSize = 150 // 150px from edges
      const topZone = y
      const bottomZone = rect.height - y

      let scrollSpeed = 0
      const maxSpeed = 15 // Maximum pixels per frame

      // Near top edge -> scroll up (negative speed)
      if (topZone < edgeSize && topZone > 0) {
        const intensity = 1 - (topZone / edgeSize) // 0 to 1
        scrollSpeed = -maxSpeed * intensity
      }
      // Near bottom edge -> scroll down (positive speed)
      else if (bottomZone < edgeSize && bottomZone > 0) {
        const intensity = 1 - (bottomZone / edgeSize) // 0 to 1
        scrollSpeed = maxSpeed * intensity
      }

      // Apply scroll if there's speed
      if (scrollSpeed !== 0) {
        container.scrollTop += scrollSpeed
      }

      // Continue animation loop if cursor is in scroll zone
      animationFrameId = requestAnimationFrame(scroll)
    }

    const handleMouseEnter = () => {
      // Start animation loop
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(scroll)
      }
    }

    const handleMouseLeave = () => {
      // Stop animation loop
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
      lastPosRef.current = { x: 0, y: 0 }
    }

    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    // Cleanup
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
