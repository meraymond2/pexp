import { Cost } from "./cost"
import { Document, Text } from "./doc"

export type Measure = {
  cost: Cost
  document: Document
  lastLineLength: number
}
// export const Measure = (d: Document, c: Cost, l: number): Measure => ({
//   cost: c,
//   document: d,
//   lastLineLength: l,
// })

export type MeasureSet = {
  measures: Measure[]
  tainted: boolean
}

export const ValidSet = (ms: Measure[]): MeasureSet => {
  // todo: sort?
  return {
    measures: ms,
    tainted: false,
  }
}

export const TaintedSet = (m: Measure): MeasureSet => ({
  measures: [m],
  tainted: true,
})

export const measureText = (doc: Text, col: number, cost: Cost): Measure => ({
  cost,
  document: doc,
  lastLineLength: col + doc.s.length,
})
