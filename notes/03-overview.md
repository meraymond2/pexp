# 3 An Overview of PIe

fn PIe(document: Σe, cf: CostFactory, computation-width-limit: ??): TextLayout = ...

## 3.1 Documents in Σe
We specify a document, including formatting _choices_. That's evaluated to a set of layouts, and PIe picks the optimal layout. 

The constructs come from a mix of traditional and arbitrary-choice PPLs, as well as borrowing from Wadler and Leijen's PPLs.

There are two types of documents, _choiceless_ documents and _general_ documents. A choiceless document can be rendered at a given column position `c` and an indentation level `i`. In the paper it's a d with a line over it, I'll do them as đ.

Text(s) - render a layout with a single line s
NewLine - normally renders to a line break followed by i spaces. It can interact with Flatten, which reduces it to a single space (like a traditional PPL)
Concat - takes two choiceless documents, and concats them in an _unaligned_ way, like a traditional PPL.
Nest - takes an integer n and a đ, and renders it but with the indentation _increased_ by n.
Align - renders đ with the indentation level _set_ to the column position c. C isn't an argument, it's the current value.
Flatten - takes a đ and renders it, but with all newlines and indentation from NewLines flattened to single spaces.

General documents support have one more expression, the (arbitrary) Choice operator, which allows a choice of two sub-docs. They render to a non-empty set of layouts. 
- The general doc container Choices _widens_ to a finite set of choiceless docs. 

## 3.2 Cost Factory
