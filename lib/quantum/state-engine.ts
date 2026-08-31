// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Quantum State Engine (Frontend Math)
// Pure TypeScript — no backend required.
// Computes exact statevectors for ≤8 qubits using complex number arithmetic.
// ─────────────────────────────────────────────────────────────────────────────

import type { GateId, CircuitOperation, QuantumCircuit } from './types'

// ── Complex number ────────────────────────────────────────────────────────────
export type Complex = { re: number; im: number }

export const C = {
  zero: (): Complex => ({ re: 0, im: 0 }),
  one: (): Complex => ({ re: 1, im: 0 }),
  of: (re: number, im = 0): Complex => ({ re, im }),
  add: (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im }),
  mul: (a: Complex, b: Complex): Complex => ({
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }),
  scale: (a: Complex, s: number): Complex => ({ re: a.re * s, im: a.im * s }),
  abs2: (a: Complex): number => a.re * a.re + a.im * a.im,
  abs: (a: Complex): number => Math.sqrt(C.abs2(a)),
  phase: (a: Complex): number => Math.atan2(a.im, a.re),
  conj: (a: Complex): Complex => ({ re: a.re, im: -a.im }),
  format: (a: Complex, precision = 3): string => {
    const re = Math.abs(a.re) < 1e-9 ? 0 : a.re
    const im = Math.abs(a.im) < 1e-9 ? 0 : a.im
    if (im === 0) return re.toFixed(precision)
    if (re === 0) return `${im.toFixed(precision)}i`
    const sign = im < 0 ? '' : '+'
    return `${re.toFixed(precision)}${sign}${im.toFixed(precision)}i`
  },
}

// ── State vector ──────────────────────────────────────────────────────────────
export type StateVector = Complex[]  // length = 2^n

export function zeroState(n: number): StateVector {
  const dim = 1 << n
  const sv = Array.from({ length: dim }, () => C.zero())
  sv[0] = C.one()  // |00…0⟩
  return sv
}

export function normalize(sv: StateVector): StateVector {
  const norm = Math.sqrt(sv.reduce((s, c) => s + C.abs2(c), 0))
  if (norm < 1e-12) return sv
  return sv.map(c => C.scale(c, 1 / norm))
}

// ── 2×2 unitary matrix ────────────────────────────────────────────────────────
type U2 = [Complex, Complex, Complex, Complex] // [a, b, c, d] = [[a,b],[c,d]]

const INV_SQRT2 = 1 / Math.sqrt(2)

function buildGateMatrix(gate: GateId, params?: { angle?: number }): U2 {
  const angle = params?.angle ?? 0
  const c = Math.cos(angle / 2)
  const s = Math.sin(angle / 2)

  switch (gate) {
    case 'H':  return [C.of(INV_SQRT2), C.of(INV_SQRT2), C.of(INV_SQRT2), C.of(-INV_SQRT2)]
    case 'X':  return [C.zero(), C.one(), C.one(), C.zero()]
    case 'Y':  return [C.zero(), C.of(0, -1), C.of(0, 1), C.zero()]
    case 'Z':  return [C.one(), C.zero(), C.zero(), C.of(-1)]
    case 'S':  return [C.one(), C.zero(), C.zero(), C.of(0, 1)]
    case 'T':  return [C.one(), C.zero(), C.zero(), C.of(INV_SQRT2, INV_SQRT2)]
    case 'RX': return [C.of(c), C.of(0, -s), C.of(0, -s), C.of(c)]
    case 'RY': return [C.of(c), C.of(-s), C.of(s), C.of(c)]
    case 'RZ': return [C.of(Math.cos(-angle/2), Math.sin(-angle/2)), C.zero(), C.zero(), C.of(Math.cos(angle/2), Math.sin(angle/2))]
    default:   return [C.one(), C.zero(), C.zero(), C.one()] // identity
  }
}

// ── Apply single-qubit gate to qubit `q` in n-qubit system ───────────────────
function applySingleQubit(sv: StateVector, n: number, q: number, gate: U2): StateVector {
  const out = sv.map(C.zero) as StateVector
  const dim = 1 << n
  // q is 0-indexed from MSB. Bit position in the integer index:
  const bit = n - 1 - q

  for (let i = 0; i < dim; i++) {
    const b = (i >> bit) & 1
    const partner = b === 0 ? i | (1 << bit) : i & ~(1 << bit)
    const i0 = b === 0 ? i : partner
    const i1 = b === 0 ? partner : i
    if (b === 0) {
      // Only process each pair once
      const a0 = sv[i0], a1 = sv[i1]
      out[i0] = C.add(C.mul(gate[0], a0), C.mul(gate[1], a1))
      out[i1] = C.add(C.mul(gate[2], a0), C.mul(gate[3], a1))
    }
  }
  return out
}

// ── Apply CNOT (control=c, target=t) ─────────────────────────────────────────
function applyCNOT(sv: StateVector, n: number, control: number, target: number): StateVector {
  const out = [...sv] as StateVector
  const dim = 1 << n
  const cBit = n - 1 - control
  const tBit = n - 1 - target

  for (let i = 0; i < dim; i++) {
    if (((i >> cBit) & 1) === 1) {
      const j = i ^ (1 << tBit)
      if (j > i) {
        ;[out[i], out[j]] = [out[j], out[i]]
      }
    }
  }
  return out
}

// ── Apply CZ ──────────────────────────────────────────────────────────────────
function applyCZ(sv: StateVector, n: number, q0: number, q1: number): StateVector {
  const out = [...sv] as StateVector
  const dim = 1 << n
  const b0 = n - 1 - q0
  const b1 = n - 1 - q1

  for (let i = 0; i < dim; i++) {
    if (((i >> b0) & 1) === 1 && ((i >> b1) & 1) === 1) {
      out[i] = C.scale(sv[i], -1)
    }
  }
  return out
}

// ── Apply SWAP ────────────────────────────────────────────────────────────────
function applySWAP(sv: StateVector, n: number, q0: number, q1: number): StateVector {
  // SWAP = CNOT(q0→q1) · CNOT(q1→q0) · CNOT(q0→q1)
  let out = applyCNOT(sv, n, q0, q1)
  out = applyCNOT(out, n, q1, q0)
  out = applyCNOT(out, n, q0, q1)
  return out
}

// ── Step-by-step simulation ───────────────────────────────────────────────────
export interface SimStep {
  opIndex: number
  gate: GateId
  targets: number[]
  controls?: number[]
  stateBefore: StateVector
  stateAfter: StateVector
  params?: { angle?: number }
}

export interface StepwiseResult {
  steps: SimStep[]
  finalState: StateVector
  n: number
}

export function simulateStepwise(circuit: QuantumCircuit): StepwiseResult {
  const n = circuit.qubits
  let state = zeroState(n)

  // Sort operations by moment, then by target qubit
  const sorted = [...circuit.operations].sort((a, b) =>
    a.moment !== b.moment ? a.moment - b.moment : a.targets[0] - b.targets[0]
  )

  const steps: SimStep[] = []

  for (let i = 0; i < sorted.length; i++) {
    const op = sorted[i]
    const stateBefore = [...state] as StateVector

    if (op.gate === 'MEASURE') {
      // Measurement — collapse to computational basis (pick most probable)
      // For visualization, we leave the state as-is and note the step
      steps.push({ opIndex: i, gate: op.gate, targets: op.targets, stateBefore, stateAfter: state, params: op.params })
      continue
    }

    let stateAfter: StateVector

    if (op.gate === 'CNOT') {
      const ctrl = op.controls?.[0] ?? 0
      stateAfter = applyCNOT(state, n, ctrl, op.targets[0])
    } else if (op.gate === 'CZ') {
      const ctrl = op.controls?.[0] ?? 0
      stateAfter = applyCZ(state, n, ctrl, op.targets[0])
    } else if (op.gate === 'SWAP') {
      const ctrl = op.controls?.[0] ?? op.targets[0]
      stateAfter = applySWAP(state, n, ctrl, op.targets[0])
    } else {
      const matrix = buildGateMatrix(op.gate, op.params)
      stateAfter = applySingleQubit(state, n, op.targets[0], matrix)
    }

    stateAfter = normalize(stateAfter)
    steps.push({ opIndex: i, gate: op.gate, targets: op.targets, controls: op.controls, stateBefore, stateAfter, params: op.params })
    state = stateAfter
  }

  return { steps, finalState: state, n }
}

// ── Extract Bloch sphere angles for a single-qubit state ──────────────────────
// For a 1-qubit state |ψ⟩ = α|0⟩ + β|1⟩
// θ = 2 arccos(|α|), φ = arg(β) - arg(α)
export interface BlochAngles {
  theta: number  // polar angle [0, π]
  phi: number    // azimuthal angle [0, 2π]
  x: number      // Bloch vector x
  y: number      // Bloch vector y
  z: number      // Bloch vector z
}

export function qubitBlochAngles(alpha: Complex, beta: Complex): BlochAngles {
  const normA = C.abs(alpha)
  const normB = C.abs(beta)
  const theta = 2 * Math.acos(Math.min(1, normA))
  const phaseA = C.phase(alpha)
  const phaseB = C.phase(beta)
  const phi = ((phaseB - phaseA) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)

  return {
    theta,
    phi,
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  }
}

// ── Extract per-qubit reduced Bloch angles (partial trace) ────────────────────
export function allQubitBlochAngles(sv: StateVector, n: number): BlochAngles[] {
  return Array.from({ length: n }, (_, q) => {
    const bit = n - 1 - q
    let alpha = C.zero()
    let beta = C.zero()
    for (let i = 0; i < sv.length; i++) {
      if (((i >> bit) & 1) === 0) {
        alpha = C.add(alpha, C.mul(C.conj(sv[i]), sv[i]).re > 0 ? sv[i] : C.zero())
      } else {
        beta = C.add(beta, sv[i])
      }
    }
    // Simplified: just use the amplitudes projected on |0⟩ and |1⟩
    const a2 = sv.reduce((s, c, i) => ((i >> bit) & 1) === 0 ? s + C.abs2(c) : s, 0)
    const b2 = sv.reduce((s, c, i) => ((i >> bit) & 1) === 1 ? s + C.abs2(c) : s, 0)
    const normA = Math.sqrt(a2)
    const normB = Math.sqrt(b2)
    const theta = 2 * Math.acos(Math.min(1, normA))
    return {
      theta,
      phi: 0,
      x: Math.sin(theta),
      y: 0,
      z: Math.cos(theta),
    }
  })
}

// ── Probability vector from statevector ───────────────────────────────────────
export function probabilities(sv: StateVector, n: number): Array<{ label: string; prob: number }> {
  return sv.map((amp, i) => ({
    label: i.toString(2).padStart(n, '0'),
    prob: C.abs2(amp),
  }))
}

// ── Amplitude table ───────────────────────────────────────────────────────────
export interface AmplitudeEntry {
  index: number
  label: string     // e.g. '|01⟩'
  amplitude: Complex
  magnitude: number
  probability: number
  phase: number     // radians
}

export function amplitudeTable(sv: StateVector, n: number): AmplitudeEntry[] {
  return sv.map((amp, i) => {
    const mag = C.abs(amp)
    return {
      index: i,
      label: `|${i.toString(2).padStart(n, '0')}⟩`,
      amplitude: amp,
      magnitude: mag,
      probability: mag * mag,
      phase: C.phase(amp),
    }
  }).filter(e => e.magnitude > 1e-6)
}
