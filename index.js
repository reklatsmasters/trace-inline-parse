'use strict'

var fantasy = require('ramda-fantasy')
var Maybe = fantasy.Maybe
var Either = fantasy.Either
var Left = Either.Left
var Right = Either.Right

var INLINED = /^Inlined\s(?:(get|set)\s)?([^\s]+)\s(?:(tail)\s)?called from\s(?:(get|set)\s)?([^.\s]+)?/
var INLINED_NATIVE = /^Inlining\s(api|builtin)(?:\sfunction)?\s([^\s]+)\s<JS Function\s(?:(get|set)\s)?([^(\s]+)?/
var NOT_INLINED = /^Did not inline\s(?:(get|set)\s)?([^\s]+)\scalled from\s(?:(get|set)\s)?([^\s]+)\s\(([^).]+)\)/

var TYPE_JS = 'func'
var TYPE_NATIVE = 'native'

module.exports = parse

/**
 * main parser
 * @param line {string}
 */
function parse(line) {
  assert_str(line)

  return Either.either(pipe, noop, Right(line).chain(is_inlined).chain(is_native).chain(is_not_inlined))
}

// helper
function pipe(q) {
  return q
}

// helper
function noop() {}

function is_inlined(line) {
  return match_line(line, INLINED).map(build_inlined).getOrElse(Right(line))
}

function is_native(line) {
  return match_line(line, INLINED_NATIVE).map(build_native).getOrElse(Right(line))
}

function is_not_inlined(line) {
  return match_line(line, NOT_INLINED).map(build_not_inlined).getOrElse(Right(line))
}

/**
 * check to string type
 */
function assert_str(s) {
  if (typeof s !== 'string') {
    throw new TypeError('expected string')
  }
}

/**
 * test string to regexp and return Maybe monad
 */
function match_line(line, rx) {
  return Maybe(line.match(rx))
}

/**
 * create `target` or `caller` nodes
 */
function node(name, accessor) {
  if (!name) {
    return false
  }

  return {
    name: name,
    accessor: accessor ? accessor : false
  }
}

function build_inlined(match) {
  return Left({
    target: node(match[2], match[1]),
    caller: node(match[5], match[4]),
    type: TYPE_JS,
    inlined: true,
    tailcall: !!match[3]
  })
}

function build_not_inlined(match) {
  return Left({
    target: node(match[2], match[1]),
    caller: node(match[4], match[3]),
    type: TYPE_JS,
    inlined: false,
    reason: match[5]
  })
}

function build_native(match) {
  return Left({
    target: node(match[4], match[3]),
    caller: false,
    type: TYPE_NATIVE,
    inlined: true,
    place: match[1],
    address: match[2]
  })
}
