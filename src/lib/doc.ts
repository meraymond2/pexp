export type Document = Text | NL | Concat | Align | Flatten | Nest;

let id = 0;

export type Text = {
  _tag: "text";
  id: number;
  s: string;
};
export const Text = (s: string): Text => ({
  _tag: "text",
  id: id++,
  s,
});

export type NL = {
  _tag: "new-line";
  id: number;
};
export const NL: NL = {
  _tag: "new-line",
  id: id++,
};

export type Nest = {
  _tag: "nest";
  id: number;
  n: number;
  doc: Document;
};
export const Nest = (n: number, doc: Document): Nest => ({
  _tag: "nest",
  id: id++,
  n,
  doc,
});

export type Concat = {
  _tag: "concat";
  id: number;
  a: Document;
  b: Document;
};
export const Concat = (a: Document, b: Document): Concat => ({
  _tag: "concat",
  id: id++,
  a,
  b,
});

export type Align = {
  _tag: "align";
  id: number;
  d: Document;
};
export const Align = (d: Document): Align => ({
  _tag: "align",
  id: id++,
  d,
});

export type Flatten = {
  _tag: "flatten";
  id: number;
  d: Document;
};
export const Flatten = (d: Document): Flatten => ({
  _tag: "flatten",
  id: id++,
  d,
});
