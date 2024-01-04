import { Text } from "../../src/lib/doc"
import { CostFactory, Measure, measureText } from "../../src/lib/measure"

const costFactory: CostFactory = {
  textFn: (col, len) => {
    const margin = 80
    const endPos = col + len
    if (endPos < margin) return 0
    return endPos - margin
  },
  nlCost: 3,
  addCosts: (a, b) => a + b,
}

describe("measure", () => {
  it("calculates the measure of Text", () => {
    const s = "cascat"
    const doc = Text(s)
    const at0: Measure = measureText(doc, 0, costFactory)
    expect(at0).toEqual({
      document: doc,
      cost: 0,
      lastLineLength: 6,
    })

    const at20: Measure = measureText(doc, 20, costFactory)
    expect(at20).toEqual({
      document: doc,
      cost: 0,
      lastLineLength: 26,
    })
  })
})
