import { CostFactory, costText } from "../../src/lib/cost"
import { Text } from "../../src/lib/doc"

describe("cost", () => {
  const costFactory: CostFactory = {
    textFn: (col, len) => {
      const margin = 80
      const endPos = col + len
      if (endPos < margin) return 0
      return endPos - margin
    },
    nlCost: 3,
  }

  it("calculates a Text cost correctly", () => {
    const s = "cascat"
    const doc = Text(s)
    const atZero = costText(doc, 0, costFactory)
    expect(atZero).toEqual(0)

    const at78 = costText(doc, 78, costFactory)
    expect(at78).toEqual(4)
  })
})
