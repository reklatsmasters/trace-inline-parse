'use strict'

var test = require('tape')
var parse = require('./')

test('parse inlined', function (t) {
  var s = 'Inlined adjustOffset called from slice.'

  t.deepEqual(parse(s), {
    target: {
      name: 'adjustOffset',
      accessor: false
    },
    caller: {
      name: 'slice',
      accessor: false
    },
    type: 'func',
    inlined: true,
    tailcall: false
  })
  t.end()
})

test('parse inlined (empty parent)', function (t) {
  var s = 'Inlined decode called from .'

  t.deepEqual(parse(s), {
    target: {
      name: 'decode',
      accessor: false
    },
    caller: false,
    type: 'func',
    inlined: true,
    tailcall: false
  })
  t.end()
})

test('parse inlined getter', function (t) {
  var s = 'Inlined get buffer called from slice.'

  t.deepEqual(parse(s), {
    target: {
      name: 'buffer',
      accessor: 'get'
    },
    caller: {
      name: 'slice',
      accessor: false
    },
    type: 'func',
    inlined: true,
    tailcall: false
  })
  t.end()
})

test('parse inlined setter', function (t) {
  var s = 'Inlined set buffer called from slice.'

  t.deepEqual(parse(s), {
    target: {
      name: 'buffer',
      accessor: 'set'
    },
    caller: {
      name: 'slice',
      accessor: false
    },
    type: 'func',
    inlined: true,
    tailcall: false
  })
  t.end()
})

test('parse inlined getter from setter', function (t) {
  var s = 'Inlined get buffer called from set slice.'

  t.deepEqual(parse(s), {
    target: {
      name: 'buffer',
      accessor: 'get'
    },
    caller: {
      name: 'slice',
      accessor: 'set'
    },
    type: 'func',
    inlined: true,
    tailcall: false
  })
  t.end()
})

test('parse inlined tail call', function (t) {
  var s = 'Inlined adjustOffset tail called from slice.'

  t.deepEqual(parse(s), {
    target: {
      name: 'adjustOffset',
      accessor: false
    },
    caller: {
      name: 'slice',
      accessor: false
    },
    type: 'func',
    inlined: true,
    tailcall: true
  })
  t.end()
})

test('parse native / builtin', function (t) {
  var s = 'Inlining builtin 000002F5B86C1BE9 <JS Function charCodeAt (SharedFunctionInfo 000002F5B8657279)>'

  t.deepEqual(parse(s), {
    target: {
      name: 'charCodeAt',
      accessor: false
    },
    caller: false,
    type: 'native',
    inlined: true,
    place: 'builtin',
    address: '000002F5B86C1BE9'
  })
  t.end()
})

test('parse native / api', function (t) {
  var s = 'Inlining api function 000003ED5D005A71 <JS Function utf8Slice (SharedFunctionInfo 000003ED5D0059C9)>'

  t.deepEqual(parse(s), {
    target: {
      name: 'utf8Slice',
      accessor: false
    },
    caller: false,
    type: 'native',
    inlined: true,
    place: 'api',
    address: '000003ED5D005A71'
  })
  t.end()
})

test('parse native getter', function (t) {
  var s = 'Inlining api function 000003ED5D005A71 <JS Function get buffer (SharedFunctionInfo 000003ED5D0059C9)>'

  t.deepEqual(parse(s), {
    target: {
      name: 'buffer',
      accessor: 'get'
    },
    caller: false,
    type: 'native',
    inlined: true,
    place: 'api',
    address: '000003ED5D005A71'
  })
  t.end()
})

test('parse empty native', function (t) {
  var s = 'Inlining api function 000003ED5D005A71 <JS Function (SharedFunctionInfo 000003ED5D0059C9)>'

  t.deepEqual(parse(s), {
    target: false,
    caller: false,
    type: 'native',
    inlined: true,
    place: 'api',
    address: '000003ED5D005A71'
  })
  t.end()
})

test('parse not inlined func', function (t) {
  var s = 'Did not inline dictval called from select (target text too big).'

  t.deepEqual(parse(s), {
    target: {
      name: 'dictval',
      accessor: false
    },
    caller: {
      name: 'select',
      accessor: false
    },
    type: 'func',
    inlined: false,
    reason: 'target text too big'
  })

  t.end()
})

test('parse not inlined getter', function (t) {
  var s = 'Did not inline get dictval called from select (target text too big).'

  t.deepEqual(parse(s), {
    target: {
      name: 'dictval',
      accessor: 'get'
    },
    caller: {
      name: 'select',
      accessor: false
    },
    type: 'func',
    inlined: false,
    reason: 'target text too big'
  })

  t.end()
})

test('parse not inlined getter from setter', function (t) {
  var s = 'Did not inline get dictval called from set select (target text too big).'

  t.deepEqual(parse(s), {
    target: {
      name: 'dictval',
      accessor: 'get'
    },
    caller: {
      name: 'select',
      accessor: 'set'
    },
    type: 'func',
    inlined: false,
    reason: 'target text too big'
  })

  t.end()
})

test('skip unparsed line', function (t) {
  var s = 'some debug line'

  t.is(parse(s), void 0)
  t.end()
})
