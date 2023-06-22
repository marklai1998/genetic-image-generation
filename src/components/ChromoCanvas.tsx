import React, { useEffect, useRef } from 'react'
import { Chromo } from '../genetic/chromo'
import { drawChromo } from '../genetic/utils'

type Props = {
  containerWidth: number
  containerHeight: number
  chromo?: Chromo
  maxWidth?: number
  onDraw?: (chromo: Chromo, canvas: HTMLCanvasElement) => void
}

export const ChromoCanvas = ({
  containerWidth,
  containerHeight,
  chromo,
  maxWidth,
  onDraw,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const lowestDimension = maxWidth
      ? Math.min(containerWidth, containerHeight, maxWidth)
      : Math.min(containerWidth, containerHeight)
    canvas.width = lowestDimension
    canvas.height = lowestDimension
  }, [containerWidth, containerHeight, maxWidth])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !chromo) return
    drawChromo(chromo, canvas)
    onDraw && onDraw(chromo, canvas)
  }, [chromo, onDraw])

  return <canvas ref={canvasRef} />
}
