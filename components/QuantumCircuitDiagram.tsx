'use client'

import { useEffect, useRef } from 'react'

/**
 * QuantumCircuitDiagram
 * ---------------------
 * Monochrome SVG line-art of a simple 3-qubit quantum circuit.
 * Layout (left → right):
 *   q0: ─── H ─────────── [M]
 *   q1: ─────── ●─────── [M]
 *              │
 *   q2: ─── X ─⊕──── X ─ [M]
 *
 * The H gate is accent-filled. All other elements use --border / --text-secondary strokes.
 * One deliberate animation: a small dot travels along q0's wire on load.
 * Respects prefers-reduced-motion.
 */
export default function QuantumCircuitDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)

  // Pulse the H gate box on hover (opacity breathe)
  // disabled if prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    const hGate = svgRef.current?.querySelector('#gate-H') as SVGRectElement | null
    if (!hGate) return

    let frame: number
    let t = 0
    const pulse = () => {
      t += 0.03
      const opacity = 0.85 + 0.15 * Math.sin(t)
      hGate.style.opacity = String(opacity)
      frame = requestAnimationFrame(pulse)
    }

    const parent = hGate.closest('g')
    parent?.addEventListener('mouseenter', () => { frame = requestAnimationFrame(pulse) })
    parent?.addEventListener('mouseleave', () => {
      cancelAnimationFrame(frame)
      hGate.style.opacity = '1'
    })
  }, [])

  // SVG dimensions & layout constants
  const W = 480
  const H_SVG = 260
  const LEFT_PAD = 52   // left label area
  const RIGHT_PAD = 36  // measurement area
  const WIRE_SPACING = 72
  const WIRE_Y = [72, 144, 216]  // y for q0, q1, q2
  const WIRE_END_X = W - RIGHT_PAD - 20
  const GATE_W = 32
  const GATE_H = 28
  const GATE_R = 5

  // Gate horizontal positions
  const X_H  = LEFT_PAD + 40           // H gate on q0
  const X_X1 = LEFT_PAD + 40           // X gate on q2
  const X_CNOT = LEFT_PAD + 120        // CNOT: control on q1, target on q2
  const X_X2  = LEFT_PAD + 200         // X gate on q2
  const MEAS_X = WIRE_END_X + 6        // measurement symbols

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '480px',
      }}
      aria-label="Quantum circuit diagram showing H, X, and CNOT gates on three qubit wires"
      role="img"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H_SVG}`}
        width="100%"
        height="auto"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Animated qubit dot — travels along q0's wire */}
          <circle id="qubit-dot" r="4" fill="var(--accent)" opacity="0" />
        </defs>

        {/* ── Qubit labels ─────────────────────────────────────── */}
        {(['q0', 'q1', 'q2'] as const).map((label, i) => (
          <text
            key={label}
            x={LEFT_PAD - 10}
            y={WIRE_Y[i] + 5}
            textAnchor="end"
            fontFamily="var(--font-geist-mono), JetBrains Mono, monospace"
            fontSize="13"
            fill="var(--text-tertiary)"
            fontWeight="400"
          >
            {label}
          </text>
        ))}

        {/* ── Qubit wires ───────────────────────────────────────── */}
        {WIRE_Y.map((y, i) => (
          <line
            key={i}
            x1={LEFT_PAD}
            y1={y}
            x2={WIRE_END_X}
            y2={y}
            stroke="var(--border-strong)"
            strokeWidth="1.5"
          />
        ))}

        {/* ── H gate (q0) — accent fill, white text ────────────── */}
        <g id="H-gate-group" style={{ cursor: 'default' }}>
          <rect
            id="gate-H"
            x={X_H - GATE_W / 2}
            y={WIRE_Y[0] - GATE_H / 2}
            width={GATE_W}
            height={GATE_H}
            rx={GATE_R}
            fill="var(--accent)"
            stroke="var(--accent)"
            strokeWidth="1"
          />
          <text
            x={X_H}
            y={WIRE_Y[0] + 5}
            textAnchor="middle"
            fontFamily="var(--font-geist-mono), JetBrains Mono, monospace"
            fontSize="13"
            fontWeight="600"
            fill="var(--accent-text-on)"
          >
            H
          </text>
        </g>

        {/* ── X gate (q2, before CNOT) ─────────────────────────── */}
        <rect
          x={X_X1 - GATE_W / 2}
          y={WIRE_Y[2] - GATE_H / 2}
          width={GATE_W}
          height={GATE_H}
          rx={GATE_R}
          fill="var(--surface)"
          stroke="var(--border-strong)"
          strokeWidth="1"
        />
        <text
          x={X_X1}
          y={WIRE_Y[2] + 5}
          textAnchor="middle"
          fontFamily="var(--font-geist-mono), JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="500"
          fill="var(--text-secondary)"
        >
          X
        </text>

        {/* ── CNOT gate: control (q1) ● — vertical line — target (q2) ⊕ ── */}
        {/* Vertical connector */}
        <line
          x1={X_CNOT}
          y1={WIRE_Y[1]}
          x2={X_CNOT}
          y2={WIRE_Y[2]}
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />
        {/* Control dot on q1 */}
        <circle
          cx={X_CNOT}
          cy={WIRE_Y[1]}
          r="5"
          fill="var(--text-secondary)"
        />
        {/* Target ⊕ on q2 */}
        <circle
          cx={X_CNOT}
          cy={WIRE_Y[2]}
          r="12"
          fill="var(--surface)"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />
        {/* Plus sign inside ⊕ */}
        <line
          x1={X_CNOT - 8}
          y1={WIRE_Y[2]}
          x2={X_CNOT + 8}
          y2={WIRE_Y[2]}
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
        />
        <line
          x1={X_CNOT}
          y1={WIRE_Y[2] - 8}
          x2={X_CNOT}
          y2={WIRE_Y[2] + 8}
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
        />

        {/* ── X gate (q2, after CNOT) ──────────────────────────── */}
        <rect
          x={X_X2 - GATE_W / 2}
          y={WIRE_Y[2] - GATE_H / 2}
          width={GATE_W}
          height={GATE_H}
          rx={GATE_R}
          fill="var(--surface)"
          stroke="var(--border-strong)"
          strokeWidth="1"
        />
        <text
          x={X_X2}
          y={WIRE_Y[2] + 5}
          textAnchor="middle"
          fontFamily="var(--font-geist-mono), JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="500"
          fill="var(--text-secondary)"
        >
          X
        </text>

        {/* ── Measurement symbols ───────────────────────────────── */}
        {WIRE_Y.map((y, i) => (
          <g key={i} transform={`translate(${MEAS_X}, ${y})`}>
            {/* Meter box */}
            <rect
              x={-14}
              y={-14}
              width={28}
              height={28}
              rx={GATE_R}
              fill="var(--surface)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            {/* Meter arc */}
            <path
              d="M -8 4 A 8 8 0 0 1 8 4"
              stroke="var(--text-tertiary)"
              strokeWidth="1.2"
              fill="none"
            />
            {/* Meter needle */}
            <line
              x1="0"
              y1="4"
              x2="6"
              y2="-4"
              stroke="var(--text-tertiary)"
              strokeWidth="1.2"
            />
          </g>
        ))}

        {/* ── Travelling qubit dot animation (q0 wire) ─────────── */}
        {/* 
          A small dot animates from x=LEFT_PAD to x=WIRE_END_X along q0's wire on page load.
          Class 'qubit-dot-path' defined in globals.css handles the animation.
          prefers-reduced-motion: animation is disabled via @media in globals.css.
        */}
        <circle
          cx="0"
          cy={WIRE_Y[0]}
          r="4"
          fill="var(--accent)"
          opacity="0"
          className="qubit-dot-path"
          style={{ offsetPath: `path('M ${LEFT_PAD},${WIRE_Y[0]} H ${WIRE_END_X}')` }}
        >
          <animateMotion
            dur="2.8s"
            begin="0.6s"
            fill="freeze"
            path={`M 0,0 H ${WIRE_END_X - LEFT_PAD}`}
          >
            <mpath />
          </animateMotion>
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.05;0.88;1"
            dur="2.8s"
            begin="0.6s"
            fill="freeze"
          />
        </circle>

        {/* Wire labels on right side (optional readability) */}
        {WIRE_Y.map((y, i) => (
          <line
            key={`tick-${i}`}
            x1={WIRE_END_X}
            y1={y}
            x2={MEAS_X - 14}
            y2={y}
            stroke="var(--border-strong)"
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  )
}
