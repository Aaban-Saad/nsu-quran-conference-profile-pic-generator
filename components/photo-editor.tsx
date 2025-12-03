"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import ImagePreview from "./image-preview"
import ControlPanel from "./control-panel"
import { Download, Upload, ImageIcon, Check, Github } from "lucide-react"
import Image from "next/image"

const BG_IMAGE_URL = "/images/bg.png"

const PREDEFINED_PHOTOS = [
  { id: "avatar1", src: "/images/avatars/avatar1.png", label: "Avatar 1" },
  { id: "avatar2", src: "/images/avatars/avatar2.png", label: "Avatar 2" },
  { id: "avatar3", src: "/images/avatars/avatar3.png", label: "Avatar 3" },
  { id: "avatar4", src: "/images/avatars/avatar4.png", label: "Avatar 4" },
  { id: "avatar5", src: "/images/avatars/avatar5.png", label: "Avatar 5" },
  { id: "avatar6", src: "/images/avatars/avatar6.png", label: "Avatar 6" },
]

export default function PhotoEditor() {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
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
        setSelectedPreset(null)
        resetTransforms()
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePresetSelect = (preset: typeof PREDEFINED_PHOTOS[0]) => {
    setUserImage(preset.src)
    setSelectedPreset(preset.id)
    resetTransforms()
  }

  const resetTransforms = () => {
    setScale(1)
    setOffsetX(0)
    setOffsetY(0)
  }

  const handleDownload = async () => {
    if (!userImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = "nsu-quran-conference-profile.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-sky-100">

      <div className="flex items-center justify-end">
        <Button asChild variant={'outline'} className="m-2 font-bold">
          <a
            href="https://github.com/Aaban-Saad/nsu-quran-conference-profile-pic-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-700"
          >
            <Image src={'/github.svg'} alt="GitHub Logo" width={24} height={24} />
            <span>Contribute</span>
          </a>
        </Button>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            NSU Quran Conference & Seerah Exhibition 2025
          </h1>
          <p className="text-xl text-slate-600">Profile Photo Generator</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Photo Selection */}
          <div className="space-y-6">
            {/* Predefined Photos Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Choose a Photo
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {PREDEFINED_PHOTOS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedPreset === preset.id
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <img
                      src={preset.src}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                    {selectedPreset === preset.id && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                        <div className="bg-emerald-500 rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Upload Custom Photo */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-slate-500">or upload your own</span>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className={`mt-4 w-full border-2 border-dashed rounded-xl p-6 text-center transition-all hover:bg-slate-50 ${userImage && !selectedPreset
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300"
                  }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-slate-700 font-medium">
                  {userImage && !selectedPreset ? "Photo uploaded!" : "Click to upload"}
                </p>
                <p className="text-sm text-slate-500">PNG, JPG up to 10MB</p>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload profile photo"
              />
            </section>

            
          </div>

          {/* Right Column - Preview & Download */}
          <div className="space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Preview
              </h2>

              {userImage ? (
                <ImagePreview
                  userImage={userImage}
                  scale={scale}
                  offsetX={offsetX}
                  offsetY={offsetY}
                  bgImageUrl={BG_IMAGE_URL}
                  canvasRef={canvasRef}
                />
              ) : (
                <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
                    <p>Select or upload a photo to preview</p>
                  </div>
                </div>
              )}
            </section>

            {/* Controls Section */}
            {userImage && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                  Adjust Photo
                </h2>
                <ControlPanel
                  scale={scale}
                  offsetX={offsetX}
                  offsetY={offsetY}
                  onScaleChange={setScale}
                  onOffsetXChange={setOffsetX}
                  onOffsetYChange={setOffsetY}
                />
              </section>
            )}

            {/* Download Button */}
            {userImage && (
              <Button
                onClick={handleDownload}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6 rounded-xl shadow-lg shadow-emerald-200 border-0"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Profile Photo
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>Made with ❤️ by <a href="https://github.com/Aaban-Saad" className="underline">Aaban Saad</a></p>
          <p>Visit: <a href="https://chatpoka.com" className="underline">chatpoka.com</a></p>
          <p className="mt-2">Contribute: <a href="https://github.com/Aaban-Saad/nsu-quran-conference-profile-pic-generator" className="underline">GitHub</a></p>
        </footer>
      </div>
    </div>
  )
}
