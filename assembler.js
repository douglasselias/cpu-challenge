// @ts-check

const fs = require("fs")

const code = fs.readFileSync("main.asm").toString()

const instructions = new Map([
  ['movr', 10],
  ['movv', 11],
  ['add', 20],
  ['sub', 21],
  ['push', 30],
  ['pop', 31],
  ['jp', 40],
  ['jl', 41],
  ['call', 42],
  ['ret', 50],
  ['print', 60],
  ['halt', 255],
])

const parseLine = (line) => {
  const tokens = line.split(/\s+/g).map(token => token.replace(",", "").trim()).filter(token => token.length > 0)
  return tokens
    .map(token => {
      const instruction = instructions.get(token.toLowerCase())
      if (instruction) return instruction
      if (token.includes("R")) return token.slice(1)
      return token
    })
    .map(token => parseInt(token))
}

const program = code.split("\n").flatMap(line => {
  return parseLine(line)
})

console.log(program)