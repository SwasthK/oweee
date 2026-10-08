export function buildUpiUri({
  upiId,
  name,
  amount,
  note,
}: {
  upiId: string
  name?: string | null
  amount?: number
  note?: string
}): string {
  const params: [string, string][] = [["pa", upiId]]

  if (name) params.push(["pn", name])
  if (amount !== undefined && amount > 0) params.push(["am", amount.toFixed(2)])
  params.push(["cu", "INR"])
  if (note) params.push(["tn", note])

  const query = params
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&")

  return `upi://pay?${query}`
}
