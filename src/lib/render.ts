import { Document } from "./doc"

export type Layout = string[]

export type PrintCtx = {
  c: number
  i: number
  indentStr: string
}

export const render = (doc: Document, ctx: PrintCtx): Layout => {
  switch (doc._tag) {
    case "text":
      return [doc.s]
    case "new-line":
      return ["", ctx.indentStr.repeat(ctx.i)]
    case "concat": {
      const la = render(doc.a, ctx)
      const lb = render(doc.b, ctx)
      // If this gets slow for big layouts, can probably do with less copying
      const pre = la.slice(0, la.length - 1)
      const post = lb.slice(1)
      const merged = la[la.length - 1] + lb[0]
      return pre.concat(merged).concat(post)
    }
    case "nest":
      return render(doc.nested, { ...ctx, i: ctx.i + doc.n })
    case "align":
      return render(doc.aligned, { ...ctx, i: ctx.c })
    case "union":
      throw Error("Unreachable: cannot render Union")
  }
}
