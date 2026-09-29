export interface CurrencyOption {
  code: string
  symbol: string
  label: string
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "INR", symbol: "₹", label: "INR (₹) - Indian Rupee" },
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound" },
  { code: "CAD", symbol: "C$", label: "CAD (C$) - Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "AUD (A$) - Australian Dollar" },
  { code: "JPY", symbol: "¥", label: "JPY (¥) - Japanese Yen" },
  { code: "AED", symbol: "AED", label: "AED - UAE Dirham" },
  { code: "SGD", symbol: "S$", label: "SGD (S$) - Singapore Dollar" },
]

export const DEFAULT_CURRENCY = "INR"

export function getCurrencySymbol(code?: string | null): string {
  if (!code) return "₹"
  const found = CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase())
  return found ? found.symbol : code
}

export function formatMoney(amount: number | string, currency = DEFAULT_CURRENCY): string {
  const num = typeof amount === "string" ? parseFloat(amount) || 0 : amount
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
