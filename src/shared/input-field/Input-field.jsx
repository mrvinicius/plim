import React from 'react'

import './Input-field.css'

export default function InputField({ label, className = '', inputRef, ...props }) {
  return (
    <label className={`Input-field ${className}`}>
      <span>{label}</span>
      <input type="text" {...props} ref={inputRef} />
    </label>
  )
}