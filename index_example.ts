import { Huffman } from './index.ts'

const h = new Huffman()

const input = prompt('Enter text to compress')

if (input) {
  const encoded = h.encode(input)

  console.log(`Encoded: ${encoded}`)

  console.log(h.bitsSaved(input))
}
