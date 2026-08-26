'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface FormFieldProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  helperText?: string
  autoComplete?: string
  required?: boolean
}

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  autoComplete,
  required,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className={isPassword ? 'form-input-wrap' : undefined}>
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`form-input ${error ? 'error' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        />
        {isPassword && (
          <button
            type="button"
            className="field-icon-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={16} strokeWidth={1.5} />
            ) : (
              <Eye size={16} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
      {helperText && !error && (
        <span
          id={`${id}-helper`}
          style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            marginTop: '4px',
            lineHeight: 1.4,
          }}
        >
          {helperText}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
