export type Document = Text | NL | Concat | Align | Nest | Union

// Id is mainly for debugging for now.
let id = 0

export type Text = {
  _tag: "text"
  id: number
  s: string
}
export const Text = (s: string): Text => ({
  _tag: "text",
  id: id++,
  s,
})

export type NL = {
  _tag: "new-line"
  id: number
}
export const NL: NL = {
  _tag: "new-line",
  id: id++,
}

export type Nest = {
  _tag: "nest"
  id: number
  n: number
  nested: Document
}
export const Nest = (n: number, nested: Document): Nest => ({
  _tag: "nest",
  id: id++,
  n,
  nested,
})

export type Concat = {
  _tag: "concat"
  id: number
  a: Document
  b: Document
}
export const Concat = (a: Document, b: Document): Concat => ({
  _tag: "concat",
  id: id++,
  a,
  b,
})

export type Align = {
  _tag: "align"
  id: number
  aligned: Document
}
export const Align = (aligned: Document): Align => ({
  _tag: "align",
  id: id++,
  aligned,
})

export type Union = {
  _tag: "union"
  id: number
  a: Document
  b: Document
}
export const Union = (a: Document, b: Document): Union => ({
  _tag: "union",
  id: id++,
  a,
  b,
})

// TODO: according to the paper, this should be memoised, but I'm skipping that for now.
export const Flatten = (doc: Document): Document => {
  switch (doc._tag) {
    case "align":
      return {
        ...doc,
        aligned: Flatten(doc.aligned),
      }
    case "concat":
      return {
        ...doc,
        a: Flatten(doc.a),
        b: Flatten(doc.b),
      }
    case "nest":
      return {
        ...doc,
        nested: Flatten(doc.nested),
      }
    case "new-line":
      return Text(" ")
    case "text":
      return doc
    case "union":
      return {
        ...doc,
        a: Flatten(doc.a),
        b: Flatten(doc.b),
      }
  }
}
