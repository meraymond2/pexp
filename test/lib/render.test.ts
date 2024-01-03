import { Text } from "../../src/lib/doc"
import { Layout } from "../../src/lib/layout"
import { render } from "../../src/lib/render"

describe("rendering", () => {
  it("renders a Text doc correctly", () => {
    const s = "cascat"
    const doc = Text(s)
    const actual: Layout = render(doc)
    const expected: Layout = [s]
    expect(actual).toEqual(expected)
  })
})
