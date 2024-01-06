import { writeFileSync } from "fs"
import { CostFactory } from "../../lib/measure"
import { pprint } from "../../lib/printer"
import { layout } from "./layout"
import { lex } from "./lex"
import { parse } from "./parse"

const mkCostFactory = (margin: number, nlCost: number = 3): CostFactory => ({
  textFn: (col, len) => {
    const endPos = col + len
    if (endPos < margin) return 0
    return endPos - margin
  },
  nlCost,
  addCosts: (a, b) => a + b,
})

describe("printing JSON objects", () => {
  const jsStr = JSON.stringify({
    name: "pexp",
    version: "1.0.0",
    scripts: {
      build: "esbuild src/index.ts --outdir=out --platform=node --bundle",
      start: "npm run build && node out/index.js",
      fix: "npx prettier -w src/",
      test: "jest",
    },
    devDependencies: {
      "@types/jest": "^29.5.11",
      "@types/node": "^20.10.5",
      esbuild: "^0.19.10",
      jest: "^29.7.0",
      prettier: "^3.1.1",
      "ts-jest": "^29.1.1",
      typescript: "^5.3.3",
    },
    prettier: { semi: false, printWidth: 100 },
  })
  const parsed = parse(lex(jsStr))
  const doc = layout(parsed)

  test("at margin 80", () => {
    const F = mkCostFactory(80)
    const actual = pprint(doc, F, 200).join("\n")
    const expected = `
{
  "name": "pexp",
  "version": "1.0.0",
  "scripts": {
    "build": "esbuild src/index.ts --outdir=out --platform=node --bundle",
    "start": "npm run build && node out/index.js",
    "fix": "npx prettier -w src/",
    "test": "jest"
  },
  "devDependencies": {
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.5",
    "esbuild": "^0.19.10",
    "jest": "^29.7.0",
    "prettier": "^3.1.1",
    "ts-jest": "^29.1.1",
    "typescript": "^5.3.3"
  },
  "prettier": { "semi": false, "printWidth": 100 }
}
  `.trim()
    expect(actual).toEqual(expected)
  })

  test("at margin 40", () => {
    const F = mkCostFactory(40)
    const actual = pprint(doc, F, 200).join("\n")
    const expected = `
{
  "name": "pexp",
  "version": "1.0.0",
  "scripts": {
    "build": "esbuild src/index.ts --outdir=out --platform=node --bundle",
    "start": "npm run build && node out/index.js",
    "fix": "npx prettier -w src/",
    "test": "jest"
  },
  "devDependencies": {
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.5",
    "esbuild": "^0.19.10",
    "jest": "^29.7.0",
    "prettier": "^3.1.1",
    "ts-jest": "^29.1.1",
    "typescript": "^5.3.3"
  },
  "prettier": {
    "semi": false,
    "printWidth": 100
  }
}
  `.trim()
    expect(actual).toEqual(expected)
  })
})

describe("printing JSON arrays", () => {
  const jsStr = JSON.stringify([1, 2, 3, 4, 5])
  const doc = layout(parse(lex(jsStr)))

  test("at margin = 40", () => {
    const F = mkCostFactory(40)
    const actual = pprint(doc, F, 200).join("\n")
    const expected = `[ 1, 2, 3, 4, 5 ]`
    expect(actual).toEqual(expected)
  })
  test("at margin = 4", () => {
    const F = mkCostFactory(4, 1)
    const actual = pprint(doc, F, 200).join("\n")
    const expected = `
[
  1,
  2,
  3,
  4,
  5
]`.trim()
    expect(actual).toEqual(expected)
  })
})

describe("wrapping JSON arrays", () => {
  const jsStr = JSON.stringify([
    "abc",
    "bcd",
    "cde",
    "def",
    "efg",
    "fgh",
    "ghi",
    "hij",
    "ijk",
    "jkl",
    "klm",
    "lmn",
    "mno",
    "nop",
    "opq",
    "pqr",
    "qrs",
    "rst",
    "stu",
    "tuv",
    "uvw",
    "vwx",
    "wxy",
    "xyz",
  ])
  const doc = layout(parse(lex(jsStr)))

  test.skip("at margin = 40", () => {
    const F = mkCostFactory(40)
    const actual = pprint(doc, F, 200).join("\n")
    const expected = `
[
  'abc', 'bcd', 'cde', 'def', 'efg',
  'fgh', 'ghi', 'hij', 'ijk', 'jkl',
  'klm', 'lmn', 'mno', 'nop', 'opq',
  'pqr', 'qrs', 'rst', 'stu', 'tuv',
  'uvw', 'vwx', 'wxy', 'xyz'
]
`.trim()
    expect(actual).toEqual(expected)
  })
})
