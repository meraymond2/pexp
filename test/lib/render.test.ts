import { NL, Text } from "../../src/lib/doc"
import { Layout } from "../../src/lib/layout"
import { render } from "../../src/lib/render"

describe("rendering", () => {
  it("renders a Text doc correctly", () => {
    const s = "cascat"
    const doc = Text(s)
    const actual: Layout = render(doc, 0)
    const expected: Layout = [s]
    expect(actual).toEqual(expected)
  })

  it("renders a NL doc correctly", () => {
    const doc = NL
    const actual: Layout = render(doc, 0)
    const expected: Layout = ["", ""]
    expect(actual).toEqual(expected)
  })
})
