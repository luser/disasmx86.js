function Register(name) {
  this.name = name;
}

Register.prototype = {
  toString: function(style) {
    style = style ? style : "att";
    if (style == "att")
      return "%" + this.name;
    return this.name;
  }
};

function Literal(value, size) {
  this.value = value;
  this.size = size;
}

Literal.prototype = {
  toString: function(style) {
    style = style ? style : "att";
    // format hex string first
    var v = this.value.toString(16);
    if (v.length < 2 * this.size) {
      // zero-pad to the left
      v = Array(2 * this.size - v.length + 1).join("0") + v;
    }
    // AT&T literals start with $0x
    if (style == "att") {
      return "$0x" + v;
    }
    // Intel literals must start with a digit
    if (!/[^\d]/.test(v)) {
      v = "0" + v;
    }
    // and end with h
    return v + "h";
  }
};

function Address(parts) {
  this.register = parts.register || null;
  this.displacement = parts.displacement || null;
};

Address.prototype = {
  toString: function(style)  {
    style = style ? style : "att";
    if (style == "att") {
      var val = "";
      if (this.displacement != null) {
        val = this.displacement.toString(style);
      }
      if (this.register != null) {
        val += "(" + this.register.toString(style) + ")";
      }
      return val;
    }
    return "";
  }
};

// General-purpose registers, indexed by operand size in bytes.
const gpregs = {
    1: [new Register("al"), new Register("cl"), new Register("dl"), new Register("bl"),
        new Register("ah"), new Register("ch"), new Register("dh"), new Register("bh")],
    2: [new Register("ax"), new Register("cx"), new Register("dx"), new Register("bx"),
        new Register("sp"), new Register("bp"), new Register("si"), new Register("di")],
    4: [new Register("eax"), new Register("ecx"), new Register("edx"), new Register("ebx"),
        new Register("esp"), new Register("ebp"), new Register("esi"), new Register("edi")]
};

// Segment registers.
const segregs = [new Register("es"), new Register("cs"), new Register("ss"),
                 new Register("ds"), new Register("fs"),new Register("gs")];

const prefix = {
    LOCK: 1,
    REPE: 2,
    REPNE: 3,
    SEGMENT_CS: 4,
    SEGMENT_SS: 5,
    SEGMENT_DS: 6,
    SEGMENT_ES: 7,
    SEGMENT_FS: 8,
    SEGMENT_GS: 9,
    OPERAND_SIZE: 10,
    ADDR_SIZE: 11
};

const tables = {
  MODRM: 0
};

const opcodes_x86 = {
    0x00: {name:"add",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x01: {name:"add",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x02: {name:"add",
           src_type: "E",
           src_size: "b",
           dest_type: "G",
           dest_size: "b"},
    0x03: {name:"add",
           src_type: "E",
           src_size: "v",
           dest_type: "G",
           dest_size: "v"},
    0x04: {name:"add",
           src_type:"I",
           src_size:"b",
           dest_type:"RR",
           dest_size:"b",
           dest:0},
    0x05: {name:"add",
           src_type:"I",
           src_size:"z",
           dest_type:"RR",
           dest_size:"z",
           dest:0},
    0x06: {name:"push",
           src_type: "RS",
           src:0},
    0x07: {name:"pop",
           src_type: "RS",
           src:0},
    0x08: {name:"or",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x09: {name:"or",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x0a: {name:"or",
           src_type: "E",
           src_size: "b",
           dest_type: "G",
           dest_size: "b"},
    0x0b: {name:"or",
           src_type: "E",
           src_size: "v",
           dest_type: "G",
           dest_size: "v"},
    0x0c: {name:"or",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:0},
    0x0d: {name:"or",
           src_type:"I",
           src_size:"z",
           dest_type:"RR",
           dest_size:"z",
           dest:0},
    0x0e: {name:"push",
           src_type: "RS",
           src:1},
    //0x0F XXX: two-byte opcodes
    0x10: {name:"adc",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x11: {name:"adc",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x12: {name:"adc",
           src_type: "E",
           src_size: "b",
           dest_type: "G",
           dest_size: "b"},
    0x13: {name:"adc",
           src_type: "E",
           src_size: "v",
           dest_type: "G",
           dest_size: "v"},
    0x14: {name:"adc",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:0},
    0x15: {name:"adc",
           src_type:"I",
           src_size:"z",
           dest_type:"RR",
           dest_size:"z",
           dest:0},
    0x16: {name:"push",
           src_type: "RS",
           src:2},
    0x17: {name:"pop",
           src_type: "RS",
           src:2},
    0x18: {name:"sbb",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x19: {name:"sbb",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x1a: {name:"sbb",
           src_type: "E",
           src_size: "b",
           dest_type: "G",
           dest_size: "b"},
    0x1b: {name:"sbb",
           src_type: "E",
           src_size: "v",
           dest_type: "G",
           dest_size: "v"},
    0x1c: {name:"sbb",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:0},
    0x1d: {name:"sbb",
           src_type:"I",
           src_size:"z",
           dest_type:"RR",
           dest_size:"z",
           dest:0},
    0x1E: {name:"push",
           src_type: "RS",
           src:3},
    0x1F: {name:"pop",
           src_type: "RS",
           src:3},
    0x20: {name:"and",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x21: {name:"and",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x22: {name:"and",
           src_type: "E",
           src_size: "b",
           dest_type: "G",
           dest_size: "b"},
    0x23: {name:"and",
           src_type: "E",
           src_size: "v",
           dest_type: "G",
           dest_size: "v"},
    0x24: {name:"and",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:0},
    0x25: {name:"and",
           src_type:"I",
           src_size:"z",
           dest_type:"RR",
           dest_size:"z",
           dest:0},
    //0x26 XXX: segment override prefix ES
    0x27: {name:"daa"},
    0x28: {name:"sub",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x29: {name:"sub",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x2a: {name:"sub",
           src_type: "E",
           src_size: "b",
           dest_type: "G",
           dest_size: "b"},
    0x2b: {name:"sub",
           src_type: "E",
           src_size: "v",
           dest_type: "G",
           dest_size: "v"},
    0x2c: {name:"sub",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:0},
    0x2d: {name:"sub",
           src_type:"I",
           src_size:"z",
           dest_type:"RR",
           dest_size:"z",
           dest:0},
    //0x2E XXX: segment override prefix CS
    0x2F: {name:"das"},
    0x30: {name:"xor",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x31: {name:"xor",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x32: {name:"xor",
           src_type: "E",
           src_size: "b",
           dest_type: "G",
           dest_size: "b"},
    0x33: {name:"xor",
           src_type: "E",
           src_size: "v",
           dest_type: "G",
           dest_size: "v"},
    0x34: {name:"xor",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:0},
    0x35: {name:"xor",
           src_type:"I",
           src_size:"z",
           dest_type:"RR",
           dest_size:"z",
           dest:0},
    //0x36 XXX: segment override prefix SS
    0x37: {name:"aaa"},
    0x38: {name:"cmp",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x39: {name:"cmp",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x3a: {name:"cmp",
           src_type: "E",
           src_size: "b",
           dest_type: "G",
           dest_size: "b"},
    0x3b: {name:"cmp",
           src_type: "E",
           src_size: "v",
           dest_type: "G",
           dest_size: "v"},
    0x3c: {name:"cmp",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:0},
    0x3d: {name:"cmp",
           src_type:"I",
           src_size:"z",
           dest_type:"RR",
           dest_size:"z",
           dest:0},
    //0x3E XXX: segment override prefix DS
    0x3f: {name:"aas"},
    0x40: {name:"inc",
           src_type: "RR",
           src_size: "v",
           src:0},
    0x41: {name:"inc",
           src_type: "RR",
           src_size: "v",
           src:1},
    0x42: {name:"inc",
           src_type: "RR",
           src_size: "v",
           src:2},
    0x43: {name:"inc",
           src_type: "RR",
           src_size: "v",
           src:3},
    0x44: {name:"inc",
           src_type: "RR",
           src_size: "v",
           src:4},
    0x45: {name:"inc",
           src_type: "RR",
           src_size: "v",
           src:5},
    0x46: {name:"inc",
           src_type: "RR",
           src_size: "v",
           src:6},
    0x47: {name:"inc",
           src_type: "RR",
           src_size: "v",
           src:7},
    0x48: {name:"dec",
           src_type: "RR",
           src_size: "v",
           src:0},
    0x49: {name:"dec",
           src_type: "RR",
           src_size: "v",
           src:1},
    0x4a: {name:"dec",
           src_type: "RR",
           src_size: "v",
           src:2},
    0x4b: {name:"dec",
           src_type: "RR",
           src_size: "v",
           src:3},
    0x4c: {name:"dec",
           src_type: "RR",
           src_size: "v",
           src:4},
    0x4d: {name:"dec",
           src_type: "RR",
           src_size: "v",
           src:5},
    0x4e: {name:"dec",
           src_type: "RR",
           src_size: "v",
           src:6},
    0x4f: {name:"dec",
           src_type: "RR",
           src_size: "v",
           src:7},
    0x50: {name:"push",
           src_type: "RR",
           src_size: "v",
           src:0},
    0x51: {name:"push",
           src_type: "RR",
           src_size: "v",
           src:1},
    0x52: {name:"push",
           src_type: "RR",
           src_size: "v",
           src:2},
    0x53: {name:"push",
           src_type: "RR",
           src_size: "v",
           src:3},
    0x54: {name:"push",
           src_type: "RR",
           src_size: "v",
           src:4},
    0x55: {name:"push",
           src_type: "RR",
           src_size: "v",
           src:5},
    0x56: {name:"push",
           src_type: "RR",
           src_size: "v",
           src:6},
    0x57: {name:"push",
           src_type: "RR",
           src_size: "v",
           src:7},
    0x58: {name:"pop",
           src_type: "RR",
           src_size: "v",
           src:0},
    0x59: {name:"pop",
           src_type: "RR",
           src_size: "v",
           src:1},
    0x5a: {name:"pop",
           src_type: "RR",
           src_size: "v",
           src:2},
    0x5b: {name:"pop",
           src_type: "RR",
           src_size: "v",
           src:3},
    0x5c: {name:"pop",
           src_type: "RR",
           src_size: "v",
           src:4},
    0x5d: {name:"pop",
           src_type: "RR",
           src_size: "v",
           src:5},
    0x5e: {name:"pop",
           src_type: "RR",
           src_size: "v",
           src:6},
    0x5f: {name:"pop",
           src_type: "RR",
           src_size: "v",
           src:7},
    0x60: {name:"pusha"},
    0x61: {name:"popa"},
    //0x62 BOUND Gv,Ma
    //0x63 ARPL Ew,Gw
    //0x64 XXX: segment override prefix FS
    //0x65 XXX: segment override prefix GS
    0x66: {prefix_type:prefix.OPERAND_SIZE},
    0x67: {prefix_type:prefix.ADDR_SIZE},
    0x68: {name:"push",
           src_type:"I",
           src_size:"z"},
    //0x69 IMUL Gv,Ev,Iz
    0x6a: {name:"push",
           src_type:"I",
           src_size:"b"},
    //0x6B IMUL Gv,Ev,Ib
    //0x6C INS Yb,DX
    //0x6D INS Yz,DX
    //0x6E OUTS DX,Xb
    //0x6F OUTS DX,Xz
    0x70: {name:"jo",
           src_type: "J",
           src_size: "b"},
    0x71: {name:"jno",
           src_type: "J",
           src_size: "b"},
    0x72: {name:"jb",
           src_type: "J",
           src_size: "b"},
    0x73: {name:"jnb",
           src_type: "J",
           src_size: "b"},
    0x74: {name:"jz",
           src_type: "J",
           src_size: "b"},
    0x75: {name:"jnz",
           src_type: "J",
           src_size: "b"},
    0x76: {name:"jbe",
           src_type: "J",
           src_size: "b"},
    0x77: {name:"jnbe",
           src_type: "J",
           src_size: "b"},
    0x78: {name:"js",
           src_type: "J",
           src_size: "b"},
    0x79: {name:"jns",
           src_type: "J",
           src_size: "b"},
    0x7a: {name:"jp",
           src_type: "J",
           src_size: "b"},
    0x7b: {name:"jnp",
           src_type: "J",
           src_size: "b"},
    0x7c: {name:"jl",
           src_type: "J",
           src_size: "b"},
    0x7d: {name:"jnl",
           src_type: "J",
           src_size: "b"},
    0x7e: {name:"jle",
           src_type: "J",
           src_size: "b"},
    0x7f: {name:"jnle",
           src_type: "J",
           src_size: "b"},
    0x80: { // group 1 Eb,Ib
      table_type:tables.MODRM,
      0x0: {name:"add",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x1: {name:"or",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x2: {name:"adc",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x3: {name:"sbb",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x4: {name:"and",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x5: {name:"sub",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x6: {name:"xor",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x7: {name:"cmp",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"}
    },
    0x81: { // group 1 Ev,Iz
      table_type:tables.MODRM,
      0x0: {name:"add",
            src_type: "I",
            src_size: "z",
            dest_type: "E",
            dest_size: "v"},
      0x1: {name:"or",
            src_type: "I",
            src_size: "z",
            dest_type: "E",
            dest_size: "v"},
      0x2: {name:"adc",
            src_type: "I",
            src_size: "z",
            dest_type: "E",
            dest_size: "v"},
      0x3: {name:"sbb",
            src_type: "I",
            src_size: "z",
            dest_type: "E",
            dest_size: "v"},
      0x4: {name:"and",
            src_type: "I",
            src_size: "z",
            dest_type: "E",
            dest_size: "v"},
      0x5: {name:"sub",
            src_type: "I",
            src_size: "z",
            dest_type: "E",
            dest_size: "v"},
      0x6: {name:"xor",
            src_type: "I",
            src_size: "z",
            dest_type: "E",
            dest_size: "v"},
      0x7: {name:"cmp",
            src_type: "I",
            src_size: "z",
            dest_type: "E",
            dest_size: "v"}
    },
    0x82: { // group 1 Eb,Ib
      table_type:tables.MODRM,
      0x0: {name:"add",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x1: {name:"or",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x2: {name:"adc",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x3: {name:"sbb",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x4: {name:"and",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x5: {name:"sub",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x6: {name:"xor",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"},
      0x7: {name:"cmp",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "b"}
    },
    0x83: { // group 1 Ev,Ib
      table_type:tables.MODRM,
      0x0: {name:"add",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "v"},
      0x1: {name:"or",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "v"},
      0x2: {name:"adc",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "v"},
      0x3: {name:"sbb",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "v"},
      0x4: {name:"and",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "v"},
      0x5: {name:"sub",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "v"},
      0x6: {name:"xor",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "v"},
      0x7: {name:"cmp",
            src_type: "I",
            src_size: "b",
            dest_type: "E",
            dest_size: "v"}
    },
    0x84: {name:"test",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x85: {name:"test",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x86: {name:"xchg",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x87: {name:"xchg",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x88: {name:"mov",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b"},
    0x89: {name:"mov",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v"},
    0x8a: {name:"mov",
           src_type: "E",
           src_size: "b",
           dest_type: "G",
           dest_size: "b"},
    0x8b: {name:"mov",
           src_type: "E",
           src_size: "v",
           dest_type: "G",
           dest_size: "v"},
    //0x8C MOV Mw,Sw / MOV Rv,Sw
    //0x8D LEA Gv,M
    //0x8E MOV Sw,Mw / MOV Sw,Rv
    //0x8F POP Ev
    0x90: {name:"nop"},
    0x91: {name:"xchg",
           src_type: "RR",
           src_size: "v",
           src:0,
           dest_type: "RR",
           dest_size: "v",
           dest:1},
    0x92: {name:"xchg",
           src_type: "RR",
           src_size: "v",
           src:0,
           dest_type: "RR",
           dest_size: "v",
           dest:2},
    0x93: {name:"xchg",
           src_type: "RR",
           src_size: "v",
           src:0,
           dest_type: "RR",
           dest_size: "v",
           dest:3},
    0x94: {name:"xchg",
           src_type: "RR",
           src_size: "v",
           src:0,
           dest_type: "RR",
           dest_size: "v",
           dest:4},
    0x95: {name:"xchg",
           src_type: "RR",
           src_size: "v",
           src:0,
           dest_type: "RR",
           dest_size: "v",
           dest:5},
    0x96: {name:"xchg",
           src_type: "RR",
           src_size: "v",
           src:0,
           dest_type: "RR",
           dest_size: "v",
           dest:6},
    0x97: {name:"xchg",
           src_type: "RR",
           src_size: "v",
           src:0,
           dest_type: "RR",
           dest_size: "v",
           dest:7},
    //0x98 CBW/CWDE
    //0x99 CWD/CDQ
    //0x9A CALL Ap
    0x9b: {name:"fwait"},
    0x9c: {name:"pushf"},
    0x9d: {name:"popf"},
    0x9e: {name:"sahf"},
    0x9f: {name:"lahf"},
    //0xA0 MOV AL,Ob
    //0xA1 MOV rAX,Ov
    //0xA2 MOV Ob,AL
    //0xA3 MOV Ov,rAX
    //0xA4 MOVS Yb,Xb
    //0xA5 MOVS Yv,Xv
    //0xA6 CMPS Yb,Xb
    //0xA7 CMPS Yv,Xv
    0xa8: {name:"test",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:0},
    0xa9: {name:"test",
           src_type:"I",
           src_size:"z",
           dest_type:"RR",
           dest_size:"z",
           dest:0},
    //0xAA STOS Yb,AL
    //0xAB STOS Yv,rAX
    //0xAC LODS AL,Xb
    //0xAD LODS rAX,Xv
    //0xAE SCAS Yb,AL
    //0xAF SCAS Yv,rAX
    0xb0: {name:"mov",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:0},
    0xb1: {name:"mov",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:1},
    0xb2: {name:"mov",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:2},
    0xb3: {name:"mov",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:3},
    0xb4: {name:"mov",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:4},
    0xb5: {name:"mov",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:5},
    0xb6: {name:"mov",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:6},
    0xb7: {name:"mov",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:7},
    0xb8: {name:"mov",
           src_type: "I",
           src_size: "v",
           dest_type: "RR",
           dest_size: "v",
           dest:0},
    0xb9: {name:"mov",
           src_type: "I",
           src_size: "v",
           dest_type: "RR",
           dest_size: "v",
           dest:1},
    0xba: {name:"mov",
           src_type: "I",
           src_size: "v",
           dest_type: "RR",
           dest_size: "v",
           dest:2},
    0xbb: {name:"mov",
           src_type: "I",
           src_size: "v",
           dest_type: "RR",
           dest_size: "v",
           dest:3},
    0xbc: {name:"mov",
           src_type: "I",
           src_size: "v",
           dest_type: "RR",
           dest_size: "v",
           dest:4},
    0xbd: {name:"mov",
           src_type: "I",
           src_size: "v",
           dest_type: "RR",
           dest_size: "v",
           dest:5},
    0xbe: {name:"mov",
           src_type: "I",
           src_size: "v",
           dest_type: "RR",
           dest_size: "v",
           dest:6},
    0xbf: {name:"mov",
           src_type: "I",
           src_size: "v",
           dest_type: "RR",
           dest_size: "v",
           dest:7},
    //0xC0 group 2 Eb,Ib
    //0xC1 group 2 Ev,Ib
    0xc2: {name:"ret",
           src_type:"I",
           src_size:"w"},
    0xc3: {name:"ret"},
    //0xC4 LES Gz,Mp
    //0xC5 LDS Gz,Mp
    //0xC6 group 12 Eb,Ib
    //0xC7 group 12 Ev,Iz
    //0xC8 ENTER Iw,Ib
    0xc9: {name:"leave"},
    0xca: {name:"lret",
           src_type:"I",
           src_size:"w"},
    0xcb: {name:"lret"},
    0xcc: {name:"int3"},
    0xcd: {name:"int",
           src_type:"I",
           src_size:"b"},
    0xce: {name:"into"},
    0xcf: {name:"iret"},
    //0xD0 group 2 Eb,1
    //0xD1 group 2 Ev,1
    //0xD2 group 2 Eb,CL
    //0xD3 group 2 Ev,CL
    //0xD4 AAM Ib
    //0xD5 AAD Ib
    0xd6: {name:"salc"},
    //0xD7 XLAT
    //0xD8 FPU ESC 0
    //0xD9 FPU ESC 1
    //0xDA FPU ESC 2
    //0xDB FPU ESC 3
    //0xDC FPU ESC 4
    //0xDD FPU ESC 5
    //0xDE FPU ESC 6
    //0xDF FPU ESC 7
    //0xE0 LOOPNE/LOOPNZ Jb
    //0xE1 LOOPE/LOOPZ Jb
    //0xE2 LOOP Jb
    //0xE3 JCXZ/JECX Jb
    0xe4: {name:"in",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "b",
           dest:0},
    0xe5: {name:"in",
           src_type: "I",
           src_size: "b",
           dest_type: "RR",
           dest_size: "v",
           dest:0},
    0xe6: {name:"out",
           src_type: "RR",
           src_size: "b",
           dest_type: "I",
           dest_size: "b",
           src:0},
    0xe7: {name:"out",
           src_type: "RR",
           src_size: "v",
           dest_type: "I",
           dest_size: "b",
           src:0},
    0xe8: {name:"call",
           src_type: "J",
           src_size: "z"},
    0xe9: {name:"jmp",
           src_type: "J",
           src_size: "z"},
/*TODO: handle this properly
    0xea: {name:"jmp",
           src_type: "A",
           src_size: "z"},*/
    0xeb: {name:"jmp",
           src_type: "J",
           src_size: "b"},
    0xec: {name:"in",
           src_type: "RR",
           src_size: "w",
           dest_type: "RR",
           dest_size: "b",
           src:2,
           dest:0},
    0xed: {name:"in",
           src_type: "RR",
           src_size: "w",
           dest_type: "RR",
           dest_size: "v",
           src:2,
           dest:0},
    0xee: {name:"out",
           src_type: "RR",
           src_size: "b",
           dest_type: "RR",
           dest_size: "w",
           src:0,
           dest:2},
    0xef: {name:"out",
           src_type: "RR",
           src_size: "v",
           dest_type: "RR",
           dest_size: "w",
           src:0,
           dest:2},
    //0xF0 LOCK prefix
    0xf1: {name:"icebp"},
    //0xF2 REPNE prefix
    //0xF3 REP/REPE prefix
    0xf4: {name:"hlt"},
    0xf5: {name:"cmc"},
    //0xF6 group 3 Eb
    //0xF7 group 3 Ev
    0xf8: {name:"clc"},
    0xf9: {name:"stc"},
    0xfa: {name:"cli"},
    0xfb: {name:"sti"},
    0xfc: {name:"cld"},
    0xfd: {name:"std"}
    //0xFE group 4 INC/DEC
    //0xFF group 5 INC/DEC/...
};

/*
 * Decode x86 instruction prefixes from |bytes| starting at |offset|.
 * Set the prefix information in |config|. Return the number of bytes
 * decoded.
 */
function handle_prefixes(bytes, offset, config, default_size) {
    var count = 0;
    while (count < 4 && offset < bytes.length) {
        var pb = bytes[offset++];
        if (!(pb in opcodes_x86))
            break;

        var p = opcodes_x86[pb];
        if (!p.prefix_type)
            break;

        count++;
        switch (p.prefix_type) {
        case prefix.LOCK:
            config.lock = true;
            break;
        case prefix.REPE:
        case prefix.REPNE:
            //TODO
            break;
        case prefix.SEGMENT_CS:
        case prefix.SEGMENT_SS:
        case prefix.SEGMENT_DS:
        case prefix.SEGMENT_ES:
        case prefix.SEGMENT_FS:
        case prefix.SEGMENT_GS:
            //TODO
            break;
        case prefix.OPERAND_SIZE:
            //TODO: handle 64-bit
            config.op_size = default_size == 4 ? 2 : 4;
            break;
        case prefix.ADDR_SIZE:
            config.addr_size = default_size == 4 ? 2 : 4;
            break;
        }
    }
    return count;
}

/*
 * Fetch |count| bytes from |bytes| at |offset| and return the value as a little-endian
 * integer.
 */
function fetch_bytes(count, bytes, offset) {
    if (offset + count > bytes.length)
        throw new Error("Ran out of bytes!");
  var val = 0;
  for (var i = 0; i < count; i++) {
    val |= (bytes[offset + i] << (8 * i));
  }
  return val;
}

/*
 * Given a register value |reg|, return the register name
 * according to the operand size as defined in the opcode
 * definition |opsize| and the current |config|.
 */
function decode_register(reg, opsize, config) {
    var size;
    switch (opsize) {
    case "b":
        size = 1;
        break;
    case "w":
        size = 2;
        break;
    case "d":
        size = 4;
        break;
    case "q":
        size = 8;
        break;
    case "v":
    case "z": //XXX?
        size = config.op_size;
        break;
    }
    return gpregs[size][reg];
}

function modrm_mod(modrm) {
  return (modrm & 0xc0) >> 6;
}

function modrm_reg(modrm) {
  return (modrm & 0x38) >> 3;
}

function modrm_rm(modrm) {
  return modrm & 0x7;
}

/*
 * Decode the Mod R/M byte in |op_bytes|. |which| can be "reg" or "rm".
 * |opsize| is the operand size defined for the current instruction.
 */
function decode_modrm(op_bytes, which, opsize, config) {
    var mod = modrm_mod(op_bytes.modrm);
    var reg = modrm_reg(op_bytes.modrm);
    var rm = modrm_rm(op_bytes.modrm);
    switch (which) {
    case "reg":
        return decode_register(reg, opsize, config);
    case "rm":
        if (rm == 4 && mod != 3) {
          // SIB mode
        }
        else {
          switch (mod) {
          case 0: // register-indirect addressing
            if (rm == 5) {
              // 4-byte displacement only
              return new Address({displacement: new Literal(op_bytes.displacement,
                                                            op_bytes.displacement_size)});
            }
            
            return new Address({register: decode_register(rm, opsize, config)});
          case 1: // register-indirect + 1 byte displacement
          case 2: // register-indirect + 4 byte displacement
            return new Address({register: decode_register(rm, opsize, config),
                                displacement: new Literal(op_bytes.displacement,
                                                          op_bytes.displacement_size)});
          case 3: // register-only addressing
            return decode_register(rm, opsize, config);
            break;
          }
        }
        break;
    }
    return null;
}

/*
 * Handle a single operand for an instruction.
 * Return the number of additional bytes consumed.
 */
function handle_operand(insn, insn_ret, operand, op_bytes, config) {
    //console.log(insn[operand + "_type"]);
    switch (insn[operand + "_type"]) {
    case null:
        // no argument
        break;
    case "RR":
        // general-purpose register encoded in opcode
        insn_ret[operand] = decode_register(insn[operand], insn[operand + "_size"], config);
        break;
    case "RS":
        // segment register encoded in opcode
        insn_ret[operand] = segregs[insn[operand]];
        break;
    case "E":
        // mod R/M byte, general-purpose register or memory address
        insn_ret[operand] = decode_modrm(op_bytes, 'rm', insn[operand + "_size"], config);
        break;
    case "G":
        // R/M byte, general-purpose register
        insn_ret[operand] = decode_modrm(op_bytes, 'reg', insn[operand + "_size"], config);
        break;
    case "A":
    case "I":
    case "J": //XXX: offset relative to instruction pointer!
        // Immediate data
        insn_ret[operand] = new Literal(op_bytes.immediate, op_bytes.immediate_size);
        break;
    }
}

/*
 * Handle multi-byte instruction table lookup.
 * Return 
 */
function handle_subtable(table, config, bytes, offset) {
  var size = 0;
  var index;
  switch (table.table_type) {
  case tables.MODRM:
    var modrm = fetch_bytes(1, bytes, offset);
    // Don't increment size because handle_op_bytes will consume the Mod R/M byte.
    index = modrm_reg(modrm);
    break;
  }
  return [table[index], size];
}

/*
 * Fetch all the extra bytes needed to decode this opcode,
 * including the Mod R/M byte, any displacement bytes, the SIB byte,
 * and any immediate bytes. Return the number of bytes fetched.
 */
function handle_op_bytes(insn, op_bytes, config, bytes, offset) {
  var modrm = false, immediate_size = 0;
  var size = 0;
  var operands = ["dest","src","aux"];
  for (var i=0; i<operands.length; i++) {
    switch (insn[operands[i] + "_type"]) {
    case "C":
    case "D":
    case "E":
    case "G":
    case "M":
    case "P":
    case "PR":
    case "R":
    case "S":
    case "T":
    case "V":
    case "VR":
    case "W":
      modrm = true;
      break;
    case "A":
    case "I":
    case "J":
      switch (insn[operands[i] + "_size"]) {
      case "b":
        immediate_size = 1;
        break;
      case "w":
        immediate_size = 2;
        break;
      case "d":
        immediate_size = 4;
        break;
      case "q":
        immediate_size = 8;
        break;
      case "o":
        immediate_size = 16;
        break;
      case "v":
      case "z": //XXX: dword, not qword!
        if (insn[operands[i] + "_type"] == "I") {
          immediate_size = config.op_size;
        }
        else {
          immediate_size = config.addr_size;
        }
        break;
      }
      break;
    }
  }
  // Handle Mod R/M byte + SIB + displacement
  if (modrm) {
    op_bytes.modrm = fetch_bytes(1, bytes, offset);
    offset++;
    size++;
    var mod = modrm_mod(op_bytes.modrm);
    var rm = modrm_rm(op_bytes.modrm);
    // SIB
    if (rm == 4 && mod != 3) {
      op_bytes.sib = fetch_bytes(1, bytes, offset);
      offset++;
      size++;
    }
    switch (mod) {
    case 0:
      // register-indirect addressing (or 4-byte only)
      if (rm == 5) {
        //XXX: displacement is signed
        op_bytes.displacement_size = 4;
        op_bytes.displacement = fetch_bytes(4, bytes, offset);
        offset += 4;
        size += 4;
      }
      break;
    case 1:
      //XXX: displacement is signed
      op_bytes.displacement_size = 1;
      op_bytes.displacement = fetch_bytes(1, bytes, offset);
      offset++;
      size++;
      break;
    case 2:
      //XXX: displacement is signed
      op_bytes.displacement_size = 4;
      op_bytes.displacement = fetch_bytes(4, bytes, offset);
      offset += 4;
      size += 4;
      break;
    case 3:
      // register addressing
      break;
    }
  }
  // Handle immediate bytes
  if (immediate_size > 0) {
    op_bytes.immediate_size = immediate_size;
    op_bytes.immediate = fetch_bytes(immediate_size, bytes, offset);
    offset += immediate_size;
    size += immediate_size;
  }
  return size;
}

/*
 * Disassemble a single instruction starting at bytes[offset].
 * Returns [instruction, instruction size].
 */
function disassemble_x86_instruction(bytes, offset) {
    if (bytes.length <= offset || offset < 0) {
        return [null, 0];
    }
    var length = 1;
    var config = {addr_size:4, op_size:4, lock:false, strops: null, segment:null};
    var size = handle_prefixes(bytes, offset, config, 4);
    offset += size;
    var op = bytes[offset];
    if (op in opcodes_x86) {
        var insn = opcodes_x86[op];
        size++;
        offset++;
        if (insn.prefix) {
            // error, too many prefixes?
            return [null, size];
        }
        if ('table_type' in insn) {
          // subtable lookup for multi-byte opcodes
          var ret = handle_subtable(insn, config, bytes, offset);
          insn = ret[0];
          size += ret[1];
          offset += ret[1];
        }
        // Handle mod/rm, displacement, sib, immediate bytes all at once
        var op_bytes = {};
        size += handle_op_bytes(insn, op_bytes, config, bytes, offset);
        var insn_ret = {name:insn.name, config:config};
        var operands = ["dest","src","aux"];
        for (var i=0; i<operands.length; i++) {
            handle_operand(insn, insn_ret, operands[i], op_bytes, config);
        }
        return [insn_ret, size];
    }
    else {
        // Unknown
        return [null, 1];
    }
}

/*
 * Disassemble a single instruction starting at bytes[offset].
 * Format the instruction bytes + mnemonics.
 * Returns [bytes string, mnemonic string, instruction size].
 */
function disassemble_and_format_x86_instruction(bytes, offset) {
    var dis = disassemble_x86_instruction(bytes, offset);
    // format bytes
    var len = dis[1];
    var format_bytes = ["  ","  ","  ","  ","  "];
    for (var i = 0; i < len; i++) {
        var b = bytes[offset + i].toString(16);
        format_bytes[i] = b.length == 1 ? "0" + b : b;
    }
    var insn = dis[0];
    var mnemonic;
    if (insn == null) {
        mnemonic = "??";
    }
    else {
        mnemonic = insn.name;
        if (insn.src) {
            mnemonic += " ";
            if (insn.dest) {
                //TODO: handle Intel syntax as well
                mnemonic += insn.src+","+insn.dest;
            }
            else {
                mnemonic += insn.src;
            }
        }
    }
    return [format_bytes.join(" "), mnemonic, len];
}

/*
 * Disassemble |count| instructions from |memory| starting at |start_address|.
 * Return a string with one instruction per line, formatted like:
 * <address>: <bytes> <mnemonics>
 */
function disassemble_memory(memory, start_address, count) {
    var ret = [];
    //XXX: handle 64-bit offsets?
    var offset = start_address.minus(memory.startAddress).lo;
    for (var i = 0; i < count; i++) {
        var dis = disassemble_and_format_x86_instruction(memory.bytes, offset);
        ret.push(memory.startAddress.plus(new Uint64(offset)).toString() + " " +
                 dis[0] + " " + dis[1]);
        offset += dis[2];
    }
    return ret.join("\n");
}
