import { Concat, NL, Nest, Text } from "../lib/doc"
import { Layout } from "../lib/layout"
import { render } from "../lib/render"

describe("render Text", () => {
  test("render Text(s)", () => {
    const s = "cascat"
    const doc = Text(s)
    const actual: Layout = render(doc, 0)
    const expected: Layout = [s]
    expect(actual).toEqual(expected)
  })
})

describe("render NL", () => {
  test("render NL", () => {
    const doc = NL
    const actual: Layout = render(doc, 0)
    const expected: Layout = ["", ""]
    expect(actual).toEqual(expected)
  })
})

describe("render Concat", () => {
  test("render Concat(Text, Text)", () => {
    const doc = Concat(Text("cas"), Text("cat"))
    const actual: Layout = render(doc, 0)
    const expected: Layout = ["cascat"]
    expect(actual).toEqual(expected)
  })
})

describe("render Nest", () => {
  test("render Nest(Text)", () => {
    // Slightly counterintuitive, but Nesting text doesn't indent it directly,
    // because otherwise you couldn't have a line of Text items.
    const doc = Nest(1, Text("lunabee"))
    const actual: Layout = render(doc, 0)
    const expected: Layout = ["lunabee"]
    expect(actual).toEqual(expected)
  })

  test("render Nest(Concat(NL, Text))", () => {
    const doc = Nest(1, Concat(NL, Text("lunabee")))
    const actual = render(doc, 0)
    const expected: Layout = ["", "  lunabee"]
    expect(actual).toEqual(expected)
  })
})
