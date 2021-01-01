import fs from 'fs'

const arraySize = 10000
const maxValue = 128
const debugStart = 14
const debugEnd = 18

async function main() {
  const memory = new WebAssembly.Memory({ initial: 1 })

  const a = new Uint8Array(memory.buffer, 0, arraySize)
  const b = new Uint8Array(memory.buffer, arraySize, arraySize)
  const result = new Uint8Array(memory.buffer, 2 * arraySize, arraySize)

  for (let i = 0; i < arraySize; i++) {
    a[i] = Math.floor(Math.random() * maxValue)
    b[i] = Math.floor(Math.random() * maxValue)
  }
  console.log('a:', a.subarray(debugStart, debugEnd))
  console.log('b:', b.subarray(debugStart, debugEnd))

  for (let i = 0; i < arraySize; i++) {
    result[i] = a[i] + b[i]
  }
  console.log('result:', result.subarray(debugStart, debugEnd))

  result.fill(0)

  const { instance } = await WebAssembly.instantiate(
    fs.readFileSync('./simd.wasm'),
    {
      js: { memory },
    },
  )
  console.log(instance.exports.add(arraySize))
  console.log('result:', result.subarray(debugStart, debugEnd))
}

main()
