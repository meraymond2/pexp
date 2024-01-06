import { Align, Concat, Document, Flatten, NL, Nest, Text } from "./doc"
import { Layout } from "./layout"

export type PrintCtx = {
  col: number
  indent: number
  flatten: boolean
}

export const render = (doc: Document, ctx: PrintCtx): Layout => {
  switch (doc._tag) {
    case "text":
      return renderText(doc)
    case "new-line":
      return renderNL(ctx)
    case "concat":
      return renderConcat(doc, ctx)
    case "nest":
      return renderNest(doc, ctx)
    case "align":
      return renderAlign(doc, ctx)
    case "flatten":
      return renderFlatten(doc, ctx)
  }
}

const renderText = (doc: Text): Layout => [doc.s]

const INDENT = "  "

const renderNL = (ctx: PrintCtx): Layout => (ctx.flatten ? [" "] : ["", INDENT.repeat(ctx.indent)])

const renderConcat = (doc: Concat, ctx: PrintCtx): Layout => {
  const la = render(doc.a, ctx)
  const lb = render(doc.b, ctx)
  // TODO: see if this gets slow for big layouts, can maybe do with less copying
  const pre = la.slice(0, la.length - 1)
  const post = lb.slice(1)
  const merged = la[la.length - 1] + lb[0]
  return pre.concat(merged).concat(post)
}

export const renderNest = (doc: Nest, ctx: PrintCtx): Layout =>
  render(doc.doc, { ...ctx, indent: ctx.indent + doc.n })

export const renderAlign = (align: Align, ctx: PrintCtx): Layout =>
  render(align.d, { ...ctx, indent: ctx.col })

export const renderFlatten = (flatten: Flatten, ctx: PrintCtx): Layout =>
  render(flatten.d, { ...ctx, flatten: true })
