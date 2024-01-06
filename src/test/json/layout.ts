import { Concat, Document, Flatten, NL, Nest, Text, Union } from "../../lib/doc"
import { Node } from "./parse"

const Line = (docs: Document[]): Document => docs.reduce((acc, doc) => Concat(acc, doc))

const Group = (doc: Document): Document => Union(doc, Flatten(doc))

// export const WrapBlock = (ls: Document[]): Document => {
//   // Naive version, nothing clever
// }

export const layout = (node: Node): Document => {
  switch (node._tag) {
    case "true":
      return Text("true")
    case "false":
      return Text("false")
    case "null":
      return Text("null")
    case "number":
      return Text(node.value)
    case "string":
      return Text(node.value)
    case "object": {
      const values = Nest(
        1,
        Concat(
          NL,
          Line(
            node.vals.map(({ key, value }, idx) => {
              const kv = Group(Line([Text(key + ": "), layout(value)]))
              if (idx < node.vals.length - 1) {
                return Line([kv, Text(","), NL])
              }
              return kv
            }),
          ),
        ),
      )
      return Line([Text("{"), values, NL, Text("}")])
    }
    case "array": {
      const values = Nest(
        1,
        Concat(
          NL,
          Line(
            node.vals.map((value, idx) => {
              const val = layout(value)
              if (idx < node.vals.length - 1) {
                return Line([val, Text(","), NL])
              }
              return val
            }),
          ),
        ),
      )
      return Group(Line([Text("["), values, NL, Text("]")]))
    }
  }
}
