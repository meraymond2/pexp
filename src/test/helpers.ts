import { Document } from "../lib/doc"
import { CostFactory, MeasureSet, ValidMeasureSet } from "../lib/measure"

export const costFactory = (margin: number = 80, nlCost: number = 3): CostFactory => ({
  textFn: (col, len) => {
    const endPos = col + len
    if (endPos < margin) return 0
    return endPos - margin
  },
  nlCost,
  addCosts: (a, b) => Math.max(a, b),
  lessOrEqualCost: (a, b) => a <= b,
})

export const W = 150

export const stripIds = (doc: Document): Document => {
  switch (doc._tag) {
    case "align":
      return { ...doc, d: stripIds(doc.d), id: -1 }
    case "concat":
    case "union":
      return { ...doc, da: stripIds(doc.da), db: stripIds(doc.db), id: -1 }
    case "nest":
      return { ...doc, d: stripIds(doc.d), id: -1 }
    case "new-line":
    case "text":
      return { ...doc, id: -1 }
  }
}

export const stripIdsMSet = (ms: MeasureSet): MeasureSet => {
  if (ms.tainted) {
    const m = ms.measure()
    return {
      tainted: true,
      measure: () => ({ ...m, document: stripIds(m.document) }),
    }
  }
  return {
    tainted: false,
    measures: ms.measures.map((m) => ({
      ...m,
      document: stripIds(m.document),
    })),
  }
}

export const assertValid = (S: MeasureSet): ValidMeasureSet => {
  if (S.tainted) throw Error("Assertion failed: S tainted")
  return S
}
