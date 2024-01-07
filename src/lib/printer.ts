import { Document } from "./doc"
import { CostFactory } from "./measure"
import { render, Layout } from "./render"
import { resolve } from "./resolve"

export const pprint = (doc: Document, costFactory: CostFactory, W: number): Layout => {
  const ms = resolve(doc, 0, 0, W, costFactory)
  const optimal = ms.tainted ? ms.measure().document : ms.measures[0].document
  return render(optimal, { col: 0, indent: 0, flatten: false })
}
