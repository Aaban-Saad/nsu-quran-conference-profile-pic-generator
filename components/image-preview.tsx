"use client"

import type React from "react"

import { useEffect } from "react"

interface ImagePreviewProps {
  userImage: string | null
  scale: number
  offsetX: number
  offsetY: number
  bgImageUrl: string
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export default function ImagePreview({ userImage, scale, offsetX, offsetY, bgImageUrl, canvasRef }: ImagePreviewProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !userImage) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 1500
    canvas.height = 1500

    const bgImage = new Image()
    bgImage.crossOrigin = "anonymous"
    bgImage.src = bgImageUrl

    bgImage.onload = () => {
      // Draw background
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)

      // Draw circular mask with user image
      const maskRadius = 320
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2 - 170

      const userImg = new Image()
      userImg.crossOrigin = "anonymous"
      userImg.src = userImage

      userImg.onload = () => {
        // Create circular clipping region
        ctx.save()
        ctx.beginPath()
        ctx.arc(centerX, centerY, maskRadius, 0, Math.PI * 2)
        ctx.clip()

        // Calculate image dimensions to fit in circle
        const imgWidth = maskRadius * 2 * scale
        const imgHeight = (userImg.height / userImg.width) * imgWidth

        // Draw user image with offset
        const imgX = centerX - imgWidth / 2 + offsetX
        const imgY = centerY - imgHeight / 2 + offsetY

        ctx.drawImage(userImg, imgX, imgY, imgWidth, imgHeight)

        ctx.restore()

        // Draw border circle
        // ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        // ctx.lineWidth = 3
        // ctx.beginPath()
        // ctx.arc(centerX, centerY, maskRadius, 0, Math.PI * 2)
        // ctx.stroke()
      }
    }
  }, [userImage, scale, offsetX, offsetY, bgImageUrl, canvasRef])

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <canvas ref={canvasRef} className="w-full rounded-lg bg-slate-100" aria-label="Profile photo preview" />
    </div>
  )
}
