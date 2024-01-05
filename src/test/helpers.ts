import { Document } from "../lib/doc"
import { CostFactory, MeasureSet } from "../lib/measure"

export const costFactory: CostFactory = {
  textFn: (col, len) => {
    const margin = 80
    const endPos = col + len
    if (endPos < margin) return 0
    return endPos - margin
  },
  nlCost: 3,
  addCosts: (a, b) => a + b,
}

export const W = 150

export const stripIds = (doc: Document): Document => {
  switch (doc._tag) {
    case "align":
      return { ...doc, d: stripIds(doc.d), id: -1 }
    case "concat":
      return { ...doc, a: stripIds(doc.a), b: stripIds(doc.b), id: -1 }
    case "flatten":
      return { ...doc, d: stripIds(doc.d), id: -1 }
    case "nest":
      return { ...doc, doc: stripIds(doc.doc), id: -1 }
    case "new-line":
    case "text":
      return { ...doc, id: -1 }
  }
}

export const stripIdsMSet = (ms: MeasureSet): MeasureSet => ({
  ...ms,
  measures: ms.measures.map((m) => ({ ...m, document: stripIds(m.document) })),
})
