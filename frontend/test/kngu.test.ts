import { describe, expect, it } from 'vitest'
import { AGE_BANDS, GROWTH_CAUTION, KNGU_GOALS } from '../app/data/kngu'
import { EXERCISES } from '../app/data/exercises'
import { LOCALES } from '../app/data/types'

describe('KNGU goals', () => {
  it('has the 8 physical-preparation goals for every age band, in both languages', () => {
    const ids = new Set<string>()
    for (const band of AGE_BANDS) {
      expect(KNGU_GOALS[band], band).toHaveLength(8)
      for (const g of KNGU_GOALS[band]) {
        expect(ids.has(g.id), g.id).toBe(false)
        ids.add(g.id)
        for (const l of LOCALES) {
          expect(g.name[l].trim(), `${g.id} name ${l}`).toBeTruthy()
          expect(g.standard[l].trim(), `${g.id} standard ${l}`).toBeTruthy()
        }
        if (g.exercise) expect(EXERCISES[g.exercise], `${g.id} → ${g.exercise}`).toBeDefined()
      }
    }
  })

  it('links the 9–10 home goals to exercises in the library', () => {
    const home = KNGU_GOALS['9-10'].filter(g => g.where === 'home')
    expect(home.length).toBeGreaterThanOrEqual(5)
    for (const g of home) expect(g.exercise, g.id).toBeDefined()
  })

  it('only names existing exercises as growth-spurt cautions', () => {
    for (const id of GROWTH_CAUTION) expect(EXERCISES[id], id).toBeDefined()
  })
})
