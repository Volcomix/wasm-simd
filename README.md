# WebAssembly SIMD example

This example demonstrates the usage of SIMD in JavaScript through WebAssembly.
It runs 100000 times the addition of 2 arrays of size 10000 (see [index.js](index.js) for more details).

The first implementation is done with a simple loop in JavaScript:

```js
for (let j = 0; j < arraySize; j++) {
  result[j] = a[j] + b[j]
}
```

The second implementation relies on WebAssembly code written by hand in [text format](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format).
Here is the SIMD specific part (you can find the entire code in [simd.wat](simd.wat)):

```wasm
(v128.store
  (i32.add (local.get $result) (local.get $i))
  (i8x16.add
    (v128.load (local.get $i)) ;; a
    (v128.load (i32.add (local.get $arraySize) (local.get $i))) ;; b
  )
)
```

## Results

Here are the execution times I get on my computer, along with few values from the arrays for debugging purpose:

```
a: Uint8Array(4) [ 99, 127, 7, 13 ]
b: Uint8Array(4) [ 6, 77, 8, 85 ]

--- Simple loop (JS) ---
3742ms - result: Uint8Array(4) [ 105, 204, 15, 98 ]

--- SIMD (WASM) ---
74ms - result: Uint8Array(4) [ 105, 204, 15, 98 ]
```

## Requirements

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com/)
- [WABT](https://github.com/WebAssembly/wabt)

## Usage

```bash
yarn start
```
