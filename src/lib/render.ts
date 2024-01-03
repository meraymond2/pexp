import { Document, Text } from "./doc"
import { Layout } from "./layout"

export const render = (doc: Document): Layout => {
  switch (doc._tag) {
    case "text":
      return renderText(doc)
    default:
      throw Error("Unimplemented " + doc._tag)
  }
}

const renderText = (doc: Text): Layout => [doc.s]
