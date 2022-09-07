# huffman-deno

Super simple implementation of the [Huffman algorithm](https://www.programiz.com/dsa/huffman-coding) in Deno.

## Requirements

[Deno 1.25+](https://deno.land/manual@v1.25.1/getting_started/installation).

## Example

```ts
import { Huffman } from 'https://denopkg.com/talentlessguy/huffman/index.ts'

const h = new Huffman()

const encoded = h.encode('Hello World')

const decoded = h.decode(encoded)
```
