// Core functional programming utilities

// Pipe function - allows composing functions from left to right
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value)

// Compose function - allows composing functions from right to left
const compose = (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value)

// Curry function - converts a function to a curried version
const curry = (fn) => (...args) => {
    if (args.length >= fn.length) {
        return fn(...args)
    }
    return (...nextArgs) => curry(fn)(...args, ...nextArgs)
}

// Maybe monad for handling null/undefined values
const Maybe = {
    of: (value) => ({ value, isNothing: value == null }),
    map: (fn) => (maybe) => 
        maybe.isNothing ? maybe : Maybe.of(fn(maybe.value)),
    flatMap: (fn) => (maybe) => 
        maybe.isNothing ? maybe : fn(maybe.value),
    filter: (predicate) => (maybe) => 
        maybe.isNothing || !predicate(maybe.value) 
            ? { value: null, isNothing: true } 
            : maybe,
    getOrElse: (defaultValue) => (maybe) => 
        maybe.isNothing ? defaultValue : maybe.value
}

// Either monad for error handling
const Either = {
    left: (error) => ({ isLeft: true, value: error }),
    right: (value) => ({ isLeft: false, value }),
    map: (fn) => (either) => 
        either.isLeft ? either : Either.right(fn(either.value)),
    flatMap: (fn) => (either) => 
        either.isLeft ? either : fn(either.value),
    fold: (leftFn, rightFn) => (either) => 
        either.isLeft ? leftFn(either.value) : rightFn(either.value)
}

// Utility functions
const identity = (x) => x
const constant = (x) => () => x
const not = (fn) => (...args) => !fn(...args)
const partial = (fn, ...args1) => (...args2) => fn(...args1, ...args2)

// Array utilities
const map = curry((fn, arr) => arr.map(fn))
const filter = curry((predicate, arr) => arr.filter(predicate))
const reduce = curry((fn, initial, arr) => arr.reduce(fn, initial))
const find = curry((predicate, arr) => arr.find(predicate))
const forEach = curry((fn, arr) => { arr.forEach(fn); return arr })

// Object utilities
const prop = curry((key, obj) => obj[key])
const props = curry((keys, obj) => keys.map(key => obj[key]))
const pick = curry((keys, obj) => 
    keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {}))
const omit = curry((keys, obj) => {
    const keysSet = new Set(keys)
    return Object.keys(obj)
        .filter(key => !keysSet.has(key))
        .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})
})

// String utilities
const toLowerCase = (str) => str.toLowerCase()
const toUpperCase = (str) => str.toUpperCase()
const trim = (str) => str.trim()
const includes = curry((substring, str) => str.includes(substring))
const startsWith = curry((prefix, str) => str.startsWith(prefix))
const endsWith = curry((suffix, str) => str.endsWith(suffix))

// Async utilities
const asyncPipe = (...fns) => (value) => 
    fns.reduce(async (acc, fn) => fn(await acc), value)

const asyncMap = curry(async (fn, arr) => Promise.all(arr.map(fn)))

const tryCatch = (fn, errorFn = identity) => async (...args) => {
    try {
        const result = await fn(...args)
        return Either.right(result)
    } catch (error) {
        return Either.left(errorFn(error))
    }
}

// Validation utilities
const isString = (value) => typeof value === 'string'
const isNumber = (value) => typeof value === 'number'
const isObject = (value) => typeof value === 'object' && value !== null
const isArray = Array.isArray
const isEmpty = (value) => {
    if (value == null) return true
    if (isString(value) || isArray(value)) return value.length === 0
    if (isObject(value)) return Object.keys(value).length === 0
    return false
}

// Logging utilities
const log = curry((tag, value) => {
    console.log(`[${tag}]:`, value)
    return value
})

const trace = (value) => {
    console.log('Trace:', value)
    return value
}

module.exports = {
    // Core functions
    pipe,
    compose,
    curry,
    
    // Monads
    Maybe,
    Either,
    
    // Utilities
    identity,
    constant,
    not,
    partial,
    
    // Array functions
    map,
    filter,
    reduce,
    find,
    forEach,
    
    // Object functions
    prop,
    props,
    pick,
    omit,
    
    // String functions
    toLowerCase,
    toUpperCase,
    trim,
    includes,
    startsWith,
    endsWith,
    
    // Async functions
    asyncPipe,
    asyncMap,
    tryCatch,
    
    // Validation functions
    isString,
    isNumber,
    isObject,
    isArray,
    isEmpty,
    
    // Logging functions
    log,
    trace
}