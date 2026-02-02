/**
 * Formats a number as a currency string with South American/European style:
 * - Thousands separator: "." (dot)
 * - Decimal separator: "," (comma)
 * - 2 decimal places
 * Example: 10000 -> "10.000,00"
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
