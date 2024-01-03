import { NL, Text } from "./doc"

export type CostFactory = {
  textFn: (col: number, len: number) => Cost
  nlCost: Cost
}

// The printer abstracts over the cost type, so you can keep the
// elements of the cost separate, but I'm combining them into a single
// number for simplicity for now.
export type Cost = number

export const addCosts = (a: Cost, b: Cost): Cost => a + b

export const costText = (doc: Text, col: number, cf: CostFactory): Cost => cf.textFn(col, doc.s.length)
export const costNL = (_doc: NL, indent: number, cf: CostFactory): Cost => cf.textFn(0, indent) + cf.nlCost
