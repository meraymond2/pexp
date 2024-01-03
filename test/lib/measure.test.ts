import { Text } from "../../src/lib/doc"
import { Measure, measureText } from "../../src/lib/measure"

describe("measure", () => {
  it("calculates the measure of Text", () => {
    const s = "cascat"
    const doc = Text(s)
    const at0: Measure = measureText(doc, 0, 0)
    expect(at0).toEqual({
      document: doc,
      cost: 0,
      lastLineLength: 6,
    })

    const at20: Measure = measureText(doc, 20, 0)
    expect(at20).toEqual({
      document: doc,
      cost: 0,
      lastLineLength: 26,
    })
  })
})
