// "use client"

// import type React from "react"

// import { useEffect } from "react"

// interface ImagePreviewProps {
//   userImage: string | null
//   scale: number
//   offsetX: number
//   offsetY: number
//   bgImageUrl: string
//   canvasRef: React.RefObject<HTMLCanvasElement>
// }

// export default function ImagePreview({ userImage, scale, offsetX, offsetY, bgImageUrl, canvasRef }: ImagePreviewProps) {
//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas || !userImage) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // Set canvas size
//     canvas.width = 1500
//     canvas.height = 1500

//     const bgImage = new Image()
//     bgImage.crossOrigin = "anonymous"
//     bgImage.src = bgImageUrl

//     bgImage.onload = () => {
//       // Draw background
//       ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)

//       // Draw circular mask with user image
//       const maskRadius = 380
//       const centerX = canvas.width / 2
//       const centerY = canvas.height / 2 - 115

//       const userImg = new Image()
//       userImg.crossOrigin = "anonymous"
//       userImg.src = userImage

//       userImg.onload = () => {
//         // Create circular clipping region
//         ctx.save()
//         ctx.beginPath()
//         ctx.arc(centerX, centerY, maskRadius, 0, Math.PI * 2)
//         ctx.clip()

//         // Calculate image dimensions to fit in circle
//         const imgWidth = maskRadius * 2 * scale
//         const imgHeight = (userImg.height / userImg.width) * imgWidth

//         // Draw user image with offset
//         const imgX = centerX - imgWidth / 2 + offsetX
//         const imgY = centerY - imgHeight / 2 + offsetY

//         ctx.drawImage(userImg, imgX, imgY, imgWidth, imgHeight)

//         ctx.restore()

//         // Create soft edge by drawing a radial gradient overlay
//         ctx.save()
//         ctx.globalCompositeOperation = "destination-in"
        
//         const featherWidth = 150 // Adjust this for more/less blur
//         const gradient = ctx.createRadialGradient(
//           centerX, centerY, maskRadius - featherWidth,
//           centerX, centerY, maskRadius
//         )
//         gradient.addColorStop(0, "rgba(0, 0, 0, 1)")
//         gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        
//         ctx.fillStyle = gradient
//         ctx.beginPath()
//         ctx.arc(centerX, centerY, maskRadius, 0, Math.PI * 2)
//         ctx.fill()
        
//         ctx.restore()

//         // Redraw background on top (outside the circle area)
//         ctx.save()
//         ctx.globalCompositeOperation = "destination-over"
//         ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
//         ctx.restore()
//       }
//     }
//   }, [userImage, scale, offsetX, offsetY, bgImageUrl, canvasRef])

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-4">
//       <canvas ref={canvasRef} className="w-full rounded-lg bg-slate-100" aria-label="Profile photo preview" />
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useEffect } from "react"

interface ImagePreviewProps {
  userImage: string | null
  scale: number
  offsetX: number
  offsetY: number
  bgImageUrl: string
  overlayImageUrl: string
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export default function ImagePreview({ userImage, scale, offsetX, offsetY, bgImageUrl, overlayImageUrl, canvasRef }: ImagePreviewProps) {
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

    const overlayImage = new Image()
    overlayImage.crossOrigin = "anonymous"
    overlayImage.src = overlayImageUrl

    let imagesLoaded = 0
    const totalImages = 2

    const onImageLoad = () => {
      imagesLoaded++
      if (imagesLoaded < totalImages) return

      // Draw circular mask with user image
      const maskRadius = 500
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      const userImg = new Image()
      userImg.crossOrigin = "anonymous"
      userImg.src = userImage

      userImg.onload = () => {
        // Create an offscreen canvas for the user image with effects
        const offscreenCanvas = document.createElement("canvas")
        offscreenCanvas.width = canvas.width
        offscreenCanvas.height = canvas.height
        const offCtx = offscreenCanvas.getContext("2d")
        if (!offCtx) return

        // Draw circular clipping region on offscreen canvas
        offCtx.save()
        offCtx.beginPath()
        offCtx.arc(centerX, centerY, maskRadius, 0, Math.PI * 2)
        offCtx.clip()

        // Calculate image dimensions to fit in circle
        const imgWidth = maskRadius * 2 * scale
        const imgHeight = (userImg.height / userImg.width) * imgWidth

        // Draw user image with offset
        const imgX = centerX - imgWidth / 2 + offsetX
        const imgY = centerY - imgHeight / 2 + offsetY

        offCtx.drawImage(userImg, imgX, imgY, imgWidth, imgHeight)
        offCtx.restore()

        // Apply soft edge with radial gradient
        offCtx.save()
        offCtx.globalCompositeOperation = "destination-in"
        
        const featherWidth = 150
        const gradient = offCtx.createRadialGradient(
          centerX, centerY, maskRadius - featherWidth,
          centerX, centerY, maskRadius
        )
        gradient.addColorStop(0, "rgba(0, 0, 0, 1)")
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        
        offCtx.fillStyle = gradient
        offCtx.beginPath()
        offCtx.arc(centerX, centerY, maskRadius, 0, Math.PI * 2)
        offCtx.fill()
        offCtx.restore()

        // Apply bottom fade mask
        offCtx.save()
        offCtx.globalCompositeOperation = "destination-in"
        
        // Create a mask canvas to build the fade effect
        const maskCanvas = document.createElement("canvas")
        maskCanvas.width = canvas.width
        maskCanvas.height = canvas.height
        const maskCtx = maskCanvas.getContext("2d")
        if (!maskCtx) return

        // Fill the mask with full opacity first
        maskCtx.fillStyle = "rgba(0, 0, 0, 1)"
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)

        // Now create the bottom fade gradient
        const maskHeight = 520
        const circleBottom = centerY + maskRadius
        const fadeStart = circleBottom - maskHeight

        const bottomMaskGradient = maskCtx.createLinearGradient(
          0, fadeStart,
          0, circleBottom
        )
        bottomMaskGradient.addColorStop(0, "rgba(0, 0, 0, 1)")
        bottomMaskGradient.addColorStop(0.5, "rgba(0, 0, 0, .7)")
        bottomMaskGradient.addColorStop(0.7, "rgba(0, 0, 0, .1)")
        bottomMaskGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        // Clear the fade zone and redraw with gradient
        maskCtx.clearRect(0, fadeStart, maskCanvas.width, maskHeight)
        maskCtx.fillStyle = bottomMaskGradient
        maskCtx.fillRect(0, fadeStart, maskCanvas.width, maskHeight)

        // Clear everything below the circle
        maskCtx.clearRect(0, circleBottom, maskCanvas.width, maskCanvas.height - circleBottom)

        // Apply the mask
        offCtx.drawImage(maskCanvas, 0, 0)
        offCtx.restore()

        // Now draw everything to the main canvas
        // 1. Draw background
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
        
        // 2. Draw the masked user image
        ctx.drawImage(offscreenCanvas, 0, 0)
        
        // 3. Draw overlay on top of everything
        ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height)
      }
    }

    bgImage.onload = onImageLoad
    overlayImage.onload = onImageLoad

  }, [userImage, scale, offsetX, offsetY, bgImageUrl, overlayImageUrl, canvasRef])

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <canvas ref={canvasRef} className="w-full rounded-lg bg-slate-100" aria-label="Profile photo preview" />
    </div>
  )
}