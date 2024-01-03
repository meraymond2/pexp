import { CostFactory } from "../../src/lib/cost"
import { NL, Text } from "../../src/lib/doc"
import { pprint } from "../../src/lib/printer"

const costFactory: CostFactory = {
  textFn: (col, len) => {
    const margin = 80
    const endPos = col + len
    if (endPos < margin) return 0
    return endPos - margin
  },
  nlCost: 3,
}

const w = 150

describe("pretty printer", () => {
  it("prints a single Text doc correctly", () => {
    const s = "cascat"
    const doc = Text(s)
    const actual = pprint(doc, costFactory, w)
    expect(actual).toEqual([s])
  })

  it("prints a single NL doc correctly", () => {
    const doc = NL
    const actual = pprint(doc, costFactory, w)
    expect(actual).toEqual(["", ""])
  })
})
