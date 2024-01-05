import { Concat, NL, Text } from "../lib/doc"
import { CostFactory } from "../lib/measure"
import { resolve } from "../lib/resolve"

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
          cost: 126,
          lastLineLength: 206,
        },
      ],
      tainted: true,
    })
  })
})

describe("resolve", () => {
  it("resolves NL docs correctly", () => {
    const doc = NL
    const at0 = resolve(doc, 0, 0, w, costFactory)
    expect(at0).toEqual({
      measures: [
        {
          document: doc,
          cost: 3,
          lastLineLength: 0,
        },
      ],
      tainted: false,
    })

    const at78 = resolve(doc, 78, 0, w, costFactory)
    expect(at78).toEqual({
      measures: [
        {
          document: doc,
          cost: 3,
          lastLineLength: 0,
        },
      ],
      tainted: false,
    })

    const at78WithIndent = resolve(doc, 78, 4, w, costFactory)
    expect(at78WithIndent).toEqual({
      measures: [
        {
          document: doc,
          cost: 3,
          lastLineLength: 4,
        },
      ],
      tainted: false,
    })

    const at200 = resolve(doc, 200, 0, w, costFactory)
    expect(at200).toEqual({
      measures: [
        {
          document: doc,
          cost: 3,
          lastLineLength: 0,
        },
      ],
      tainted: true,
    })

    const at200Indent = resolve(doc, 0, 200, w, costFactory)
    expect(at200Indent).toEqual({
      measures: [
        {
          document: doc,
          cost: 123,
          lastLineLength: 200,
        },
      ],
      tainted: true,
    })
  })
})

describe("resolve", () => {
  it("resolves Concat docs correctly", () => {
    const doc = Concat(Text("cas"), Text("cat"))
    const at0 = resolve(doc, 0, 0, w, costFactory)
    const actualId = at0.measures[0].document.id
    expect(at0).toEqual({
      measures: [
        {
          document: { ...doc, id: actualId },
          cost: 0,
          lastLineLength: 6,
        },
      ],
      tainted: false,
    })
  })
})
