const gpregs = {
    1: ["%al", "%cl", "%dl", "%bl", "%ah", "%ch", "%dh", "%bh"],
    2: ["%ax", "%cx", "%dx", "%bx", "%sp", "%bp", "%si", "%di"],
    4: ["%eax", "%ecx", "%edx", "%ebx", "%esp", "%ebp", "%esi", "%edi"]
};

const segregs = ["%es","%cs","%ss","%ds","%fs","%fs"];

const flags = {
    PREFIX_LOCK: 1,
    PREFIX_REPE: 2,
    PREFIX_REPNE: 3,
    PREFIX_SEGMENT_CS: 4,
    PREFIX_SEGMENT_SS: 5,
    PREFIX_SEGMENT_DS: 6,
    PREFIX_SEGMENT_ES: 7,
    PREFIX_SEGMENT_FS: 8,
    PREFIX_SEGMENT_GS: 9,
    PREFIX_OPERAND_SIZE: 10,
    PREFIX_ADDR_SIZE: 11
};

const opcodes_x86 = {
    0x00: {name:"add",
           src_type: "E",
           src_size: "b",
           dest_type: "G",
           dest_size: "b",
           aux_type: null},
    0x01: {name:"add",
           src_type: "E",
           src_size: "v",
           dest_type: "G",
           dest_size: "v",
           aux_type: null},
    0x02: {name:"add",
           src_type: "G",
           src_size: "b",
           dest_type: "E",
           dest_size: "b",
           aux_type: null},
    0x03: {name:"add",
           src_type: "G",
           src_size: "v",
           dest_type: "E",
           dest_size: "v",
           aux_type: null},
    //0x04 ADD AL,Ib
    //0x05 ADD rAX,Iz
    0x06: {name:"push",
           dest_type: null,
           src_type: "RS",
           aux_type: null,
           dest: 0, src:0},
    0x07: {name:"pop",
           dest_type: null,
           src_type: "RS",
           aux_type: null,
           dest: 0, src:0},
    //0x08 OR Eb,Gb
    //0x09 OR Ev,Gv
    //0x0A OR Gb,Eb
    //0x0B OR Gv,Ev
    //0x0C OR AL,Ib
    //0x0D OR rAX,Iz
    //0x0E PUSH CS
    //0x0F XXX: two-byte opcodes
    //0x10 ADC Eb,Gb
    //0x11 ADC Ev,Gv
    //0x12 ADC Gb,Eb
    //0x13 ADC Gv,Ev
    //0x14 ADC AL,Ib
    //0x15 ADC rAX,Iz
    //0x16 PUSH SS
    //0x17 POP SS
    //0x18 SBB Eb,Gb
    //0x19 SBB Ev,Gv
    //0x1A SBB Gb,Eb
    //0x1B SBB Gv,Ev
    //0x1C SBB AL,Ib
    //0x1D SBB rAX,Iz
    //0x1E PUSH DS
    //0x1F POP DS
    //0x20 AND Eb,Gb
    //0x21 AND Ev,Gv
    //0x22 AND Gb,Eb
    //0x23 AND Gv,Ev
    //0x24 AND AL,Ib
    //0x25 AND rAX,Iz
    //0x26 XXX: segment override prefix ES
    //0x27 DAA
    //0x28 SUB Eb,Gb
    //0x29 SUB Ev,Gv
    //0x2A SUB Gb,Eb
    //0x2B SUB Gv,Ev
    //0x2C SUB AL,Ib
    //0x2D SUB rAX,Iz
    //0x2E XXX: segment override prefix CS
    //0x2F DAS
    //0x30 XOR Eb,Gb
    //0x31 XOR Ev,Gv
    //0x32 XOR Gb,Eb
    //0x33 XOR Gv,Ev
    //0x34 XOR AL,Ib
    //0x35 XOR rAX,Iz
    //0x36 XXX: segment override prefix SS
    //0x37 AAA
    //0x38 CMP Eb,Gb
    //0x39 CMP Ev,Gv
    //0x3A CMP Gb,Eb
    //0x3B CMP Gv,Ev
    //0x3C CMP AL,Ib
    //0x3D CMP rAX,Iz
    //0x3E XXX: segment override prefix DS
    //0x3F AAS
    0x40: {name:"inc",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:0, aux:0},
    0x41: {name:"inc",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:1, aux:0},
    0x42: {name:"inc",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:2, aux:0},
    0x43: {name:"inc",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:3, aux:0},
    0x44: {name:"inc",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:4, aux:0},
    0x45: {name:"inc",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:5, aux:0},
    0x46: {name:"inc",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:6, aux:0},
    0x47: {name:"inc",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:7, aux:0},
    0x48: {name:"dec",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:0, aux:0},
    0x49: {name:"dec",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:1, aux:0},
    0x4a: {name:"dec",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:2, aux:0},
    0x4b: {name:"dec",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:3, aux:0},
    0x4c: {name:"dec",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:4, aux:0},
    0x4d: {name:"dec",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:5, aux:0},
    0x4e: {name:"dec",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:6, aux:0},
    0x4f: {name:"dec",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:7, aux:0},
    0x50: {name:"push",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:0, aux:0},
    0x51: {name:"push",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:1, aux:0},
    0x52: {name:"push",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:2, aux:0},
    0x53: {name:"push",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:3, aux:0},
    0x54: {name:"push",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:4, aux:0},
    0x55: {name:"push",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:5, aux:0},
    0x56: {name:"push",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:6, aux:0},
    0x57: {name:"push",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:7, aux:0},
    0x58: {name:"pop",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:0, aux:0},
    0x59: {name:"pop",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:1, aux:0},
    0x5a: {name:"pop",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:2, aux:0},
    0x5b: {name:"pop",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:3, aux:0},
    0x5c: {name:"pop",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:4, aux:0},
    0x5d: {name:"pop",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:5, aux:0},
    0x5e: {name:"pop",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:6, aux:0},
    0x5f: {name:"pop",
           dest_type: null,
           src_type: "RR",
           aux_type: null,
           dest: 0, src:7, aux:0},
    //0x60 PUSHA[D]
    //0x61 POPA[D]
    //0x62 BOUND Gv,Ma
    //0x63 ARPL Ew,Gw
    //0x64 XXX: segment override prefix FS
    //0x65 XXX: segment override prefix GS
    0x66: {prefix:true,
           prefix_type:flags.PREFIX_OPERAND_SIZE},
    0x67: {prefix:true,
           prefix_type:flags.PREFIX_ADDR_SIZE},
    //0x68 PUSH Iz
    //0x69 IMUL Gv,Ev,Iz
    //0x6A PUSH Ib
    //0x6B IMUL Gv,Ev,Ib
    //0x6C INS Yb,DX
    //0x6D INS Yz,DX
    //0x6E OUTS DX,Xb
    //0x6F OUTS DX,Xz
    //0x70 JO Jb
    //0x71 JNO Jb
    //0x72 JB Jb
    //0x73 JNB Jb
    //0x74 JZ Jb
    //0x75 JNZ Jb
    //0x76 JBE Jb
    //0x77 JNBE Jb
    //0x78 JS Jb
    //0x79 JNS Jb
    //0x7A JP Jb
    //0x7B JNP Jb
    //0x7C JL Jb
    //0x7D JNL Jb
    //0x7E JLE Jb
    //0x7F JNLE Jb
    //0x80 group 1 Eb,Ib
    //0x81 group 1 Ev,Iz
    //0x82 group 1 Eb,Ib
    //0x83 group 1 Ev,Ib
    //0x84 TEST Eb,Gb
    //0x85 TEST Ev,Gv
    //0x86 XCHG Eb,Gb
    //0x87 XCHG Ev,Gv
    //0x88 MOV Eb,Gb
    //0x89 MOV Ev,Gv
    //0x8A MOV Gb,Eb
    //0x8B MOV Gv,Ev
    //0x8C MOV Mw,Sw / MOV Rv,Sw
    //0x8D LEA Gv,M
    //0x8E MOV Sw,Mw / MOV Sw,Rv
    //0x8F POP Ev
    0x90: {name:"nop",
           dest_type: null,
           src_type: null,
           aux_type: null,
           dest: 0, src:0, aux:0},
    //0x91
    //0x92
    //0x93
    //0x94
    //0x95
    //0x96
    //0x97
    //0x98
    //0x99
    //0x9A
    //0x9B
    //0x9C
    //0x9D
    //0x9E
    //0x9F
    //0xA0
    //0xA1
    //0xA2
    //0xA3
    //0xA4
    //0xA5
    //0xA6
    //0xA7
    //0xA8
    //0xA9
    //0xAA
    //0xAB
    //0xAC
    //0xAD
    //0xAE
    //0xAF
    //0xB0
    //0xB1
    //0xB2
    //0xB3
    //0xB4
    //0xB5
    //0xB6
    //0xB7
    //0xB8
    //0xB9
    //0xBA
    //0xBB
    //0xBC
    //0xBD
    //0xBE
    //0xBF
    //0xC0
    //0xC1
    //0xC2
    0xc3: {name:"ret",
           dest_type: null,
           src_type: null,
           aux_type: null,
           dest: 0, src:0, aux:0},
    //0xC4
    //0xC5
    //0xC6
    //0xC7
    //0xC8
    0xc9: {name:"leave",
           dest_type: null,
           src_type: null,
           aux_type: null,
           dest: 0, src:0, aux:0},
    //0xCA
    //0xCB
    //0xCC
    //0xCD
    //0xCE
    //0xCF
    //0xD0
    //0xD1
    //0xD2
    //0xD3
    //0xD4
    //0xD5
    //0xD6
    //0xD7
    //0xD8
    //0xD9
    //0xDA
    //0xDB
    //0xDC
    //0xDD
    //0xDE
    //0xDF
    //0xE0
    //0xE1
    //0xE2
    //0xE3
    //0xE4
    //0xE5
    //0xE6
    //0xE7
    //0xE8
    //0xE9
    //0xEA
    //0xEB
    //0xEC
    //0xED
    //0xEE
    //0xEF
    //0xF0
    //0xF1
    //0xF2
    //0xF3
    0xf4: {name:"hlt",
           dest_type: null,
           src_type: null,
           aux_type: null,
           dest: 0, src:0, aux:0}
    //0xF5
    //0xF6
    //0xF7
    //0xF8
    //0xF9
    //0xFA
    //0xFB
    //0xFC
    //0xFD
    //0xFE
    //0xFF
};

/*
 * Decode x86 instruction prefixes from |bytes| starting at |offset|.
 * Set the prefix information in |config|. Return the number of bytes
 * decoded.
 */
function handle_prefixes(bytes, offset, config, default_size) {
    var count = 0;
    while (count < 4 && offset < bytes.length) {
        var prefix = bytes[offset++];
        if (!(prefix in opcodes_x86))
            break;

        var p = opcodes_x86[prefix];
        if (!p.prefix)
            break;

        count++;
        switch (p.prefix_type) {
        case flags.PREFIX_LOCK:
            config.lock = true;
            break;
        case flags.PREFIX_REPE:
        case flags.PREFIX_REPNE:
            //TODO
            break;
        case flags.PREFIX_SEGMENT_CS:
        case flags.PREFIX_SEGMENT_SS:
        case flags.PREFIX_SEGMENT_DS:
        case flags.PREFIX_SEGMENT_ES:
        case flags.PREFIX_SEGMENT_FS:
        case flags.PREFIX_SEGMENT_GS:
            //TODO
            break;
        case flags.PREFIX_OPERAND_SIZE:
            //TODO: handle 64-bit
            config.op_size = default_size == 4 ? 2 : 4;
            break;
        case flags.PREFIX_ADDR_SIZE:
            config.addr_size = default_size == 4 ? 2 : 4;
            break;
        }
    }
    return count;
}

/*
 * Fetch the byte from |bytes| at |offset| and return it, or return
 * -1 if there are no more bytes left.
 */
function fetch_byte(bytes, offset) {
    if (offset >= bytes.length)
        return -1;
    return bytes[offset];
}

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
        size = config.op_size;
        break;
    }
    return gpregs[size][reg];
}

function decode_modrm(modrm, which, opsize, config) {
    var mod = (modrm & 0xc0) >> 6;
    var reg = (modrm & 0x38) >> 3;
    var rm = modrm & 0x7;
    switch (which) {
    case "reg":
        return [decode_register(reg, opsize, config), 0];
    case "rm":
        switch (mod) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            return [decode_register(rm, opsize, config), 0];
            break;
        }
        break;
    }
    return [null, 0];
}

/*
 * Handle a single operand for an instruction.
 * Return the number of additional bytes consumed.
 */
function handle_operand(insn, insn_ret, operand, config, bytes, offset) {
    var size = 0;
    var modrm = fetch_byte(bytes, offset);
    //console.log(insn[operand + "_type"]);
    switch (insn[operand + "_type"]) {
    case null:
        // no argument
        break;
    case "RR":
        // general-purpose register encoded in opcode
        insn_ret[operand] = gpregs[config.op_size][insn[operand]];
        break;
    case "RS":
        // segment register encoded in opcode
        insn_ret[operand] = segregs[insn[operand]];
        break;
    case "E":
        // mod R/M byte, general-purpose register or memory address
        if (modrm == -1)
            return -1;
        size++;
        var ret = decode_modrm(modrm, 'rm', insn[operand + "_size"], config);
        insn_ret[operand] = ret[0];
        size += ret[1];
        break;
    case "G":
        // R/M byte, general-purpose register
        if (modrm == -1)
            return -1;
        // Don't increment size, the other operand already read the mod R/M byte.
        ret = decode_modrm(modrm, 'reg', insn[operand + "_size"], config);
        insn_ret[operand] = ret[0];
        break;
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
    var op = bytes[offset + size];
    if (op in opcodes_x86) {
        var insn = opcodes_x86[op];
        //TODO: handle multi-byte opcodes
        size++;
        offset++;
        if (insn.prefix) {
            // error, too many prefixes?
            return [null, size];
        }
        var insn_ret = {name:insn.name, config:config};
        var operands = ["dest","src","aux"];
        for (var i=0; i<operands.length; i++) {
            var operand_size = handle_operand(insn, insn_ret, operands[i], config, bytes, offset);
            size += operand_size;
        }
        return [insn_ret, size];
    }
    else {
        // Unknown
        return [null, 0];
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