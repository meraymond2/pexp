# 4 THe Semantics of Σe

This is a more formal definition of 3.1.

## 4.1 Layouts
A layout is a non-empty list of lines. Each line is a string without newline-chars. The first line of a layout may be placed at any column, but subsequent lines start at column = 0. 

The layout is the rendered product of a choiceless document.

## 4.2 Formal Semantics
The combination of column and indentation is called the _printing context_.

Given a choiceless document đ, column c, indentation i, and flattening-boolean f, we render to a layout l.

### Rendering
Rendering Text - Text(s) renders to a layout of a single line s. We don't pay attention to the context, so it's not indented.

Rendering Newlines - if flatten is false, we render this to two lines, one empty line, one line indented by i spaces. If flatten is true, it's a single line of a single space.

Rendering Unaligned Concatenation - given Concat(đa, đb), we first render đa to la. They distinguish between the case of la being a single or multiple lines, but it sounds like the same to me. For đb, we render it, but it's first line gets concatenated to the last line of la. So I think we need to render them both first, concat the la-last to lb-first, then return that.

Widening Choices - widen(Choice(da, db)) widens to the unions of widen(da) and widen(db). It doesn't say what the means though.
