export type Token = LBrace | RBrace | LSquare | RSquare | Comma | Colon | Null | True | False | String | Number

type LBrace = { _tag: "{" }
type RBrace = { _tag: "}" }
type LSquare = { _tag: "[" }
type RSquare = { _tag: "]" }
type Comma = { _tag: "," }
type Colon = { _tag: ":" }
type Null = { _tag: "null" }
type True = { _tag: "true" }
type False = { _tag: "false" }
export type String = { _tag: "string"; literal: string }
type Number = { _tag: "number"; literal: string }

export const lex = (s: string): Token[] => {
  let i = 0
  let ts: Token[] = []
  while (i < s.length) {
    const c = s[i]
    switch (c) {
      case "{":
      case "}":
      case "[":
      case "]":
      case ",":
      case ":":
        ts.push({ _tag: c })
        i++
        break
      case "n":
        ts.push({ _tag: "null" })
        i += 4
        break
      case "t":
        ts.push({ _tag: "true" })
        i += 4
        break
      case "f":
        ts.push({ _tag: "false" })
        i += 5
        break
      case '"': {
        const start = i
        let escapes = 0
        i++
        while (!(s[i] === '"' && escapes % 2 === 0)) {
          i++
        }
        i++
        const end = i
        ts.push({ _tag: "string", literal: s.slice(start, end) })
        break
      }
      default:
        {
          if (numericish(c)) {
            const start = i
            while (numericish(s[i])) {
              i++
            }
            const end = i
            const n = s.slice(start, end)
            if (n.length) {
              ts.push({ _tag: "number", literal: n })
              break
            }
          }
        }
        i++
    }
  }
  return ts
}

const numericish = (c: string): boolean => /[0-9-+Ee.]/.test(c)
