import React, { useRef, useEffect } from 'react'

/** Wrap your component's elements in this component to show when your component has rerendered */
export const UpdatingBorder = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.style.borderColor = 'red'
      const timeout = setTimeout(() => {
        ref.current!.style.borderColor = 'black'
      }, 1000)
      return () => clearTimeout(timeout)
    }
    return
  })
  return (
    <div
      ref={ref}
      style={{
        border: 'black solid 2px',
      }}
    >
      {children}
    </div>
  )
}
