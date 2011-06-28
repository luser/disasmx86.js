const gpregs = {
    1: ["%al", "%cl", "%dl", "%bl", "%ah", "%ch", "%dh", "%bh"],
    2: ["%ax", "%cx", "%dx", "%bx", "%sp", "%bp", "%si", "%di"],
    4: ["%eax", "%ecx", "%edx", "%ebx", "%esp", "%ebp", "%esi", "%edi"]
};

function decode_modrm(b, op, rawop, options) {
    var mod = (b & 0xc0) >> 6;
    var rmsrc = (b & 0x38) >> 3;
    var rmdest = b & 0x7;
    var src_lookup = [
        ["[%eax]", "[%ecx]", "[%edx]", "[%ebx]", "[sib]", "[xxx]", "[%esi]", "[%edi]"],
        ["[%eax]+8", "[%ecx]+8", "[%edx]+8", "[%ebx]+8", "[sib]+8", "[xxx]+8", "[%esi]+8", "[%edi]+8"],
        ["[%eax]+32", "[%ecx]+32", "[%edx]+32", "[%ebx]+32", "[sib]+32", "[xxx]+32", "[%esi]+32", "[%edi]+32"],
        ["%eax", "%ecx", "%edx", "%ebx", "%esp", "%ebp", "%esi", "%edi"]
    ];
    var dest = gpregs[rmdest];
    var src = src_lookup[mod][rmsrc];
    return dest + "," + src;
}

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
    PREFIX_ADDR_SIZE: 11,
};

const opcodes_x86 = {
    0x00: {name:"add",
           dest_type: "E",
           dest_size: "b",
           src_type: "G",
           src_size: "b",
           aux_type: null},
    0x50: {name:"push",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:0, aux:0},
    0x51: {name:"push",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:1, aux:0},
    0x52: {name:"push",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:2, aux:0},
    0x53: {name:"push",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:3, aux:0},
    0x54: {name:"push",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:4, aux:0},
    0x55: {name:"push",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:5, aux:0},
    0x56: {name:"push",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:6, aux:0},
    0x57: {name:"push",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:7, aux:0},
    0x58: {name:"pop",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:0, aux:0},
    0x59: {name:"pop",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:1, aux:0},
    0x5a: {name:"pop",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:2, aux:0},
    0x5b: {name:"pop",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:3, aux:0},
    0x5c: {name:"pop",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:4, aux:0},
    0x5d: {name:"pop",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:5, aux:0},
    0x5e: {name:"pop",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:6, aux:0},
    0x5f: {name:"pop",
           dest_type: null,
           src_type: flags.ADDRMETH_RR,
           aux_type: null,
           dest: 0, src:7, aux:0},
    0x66: {prefix:true,
           prefix_type:flags.PREFIX_OPERAND_SIZE},
    0x67: {prefix:true,
           prefix_type:flags.PREFIX_ADDR_SIZE},
    0x90: {name:"nop",
           dest_type: null,
           src_type: null,
           aux_type: null,
           dest: 0, src:0, aux:0},
    0xc3: {name:"ret",
           dest_type: null,
           src_type: null,
           aux_type: null,
           dest: 0, src:0, aux:0},
    0xc9: {name:"leave",
           dest_type: null,
           src_type: null,
           aux_type: null,
           dest: 0, src:0, aux:0},
    0xf4: {name:"hlt",
           dest_type: null,
           src_type: null,
           aux_type: null,
           dest: 0, src:0, aux:0},
};

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
            config.lock = true
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
        if (insn.prefix) {
            // error, too many prefixes?
            return [null, size + 1];
        }
        var insn_ret = {name:insn.name, config:config};
        switch (insn.dest_type) {
        case null:
            // no dest argument
            break;
        case flags.ADDRMETH_RR:
            insn_ret.dest = gpregs[config.op_size][insn.dest];
            break;
        }
        switch (insn.src_type) {
        case null:
            // no src argument
            break;
        case flags.ADDRMETH_RR:
            insn_ret.src = gpregs[config.op_size][insn.src];
            break;
        }
        //TODO: handle built-in src
        if (insn.aux_type != null) {
            //TODO: parse aux operand
        }
        //TODO: handle built-in aux
        return [insn_ret, size + 1];
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