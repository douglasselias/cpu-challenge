// @ts-check

const fs = require("fs")

function assemble(filePath) {
  const instructions = {
    'movr': 10,
    'movv': 11,
    'add': 20,
    'sub': 21,
    'push': 30,
    'pop': 31,
    'jp': 40,
    'jl': 41,
    'call': 42,
    'ret': 50,
    'print': 60,
    'halt': 255,
  }

  const parsedTokens = []
  const lines = fs.readFileSync(filePath).toString().trim().split("\n")

  for (const line of lines) {
    const tokens = line.trim().replace(/,/g, " ").toLowerCase().split(/\s+/g)
    console.log(tokens)

    for (const token of tokens) {
      const isRegister = token.length == 2 && token.slice(0, 1) == 'r'
      const instruction = instructions[token]

      if (isRegister) parsedTokens.push(parseInt(token.slice(1)))
      else if (instruction) parsedTokens.push(instruction)
      else parsedTokens.push(parseInt(token))
    }
  }

  return parsedTokens
}

// assemble("main.asm")
console.log(assemble("main.asm"))


const program = [
  11, 0, 10,
  42, 6,
  255,
  30, 0,
  11, 0, 0,
  11, 1, 1,
  11, 3, 1,
  60, 1,
  10, 2, 0,
  20, 2, 1,
  60, 2,
  10, 0, 1,
  10, 1, 2,
  11, 2, 1,
  20, 3, 2,
  31, 2,
  30, 2,
  41, 3, 2, 19,
  31, 0,
  50
]

const a = assemble("main.asm")
program.forEach((n,i) => {
  if(n !== a[i]) console.error('wrong')
})