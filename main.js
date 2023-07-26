// @ts-check

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

const registers = [0, 0, 0, 0]

const stack = []

let currentAddr = 0
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
  currentAddr = addr
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

const instructions = new Map([
  [10, movr],
  [11, movv],
  [20, add],
  [21, sub],
  [30, push],
  [31, pop],
  [40, jp],
  [41, jl],
  [42, call],
  [50, ret],
  [60, print],
  [255, halt],
])

const readProgram = () => {
  while (currentAddr < program.length && !shouldHalt) {
    const instruction = program[currentAddr]
    const fnInstruction = instructions.get(instruction)
    currentAddr += 1

    const expectedTotalArgs = (fnInstruction?.length || 0)
    const args = program.slice(currentAddr, currentAddr + expectedTotalArgs + 1)
    currentAddr += expectedTotalArgs 

    fnInstruction?.apply(this, args)
  }
}

readProgram()