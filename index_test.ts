import { assertEquals, assert } from 'https://deno.land/std@0.154.0/testing/asserts.ts'
import { Huffman } from './index.ts'

const sampleText = `
The Industrial Revolution and its consequences have been a disaster for the human race.
They have greatly increased the life-expectancy of those of us who live in “advanced” countries, but they have destabilized society, have made life unfulfilling, have subjected human beings to indignities, have led to widespread psychological suffering (in the Third World to physical suffering as well) and have inflicted severe damage on the natural world.
The continued development of technology will worsen the situation.
It will certainly subject human beings to greater indignities and inflict greater damage on the natural world, it will probably lead to greater social disruption and psychological suffering, and it may lead to increased physical suffering even in “advanced” countries.
`

Deno.test('Should work on small strings', () => {
  const h = new Huffman()
  const strings = ['Hello World', '@!#``3', '漢字', sampleText]

  for (const str of strings) {
    assertEquals(h.decode(h.encode(str)), str)
  }
})

Deno.test('Should show saved bytes', () => {
  const h = new Huffman()

  assert(h.bitsSaved('Hello World') > 0)
})

Deno.test('Should show saved bytes on big text', () => {
  const h = new Huffman()

  assert(h.bitsSaved(sampleText) > 0)
})
