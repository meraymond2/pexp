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
The cost factory provides a way of comparing layouts.

It comprises 
1. a fn `text(col, len)` that computes the cost of text of a given length at a given column.
2. a constant `newline` that gives the cost of a line break.
3. an addition fn
4. a comparison fn

It sounds a bit like Yelland, I think the main difference is that you provide a function, not a set of constants, so you can things like soft margins without complicating the core.

They give some examples of possibly ways of doing it. I like the example that uses the square of the overflow, so long overflows cost more than a series of short overflows.

## 3.3 W, the Computation Width Limit
This is the final input to PIe. 

This sounds like the cost factory, but isn't the same as the margin.

If I understand this correctly, it's a coarse upper margin. Layouts that exceed it are automatically discarded, if there are other layouts that don't exceed it. 

It sounds related to the cost factory, but I think it's separate because it's used in a separate step. If there are two choices and one exceeds W, it'll be immediately discard. If both are within W, the cost factory gets used to determine which one is optimal.
- It still sounds a bit like it should be a constant in the cost factory. I'll see if I'm misunderstanding it.
