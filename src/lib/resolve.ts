import { Align, Concat, Document, NL, Nest, Text } from "./doc";
import { adjustAlign } from "./measure";
import {
  CostFactory,
  Measure,
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
} from "./measure";

export const resolve = (
  doc: Document,
  col: number,
  indent: number,
  w: number,
  cf: CostFactory,
): MeasureSet => {
  switch (doc._tag) {
    case "text":
      return resolveText(doc, col, indent, w, cf);
    case "new-line":
      return resolveNL(doc, col, indent, w, cf);
    case "concat":
      return resolveConcat(doc, col, indent, w, cf);
    case "nest":
      return resolveNest(doc, col, indent, w, cf);
    case "align":
      return resolveAlign(doc, col, indent, w, cf);
    default:
      throw Error("todo " + doc._tag);
  }
};

const resolveText = (
  doc: Text,
  col: number,
  indent: number,
  w: number,
  cf: CostFactory,
): MeasureSet => {
  const len = doc.s.length;
  // If placing the text would exceed W (cost + length) or if the indent
  // is greater than W, the result is a Tainted Set.
  if (col + len > w || indent > w) {
    return TaintedSet(() => measureText(doc, col, cf));
  } else {
    return ValidSet([measureText(doc, col, cf)]);
  }
};

const resolveNL = (
  doc: NL,
  col: number,
  indent: number,
  w: number,
  cf: CostFactory,
): MeasureSet => {
  if (col > w || indent > w) {
    return TaintedSet(() => measureNL(doc, indent, cf));
  } else {
    return ValidSet([measureNL(doc, indent, cf)]);
  }
};

const resolveConcat = (
  doc: Concat,
  col: number,
  indent: number,
  w: number,
  cf: CostFactory,
): MeasureSet => {
  const ra = resolve(doc.a, col, indent, w, cf);
  if (ra.tainted) {
    const ma = ra.measure();
    const rb = resolve(doc.b, ma.lastLineLength, indent, w, cf);
    const rb2 = taint(rb);
    const mb = rb2.measure();
    return TaintedSet(() => merge(ma, mb));
  } else {
    const ss = ra.measures.map((man) => {
      // RSC(mn, docB, indent) =>
      const rb = resolve(doc.b, man.lastLineLength, indent, w, cf);
      if (rb.tainted) {
        const mb = rb.measure();
        return TaintedSet(() => merge(man, mb));
      } else {
        return ValidSet(dedup(rb.measures.map((mbn) => merge(man, mbn))));
      }
    });
    return ss.reduce((acc, s) => unionMeasureSet(acc, s));
  }
};

const resolveNest = (
  doc: Nest,
  col: number,
  indent: number,
  W: number,
  cf: CostFactory,
): MeasureSet => {
  const r1 = resolve(doc.doc, col, indent + doc.n, W, cf);
  return lift(r1, (m) => adjustNest(doc.n, m));
};

const resolveAlign = (
  align: Align,
  col: number,
  indent: number,
  W: number,
  cf: CostFactory,
): MeasureSet => {
  if (indent > W) {
    return lift(taint(resolve(align, col, col, W, cf)), (m) =>
      adjustAlign(indent, m),
    );
  }
  const S = resolve(align.d, col, col, W, cf);
  return lift(S, (m) => adjustAlign(indent, m));
};
