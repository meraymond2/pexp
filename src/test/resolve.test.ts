import { Align, Concat, Flatten, NL, Nest, Text, Union } from "../lib/doc"
import { MeasureSet } from "../lib/measure"
import { render } from "../lib/render"
import { resolve } from "../lib/resolve"
import { W, assertValid, costFactory, stripIds, stripIdsMSet } from "./helpers"

const F = costFactory()

describe("resolve Text", () => {
  const s = "cascat"
  const doc = Text(s)
  test("resolve Text at 0", () => {
    const at0 = resolve(doc, 0, 0, W, F)
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
    const at78 = resolve(doc, 78, 0, W, F)
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

  test("resolve Text at 100", () => {
    const actual = resolve(doc, 100, 0, W, F)
    expect(actual).toEqual({
      measures: [
        {
          document: doc,
          cost: 26,
          lastLineLength: 106,
        },
      ],
      tainted: false,
    })
  })

  test("resolve Concat(Text, Text)", () => {
    const spacer = Text("-".repeat(100))
    const concat = Concat(spacer, doc)
    const actual = resolve(concat, 0, 0, W, F)
    const expected: MeasureSet = {
      tainted: false,
      measures: [
        {
          document: stripIds(concat),
          cost: 26,
          lastLineLength: 106,
        },
      ],
    }
    expect(stripIdsMSet(actual)).toEqual(stripIdsMSet(expected))
  })

  test("resolve Text at 200", () => {
    const at200 = resolve(doc, 200, 0, W, F)
    expect(at200.tainted).toBe(true)
    if (at200.tainted) {
      expect(at200.measure()).toEqual({
        document: doc,
        cost: 126,
        lastLineLength: 206,
      })
    }
  })
})

describe("resolve NL", () => {
  const doc = NL
  test("resolve NL at 0", () => {
    const at0 = resolve(doc, 0, 0, W, F)
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
    const at78 = resolve(doc, 78, 0, W, F)
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
    const at78WithIndent = resolve(doc, 78, 4, W, F)
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
    const at200 = resolve(doc, 200, 0, W, F)
    expect(at200.tainted).toBe(true)
    if (at200.tainted) {
      expect(at200.measure()).toEqual({
        document: doc,
        cost: 3,
        lastLineLength: 0,
      })
    }
  })

  test("resolve NL past W at col 0 with 200 indent", () => {
    const at200Indent = resolve(doc, 0, 200, W, F)
    expect(at200Indent.tainted).toBe(true)
    if (at200Indent.tainted) {
      expect(at200Indent.measure()).toEqual({
        document: doc,
        cost: 123,
        lastLineLength: 200,
      })
    }
  })
})

describe("resolve Concat", () => {
  test("resolve Concat(Text, Text)", () => {
    const doc = Concat(Text("cas"), Text("cat"))
    const at0 = assertValid(resolve(doc, 0, 0, W, F))
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

  test("combines costs correctly", () => {
    const s1 = "  "
    const s2 = "0123456789"
    const s3 = "9876543210"
    const doc = Concat(Text(s1), Concat(Text(s2), Text(s3)))
    // const doc = Concat(Concat(Text(s1), Text(s2)), Text(s3))
    const F = costFactory(10, 1)
    const actual = resolve(doc, 0, 0, 150, F)
    const expected: MeasureSet = {
      tainted: false,
      measures: [
        {
          cost: 12,
          document: doc,
          lastLineLength: 22,
        },
      ],
    }
    expect(stripIdsMSet(actual)).toEqual(stripIdsMSet(expected))
  })
})

describe("resolve Nest", () => {
  test("resolve Nest(Text) at col 0", () => {
    const doc = Nest(1, Text("lunabee"))
    const actual = resolve(doc, 0, 0, W, F)
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

describe("resolve Align", () => {
  test("resolve Align(Text) at col 0", () => {
    const doc = Align(Text("lunabee"))
    const actual = resolve(doc, 0, 4, W, F)
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

describe("Example 3.1", () => {
  const doc = Concat(
    Text("= func("),
    Concat(
      Nest(1, Concat(NL, Concat(Text("pretty,"), Concat(NL, Text("print"))))),
      Concat(NL, Text(")")),
    ),
  )
  const grouped = Union(doc, Flatten(doc))

  test("pprint with margin at 6", () => {
    const F = costFactory(6, 1)
    const W = 150
    const res = resolve(grouped, 3, 0, W, F)
    if (!res.tainted) {
      const layout = render(res.measures[0].document, { c: 3, i: 0, indentStr: "  " })
      const expected = ["= func(", "  pretty,", "  print", ")"]
      expect(layout).toEqual(expected)
    }
  })

  test("pprint with margin at 14", () => {
    const F = costFactory(14, 1)
    const W = 150
    const res = resolve(grouped, 3, 0, W, F)
    if (!res.tainted) {
      const layout = render(res.measures[0].document, { c: 3, i: 0, indentStr: "  " })
      const expected = ["= func(", "  pretty,", "  print", ")"]
      expect(layout).toEqual(expected)
    }
  })
})
