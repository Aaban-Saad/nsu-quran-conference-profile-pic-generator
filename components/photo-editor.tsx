"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import ImagePreview from "./image-preview"
import ControlPanel from "./control-panel"
import { Download, Upload } from "lucide-react"

const BG_IMAGE_URL = "/images/bg.png"

export default function PhotoEditor() {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUserImage(event.target?.result as string)
        setScale(1)
        setOffsetX(0)
        setOffsetY(0)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = async () => {
    if (!userImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = "profile-photo.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Profile Photo Generator</h1>
          <p className="text-slate-600">Upload your photo and customize it for the NSU Quran Conference</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <ImagePreview
              userImage={userImage}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              bgImageUrl={BG_IMAGE_URL}
              canvasRef={canvasRef}
            />
          </div>

          {/* Control Panel */}
          <div>
            {!userImage ? (
              <div
                className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:bg-slate-50 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-700 font-medium mb-2">Upload your photo</p>
                <p className="text-sm text-slate-500">Click to select or drag and drop</p>
              </div>
            ) : (
              <>
                <ControlPanel
                  scale={scale}
                  offsetX={offsetX}
                  offsetY={offsetY}
                  onScaleChange={setScale}
                  onOffsetXChange={setOffsetX}
                  onOffsetYChange={setOffsetY}
                />

                <div className="mt-6 space-y-3">
                  <Button onClick={handleDownload} className="w-full bg-slate-900 hover:bg-slate-800" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download Photo
                  </Button>

                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full" size="lg">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              aria-label="Upload profile photo"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
