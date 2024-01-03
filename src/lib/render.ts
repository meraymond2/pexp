import { Document, NL, Text } from "./doc"
import { Layout } from "./layout"

export const render = (doc: Document, indent: number): Layout => {
  switch (doc._tag) {
    case "text":
      return renderText(doc)
    case "new-line":
      return renderNL(doc, indent)
    default:
      throw Error("Unimplemented " + doc._tag)
  }
}

const renderText = (doc: Text): Layout => [doc.s]

const renderNL = (_doc: NL, indent: number): Layout => ["", " ".repeat(indent)]
