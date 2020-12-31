import fs from 'fs'

const arraySize = 10000

async function main() {
  const memory = new WebAssembly.Memory({ initial: 1 })

  const a = new Uint8Array(memory.buffer, 0, arraySize)
  const b = new Uint8Array(memory.buffer, arraySize, arraySize)
  const result = new Uint8Array(memory.buffer, 2 * arraySize, arraySize)

  for (let i = 0; i < arraySize; i++) {
    a[i] = Math.floor(Math.random() * 128)
    b[i] = Math.floor(Math.random() * 128)
  }
  console.log('a:', a.subarray(0, 4))
  console.log('b:', b.subarray(0, 4))

  for (let i = 0; i < arraySize; i++) {
    result[i] = a[i] + b[i]
  }
  console.log('result:', result.subarray(0, 4))

  result.fill(0)

  const { instance } = await WebAssembly.instantiate(
    fs.readFileSync('./simd.wasm'),
    {
      js: { memory },
    },
  )
  instance.exports.add(arraySize)
  console.log('result:', result.subarray(0, 4))
}

main()
