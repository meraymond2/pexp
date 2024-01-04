import { Document, NL, Text } from "./doc"
import { CostFactory, MeasureSet, TaintedSet, ValidSet, measureNL, measureText } from "./measure"

export const resolve = (doc: Document, col: number, indent: number, w: number, cf: CostFactory): MeasureSet => {
  switch (doc._tag) {
    case "text":
      return resolveText(doc, col, indent, w, cf)
    case "new-line":
      return resolveNL(doc, col, indent, w, cf)
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
    return TaintedSet(measureText(doc, col, cf))
  } else {
    return ValidSet([measureText(doc, col, cf)])
  }
}

const resolveNL = (doc: NL, col: number, indent: number, w: number, cf: CostFactory) => {
  if (col > w || indent > w) {
    return TaintedSet(measureNL(doc, col, cf))
  } else {
    return ValidSet([measureNL(doc, col, cf)])
  }
}
