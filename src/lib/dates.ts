/** Fechas de contenido (YYYY-MM-DD), interpretadas al mediodía local para evitar saltos de zona horaria. */

export function parseContentDate(value: string) {
  return new Date(`${value}T12:00:00`)
}

export function toDateValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

export function todayValue() {
  return toDateValue(new Date())
}

export function addDays(value: string, days: number) {
  const date = parseContentDate(value)
  date.setDate(date.getDate() + days)
  return toDateValue(date)
}

export function daysAgo(value: string) {
  const diff = parseContentDate(todayValue()).getTime() - parseContentDate(value).getTime()
  return Math.round(diff / 86_400_000)
}

/** Publicado en los últimos 7 días */
export function isRecent(value: string) {
  return daysAgo(value) <= 7
}

const longFormat = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
const shortFormat = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })

/** "Hoy", "Ayer" o "miércoles 12 de noviembre" */
export function formatLongDate(value: string) {
  const ago = daysAgo(value)
  if (ago === 0) return 'Hoy'
  if (ago === 1) return 'Ayer'
  const date = parseContentDate(value)
  const text = longFormat.format(date)
  const year = date.getFullYear() !== new Date().getFullYear() ? ` de ${date.getFullYear()}` : ''
  return text.charAt(0).toUpperCase() + text.slice(1) + year
}

/** "Hoy", "Ayer" o "mié 12 nov" */
export function formatShortDate(value: string) {
  const ago = daysAgo(value)
  if (ago === 0) return 'Hoy'
  if (ago === 1) return 'Ayer'
  const date = parseContentDate(value)
  const year = date.getFullYear() !== new Date().getFullYear() ? ` ${date.getFullYear()}` : ''
  return shortFormat.format(date).replace(/\./g, '') + year
}

/** "12-11", el formato que el profe ya usa en los títulos */
export function formatDayMonth(value: string) {
  const [, month, day] = value.split('-')
  return `${Number(day)}-${month}`
}

export function weekStart(value: string) {
  const date = parseContentDate(value)
  const day = date.getDay()
  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day))
  return toDateValue(date)
}

const dayFormat = new Intl.DateTimeFormat('es-AR', { day: 'numeric' })
const monthFormat = new Intl.DateTimeFormat('es-AR', { month: 'long' })

export function weekLabel(startValue: string) {
  const thisWeek = weekStart(todayValue())
  if (startValue === thisWeek) return 'Esta semana'
  if (startValue === addDays(thisWeek, -7)) return 'Semana pasada'

  const start = parseContentDate(startValue)
  const end = parseContentDate(addDays(startValue, 6))
  const year = end.getFullYear() !== new Date().getFullYear() ? ` ${end.getFullYear()}` : ''

  if (start.getMonth() === end.getMonth()) {
    return `${dayFormat.format(start)} al ${dayFormat.format(end)} de ${monthFormat.format(start)}${year}`
  }
  return `${dayFormat.format(start)} de ${monthFormat.format(start)} al ${dayFormat.format(end)} de ${monthFormat.format(end)}${year}`
}
