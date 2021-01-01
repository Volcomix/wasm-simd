import fs from 'fs'

const runCount = 100000
const arraySize = 10000
const maxValue = 128
const debugStart = 14
const debugEnd = 18

async function main() {
  const memory = new WebAssembly.Memory({ initial: 1 })
  const { instance } = await WebAssembly.instantiate(
    fs.readFileSync('./simd.wasm'),
    {
      js: { memory },
    },
  )
  const a = new Uint8Array(memory.buffer, 0, arraySize)
  const b = new Uint8Array(memory.buffer, arraySize, arraySize)
  const result = new Uint8Array(memory.buffer, 2 * arraySize, arraySize)

  console.log()
  for (let i = 0; i < arraySize; i++) {
    a[i] = Math.floor(Math.random() * maxValue)
    b[i] = Math.floor(Math.random() * maxValue)
  }
  console.log('a:', a.subarray(debugStart, debugEnd))
  console.log('b:', b.subarray(debugStart, debugEnd))

  console.log('\n--- Simple loop (JS) ---')
  let start = Date.now()
  for (let i = 0; i < runCount; i++) {
    for (let j = 0; j < arraySize; j++) {
      result[j] = a[j] + b[j]
    }
  }
  let elapsed = Date.now() - start
  console.log(`${elapsed}ms - result:`, result.subarray(debugStart, debugEnd))

  result.fill(0)

  console.log('\n--- SIMD (WASM) ---')
  start = Date.now()
  for (let i = 0; i < runCount; i++) {
    instance.exports.add(arraySize)
  }
  elapsed = Date.now() - start
  console.log(`${elapsed}ms - result:`, result.subarray(debugStart, debugEnd))

  console.log()
}

main()
