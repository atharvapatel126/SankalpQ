import type { LocalBlochVector } from '@/lib/quantum/mock-simulator'

interface BlochSphereProps {
  vector: LocalBlochVector
}

interface Point3D {
  x: number
  y: number
  z: number
}

const CENTER = 108
const RADIUS = 74

function project(point: Point3D): { x: number; y: number } {
  const horizontal = (point.x - point.y) / Math.sqrt(2)
  const vertical = (-point.x - point.y + 2 * point.z) / Math.sqrt(6)
  return {
    x: CENTER + RADIUS * horizontal,
    y: CENTER - RADIUS * vertical,
  }
}

function degrees(radians: number): string {
  return `${(radians * 180 / Math.PI).toFixed(1)}°`
}

export default function BlochSphere({ vector }: BlochSphereProps) {
  const endpoint = project(vector)
  const axes = [
    { label: 'x', point: project({ x: 1, y: 0, z: 0 }) },
    { label: 'y', point: project({ x: 0, y: 1, z: 0 }) },
    { label: 'z', point: project({ x: 0, y: 0, z: 1 }) },
  ]

  return (
    <section className="simulator-result-section simulator-bloch-section" aria-labelledby="bloch-sphere-title">
      <div className="simulator-section-heading">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">Single qubit</span>
          <h3 id="bloch-sphere-title">Bloch vector</h3>
        </div>
      </div>
      <div className="simulator-bloch-layout">
        <svg
          className="simulator-bloch-svg"
          viewBox="0 0 216 216"
          role="img"
          aria-label={`Bloch vector x ${vector.x.toFixed(3)}, y ${vector.y.toFixed(3)}, z ${vector.z.toFixed(3)}`}
        >
          <defs>
            <marker id="simulator-bloch-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 8 4 L 0 8 z" />
            </marker>
          </defs>
          <circle className="simulator-bloch-shell" cx={CENTER} cy={CENTER} r={RADIUS} />
          <ellipse className="simulator-bloch-equator" cx={CENTER} cy={CENTER} rx={RADIUS} ry={24} />
          {axes.map(axis => (
            <g key={axis.label}>
              <line className="simulator-bloch-axis" x1={CENTER} y1={CENTER} x2={axis.point.x} y2={axis.point.y} />
              <text className="simulator-bloch-axis-label" x={axis.point.x} y={axis.point.y}>{axis.label}</text>
            </g>
          ))}
          <line
            className="simulator-bloch-vector"
            x1={CENTER}
            y1={CENTER}
            x2={endpoint.x}
            y2={endpoint.y}
            markerEnd="url(#simulator-bloch-arrow)"
          />
          <circle className="simulator-bloch-point" cx={endpoint.x} cy={endpoint.y} r="4" />
        </svg>

        <dl className="simulator-bloch-values">
          <div><dt>θ</dt><dd>{degrees(vector.theta)}</dd></div>
          <div><dt>φ</dt><dd>{degrees(vector.phi)}</dd></div>
          <div><dt>x</dt><dd>{vector.x.toFixed(3)}</dd></div>
          <div><dt>y</dt><dd>{vector.y.toFixed(3)}</dd></div>
          <div><dt>z</dt><dd>{vector.z.toFixed(3)}</dd></div>
        </dl>
      </div>
      <p className="simulator-section-note">
        This orthographic projection shows the exact pure-state Bloch vector before measurement.
      </p>
    </section>
  )
}
