import { Concat, NL, Text } from "../../src/lib/doc"
import { CostFactory, Measure, measureConcat, measureNL, measureText } from "../../src/lib/measure"

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

describe("newline", () => {
  it("calculates the measure of NL", () => {
    const doc = NL
    const at0: Measure = measureNL(doc, 0, costFactory)
    expect(at0).toEqual({
      document: doc,
      cost: 3,
      lastLineLength: 0,
    })

    const at20: Measure = measureNL(doc, 20, costFactory)
    expect(at20).toEqual({
      document: doc,
      cost: 3,
      lastLineLength: 20,
    })
  })
})

describe("concat", () => {
  it("calculates the measure of Cocnat", () => {
    const doc = Concat(Text("cas"), Text("cas"))
    const at0 = measureConcat(doc, 0, 0, costFactory)
    expect(at0).toEqual({
      document: doc,
      cost: 0,
      lastLineLength: 6,
    })
  })
})
