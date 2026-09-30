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
export const DEFAULT_CURRENCY_STORAGE_KEY = "oweee_default_currency"

export function getCurrencySymbol(code?: string | null): string {
  if (!code) return "₹"
  const found = CURRENCIES.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  )
  return found ? found.symbol : code
}

export function formatMoney(
  amount: number | string,
  currency = DEFAULT_CURRENCY
): string {
  const num = typeof amount === "string" ? parseFloat(amount) || 0 : amount
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
  })}`
}

export function getSavedCurrency(): string {
  if (typeof window === "undefined") return DEFAULT_CURRENCY
  try {
    const saved = localStorage.getItem(DEFAULT_CURRENCY_STORAGE_KEY)
    if (saved && CURRENCIES.some((c) => c.code === saved.toUpperCase())) {
      return saved.toUpperCase()
    }
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${DEFAULT_CURRENCY_STORAGE_KEY}=([^;]*)`)
    )
    if (
      match &&
      match[1] &&
      CURRENCIES.some((c) => c.code === decodeURIComponent(match[1]).toUpperCase())
    ) {
      return decodeURIComponent(match[1]).toUpperCase()
    }
  } catch {
    // ignore
  }
  return DEFAULT_CURRENCY
}

export function saveCurrency(currency: string): void {
  if (typeof window === "undefined" || !currency || currency === "all") return
  const code = currency.toUpperCase()
  try {
    localStorage.setItem(DEFAULT_CURRENCY_STORAGE_KEY, code)
    document.cookie = `${DEFAULT_CURRENCY_STORAGE_KEY}=${encodeURIComponent(
      code
    )}; path=/; max-age=31536000; SameSite=Lax`
  } catch {
    // ignore
  }
}
