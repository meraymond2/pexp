import { Align, Concat, Document, NL, Nest, Text, Union } from "./doc"
import { adjustAlign } from "./measure"
import {
  CostFactory,
  MeasureSet,
  TaintedSet,
  ValidSet,
  dedup,
  measureNL,
  measureText,
  merge,
  unionMeasureSet,
  taint,
  adjustNest,
  lift,
} from "./measure"

export const resolve = (
  d: Document,
  c: number,
  i: number,
  W: number,
  F: CostFactory,
): MeasureSet => {
  switch (d._tag) {
    case "text":
      return resolveText(d, c, i, W, F)
    case "new-line":
      return resolveNL(d, c, i, W, F)
    case "concat":
      return resolveConcat(d, c, i, W, F)
    case "nest":
      return resolveNest(d, c, i, W, F)
    case "align":
      return resolveAlign(d, c, i, W, F)
    case "union":
      return resolveUnion(d, c, i, W, F)
  }
}

const resolveText = (d: Text, c: number, i: number, W: number, F: CostFactory): MeasureSet => {
  const len = d.s.length
  // If placing the text would exceed W (cost + length) or if the indent
  // is greater than W, the result is a Tainted Set.
  if (c + len > W || i > W) {
    return TaintedSet(() => measureText(d, c, F))
  } else {
    return ValidSet([measureText(d, c, F)])
  }
}

const resolveNL = (d: NL, c: number, i: number, W: number, F: CostFactory): MeasureSet => {
  if (c > W || i > W) {
    return TaintedSet(() => measureNL(d, i, F))
  } else {
    return ValidSet([measureNL(d, i, F)])
  }
}

const resolveConcat = (d: Concat, c: number, i: number, W: number, F: CostFactory): MeasureSet => {
  const ra = resolve(d.da, c, i, W, F)
  if (ra.tainted) {
    const ma = ra.measure()
    const rb = resolve(d.db, ma.lastLineLength, i, W, F)
    const rb2 = taint(rb)
    const mb = rb2.measure()
    return TaintedSet(() => merge(ma, mb))
  } else {
    const ss = ra.measures.map((man) => {
      // RSC(mn, docB, indent) =>
      const rb = resolve(d.db, man.lastLineLength, i, W, F)
      if (rb.tainted) {
        const mb = rb.measure()
        return TaintedSet(() => merge(man, mb))
      } else {
        return ValidSet(
          dedup(
            rb.measures.map((mbn) => merge(man, mbn)),
            F,
          ),
        )
      }
    })
    return ss.reduce((acc, s) => unionMeasureSet(acc, s, F))
  }
}

const resolveNest = (d: Nest, c: number, i: number, W: number, F: CostFactory): MeasureSet => {
  const r1 = resolve(d.d, c, i + d.n, W, F)
  return lift(r1, (m) => adjustNest(d.n, m))
}

const resolveAlign = (d: Align, c: number, i: number, W: number, F: CostFactory): MeasureSet => {
  if (i > W) {
    return lift(taint(resolve(d, c, c, W, F)), (m) => adjustAlign(i, m))
  }
  const S = resolve(d.d, c, c, W, F)
  return lift(S, (m) => adjustAlign(i, m))
}

const resolveUnion = (d: Union, c: number, i: number, W: number, F: CostFactory): MeasureSet => {
  const Sa = resolve(d.da, c, i, W, F)
  const Sb = resolve(d.db, c, i, W, F)
  return unionMeasureSet(Sa, Sb, F)
}
