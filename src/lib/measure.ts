import { Concat, Document, NL, Nest, Text } from "./doc"

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

const dominates = (a: Measure, b: Measure): boolean => a.lastLineLength <= b.lastLineLength && a.cost <= b.cost

export const dedup = (ms: Measure[]): Measure[] => {
  if (ms.length === 1) return ms

  const m = ms[0]
  const mprime = ms[1]
  const head = dominates(mprime, m) ? [] : [m]
  const tail = dedup(ms.slice(1))
  return head.concat(tail)
}

export const adjustNest = (n: number, m: Measure): Measure => ({
  cost: m.cost,
  lastLineLength: m.lastLineLength,
  document: Nest(n, m.document),
})

export const lift = (ms: MeasureSet, f: (m: Measure) => Measure): MeasureSet => ({
  ...ms,
  measures: ms.measures.map(f),
})

export const unionMeasureSet = (a: MeasureSet, b: MeasureSet): MeasureSet => {
  if (b.tainted) return a
  // Not sure about this one, as the notation is different from the case above.
  if (a.tainted) return b
  return {
    measures: mergeSortMeasures(a.measures, b.measures),
    tainted: false,
  }
}

const mergeSortMeasures = (as: Measure[], bs: Measure[]): Measure[] => {
  if (dominates(as[0], bs[0])) {
    return mergeSortMeasures(as, bs.slice(1))
  } else if (dominates(bs[0], as[0])) {
    return mergeSortMeasures(as.slice(1), bs)
  } else if (as[0].lastLineLength > bs[0].lastLineLength) {
    return as.slice(0, 1).concat(mergeSortMeasures(as.slice(1), bs))
  } else {
    return bs.slice(0, 1).concat(mergeSortMeasures(as, bs.slice(1)))
  }
}

export const taint = (s: MeasureSet): MeasureSet =>
  s.tainted
    ? s
    : {
        measures: s.measures.slice(0, 1),
        tainted: true,
      }

export const merge = (a: Measure, b: Measure): Measure => ({
  cost: a.cost + b.cost,
  document: Concat(a.document, b.document),
  lastLineLength: b.lastLineLength,
})

const measure = (doc: Document, col: number, indent: number, costFactory: CostFactory): Measure => {
  switch (doc._tag) {
    case "text":
      return measureText(doc, col, costFactory)
    case "new-line":
      return measureNL(doc, indent, costFactory)
    case "concat":
      return measureConcat(doc, col, indent, costFactory)
    default:
      throw Error("Unimplemented measure: " + doc._tag)
  }
}

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

export const measureConcat = (doc: Concat, col: number, indent: number, costFactory: CostFactory): Measure => {
  const ma = measure(doc.a, col, indent, costFactory)
  const mb = measure(doc.b, ma.lastLineLength, indent, costFactory)
  return {
    cost: costFactory.addCosts(ma.cost, mb.cost),
    document: doc,
    lastLineLength: mb.lastLineLength,
  }
}
