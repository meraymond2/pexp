import { Document, NL, Text } from "./doc"

/**
 * The printer is agnostic as to the type of Cost, but for now, for
 * simplicity, I am hard-coding it to a number just so I don't have
 * to parameterise a load of types.
 */
export type Cost = number

export type CostFactory = {
  textFn: (col: number, len: number) => Cost
  nlCost: Cost
  addCosts: (a: Cost, b: Cost) => Cost
}

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

export const measureText = (doc: Text, col: number, costFactory: CostFactory): Measure => ({
  cost: costFactory.textFn(col, doc.s.length),
  document: doc,
  lastLineLength: col + doc.s.length,
})

export const measureNL = (doc: NL, indent: number, costFactory: CostFactory): Measure => ({
  cost: costFactory.textFn(0, indent) + costFactory.nlCost,
  document: doc,
  lastLineLength: indent,
})
