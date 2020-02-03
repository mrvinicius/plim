import React from 'react'

import './Button.css'

export default function InputField({ children, className = '', type = 'default', ...props }) {
  return <button className={`Button ${type} ${className}`} {...props}>{children}</button>
}