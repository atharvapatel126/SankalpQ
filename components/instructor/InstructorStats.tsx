'use client'

interface StatItem {
  label: string
  value: string | number
  sub?: string
}

interface InstructorStatsProps {
  stats: StatItem[]
}

export default function InstructorStats({ stats }: InstructorStatsProps) {
  return (
    <div className="instructor-stat-grid">
      {stats.map((stat, i) => (
        <div key={i} className="dashboard-stat-card card-shadow">
          <span className="dashboard-stat-label">{stat.label}</span>
          <span className="dashboard-stat-number">{stat.value}</span>
          {stat.sub && (
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '-2px' }}>
              {stat.sub}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
