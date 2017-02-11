## trace-inline-parse [![Build Status](https://travis-ci.org/ReklatsMasters/trace-inline-parse.svg?branch=master)](https://travis-ci.org/ReklatsMasters/trace-inline-parse) [![npm](https://img.shields.io/npm/v/trace-inline-parse.svg)](https://npmjs.org/package/trace-inline-parse) [![license](https://img.shields.io/npm/l/trace-inline-parse.svg)](https://npmjs.org/package/trace-inline-parse) [![downloads](https://img.shields.io/npm/dm/trace-inline-parse.svg)](https://npmjs.org/package/trace-inline-parse)

Parser of `--trace-inlining` output from [Crankshaft](https://github.com/nodejs/node/blob/24ef1e67757514db9ee1aeded555d4fb336ca817/deps/v8/src/crankshaft/hydrogen.cc#L8121)

### example output from Crankshaft

```
Inlining builtin 000002F5B86C1BE9 <JS Function charCodeAt (SharedFunctionInfo 000002F5B8657279)>
Inlined isNaN called from adjustOffset.
Inlined get length called from slice.
Did not inline parse_int called from next_str (target text too big).
```

### Usage

```js
const parser = require('trace-inline-parse')

console.log(parser('Inlined isNaN called from adjustOffset.'))
/*
{
  target: {
    name: 'isNaN',
    accessor: false
  },
  caller: {
    name: 'adjustOffset',
    accessor: false
  },
  type: 'func',
  inlined: true,
  tailcall: false
}
*/

console.log(parser('Did not inline get foo called from (target text too big).'))
/*
{
  target: {
    name: 'foo',
    accessor: 'get'
  },
  caller: false,
  type: 'func',
  inlined: false,
  reason: 'target text too big'
}
*/
console.log(parser('Inlining builtin 000002F5B86C1BE9 <JS Function charCodeAt (SharedFunctionInfo 000002F5B8657279)>'))
/*
{
  target: {
    name: 'charCodeAt',
    accessor: false
  },
  caller: false,
  type: 'native',
  inlined: true,
  place: 'builtin',
  address: '000002F5B86C1BE9'
}
*/
```

## API

##### `parser(line: string): Node|undefined`

Parse a line and return `Node` object.

#### Node

##### `target: FUNC_NODE  | false`

processed function; equals `false` if function name is empty

##### `caller: FUNC_NODE | false`

parent function; equals `false` if function name is empty

##### `type: 'func' | 'native'`

type of processed function: 'func' for plain js functions, 'native' for any native functions

##### `inlined: bool`

Is node inlined or not?

##### `tailcall: bool`

Was function [tail call](http://www.2ality.com/2015/06/tail-call-optimization.html) optimized or not?

##### `place: 'api' | 'builtin'`

place of native inlined function: `builtin` for any internal V8 functions, `api` for any native nodejs function

##### `address: string`

address of native function

##### `reason: string`

why function wasn't inlined?

#### FUNC_NODE

##### `name: string`

Name of function

##### `accessor: bool`

`get` for getters, `set` for setters, `false` for any other functions

## License
MIT, 2017 (c) Dmitry Tsvettsikh
