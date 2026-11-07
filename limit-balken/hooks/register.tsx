import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Limit } from '../types'

const limits = atom({ plugin: 'limit-balken', key: 'limits' } as const, [] as Limit[])

const NAMEN: Record<string, string> = { five_hour: 'Stundenlimit (5 h)', seven_day: 'Wochenlimit' }

function balken(p: number, breite = 20): string {
  const voll = Math.max(0, Math.min(breite, Math.round((p / 100) * breite)))
  return '█'.repeat(voll) + '░'.repeat(breite - voll)
}

function farbe(p: number): string {
  return p >= 90 ? 'red' : p >= 70 ? 'yellow' : 'green'
}

function reset(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const z = (n: number) => String(n).padStart(2, '0')
  return `Reset ${z(d.getDate())}.${z(d.getMonth() + 1)}. ${z(d.getHours())}:${z(d.getMinutes())}`
}

function statusText(r: Limit[]): string | undefined {
  return r.length === 0
    ? undefined
    : r.map(x => `${x.kind === 'five_hour' ? '5h' : 'Woche'} ${Math.round(x.percentUsed)}%`).join(' · ')
}

function relevante(l: Limit[]): Limit[] {
  return ['five_hour', 'seven_day']
    .map(k => l.find(x => x.kind === k))
    .filter((x): x is Limit => x !== undefined)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const res = await next(e)
    try {
      const u = await $.session.usage()
      const r = relevante(u.rateLimits)
      await update($, limits, () => r)
      $.ui.status(statusText(r))
    } catch {}
    return res
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) {
      const r = relevante(e.rateLimits)
      await update($, limits, () => r)
      $.ui.status(statusText(r))
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const l = await read($, limits)
    const { Box, Text } = $.ui.resolve(e)

    if (l.length === 0) {
      return (
        <Box>
          <Text dimColor>Limits: noch keine Messung (erscheint nach der ersten Antwort)</Text>
        </Box>
      )
    }

    return (
      <Box flexDirection="column">
        {l.map(x => (
          <Box key={x.kind}>
            <Text>{(NAMEN[x.kind] ?? x.kind).padEnd(19)} </Text>
            <Text color={farbe(x.percentUsed)}>{balken(x.percentUsed)}</Text>
            <Text> {x.percentUsed.toFixed(0).padStart(3)} % </Text>
            <Text dimColor>{reset(x.resetsAt)}</Text>
          </Box>
        ))}
      </Box>
    )
  })
}
