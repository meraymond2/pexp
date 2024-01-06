import { Align, Concat, Document, NL, Nest, Text } from "./doc";
import { Layout } from "./layout";

export const render = (doc: Document, col: number, indent: number): Layout => {
  switch (doc._tag) {
    case "text":
      return renderText(doc);
    case "new-line":
      return renderNL(doc, indent);
    case "concat":
      return renderConcat(doc, col, indent);
    case "nest":
      return renderNest(doc, col, indent);
    case "align":
      return renderAlign(doc, col);
    default:
      throw Error("Unimplemented " + doc._tag);
  }
};

const renderText = (doc: Text): Layout => [doc.s];

const INDENT = "  ";

// TODO: flattening
const renderNL = (_doc: NL, indent: number): Layout => [
  "",
  INDENT.repeat(indent),
];

const renderConcat = (doc: Concat, col: number, indent: number): Layout => {
  const la = render(doc.a, col, indent);
  const lb = render(doc.b, col, indent);
  // TODO: see if this gets slow for big layouts, can maybe do with less copying
  const pre = la.slice(0, la.length - 1);
  const post = lb.slice(1);
  const merged = la[la.length - 1] + lb[0];
  return pre.concat(merged).concat(post);
};

export const renderNest = (doc: Nest, col: number, indent: number): Layout =>
  render(doc.doc, col, indent + doc.n);

export const renderAlign = (align: Align, col: number): Layout =>
  render(align.d, col, col);
