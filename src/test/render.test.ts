import { Concat, Flatten, NL, Nest, Text } from "../lib/doc"
import { Layout, render } from "../lib/render"

const initialCtx = {
  col: 0,
  indent: 0,
  flatten: false,
}

describe("render Text", () => {
  test("render Text(s)", () => {
    const s = "cascat"
    const doc = Text(s)
    const actual: Layout = render(doc, initialCtx)
    const expected: Layout = [s]
    expect(actual).toEqual(expected)
  })
})

describe("render NL", () => {
  test("render NL, flatten = false", () => {
    const doc = NL
    const actual: Layout = render(doc, initialCtx)
    const expected: Layout = ["", ""]
    expect(actual).toEqual(expected)
  })

  test("render NL, flatten = true", () => {
    const doc = NL
    const actual: Layout = render(doc, { col: 0, indent: 0, flatten: true })
    const expected: Layout = [" "]
    expect(actual).toEqual(expected)
  })
})

describe("render Concat", () => {
  test("render Concat(Text, Text)", () => {
    const doc = Concat(Text("cas"), Text("cat"))
    const actual: Layout = render(doc, initialCtx)
    const expected: Layout = ["cascat"]
    expect(actual).toEqual(expected)
  })

  test("render Concat(Concat(Text, NL), Text), flatten = false", () => {
    const doc = Concat(Concat(Text("cas"), NL), Text("cat"))
    const actual: Layout = render(doc, initialCtx)
    const expected: Layout = ["cas", "cat"]
    expect(actual).toEqual(expected)
  })

  test("render Concat(Concat(Text, NL), Text), flatten = true", () => {
    const doc = Concat(Concat(Text("cas"), NL), Text("cat"))
    const actual: Layout = render(doc, { col: 0, indent: 0, flatten: true })
    const expected: Layout = ["cas cat"]
    expect(actual).toEqual(expected)
  })
})

describe("render Nest", () => {
  test("render Nest(Text)", () => {
    // Slightly counterintuitive, but Nesting text doesn't indent it directly,
    // because otherwise you couldn't have a line of Text items.
    const doc = Nest(1, Text("lunabee"))
    const actual: Layout = render(doc, initialCtx)
    const expected: Layout = ["lunabee"]
    expect(actual).toEqual(expected)
  })

  test("render Nest(Concat(NL, Text))", () => {
    const doc = Nest(1, Concat(NL, Text("lunabee")))
    const actual = render(doc, initialCtx)
    const expected: Layout = ["", "  lunabee"]
    expect(actual).toEqual(expected)
  })
})

describe("render Flatten", () => {
  test("render Flatten(Concat(Concat(Text, NL), Text))", () => {
    const doc = Flatten(Concat(Concat(Text("cas"), NL), Text("cat")))
    const actual: Layout = render(doc, initialCtx)
    const expected: Layout = ["cas cat"]
    expect(actual).toEqual(expected)
  })
})

describe("render Example 3.1", () => {
  const doc = Concat(
    Text("= func("),
    Concat(
      Nest(1, Concat(NL, Concat(Text("pretty,"), Concat(NL, Text("print"))))),
      Concat(NL, Text(")")),
    ),
  )
  const actual = render(doc, { col: 3, indent: 0, flatten: false })
  const expected = ["= func(", "  pretty,", "  print", ")"]
  expect(actual).toEqual(expected)
})
