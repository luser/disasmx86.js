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

    res = disassemble_x86_instruction([0x06], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%es");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x07], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%es");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x0e], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%cs");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x16], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%ss");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x17], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%ss");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x1e], 0);
    equals(res[0].name, "push");
    equals(res[0].src, "%ds");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x1f], 0);
    equals(res[0].name, "pop");
    equals(res[0].src, "%ds");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x27], 0);
    equals(res[0].name, "daa");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x2f], 0);
    equals(res[0].name, "das");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x37], 0);
    equals(res[0].name, "aaa");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x3f], 0);
    equals(res[0].name, "aas");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x40], 0);
    equals(res[0].name, "inc");
    equals(res[0].src, "%eax");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x41], 0);
    equals(res[0].name, "inc");
    equals(res[0].src, "%ecx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x42], 0);
    equals(res[0].name, "inc");
    equals(res[0].src, "%edx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x43], 0);
    equals(res[0].name, "inc");
    equals(res[0].src, "%ebx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x44], 0);
    equals(res[0].name, "inc");
    equals(res[0].src, "%esp");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x45], 0);
    equals(res[0].name, "inc");
    equals(res[0].src, "%ebp");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x46], 0);
    equals(res[0].name, "inc");
    equals(res[0].src, "%esi");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x47], 0);
    equals(res[0].name, "inc");
    equals(res[0].src, "%edi");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x48], 0);
    equals(res[0].name, "dec");
    equals(res[0].src, "%eax");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x49], 0);
    equals(res[0].name, "dec");
    equals(res[0].src, "%ecx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x4a], 0);
    equals(res[0].name, "dec");
    equals(res[0].src, "%edx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x4b], 0);
    equals(res[0].name, "dec");
    equals(res[0].src, "%ebx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x4c], 0);
    equals(res[0].name, "dec");
    equals(res[0].src, "%esp");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x4d], 0);
    equals(res[0].name, "dec");
    equals(res[0].src, "%ebp");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x4e], 0);
    equals(res[0].name, "dec");
    equals(res[0].src, "%esi");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x4f], 0);
    equals(res[0].name, "dec");
    equals(res[0].src, "%edi");
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

    res = disassemble_x86_instruction([0x91], 0);
    equals(res[0].name, "xchg");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x92], 0);
    equals(res[0].name, "xchg");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%edx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x93], 0);
    equals(res[0].name, "xchg");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ebx");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x94], 0);
    equals(res[0].name, "xchg");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%esp");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x95], 0);
    equals(res[0].name, "xchg");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ebp");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x96], 0);
    equals(res[0].name, "xchg");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%esi");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x97], 0);
    equals(res[0].name, "xchg");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%edi");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x9b], 0);
    equals(res[0].name, "fwait");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x9c], 0);
    equals(res[0].name, "pushf");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x9d], 0);
    equals(res[0].name, "popf");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x9e], 0);
    equals(res[0].name, "sahf");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0x9f], 0);
    equals(res[0].name, "lahf");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xc3], 0);
    equals(res[0].name, "ret");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xc9], 0);
    equals(res[0].name, "leave");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xcb], 0);
    equals(res[0].name, "lret");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xcc], 0);
    equals(res[0].name, "int3");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xce], 0);
    equals(res[0].name, "into");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xcf], 0);
    equals(res[0].name, "iret");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xd6], 0);
    equals(res[0].name, "salc");
    equals(res[1], 1);

    res = disassemble_x86_instruction([0xf4], 0);
    equals(res[0].name, "hlt");
    equals(res[1], 1);
});

test("disassemble modrm byte registers", function() {
    var res = disassemble_x86_instruction([0x00, 0xc0], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xc1], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xc2], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%dl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xc3], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%bl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xc4], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%ah");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xc5], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%ch");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xc6], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%dh");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xc7], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%bh");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xc8], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%cl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xd0], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%dl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xd8], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%bl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xe0], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%ah");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xe8], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%ch");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xf0], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%dh");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x00, 0xf8], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%bh");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x01, 0xc0], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%eax");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x01, 0xc1], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x01, 0xc8], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%ecx");
    equals(res[0].dest, "%eax");
    equals(res[1], 2);
});

test("single byte instructions + modrm bytes", function() {
    var res = disassemble_x86_instruction([0x00, 0xc1], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x01, 0xc1], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x02, 0xc1], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%cl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x03, 0xc1], 0);
    equals(res[0].name, "add");
    equals(res[0].src, "%ecx");
    equals(res[0].dest, "%eax");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x08, 0xc1], 0);
    equals(res[0].name, "or");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x09, 0xc1], 0);
    equals(res[0].name, "or");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x0a, 0xc1], 0);
    equals(res[0].name, "or");
    equals(res[0].src, "%cl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x0b, 0xc1], 0);
    equals(res[0].name, "or");
    equals(res[0].src, "%ecx");
    equals(res[0].dest, "%eax");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x10, 0xc1], 0);
    equals(res[0].name, "adc");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x11, 0xc1], 0);
    equals(res[0].name, "adc");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x12, 0xc1], 0);
    equals(res[0].name, "adc");
    equals(res[0].src, "%cl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x13, 0xc1], 0);
    equals(res[0].name, "adc");
    equals(res[0].src, "%ecx");
    equals(res[0].dest, "%eax");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x18, 0xc1], 0);
    equals(res[0].name, "sbb");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x19, 0xc1], 0);
    equals(res[0].name, "sbb");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x1a, 0xc1], 0);
    equals(res[0].name, "sbb");
    equals(res[0].src, "%cl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x1b, 0xc1], 0);
    equals(res[0].name, "sbb");
    equals(res[0].src, "%ecx");
    equals(res[0].dest, "%eax");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x20, 0xc1], 0);
    equals(res[0].name, "and");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x21, 0xc1], 0);
    equals(res[0].name, "and");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x22, 0xc1], 0);
    equals(res[0].name, "and");
    equals(res[0].src, "%cl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x23, 0xc1], 0);
    equals(res[0].name, "and");
    equals(res[0].src, "%ecx");
    equals(res[0].dest, "%eax");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x28, 0xc1], 0);
    equals(res[0].name, "sub");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x29, 0xc1], 0);
    equals(res[0].name, "sub");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x2a, 0xc1], 0);
    equals(res[0].name, "sub");
    equals(res[0].src, "%cl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x2b, 0xc1], 0);
    equals(res[0].name, "sub");
    equals(res[0].src, "%ecx");
    equals(res[0].dest, "%eax");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x30, 0xc1], 0);
    equals(res[0].name, "xor");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x31, 0xc1], 0);
    equals(res[0].name, "xor");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x32, 0xc1], 0);
    equals(res[0].name, "xor");
    equals(res[0].src, "%cl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x33, 0xc1], 0);
    equals(res[0].name, "xor");
    equals(res[0].src, "%ecx");
    equals(res[0].dest, "%eax");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x38, 0xc1], 0);
    equals(res[0].name, "cmp");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x39, 0xc1], 0);
    equals(res[0].name, "cmp");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x3a, 0xc1], 0);
    equals(res[0].name, "cmp");
    equals(res[0].src, "%cl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x3b, 0xc1], 0);
    equals(res[0].name, "cmp");
    equals(res[0].src, "%ecx");
    equals(res[0].dest, "%eax");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x84, 0xc1], 0);
    equals(res[0].name, "test");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x85, 0xc1], 0);
    equals(res[0].name, "test");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x86, 0xc1], 0);
    equals(res[0].name, "xchg");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x87, 0xc1], 0);
    equals(res[0].name, "xchg");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x88, 0xc1], 0);
    equals(res[0].name, "mov");
    equals(res[0].src, "%al");
    equals(res[0].dest, "%cl");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x89, 0xc1], 0);
    equals(res[0].name, "mov");
    equals(res[0].src, "%eax");
    equals(res[0].dest, "%ecx");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x8a, 0xc1], 0);
    equals(res[0].name, "mov");
    equals(res[0].src, "%cl");
    equals(res[0].dest, "%al");
    equals(res[1], 2);

    res = disassemble_x86_instruction([0x8b, 0xc1], 0);
    equals(res[0].name, "mov");
    equals(res[0].src, "%ecx");
    equals(res[0].dest, "%eax");
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
