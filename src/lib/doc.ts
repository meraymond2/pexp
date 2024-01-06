export type Document = Text | NL | Concat | Align | Nest

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
  doc: Document
}
export const Nest = (n: number, doc: Document): Nest => ({
  _tag: "nest",
  id: id++,
  n,
  doc,
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
  d: Document
}
export const Align = (d: Document): Align => ({
  _tag: "align",
  id: id++,
  d,
})

// TODO: this is supposed to be memoised, but a naive cache is likely to be
// slower than none, so I'm skipping until I have a benchmark that can
// demonstrate memoisation that's faster.
export const Flatten = (doc: Document): Document => {
  switch (doc._tag) {
    case "align":
      return {
        ...doc,
        d: Flatten(doc.d),
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
        doc: Flatten(doc.doc),
      }
    case "new-line":
      return Text(" ")
    case "text":
      return doc
  }
}
