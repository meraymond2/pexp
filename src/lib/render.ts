import { Document } from "./doc"
import { Layout } from "./layout"

export type PrintCtx = {
  col: number
  indent: number
  flatten: boolean
}

// Could be added to the PrintCtx to be made configurable
const INDENT = "  "

export const render = (doc: Document, ctx: PrintCtx): Layout => {
  switch (doc._tag) {
    case "text":
      return [doc.s]
    case "new-line":
      return ctx.flatten ? [" "] : ["", INDENT.repeat(ctx.indent)]
    case "concat": {
      const la = render(doc.a, ctx)
      const lb = render(doc.b, ctx)
      // TODO: see if this gets slow for big layouts, can maybe do with less copying
      const pre = la.slice(0, la.length - 1)
      const post = lb.slice(1)
      const merged = la[la.length - 1] + lb[0]
      return pre.concat(merged).concat(post)
    }
    case "nest":
      return render(doc.doc, { ...ctx, indent: ctx.indent + doc.n })
    case "align":
      return render(doc.d, { ...ctx, indent: ctx.col })
    case "union":
      // TODO: can I make render only accept choiceless docs?
      throw Error("Unreachable: cannot render Union")
  }
}
