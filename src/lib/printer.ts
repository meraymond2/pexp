import { CostFactory } from "./cost";
import { Document } from "./doc";
import { Layout } from "./layout";
import { render } from "./render";
import { resolve } from "./resolve";

/**
 * This is going to go through the steps:
 * 1. resolve, take a document, and return a measure set
 * 2. pick optimal
 * 3. render
 */

export const pprint = (
  document: Document,
  costFactory: CostFactory,
  computationWidthLimit: number
): Layout => {
  const ms = resolve(document, costFactory, computationWidthLimit)
  const optimal = ms
  return render(optimal)
}
