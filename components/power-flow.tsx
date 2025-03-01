"use client"

import type React from "react"
import { Home, UtilityPole, Sun } from "lucide-react"

const nodeColors = {
  solar: "#FACC15",
  home: "#38bdf8",
  grid: "#fff",
  battery: "#22c55e",
}

function roundPathCorners(pathString: string, radius: number, useFractionalRadius: boolean): string {
  const parts = pathString.split(" ")
  let result = ""
  let prevX = 0
  let prevY = 0
  const cmd = ""
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part.startsWith("M") || part.startsWith("L")) {
      const coords = part.substring(1).split(",")
      const x = Number.parseFloat(coords[0])
      const y = Number.parseFloat(coords[1])
      if (i > 0) {
        const dx = x - prevX
        const dy = y - prevY
        if (dx !== 0 || dy !== 0) {
          const angle = Math.atan2(dy, dx)
          const cornerRadius = radius
          const rx = cornerRadius * Math.cos(angle)
          const ry = cornerRadius * Math.sin(angle)
          result += ` L${prevX + rx},${prevY + ry}`
        }
      }
      result += ` ${part}`
      prevX = x
      prevY = y
    } else {
      result += ` ${part}`
    }
  }
  return result
}

function createPath(x1: number, y1: number, x2: number, y2: number, horizontalFirst: boolean): string {
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  let path
  if (horizontalFirst) {
    path = `M${x1},${y1} L${x2},${y1} L${x2},${y2}`
  } else {
    path = `M${x1},${y1} L${x1},${y2} L${x2},${y2}`
  }
  return roundPathCorners(path, 30, false)
}

function GradientPath({
  path,
  startColor,
  endColor,
  angle,
  endOffset = "100%",
  isActive,
}: {
  path: string
  startColor: string
  endColor: string
  angle: number
  endOffset: string
  isActive: boolean
}) {
  const id = `gradient-${startColor.slice(1)}-${endColor.slice(1)}`
  const maskId = `mask-${id}`

  return (
    <g className={`transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}>
      <defs>
        <linearGradient id={id} gradientTransform={`rotate(${angle})`} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={startColor} />
          <stop offset={endOffset} stopColor={endColor} />
        </linearGradient>
        <mask id={maskId}>
          <g>
            <path d={path} stroke="white" strokeWidth="1.5" fill="none" />
          </g>
        </mask>
      </defs>
      <rect x="-1000" y="-1000" width="2000" height="2000" fill={`url(#${id})`} mask={`url(#${maskId})`} />
      <circle r="5" fill={startColor} opacity="0.6">
        <animateMotion dur="2s" repeatCount="indefinite" path={path} />
      </circle>
    </g>
  )
}

function PowerNode({
  x,
  y,
  name,
  icon,
  label,
  rawValue,
  color,
  flowDirection,
  crossOut = false,
}: {
  x: number
  y: number
  name: string,
  icon: React.ReactNode
  label: string
  rawValue: string
  color: string
  flowDirection: "in" | "out" | null
  crossOut?: boolean
}) {
  const renderColor = flowDirection ? color : "rgba(255, 255, 255, 0.25)"
  return (
    <g transform={`translate(${x},${y})`} className="power-node" onClick={() => window.parent.postMessage({ nodeName: name }, "*")}>
      {flowDirection && (
        <circle
          r="32"
          fill="none"
          stroke={color}
          strokeWidth="4"
          opacity="0.2"
          className={flowDirection ? "animate-ping-out" : ""}
        />
      )}
      <rect x="-50" y="-65" width="100" height="110" fill="rgba(0, 0, 0, 0)" />
      <circle r="32" fill="none" stroke={renderColor} strokeWidth="2" strokeDasharray="0.5 2" />
      <g transform="translate(-18,-18) scale(1.5)" opacity="0.8">{icon}</g>
      <text y="-50" textAnchor="middle" className="text-xl font-600 short-value" fill={renderColor} fontVariant="tabular-nums">
        {label}
      </text>
      <text y="-50" textAnchor="middle" className="text-xl font-600 raw-value" fill={renderColor} fontVariant="tabular-nums">
        {rawValue}
      </text>
      {crossOut && (
        <g transform="translate(45, 0)" opacity="0.6">
          <line x1="-8" y1="-8" x2="8" y2="8" stroke="rgba(255, 0, 0)" strokeWidth="2" />
          <line x1="-8" y1="8" x2="8" y2="-8" stroke="rgba(255, 0, 0)" strokeWidth="2" />
        </g>
      )}
    </g>
  )
}

function BatteryNode({ x, y, power, percentage }: { x: number; y: number; power: number; percentage: number }) {
  const displayPower = (power / 1000).toFixed(1)
  const watts = Math.round(power).toLocaleString()
  const displayPercentage = Math.round(percentage)
  const disableBranding = DISABLE_BRANDING

  return (
    <g transform={`translate(${x},${y})`} className="power-node" onClick={() => window.parent.postMessage({ nodeName: 'battery' }, "*")}>
      <g clipPath="url(#a)" transform={`translate(-90,-80)`}>
        <path fill="url(#b)" d="M0 0h160v100H0z" />
          {!disableBranding && (
            <g fill="#8E8E8E" opacity={0.68} transform="scale(0.5) translate(70, 30)" className="teslaLogo">
              <path d="M30 64.034c.35 1.228 1.53 2.482 3.15 2.796h4.896l.25.09v11.118h3.058V66.92l.277-.089h4.9c1.639-.38 2.794-1.568 3.138-2.796v-.027H30v.027ZM60.26 78.07h11.63c1.62-.29 2.822-1.573 3.159-2.815H57.101c.336 1.242 1.556 2.525 3.159 2.815ZM60.26 72.366h11.63c1.62-.287 2.822-1.57 3.159-2.814H57.101c.336 1.244 1.556 2.527 3.159 2.814ZM60.26 66.816h11.63c1.62-.29 2.822-1.573 3.159-2.816H57.101c.336 1.243 1.556 2.525 3.159 2.816ZM86.787 66.789h10.745c1.62-.424 2.981-1.535 3.312-2.766h-17.07v8.3h13.971v2.912l-10.958.008c-1.718.43-3.174 1.469-3.9 2.84l.888-.015h16.972v-8.505h-13.96V66.79ZM123.355 78.071c1.526-.582 2.346-1.589 2.661-2.767h-13.572l.009-11.285-3.043.008v14.044h13.945ZM135.208 66.827h11.635c1.616-.29 2.818-1.573 3.157-2.815h-17.948c.335 1.242 1.555 2.526 3.156 2.815ZM132.519 69.574v8.492h3.026v-5.654h11.013v5.654h3.024v-8.478l-17.063-.014Z" />
            </g>
          )}
        <path fill="url(#c)" d="M0 0h160v100H0z" />
      </g>
      <defs>
        <linearGradient id="b" x1={126.5} x2={9} y1={13} y2={90.5} gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset={0.49} stopColor="#FBFBFB" />
          <stop offset={0.49} stopColor="#E9E9E9" />
          <stop offset={1} stopColor="#E7E7E7" />
        </linearGradient>
        <linearGradient id="c" x1={90} x2={201.5} y1={0} y2={130.5} gradientUnits="userSpaceOnUse">
          <stop stopColor="#D9D9D9" stopOpacity={0} />
          <stop offset={1} stopColor="#EFEFEF" />
        </linearGradient>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h160v100H0z" />
        </clipPath>
      </defs>

      <text y={disableBranding ? -24 : -50} x="-10" textAnchor="middle" className="fill-black/90 text-xl font-medium short-value">
        {displayPower} kW
      </text>
      <text y={disableBranding ? -24 : -50} x="-10" textAnchor="middle" className="fill-black/90 text-xl font-medium raw-value">
        {watts} W
      </text>
      {percentage > 0.1 && (
        <g transform="translate(0,35)">
          <rect x="-90" y="-4" width="120" height="8" rx="4" className="fill-white/20" />
          <rect x="-90" y="-4" width={(120 * displayPercentage) / 100} height="8" rx="4" className="fill-green-500" />
          <text x="70" y="5" textAnchor="end" className="fill-white/90 text-sm">
        {displayPercentage}%
          </text>
        </g>
      )}
    </g>
  )
}

interface PowerFlowProps {
  solarPower: number
  gridPower: number
  homePower: number
  batteryPower: number
  batteryPercentage: number
  gridStatus: string
}

export default function PowerFlow({
  solarPower,
  gridPower,
  homePower,
  batteryPower,
  batteryPercentage,
  gridStatus,
}: PowerFlowProps) {
  const formatPower = (power: number) => (power / 1000).toFixed(1)
  const formatWatts = (power: number) => (Math.round(power)).toLocaleString()
  const flows = {
    solarToHome: solarPower > 10,
    solarToGrid: solarPower - homePower >= Math.abs(gridPower) && gridPower < 0,
    solarToBattery: solarPower > 10 && batteryPower < -10 && solarPower > homePower,
    gridToBattery: gridStatus === "1" && gridPower > 10 && batteryPower < -10 && Math.abs(batteryPower) > solarPower - homePower,
    gridToHome: gridStatus === "1" && gridPower > 10 && homePower > solarPower + batteryPower,
    batteryToHome: batteryPower > 10 && homePower > solarPower,
    batteryToGrid: gridPower < -10 && batteryPower > 10 && Math.abs(gridPower) >= homePower - solarPower - batteryPower,
  }
  const solarOnly = SOLAR_ONLY

  const gridHomeY = 100
  const nodesX = 190
  const homeX = nodesX - 35
  const gridX = -nodesX + 35
  const batteryY = 230
  const solarY = 40

  return (
    <div className="w-full h-full">
      <svg viewBox={solarOnly ? "20 -10 480 190" : "20 -10 480 320"} className="w-full h-full">
        <g transform="translate(260,52)">
          {/* Solar to Home */}
          <GradientPath
            path={createPath(5, solarY, homeX, gridHomeY-5, false)}
            startColor={nodeColors.solar}
            endColor={nodeColors.home}
            angle={45}
            endOffset="30%"
            isActive={flows.solarToHome}
          />
          {/* Solar to Grid */}
          <GradientPath
            path={createPath(-5, solarY, gridX, gridHomeY-5, false)}
            startColor={nodeColors.solar}
            endColor={nodeColors.grid}
            angle={180}
            endOffset="30%"
            isActive={flows.solarToGrid}
          />
          {/* Grid to Battery */}
            { !solarOnly && (
              <GradientPath
                path={createPath(gridX, gridHomeY+5, -5, batteryY, true)}
                startColor={nodeColors.grid}
                endColor={nodeColors.battery}
                angle={45}
                endOffset="40%"
                isActive={flows.gridToBattery}
              />
          )}
          {/* Grid to Home */}
          <GradientPath
            path={createPath(gridX, gridHomeY, homeX, gridHomeY, true)}
            startColor={nodeColors.grid}
            endColor={nodeColors.home}
            angle={0}
            endOffset="20%"
            isActive={flows.gridToHome}
          />
          {/* Solar to Battery */}
          { !solarOnly && (
            <GradientPath
              path={createPath(0, solarY, 0, batteryY, true)}
              startColor={nodeColors.solar}
              endColor={nodeColors.battery}
              angle={90}
              endOffset="50%"
              isActive={flows.solarToBattery}
            />
          )}
          {/* Battery to Home */}
          { !solarOnly && (
            <GradientPath
              path={createPath(5, batteryY, homeX, gridHomeY+5, false)}
              startColor={nodeColors.battery}
              endColor={nodeColors.home}
              angle={45}
              endOffset="50%"
              isActive={flows.batteryToHome}
            />
          )}
          {/* Battery to Grid */}
          { !solarOnly && (
            <GradientPath
              path={createPath(-5, batteryY, gridX, gridHomeY+5, false)}
              startColor={nodeColors.battery}
              endColor={nodeColors.grid}
              angle={225}
              endOffset="50%"
              isActive={flows.batteryToGrid}
            />
          )}

          {/* Nodes */}
          <PowerNode
            x={0}
            y={5}
            name="solar"
            icon={<Sun className={`w-8 h-8 ${solarPower > 0 ? "text-yellow-400" : "text-white/25"}`} />}
            label={`${formatPower(solarPower)} kW`}
            rawValue={`${formatWatts(solarPower)} W`}
            color="#facc15"
            flowDirection={solarPower > 20 ? "out" : null}
          />
          <PowerNode
            x={-nodesX}
            y={gridHomeY}
            name="grid"
            icon={<UtilityPole className={`w-8 h-8 ${Math.abs(gridPower) > 50 ? "text-white" : "text-white/25"}`} />}
            label={`${formatPower(gridPower)} kW`}
            rawValue={`${formatWatts(gridPower)} W`}
            color="#ffffff"
            flowDirection={Math.abs(gridPower) < 50 ? null : gridPower < 0 ? "in" : "out"}
            crossOut={gridStatus != "1"}
          />
          <PowerNode
            x={nodesX}
            y={gridHomeY}
            name="home"
            icon={<Home className="w-8 h-8 text-sky-400" />}
            label={`${formatPower(homePower)} kW`}
            rawValue={`${formatWatts(homePower)} W`}
            color="#38bdf8"
            flowDirection="in"
          />
          { !solarOnly && (
            <BatteryNode x={10} y={215} power={batteryPower} percentage={batteryPercentage} />
          )}
        </g>
      </svg>
    </div>
  )
}

