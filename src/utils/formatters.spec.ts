import { describe, it, expect } from 'vitest'
import { formatCurrency } from './formatters'

describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    // Note: The implementation uses 'es-CL' locale which uses dots for thousands and has no currency symbol by default in some environments,
    // or might differ slightly. We test the structure.
    // 'es-CL' typically: "1.234,56"
    const result = formatCurrency(1234.56)
    expect(result).toContain('1.234,56')
  })

  it('formats zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toBe('0,00')
  })

  it('handles integers', () => {
    const result = formatCurrency(100)
    expect(result).toContain('100')
  })
})
