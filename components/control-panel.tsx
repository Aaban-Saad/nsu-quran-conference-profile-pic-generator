"use client"

import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"

interface ControlPanelProps {
  scale: number
  offsetX: number
  offsetY: number
  onScaleChange: (value: number) => void
  onOffsetXChange: (value: number) => void
  onOffsetYChange: (value: number) => void
}

export default function ControlPanel({
  scale,
  offsetX,
  offsetY,
  onScaleChange,
  onOffsetXChange,
  onOffsetYChange,
}: ControlPanelProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Scale Control */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Scale
            <span className="ml-2 text-slate-500 font-normal">{(scale * 100).toFixed(0)}%</span>
          </label>
          <Slider
            value={[scale]}
            onValueChange={(value) => onScaleChange(value[0])}
            min={0.5}
            max={3}
            step={0.05}
            className="w-full"
            aria-label="Adjust photo scale"
          />
          <p className="text-xs text-slate-500 mt-2">Zoom in/out to fit your photo</p>
        </div>

        {/* Horizontal Offset Control */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Left/Right
            <span className="ml-2 text-slate-500 font-normal">
              {offsetX > 0 ? "+" : ""}
              {offsetX.toFixed(0)}
            </span>
          </label>
          <Slider
            value={[offsetX]}
            onValueChange={(value) => onOffsetXChange(value[0])}
            min={-200}
            max={200}
            step={5}
            className="w-full"
            aria-label="Adjust horizontal position"
          />
          <p className="text-xs text-slate-500 mt-2">Move left or right</p>
        </div>

        {/* Vertical Offset Control */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Up/Down
            <span className="ml-2 text-slate-500 font-normal">
              {offsetY > 0 ? "+" : ""}
              {offsetY.toFixed(0)}
            </span>
          </label>
          <Slider
            value={[offsetY]}
            onValueChange={(value) => onOffsetYChange(value[0])}
            min={-200}
            max={200}
            step={5}
            className="w-full"
            aria-label="Adjust vertical position"
          />
          <p className="text-xs text-slate-500 mt-2">Move up or down</p>
        </div>
      </div>
    </Card>
  )
}
