# Pretty Expressive...

Comes after the other papers, prioritises expressiveness over absolute speed. Identifies some holes in previous implementations. 

# 1 Introduction
Their printer is Πe, which is a capital pi, which denotes the product of a sequence. It targets a Pretty-Printing-Language (PPL) called Σe. Sigma denotes the sum of a sequence. 

Their printer is parameterised by a _cost factory_, a bit like Yellands, in that it is configurable. This is as opposed to some approaches which relied on a fixed, global margin.

Survey:
- they distinguish between arbitrary-choice PPLs (like Yelland), and the 'traditional' ones, that only have spaces/line breaks. A downside of the traditional approach, which is nice an simple, is that you end up with stuff like 
```
let x = first +
  second + 
  third
```

Expressiveness:
- They distinguish between expressiveness of the PPL and the resulting layout. 
- For the former, they talk about how the representation in code of the arbitrary-choice layout doesn't match the layout. You have to hack it together out of other pieces. So you can create the layout, but the PPL isn't nice to use.
- The latter is what it says above, there are layouts that are hard to create with just space/nls. 
- The phrasing is confusing, 'the document in Figure 1b is awkwardly constructed,', they mean that the constructing expression is awkward, not the printed layout.

Optimality:
- They cover the case where it's not possible to avoid overflow, which not all the other ones do as well.

Performance:
- two phases: choice resolution, and rendering

Summary:
- new PPL Σe that is more expressive than other PPLs
- new printer PIe, that takes Σe and a cost factory
- correctness proof

## Alignment
They talk a lot about unaligned and aligned concatenation. They're both types of horizontal concatenation, where the first character of layout B is placed after the last character of layout A on the same line.

In _unaligned_ concatenation, layout B is placed to the right of layout A, 'on the current indentation level'. 

In _aligned_ concatenation, all of layout B is aligned to the column at which it starts. This is as opposed to using the global indent level. 

In this example, it's using aligned-concat of an indent of two spaces with the return (...) layout. 
```
function(append(first, second, third) {
  return (
    first +
    second +
    third
  )
}
```
The above example from the paper isn't the best, but this comes up when you're printing arbitrary expressions that may need to be split and indented. 

In this JSON example, it's difficult to express this without indent. It's probably possible, but Yelland only had the aligned concat which only made it easy to do things like the second. I know some formatters like the second format for arguments. The emacs Clojure formatter would do that, and I didn't like it.

I don't know that the former was impossible in Yelland, but it wasn't easy, cause you'd have to do the whole K-V in one expression, and it would be annoying to do that recursively, where ideally each sub-call is independent.
```
{
  "xs": {
    "ys": {
      "zs": {
        "a": 1,
        "b": 2,
        "c": 3
      }
    }
  }
}
{
  "xs": {
          "ys": {
                  "zs": {
                          "a": 1,
                          "b": 2,
                          "c": 3
                  }
          }
  }
}
```
