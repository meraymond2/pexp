import { Concat, NL, Nest, Text } from "../lib/doc"
import { CostFactory, MeasureSet } from "../lib/measure"
import { resolve } from "../lib/resolve"
import { W, costFactory, stripIds, stripIdsMSet } from "./helpers"

describe("resolve Text", () => {
  const s = "cascat"
  const doc = Text(s)
  test("resolve Text at 0", () => {
    const at0 = resolve(doc, 0, 0, W, costFactory)
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
  })

  test("resolve Text at 78", () => {
    const at78 = resolve(doc, 78, 0, W, costFactory)
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
  })

  test("resolve Text at 200", () => {
    const at200 = resolve(doc, 200, 0, W, costFactory)
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

describe("resolve NL", () => {
  const doc = NL
  test("resolve NL at 0", () => {
    const at0 = resolve(doc, 0, 0, W, costFactory)
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
  })
  test("resolve NL at 78", () => {
    const at78 = resolve(doc, 78, 0, W, costFactory)
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
  })
  test("resolve NL at col 78 with indent", () => {
    const at78WithIndent = resolve(doc, 78, 4, W, costFactory)
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
  })

  test("resolve NL at col 200 past W", () => {
    const at200 = resolve(doc, 200, 0, W, costFactory)
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
  })

  test("resolve NL past W at col 0 with 200 indent", () => {
    const at200Indent = resolve(doc, 0, 200, W, costFactory)
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

describe("resolve Concat", () => {
  test("resolve Concat(Text, Text)", () => {
    const doc = Concat(Text("cas"), Text("cat"))
    const at0 = resolve(doc, 0, 0, W, costFactory)
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

describe("resolve Nest", () => {
  test("resolve Nest(Text) at col 0", () => {
    const doc = Nest(1, Text("lunabee"))
    const actual = resolve(doc, 0, 0, W, costFactory)
    const expected: MeasureSet = {
      measures: [
        {
          cost: 0,
          document: doc,
          lastLineLength: 7,
        },
      ],
      tainted: false,
    }
    expect(stripIdsMSet(actual)).toEqual(stripIdsMSet(expected))
  })
})
