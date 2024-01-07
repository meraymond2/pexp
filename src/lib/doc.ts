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
  d: Document
}
export const Nest = (n: number, d: Document): Nest => ({
  _tag: "nest",
  id: id++,
  n,
  d,
})

export type Concat = {
  _tag: "concat"
  id: number
  da: Document
  db: Document
}
export const Concat = (da: Document, db: Document): Concat => ({
  _tag: "concat",
  id: id++,
  da: da,
  db: db,
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

export type Union = {
  _tag: "union"
  id: number
  da: Document
  db: Document
}
export const Union = (da: Document, db: Document): Union => ({
  _tag: "union",
  id: id++,
  da,
  db,
})

// TODO: according to the paper, this should be memoised, but I'm skipping that for now.
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
        da: Flatten(doc.da),
        db: Flatten(doc.db),
      }
    case "nest":
      return {
        ...doc,
        d: Flatten(doc.d),
      }
    case "new-line":
      return Text(" ")
    case "text":
      return doc
    case "union":
      return {
        ...doc,
        da: Flatten(doc.da),
        db: Flatten(doc.db),
      }
  }
}
