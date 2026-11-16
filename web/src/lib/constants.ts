export const COUNTRIES = [
  'Nigeria',
  'USA',
  'UK',
  'Canada',
  'Ghana',
  'South Africa',
  'Kenya',
  'Germany',
  'France',
  'UAE',
]

const COUNTRY_CODES: Record<string, string> = {
  Nigeria: 'ng',
  USA: 'us',
  UK: 'gb',
  Canada: 'ca',
  Ghana: 'gh',
  'South Africa': 'za',
  Kenya: 'ke',
  Germany: 'de',
  France: 'fr',
  UAE: 'ae',
}

export const countryCode = (country: string) => COUNTRY_CODES[country] || ''

export const flagUrl = (country: string, width: number = 40) => {
  const code = countryCode(country)
  return code ? `https://flagcdn.com/w${width}/${code}.png` : ''
}

export const PLATFORMS = ['TikTok', 'Instagram', 'Facebook', 'X (Twitter)', 'WhatsApp', 'Buy Number']

export const countryMatches = (productCountry: string, filter: string) => {
  if (!filter || filter === 'All Countries') return true
  return (productCountry || '').trim().toLowerCase() === filter.trim().toLowerCase()
}
