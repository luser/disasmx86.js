test("disassemble instruction bad offset", function() {
    var res = disassemble_x86_instruction([0x0], 1);
    equals(res[0], null);
    equals(res[1], 0);

    res = disassemble_x86_instruction([0x0], -1);
    equals(res[0], null);
    equals(res[1], 0);
});

test("disassemble instruction single bytes", function() {
    var res = disassemble_x86_instruction([0x90], 0);
    equals(res[0].name, "nop");
    equals(res[1], 1);

    res = disassemble_x86_instruction(new Uint8Array([0x90]), 0);
    equals(res[0].name, "nop");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x90, 0x0], 0);
    equals(res[0].name, "nop");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x0, 0x90], 1);
    equals(res[0].name, "nop");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x50], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%eax");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x51], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%ecx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x52], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%edx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x53], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%ebx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x54], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%esp");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x55], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%ebp");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x56], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%esi");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x57], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%edi");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x58], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%eax");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x59], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%ecx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x5a], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%edx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x5b], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%ebx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x5c], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%esp");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x5d], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%ebp");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x5e], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%esi");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x5f], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%edi");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xc3], 0);
    equals(res[0].name, "ret");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xc9], 0);
    equals(res[0].name, "leave");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xf4], 0);
    equals(res[0].name, "hlt");
    equals(res[1], 1);
});

test("disassemble single byte instruction modrm byte", function() {
    var res = disassemble_x86_instruction([0x00, 0xc0], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%al");
    equals(res[1], 2);
});

test("disassemble instruction prefix", function() {
    var res = disassemble_x86_instruction([0x66, 0x90], 0);
    equals(res[0].name, "nop");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x66, 0x66, 0x90], 0);
    equals(res[0].name, "nop");
    equals(res[1], 3);

    res = disassemble_x86_instruction([0x66, 0x66, 0x66, 0x90], 0);
    equals(res[0].name, "nop");
    equals(res[1], 4);

    res = disassemble_x86_instruction([0x66, 0x66, 0x66, 0x66, 0x90], 0);
    equals(res[0].name, "nop");
    equals(res[1], 5);

    res = disassemble_x86_instruction([0x66, 0x50], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%ax");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x66, 0x66, 0x50], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%ax");
    equals(res[1], 3);
});

test("disassemble and format instruction", function() {
    var res = disassemble_and_format_x86_instruction([0x90], 0);
    equals(res[0].trim(), "90");
    equals(res[1], "nop");
    equals(res[2], 1);

    res = disassemble_and_format_x86_instruction([0x54], 0);
    equals(res[0].trim(), "54");
    equals(res[1], "push %esp");
    equals(res[2], 1);
});

/*
test("Constructor Errors", function() {
    raises(function() { new Uint64(-1); });
    raises(function() { new Uint64(0, -1); });
    raises(function() { new Uint64(-1, -1); });
    raises(function() { new Uint64(Math.pow(2, 32)); });
    raises(function() { new Uint64(0, Math.pow(2, 32)); });
    raises(function() { new Uint64(Math.pow(2, 32), Math.pow(2, 32)); });
});

test("Basic", function() {
    equals(new Uint64(1).lo, 1);
    equals(new Uint64(1, 2).hi, 2);
    equals(new Uint64(0xff).lo, 0xff);
    equals(new Uint64(0, 0xff).hi, 0xff);
    equals(new Uint64(1, 1).toString(), "0x0000000100000001");
    equals(new Uint64(0xff, 0xff).toString(), "0x000000ff000000ff");
    equals(new Uint64(MAX_UINT, MAX_UINT).toString(),
           "0xffffffffffffffff");
});

test("fromBytes", function() {
    equals(Uint64.fromBytes([0x00, 0xff]).toString(), "0x000000000000ff00");
    equals(Uint64.fromBytes([0x00, 0xff], false).toString(),
           "0x000000000000ff00");
    equals(Uint64.fromBytes([0x00, 0xff], true).toString(),
           "0x00000000000000ff");
    equals(Uint64.fromBytes([0xef, 0xcd, 0xab, 0x89,
                             0x67, 0x45, 0x23, 0x01]).toString(),
           "0x0123456789abcdef");
    equals(Uint64.fromBytes([0xef, 0xcd, 0xab, 0x89,
                             0x67, 0x45, 0x23, 0x01],
                            true).toString(),
           "0xefcdab8967452301");
});

test("basic add", function() {
    var x = new Uint64(1);
    var y = new Uint64(1);
    x.add(y);
    equals(x.lo, 2);
    equals(x.hi, 0);

    y = new Uint64(1, 1);
    y.add(y);
    equals(y.lo, 2);
    equals(y.hi, 2);
});

test("basic plus", function() {
    var x = new Uint64(1);
    var y = new Uint64(1);
    var z = x.plus(y);
    equals(x.lo, 1);
    equals(x.hi, 0);
    equals(y.lo, 1);
    equals(y.hi, 0);
    equals(z.lo, 2);
    equals(z.hi, 0);

    y = new Uint64(1, 1);
    z = y.plus(y);
    equals(y.lo, 1);
    equals(y.hi, 1);
    equals(z.lo, 2);
    equals(z.hi, 2);
});

test("overflow add", function() {
    var x = new Uint64(MAX_UINT, 1);
    var y = new Uint64(1);
    x.add(y);
    equals(x.lo, 0);
    equals(x.hi, 2);

    var x = new Uint64(MAX_UINT, 100);
    var y = new Uint64(5, 5);
    x.add(y);
    equals(x.lo, 4);
    equals(x.hi, 106);

    var x = new Uint64(MAX_UINT, 100);
    var y = new Uint64(MAX_UINT, 1);
    x.add(y);
    equals(x.lo, MAX_UINT - 1);
    equals(x.hi, 102);
    var z = new Uint64(2);
    x.add(z);
    equals(x.lo, 0);
    equals(x.hi, 103);

    // Overflow past 64 bits
    x = new Uint64(MAX_UINT, MAX_UINT);
    y = new Uint64(1);
    raises(function() { x.add(y) });

    x = new Uint64(MAX_UINT, MAX_UINT);
    y = new Uint64(0, 1);
    raises(function() { x.add(y) });
});

test("basic sub", function() {
    var x = new Uint64(1);
    var y = new Uint64(1);
    x.sub(y);
    equals(x.lo, 0);
    equals(x.hi, 0);

    y = new Uint64(1, 1);
    y.sub(y);
    equals(y.lo, 0);
    equals(y.hi, 0);

    x = new Uint64(2, 2);
    y = new Uint64(1, 1);
    x.sub(y);
    equals(x.lo, 1);
    equals(x.hi, 1);
});

test("basic minus", function() {
    var x = new Uint64(1);
    var y = new Uint64(1);
    var z = x.minus(y);
    equals(x.lo, 1);
    equals(x.hi, 0);
    equals(z.lo, 0);
    equals(z.hi, 0);

    y = new Uint64(1, 1);
    z = y.minus(y);
    equals(y.lo, 1);
    equals(y.hi, 1);
    equals(z.lo, 0);
    equals(z.hi, 0);

    x = new Uint64(2, 2);
    y = new Uint64(1, 1);
    z = x.minus(y);
    equals(x.lo, 2);
    equals(x.hi, 2);
    equals(z.lo, 1);
    equals(z.hi, 1);
});

test("underflow sub", function() {
    var x = new Uint64(0, 2);
    var y = new Uint64(1, 0);
    x.sub(y);
    equals(x.hi, 1);
    equals(x.lo, MAX_UINT);

    // Underflow to negative
    x = new Uint64(1);
    y = new Uint64(2);
    raises(function() { x.sub(y); });
});

test("cmp", function() {
    equals(new Uint64(1, 1).cmp(new Uint64(1, 1)), 0);
    equals(new Uint64(1, 1).cmp(new Uint64(1, 0)), 1);
    equals(new Uint64(1, 0).cmp(new Uint64(1, 1)), -1);
    equals(new Uint64(0, 1).cmp(new Uint64(1, 1)), -1);
    equals(new Uint64(1, 1).cmp(new Uint64(0, 1)), 1);
});

test("eq", function() {
    ok(new Uint64(1, 1).eq(new Uint64(1, 1)));
    ok(!(new Uint64(1, 1).eq(new Uint64(1, 0))));
    ok(!(new Uint64(1, 0).eq(new Uint64(1, 1))));
    ok(!(new Uint64(0, 1).eq(new Uint64(1, 1))));
    ok(!(new Uint64(1, 1).eq(new Uint64(0, 1))));
});

test("lt", function() {
    ok(!(new Uint64(1, 1).lt(new Uint64(1, 1))));
    ok(!(new Uint64(1, 1).lt(new Uint64(1, 0))));
    ok(new Uint64(1, 0).lt(new Uint64(1, 1)));
    ok(new Uint64(0, 1).lt(new Uint64(1, 1)));
    ok(!(new Uint64(1, 1).lt(new Uint64(0, 1))));
});

test("gt", function() {
    ok(!(new Uint64(1, 1).gt(new Uint64(1, 1))));
    ok(new Uint64(1, 1).gt(new Uint64(1, 0)));
    ok(!(new Uint64(1, 0).gt(new Uint64(1, 1))));
    ok(!(new Uint64(0, 1).gt(new Uint64(1, 1))));
    ok(new Uint64(1, 1).gt(new Uint64(0, 1)));
});

test("lte", function() {
    ok(new Uint64(1, 1).lte(new Uint64(1, 1)));
    ok(!(new Uint64(1, 1).lte(new Uint64(1, 0))));
    ok(new Uint64(1, 0).lte(new Uint64(1, 1)));
    ok(new Uint64(0, 1).lte(new Uint64(1, 1)));
    ok(!(new Uint64(1, 1).lte(new Uint64(0, 1))));
});

test("gte", function() {
    ok(new Uint64(1, 1).gte(new Uint64(1, 1)));
    ok(new Uint64(1, 1).gte(new Uint64(1, 0)));
    ok(!(new Uint64(1, 0).gte(new Uint64(1, 1))));
    ok(!(new Uint64(0, 1).gte(new Uint64(1, 1))));
    ok(new Uint64(1, 1).gte(new Uint64(0, 1)));
});
*/