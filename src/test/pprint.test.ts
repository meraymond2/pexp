import { Concat, NL, Text } from "../lib/doc"
import { pprint } from "../lib/printer"
import { W, costFactory } from "./helpers"

const F = costFactory()

describe("pretty printer", () => {
  it("prints a single Text doc correctly", () => {
    const s = "cascat"
    const doc = Text(s)
    const actual = pprint(doc, F, W)
    expect(actual).toEqual([s])
  })

  it("prints a single NL doc correctly", () => {
    const doc = NL
    const actual = pprint(doc, F, W)
    expect(actual).toEqual(["", ""])
  })

  it("prints a Concat doc correctly", () => {
    const doc = Concat(Text("cas"), Text("cat"))
    const actual = pprint(doc, F, W)
    expect(actual).toEqual(["cascat"])
  })
})
