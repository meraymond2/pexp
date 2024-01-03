# 6 Our Printer, PIe

They're going to define a _measure_, which is an output representing cost, that doesn't require a complete rendering of the layout. 

## 6.1 Overview
The naive aproach to picking an optimal layout is to brute force it, i.e. _evalute_ all the input documents by widening choices and rendering the results, and then measuring them against the cost factory. That is an exponential number of outputs though, and you don't want to render docs if you don't have to.

So we're going to utilise pruning to limit the 'search space'. 

It first resolves choices that produces a small set of measures. This forms a Pareto frontier, like in Bernardy. 
- A Pareto frontier is the set of all Pareto efficient solutions.
- The picture on Wikipedia is helpful here, it shows a two-dimensional optimisation problem, with a bunch of points, where lower values of x and y are better. The Pareto frontier is the set of points for which there exists no point that is lower and further left. Point A is dominated by Point B, if A is better on all axes. So of that set, you don't know which is the best, but you know that it's impossible any of the other points are.
The set will be optimal in cost and last-line-length. 
- THey also have a picture in the paper, but it didn't make sense before.

Then, we pick the optimal measure and render it to produce the optimal layout.

## 6.2 Measure
The _resolving_ face computes _measures_.

A measure comprises five components:
1. length of the last line, l
2. cost, C
3. choiceless document, đ
4. max column position, x
5. max indentation, y
But 4 and 5 aren't actually used in practice, just for the correctness theorem.

Meausure A dominates B if both its cost and last-line-length are <= B. If you have two measures and one has a higher cost and last-line-length than another, you can ignore it.

### Measure Computation
I'm ignoring the x and y.

•(ma, mb) => (
  mb.l-l-l, 
  ma.cost + mb.cost
  Concat(ma.doc, mb.doc) // đa <> đb
)

adjustNest(n, m) => (
  m.l-l-l,
  m.cost
  nest(n, m.doc)
)

textM(s, c, i) => (c + s.length, textC(c, s.length), Text(s))
So the last line len is the current column plus the string len, and cost is the text-cost fn at the current column + the str-len. 

lineM(nl, c, i) => (i, nlC + textC(0, i), nl)
The l-l-l is whatever the indent is, and the cost is one new-line-cost + the text cost of the indent-string at 0.

concatM(đa, đb) => {
  ma = m(đa, c, i) // find measure of đa recursively
  mb = m(đb, ma.l-l-l, i) // with ma's last line length as c
  return ma • mb
}
We find the measure of the left and right hand side, and then combine the measures using the • function. 

nestM(n, đ, c, i) => {
  m1 = m(đ, c, i + n)
  m2 = adjustNest(n, m1)
  return m2
}
We work out the measure of the doc that is to be nested, adding its nesting to the indent, then put the Nest(doc) inside that measure.
nestM(n, nđ, c, i) => {
  return {
    ...m(nđ.doc, c, i + n)
    doc: nđ
  }
}

alignM(ađ, c, i) => {
  return {
    ...m(ađ.doc, c, c),
    doc: ađ
  }
}
Like nesting, we usethe measure of the sub-doc, but now with its indent set to column.

## 6.7 Handling Flattening
They had previously said, 'to simplify the core printer, we remove flatten...this allows ut to eliminate the flattening mode parameter, which temporarily defaults to false.'

So for this section, it's just an implemenation description for how to flatten a doc, it doesn't say anything about the measure. I'm assuming that you flatten it, and then take the measure of that. 

The implementation described is to use memoisation. we have a function that recursively walks a doc and replaces all NewLines with Text(" ")s. If we don't change anything in the doc, then we don't return a new memo-key, we return the original doc, so that we don't walk anything twice. 

## 6.3 Measure Set
The measure set is produced by resolving a document. 

A measure set is either a non-empty set of untainted measures, or a tainted 'singleton set of a promise ^m' that can be forced to a measure. 

The measure set is the Pareto frontier, so the operations on it will need to maintain that invariant.

It'll be represented as an ordered list, ordered by cost in ascending order. Because it's the pareto frontier of 2 dimensions, that implies that it will be ordered by last-line-length is descending order. 
- We can represent it as a list, because as a pareto-frontier, the values must be unique. If both cost and l-l-l are the same, it's a duplicate and can be removed. If cost were the same but l-l-l were different, one of them wouldn't be pareto-optimal.

We define the following operations:
...come back to the operations

## 6.4 Document Structure

Provides a definition for a properly shared document, so that there's no duplication.

## 6.5 The Resolver
THere are definitions here, which fuse widening and measuring. It also takes into W- and Taint-pruning. 

It gives the rules, which I may come back to, or may just go and implement.

The resolver operations RS=> is deterministic and total. The top level printer is 
PIe(d) = l
where 
<d, 0, 0> RS=> [m0, m1...mn] and <doc(m0), 0, 0, false> R=> l

In other words, given a general document, at column and indentation 0, we resolve it to a set of measures. We then take the measure with the lowest cost, and render it to a layout. 

Because resolving beyond W would result in a tainted measure set, it should delay the computation for any resolution beyond W. 

It should also memoize computations, so that for identical docs _within_ W, it reuses the exist computation.
