/**
 * Huffman encoding and decoding implementation in JavaScript
 *
 * by Pavel Losev
 *
 * Used articles:
 * - https://www.programiz.com/dsa/huffman-coding
 * - https://levelup.gitconnected.com/how-to-traverse-a-tree-using-javascript-c9a79826e819
 */

type Freq = [string | [Freq, Freq], number]

type Codes = Map<string, string>

/* UTILITIES */

// Count how many times a character is in the string
const countFrequency = (input: string) => {
  const freq: Record<string, number> = {}

  for (const char of input) freq[char] = freq[char] ? freq[char] + 1 : 1

  return Object.entries(freq).sort((a, b) => a[1] - b[1]) // Sort by ascending
}

// Create a tree-like nested array of frequencies
const freqsToArrayTree = (_table: Freq[]): Freq => {
  const table = _table // Copy table variable to make function pure
  while (table.length > 1) {
    // While the array has more than element, transform elements to sub-arrays
    const first = table.shift()! // take first element
    const second = table.shift()! // take second element
    table.unshift([[first, second], first[1] + second[1]]) // create a sub-array with those elements and their sum
    table.sort((a, b) => a[1] - b[1]) // sort by ascending on every iteration
  }
  return table[0]
}

// Remove frequencies (we don't need them anymore) from the nested array and flatten it by one level recursively
// [[[[["A", 1], ["B", 2]], 3], ["C", 3]], 6] -> [ ['A', 'B'], 'C']
const stripFreqs = ([item]: Freq): [string, string] | string => {
  /* [['A', 1], ['B', 2], 3] ->  ['A', 1] -> 'A' -> ['A', 'B']
                             ->  ['B', 2] -> 'B'
    */
  if (Array.isArray(item)) return [stripFreqs(item[0]), stripFreqs(item[1])] as [string, string]

  return item // if first item is a symbol (string), just return it ['A', 1] -> 'A'
}

class Node {
  right?: Node
  left?: Node
  /**
   * node with a symbol is a leaf node
   */
  symbol?: string
  constructor({ symbol, right, left }: { left?: Node; right?: Node; symbol?: string }) {
    this.symbol = symbol
    this.left = left
    this.right = right
  }
}
/*
Create a node tree from a tree-like array
*/
const buildTree = (el: [string, string] | string) => {
  const node = new Node({})

  // if an array element has nested arrays, make them siblings of a node
  if (Array.isArray(el)) {
    node.left = buildTree(el[0])
    node.right = buildTree(el[1])
  }
  // if an element is a symbol, store it in the node
  else node.symbol = el

  return node // return a generated tree
}

/* MAIN FUNCTIONS */

/*
Create a node tree and symbol codes from a string
*/
const nodeTreeFromString = (input: string) => {
  const table = countFrequency(input) as Freq[]
  const cleanTable = stripFreqs(freqsToArrayTree(table))
  const tree = buildTree(cleanTable)
  const codes: Codes = new Map() // Maps are faster than objects (see: https://www.zhenghao.io/posts/object-vs-map)

  /**
   * Traverse the node tree (in preorder deep-first search method) and create a binary code for each symbol
   */
  const findSymbolCodes = (n: Node, c = ''): void => {
    if (n.symbol) {
      // leaf node, nodes with siblings have no symbol stored
      codes.set(n.symbol, c)
      return
    }
    if (n.left) findSymbolCodes(n.left, c + '0')
    if (n.right) findSymbolCodes(n.right, c + '1')
  }

  findSymbolCodes(tree)

  return { codes, tree }
}

export class Huffman {
  tree?: Node
  codes?: Codes
  input?: string

  encode(input: string) {
    const { tree, codes } = nodeTreeFromString(input)
    this.tree = tree
    this.codes = codes
    let out = ''
    for (const char of input) out += this.codes.get(char)
    return out
  }
  decode(input: string) {
    let node: Node = this.tree!
    let decoded = ''
    for (const char of input) {
      node = node[char === '0' ? 'left' : 'right']! // if symbol is zero, go to left child, otherwise to right

      if (!node.left && !node.right) {
        // if node is leaf, append a character to the output
        decoded += node.symbol
        node = this.tree!
      }
    }
    return decoded
  }
  bitsSaved(input: string) {
    return input.length * 8 - this.encode(input).length
  }
}
