'use client'

interface AnalyticsChartProps {
  data: { label: string; value: number }[]
  maxValue?: number
  unit?: string
  barColor?: string
}

export default function AnalyticsChart({
  data,
  maxValue,
  unit = '',
  barColor = 'var(--accent)',
}: AnalyticsChartProps) {
  const max = maxValue ?? Math.max(...data.map(d => d.value), 1)

  return (
    <div className="analytics-chart">
      {data.map((item, i) => {
        const pct = Math.round((item.value / max) * 100)
        return (
          <div key={i} className="analytics-chart-row">
            <span className="analytics-chart-label">{item.label}</span>
            <div className="analytics-chart-bar-wrap">
              <div
                className="analytics-chart-bar"
                style={{ width: `${pct}%`, backgroundColor: barColor }}
                role="progressbar"
                aria-valuenow={item.value}
                aria-valuemin={0}
                aria-valuemax={max}
              />
            </div>
            <span className="analytics-chart-value">
              {item.value}{unit}
            </span>
          </div>
        )
      })}
    </div>
  )
}
