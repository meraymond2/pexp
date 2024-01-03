import { CostFactory } from "../../src/lib/cost"
import { Text } from "../../src/lib/doc"
import { resolve } from "../../src/lib/resolve"

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

describe("resolve", () => {
  it("resolves Text docs correctly", () => {
    const s = "cascat"
    const doc = Text(s)
    const at0 = resolve(doc, 0, 0, w, costFactory)
    expect(at0).toEqual({
      measures: [
        {
          document: doc,
          cost: 0,
          lastLineLength: 6,
        },
      ],
      tainted: false,
    })

    const at78 = resolve(doc, 78, 0, w, costFactory)
    expect(at78).toEqual({
      measures: [
        {
          document: doc,
          cost: 4,
          lastLineLength: 84,
        },
      ],
      tainted: false,
    })

    const at200 = resolve(doc, 200, 0, w, costFactory)
    expect(at200).toEqual({
      measures: [
        {
          document: doc,
          cost: Infinity,
          lastLineLength: 206,
        },
      ],
      tainted: true,
    })
  })
})
