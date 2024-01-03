import { CostFactory, costText } from "./cost"
import { Document, Text } from "./doc"
import { Measure, MeasureSet, TaintedSet, ValidSet, measureText } from "./measure"

export const resolve = (doc: Document, col: number, indent: number, w: number, cf: CostFactory): MeasureSet => {
  switch (doc._tag) {
    case "text":
      return resolveText(doc, col, indent, w, cf)
    default:
      throw Error("todo " + doc._tag)
  }
}

const resolveText = (doc: Text, col: number, indent: number, w: number, cf: CostFactory): MeasureSet => {
  const len = doc.s.length
  // If placing the text would exceed W (cost + length) or if the indent
  // is greater than W, the result is a Tainted Set.
  if (col + len > w || indent > w) {
    // Do I care about the actual cost if it's tainted?
    const dummyCost = Infinity
    return TaintedSet(measureText(doc, col, dummyCost))
  } else {
    const cost = costText(doc, col, cf)
    return ValidSet([measureText(doc, col, cost)])
  }
}
