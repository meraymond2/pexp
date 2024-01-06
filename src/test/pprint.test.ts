import { Concat, Flatten, NL, Nest, Text, Union } from "../lib/doc"
import { CostFactory } from "../lib/measure"
import { pprint } from "../lib/printer"

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

  it("prints a Concat doc correctly", () => {
    const doc = Concat(Text("cas"), Text("cat"))
    const actual = pprint(doc, costFactory, w)
    expect(actual).toEqual(["cascat"])
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
    const F: CostFactory = {
      textFn: (col, len) => Math.max(col + len - 6, 0),
      nlCost: 1,
      addCosts: (a, b) => a + b,
    }
    const W = 150
    const actual = pprint(grouped, F, W)
    const expected = ["= func(", "  pretty,", "  print", ")"]
    expect(actual).toEqual(expected)
  })

  test("pprint with margin at 14", () => {
    const F: CostFactory = {
      textFn: (col, len) => Math.max(col + len - 14, 0),
      nlCost: 1,
      addCosts: (a, b) => a + b,
    }
    const W = 150
    const actual = pprint(grouped, F, W)
    const expected = ["= func( pretty, print )"]
    expect(actual).toEqual(expected)
  })
})
