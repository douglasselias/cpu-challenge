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

function executeCode(filePath) {
  const registers = [0, 0, 0, 0]
  const stack = []

  let currentAddress = 0
  let shouldHalt = false

  const movr = (reg_dst, reg_src) => {
    registers[reg_dst] = registers[reg_src]
  }

  const movv = (reg_dst, value) => {
    registers[reg_dst] = value
  }

  const add = (reg_dst, reg_src) => {
    registers[reg_dst] += registers[reg_src]
  }

  const sub = (reg_dst, reg_src) => {
    registers[reg_dst] -= registers[reg_src]
  }

  const push = (reg_src) => {
    stack.push(registers[reg_src])
  }

  const pop = (reg_dst) => {
    registers[reg_dst] = stack.pop()
  }

  const jp = (addr) => {
    currentAddress = addr
  }

  const jl = (reg_1, reg_2, addr) => {
    if (registers[reg_1] < registers[reg_2])
      jp(addr)
  }

  const call = (addr) => {
    stack.push(addr)
    jp(addr)
  }

  const ret = () => {
    jp(stack.pop())
  }

  const print = (reg) => {
    console.log(registers[reg])
  }

  const halt = () => {
    shouldHalt = true
  }

  const instructions = {
    10: movr,
    11: movv,
    20: add,
    21: sub,
    30: push,
    31: pop,
    40: jp,
    41: jl,
    42: call,
    50: ret,
    60: print,
    255: halt,
  }

  const program = assemble(filePath)

  while (currentAddress < program.length && !shouldHalt) {
    const fnInstruction = instructions.get(program[currentAddress])
    currentAddress += 1

    const expectedTotalArgs = (fnInstruction?.length || 0)
    const args = program.slice(currentAddress, currentAddress + expectedTotalArgs + 1)
    currentAddress += expectedTotalArgs

    fnInstruction?.apply(this, args)
  }
}

executeCode("main.asm")