import { describe, expect, it } from 'vitest'
import { EXERCISES, LIBRARY, MOVE_ORDER } from '../app/data/exercises'
import { BODY_AREAS, EXERCISE_IDS, LOCALES, type Text } from '../app/data/types'
import { LOADS } from '../app/data/loads'
import { SOURCES } from '../app/data/sources'
import { POSES } from '../app/data/poses'
import { LEVELS } from '../app/data/levels'

const texts = (e: (typeof LIBRARY)[number]): Text[] => [e.name, ...e.cues, e.why, e.tempo, e.safety].filter((x): x is Text => !!x)

describe('exercise library', () => {
  it('has every id exactly once', () => {
    const ids = LIBRARY.map(e => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect([...ids].sort()).toEqual([...EXERCISE_IDS].sort())
    expect(MOVE_ORDER).toHaveLength(EXERCISE_IDS.length)
  })

  it('has every field in both languages', () => {
    for (const e of LIBRARY) {
      expect(e.cues.length, e.id).toBeGreaterThan(0)
      expect(e.equipment.length, e.id).toBeGreaterThan(0)
      for (const text of texts(e)) for (const l of LOCALES) expect(text[l]?.trim(), `${e.id} ${l}`).toBeTruthy()
    }
  })

  it('cites existing sources, or says it is common practice', () => {
    for (const e of LIBRARY) {
      expect(e.sources.length > 0 || e.commonPractice, e.id).toBeTruthy()
      for (const s of e.sources) expect(SOURCES[s], `${e.id} → ${s}`).toBeDefined()
    }
  })

  it('has reciprocal progression links', () => {
    for (const e of LIBRARY) {
      if (e.harder) expect(EXERCISES[e.harder].easier, `${e.id} → ${e.harder}`).toBe(e.id)
      if (e.easier) expect(EXERCISES[e.easier].harder, `${e.id} ← ${e.easier}`).toBe(e.id)
    }
  })

  it('has a drawing for every exercise', () => {
    for (const id of EXERCISE_IDS) expect(POSES[id], id).toBeDefined()
  })

  it('says which body areas every exercise loads', () => {
    for (const id of EXERCISE_IDS) {
      expect(LOADS[id], id).toBeDefined()
      for (const area of LOADS[id]) expect(BODY_AREAS, `${id} → ${area}`).toContain(area)
    }
    // Hanging always loads the hands; weight on the hands always loads the wrists.
    for (const e of LIBRARY) {
      if (e.equipment.includes('pullupbar') && e.category === 'pull') expect(LOADS[e.id], e.id).toContain('hands')
      if (e.equipment.includes('dipbar')) expect(LOADS[e.id], e.id).toContain('wrist')
    }
  })

  it('still contains every exercise the workout plan uses', () => {
    for (const level of LEVELS) for (const item of level.plan) expect(EXERCISES[item.ex], item.ex).toBeDefined()
  })
})
