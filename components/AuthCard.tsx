import React from 'react'

interface AuthCardProps {
  children: React.ReactNode
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '40px 32px',
        boxSizing: 'border-box',
      }}
      className="card-shadow"
    >
      {children}
    </div>
  )
}
