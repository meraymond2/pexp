import { Concat, Document, NL, Nest, Text } from "./doc"
import { Layout } from "./layout"

export const render = (doc: Document, indent: number): Layout => {
  switch (doc._tag) {
    case "text":
      return renderText(doc)
    case "new-line":
      return renderNL(doc, indent)
    case "concat":
      return renderConcat(doc, indent)
    case "nest":
      return renderNest(doc, indent)
    default:
      throw Error("Unimplemented " + doc._tag)
  }
}

const renderText = (doc: Text): Layout => [doc.s]

const INDENT = "  "

// TODO: flattening
const renderNL = (_doc: NL, indent: number): Layout => ["", INDENT.repeat(indent)]

const renderConcat = (doc: Concat, indent: number): Layout => {
  const la = render(doc.a, indent)
  const lb = render(doc.b, indent)
  // TODO: see if this gets slow for big layouts, can maybe do with less copying
  const pre = la.slice(0, la.length - 1)
  const post = lb.slice(1)
  const merged = la[la.length - 1] + lb[0]
  return pre.concat(merged).concat(post)
}

export const renderNest = (doc: Nest, indent: number): Layout => render(doc.doc, indent + doc.n)
