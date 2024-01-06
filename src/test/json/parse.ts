import { Token, String as StringToken } from "./lex"

export type Node = Obj | Arr | Null | True | False | Str | Num

type KV = {
  key: string
  value: Node
}

type Obj = { _tag: "object"; vals: Array<KV> }

type Arr = { _tag: "array"; vals: Array<Node> }

type Null = { _tag: "null" }
type True = { _tag: "true" }
type False = { _tag: "false" }
type Str = { _tag: "string"; value: string }
type Num = { _tag: "number"; value: string }

class TokenIter {
  ts: Token[]
  pos: number

  constructor(ts: Token[]) {
    this.ts = ts
    this.pos = 0
  }

  match = (tag: string): void => {
    const t = this.next()
    if (t._tag !== tag) throw Error("Parse error " + tag + " " + t._tag)
  }

  next = (): Token => {
    const token = this.ts[this.pos]
    this.pos++
    return token
  }

  peek = (): Token => {
    return this.ts[this.pos]
  }
}

export const parse = (ts: Token[]): Node => {
  const iter = new TokenIter(ts)
  return parseExpr(iter)
}

const parseExpr = (ts: TokenIter): Node => {
  const t = ts.next()
  switch (t._tag) {
    case "true":
      return { _tag: "true" }
    case "false":
      return { _tag: "false" }
    case "null":
      return { _tag: "null" }
    case "string":
      return { _tag: "string", value: t.literal }
    case "number":
      return { _tag: "number", value: t.literal }
    case "[":
      return parseArray(ts)
    case "{":
      return parseObj(ts)
    default:
      throw Error("Unreachable " + t._tag)
  }
}

const parseObj = (ts: TokenIter): Obj => {
  let vals: KV[] = []
  while (true) {
    const k = ts.next() as StringToken
    ts.match(":")
    const v = parseExpr(ts)
    vals.push({ key: k.literal, value: v })
    if (ts.peek()._tag === ",") ts.next()
    else break
  }
  ts.match("}")
  return { _tag: "object", vals }
}

const parseArray = (ts: TokenIter): Arr => {
  let vals: Node[] = []
  while (true) {
    vals.push(parseExpr(ts))
    if (ts.peek()._tag === ",") ts.next()
    else break
  }
  ts.match("]")
  return { _tag: "array", vals }
}
