import { Document } from "./doc"
import { Layout } from "./layout"
import { CostFactory } from "./measure"
import { render } from "./render"
import { resolve } from "./resolve"

/**
 * This is going to go through the steps:
 * 1. resolve, take a document, and return a measure set
 * 2. pick optimal
 * 3. render
 */

export const pprint = (doc: Document, costFactory: CostFactory, W: number): Layout => {
  const ms = resolve(doc, 0, 0, W, costFactory)
  const optimal = ms.tainted ? ms.measure().document : ms.measures[0].document
  return render(optimal, { col: 0, indent: 0, flatten: false })
}
