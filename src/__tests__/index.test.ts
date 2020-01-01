import {
  bufToHex,
  strToBuf,
  u32,
  x64,
  x64hash128State,
  x86,
  x86hash128State,
  x86hash32State,
} from '../index';


const ascendingBuf = (
  // tslint:disable-next-line: prefer-template
  "\x00\x01\x02\x03\x04\x05\x06\x07" +
  "\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f" +
  
  "\x10\x11\x12\x13\x14\x15\x16\x17" +
  "\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f" +
  
  "\x20\x21\x22\x23\x24\x25\x26\x27" +
  "\x28\x29\x2a\x2b\x2c\x2d\x2e\x2f" +
  
  "\x30\x31\x32\x33\x34\x35\x36\x37" +
  "\x38\x39\x3a\x3b\x3c\x3d\x3e\x3f"
);

const testVectors: Record<string, [u32, string, string]> = {
  "": [
    0,
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
  ],
  [ascendingBuf]: [
    2303633163,
    "cc32c3983052e6520858cfaa82d82209",
    "ffd5522d8d812301a22238eb56338ea1",
  ],
  // Cover remainder === 15 case.
  [ascendingBuf.slice(0, 31)]: [
    1682074326,
    "24ab92eeac1d89ca45f5bc189ad5dda3",
    "053dd3e1a32cd0949ee59aefb4005490",
  ],
  "I will not buy this record, it is scratched.": [
    2832214938,
    "a0a9683b25ac5e40d9af2895890dddf5",
    "c382657f9a06c49d4a71fdc6d9b0d48f",
  ],
  "I will not buy this tobacconist's, it is scratched.": [
    1720269489,
    "9b5b7ba2ef3f7866889adeaf00f3f98e",
    "d30654abbd8227e367d73523f0079673",
  ],
  "My hovercraft is full of eels.": [
    2953494853,
    "e3a186aee169ba6c6a8bd9343c68fa9c",
    "03e5e14d358c16d1e5ae86df7ed5cfcb",
  ],
  // tslint:disable-next-line: object-literal-key-quotes
  "我的气垫船装满了鳗鱼。": [
    4193185573,
    "4a3b1d7c5f2763c2d6d5551f5f1e922f",
    "454d3f37ec1eb384ab6fb47de3d07525",
  ],
  // Ignore for string chunk tests as emojis are multiple codepoints.
  "My 🚀 is full of 🦎.": [
    1818098979,
    "e616d85ffee7f678dab461995b5bb90f",
    "d047391e58c6c9dfccde62c92e049f50",
  ],
};


function chunk(data: string, size: number): string[];
function chunk(data: Uint8Array, size: number): Uint8Array[];
function chunk(data: string | Uint8Array, size: number): string[] | Uint8Array[] {
  if (size === 0) { throw new RangeError("Size cannot be 0."); }
  const chunks = [];
  
  if (typeof data === 'string') {
    if (data.length === 0) { return [data]; }
    for (let i = 0; i < data.length; i += size) {
      chunks.push(data.substr(i, size));
    }
    return chunks as string[];
  } else {
    if (data.byteLength === 0) { return [data]; }
    for (let i = 0; i < data.byteLength; i += size) {
      chunks.push(data.subarray(i, i + size));
    }
    return chunks as Uint8Array[];
  }
}


const testVectorsx86hash32: Record<string, u32> = {};
const testVectorsx86hash128str: Record<string, string> = {};
const testVectorsx86hash128buf: Record<string, Uint8Array> = {};
const testVectorsx64hash128str: Record<string, string> = {};
const testVectorsx64hash128buf: Record<string, Uint8Array> = {};

for (const [key, values] of Object.entries(testVectors)) {
  [
    testVectorsx86hash32[key],
    testVectorsx86hash128str[key],
    testVectorsx64hash128str[key],
  ] = values;
  testVectorsx86hash128buf[key] = new Uint8Array(
    chunk(testVectorsx86hash128str[key], 2).map(s => parseInt(s, 16)),
  );
  testVectorsx64hash128buf[key] = new Uint8Array(
    chunk(testVectorsx64hash128str[key], 2).map(s => parseInt(s, 16)),
  );
}


describe(
  "bufToHex()", () => {
    test(`returns ''`, () => {
      expect(bufToHex()).toBe('');
    });
  },
);

describe.each(
  // tslint:disable-next-line: prefer-array-literal
  [...new Array(256).keys()]
    .map(i => [
      new Uint8Array([i, 255 - i]),
      `${i.toString(16).padStart(2, "0")}${(255 - i).toString(16).padStart(2, "0")}`,
    ] as [Uint8Array, string]),
)(
  "bufToHex(Uint8Array %p)",
  (buf, expected) => {
    test(`returns '${expected}'`, () => {
      expect(bufToHex(buf)).toBe(expected);
    });
  },
);


describe.each(Object.entries(testVectorsx86hash32)
  .map(([k, v]) => [k, v] as [string, u32]),
)(
  "x86.hash32(%j)",
  // tslint:disable-next-line: variable-name
  (str, expected) => {
    test(`returns ${expected}`, () => {
      expect(x86.hash32(str)).toBe(expected);
    });
  },
);

describe.each(Object.entries(testVectorsx86hash128str)
  .map(([k, v]) => [k, v]),
)(
  "x86.hash128(%j)",
  // tslint:disable-next-line: variable-name
  (str, expected) => {
    test(`returns '${expected}'`, () => {
      expect(x86.hash128(str)).toBe(expected);
    });
  },
);

describe.each(Object.entries(testVectorsx86hash128buf)
  .map(([k, v]) => [strToBuf(k), v]),
)(
  "x86.hash128(Uint8Array %p)",
  (buf, expected) => {
    test(`returns Uint8Array [${expected.join(", ")}]`, () => {
      expect(x86.hash128(buf)).toEqual(expected);
    });
  },
);

describe.each(Object.entries(testVectorsx64hash128str)
  .map(([k, v]) => [k, v]),
)(
  "x64.hash128(%j)",
  // tslint:disable-next-line: variable-name
  (str, expected) => {
    test(`returns '${expected}'`, () => {
      expect(x64.hash128(str)).toBe(expected);
    });
  },
);

describe.each(Object.entries(testVectorsx64hash128buf)
  .map(([k, v]) => [strToBuf(k), v]),
)(
  "x64.hash128(Uint8Array %p)",
  (buf, expected) => {
    test(`returns Uint8Array [${expected.join(", ")}]`, () => {
      expect(x64.hash128(buf)).toEqual(expected);
    });
  },
);


describe.each(
  Object.entries(testVectorsx86hash32)
    .slice(0, -1)
    .flatMap(([k, v]) => (
      // tslint:disable-next-line: prefer-array-literal
      [...new Array(Math.max(1, k.length - 1)).keys()].map(i => [
        k, i + 1, chunk(k, i + 1), v,
      ] as [string, number, string[], u32])
    )),
)(
  "x86.hash32(chunk(%j, %p))",
  // tslint:disable-next-line: variable-name
  (_k, _size, chunks, expected) => {
    test(`returns ${expected}`, () => {
      let state: u32 | x86hash32State = 0x0;
      for (const chunk of chunks) {
        state = x86.hash32(chunk, state, false);
      }
      
      expect(x86.hash32(undefined, state, true)).toBe(expected);
      expect(x86.hash32("", state, true)).toBe(expected);
    });
  },
);

describe.each(
  Object.entries(testVectorsx86hash128str)
    .slice(0, -1)
    .flatMap(([k, v]) => (
      // tslint:disable-next-line: prefer-array-literal
      [...new Array(Math.max(1, k.length - 1)).keys()].map(i => [
        k, i + 1, chunk(k, i + 1), v,
      ] as [string, number, string[], string])
    ),
))(
  "x86.hash128(chunk(%j, %p))",
  // tslint:disable-next-line: variable-name
  (_k, _size, chunks, expected) => {
    test(`returns '${expected}'`, () => {
      let state: u32 | x86hash128State = 0x0;
      for (const chunk of chunks) {
        state = x86.hash128(chunk, state, false);
      }
      
      expect(x86.hash128("", state, true)).toBe(expected);
    });
  },
);

describe.each(
  Object.entries(testVectorsx86hash128buf)
    .map(([k, v]) => ([k, strToBuf(k), v] as const))
    .flatMap(([k, b, v]) => (
      // tslint:disable-next-line: prefer-array-literal
      [...new Array(Math.max(1, b.byteLength - 1)).keys()].map(i => [
        k, i + 1, chunk(b, i + 1), v,
      ] as [string, number, Uint8Array[], Uint8Array])
    )),
)(
  "x86.hash128(chunk(strToBuf(%j), %p))",
  // tslint:disable-next-line: variable-name
  (_k, _size, chunks, expected) => {
    test(`returns Uint8Array [${expected.join(", ")}]`, () => {
      let state: u32 | x86hash128State = 0x0;
      for (const chunk of chunks) {
        state = x86.hash128(chunk, state, false);
      }
      
      expect(x86.hash128(undefined, state, true)).toEqual(expected);
    });
  },
);

describe.each(
  Object.entries(testVectorsx64hash128str)
    .slice(0, -1)
    .flatMap(([k, v]) => (
      // tslint:disable-next-line: prefer-array-literal
      [...new Array(Math.max(1, k.length - 1)).keys()].map(i => [
        k, i + 1, chunk(k, i + 1), v,
      ] as [string, number, string[], string])
    )),
)(
  "x64.hash128(chunk(%j, %p))",
  // tslint:disable-next-line: variable-name
  (_jsonStr, _size, chunks, expected) => {
    test(`returns '${expected}'`, () => {
      let state: u32 | x64hash128State = 0x0;
      for (const chunk of chunks) {
        state = x64.hash128(chunk, state, false);
      }
      
      expect(x64.hash128("", state, true)).toBe(expected);
    });
  },
);

describe.each(
  Object.entries(testVectorsx64hash128buf)
    .map(([k, v]) => ([k, strToBuf(k), v] as const))
    .flatMap(([k, b, v]) => (
      // tslint:disable-next-line: prefer-array-literal
      [...new Array(Math.max(1, b.byteLength - 1)).keys()].map(i => [
        k, i + 1, chunk(b, i + 1), v,
      ] as [string, number, Uint8Array[], Uint8Array])
    )),
)(
  "x64.hash128(chunk(strToBuf(%j), %p))",
  // tslint:disable-next-line: variable-name
  (_jsonStr, _size, chunks, expected) => {
    test(`returns Uint8Array [${expected.join(", ")}]`, () => {
      let state: u32 | x64hash128State = 0x0;
      for (const chunk of chunks) {
        state = x64.hash128(chunk, state, false);
      }
      
      expect(x64.hash128(undefined, state, true)).toEqual(expected);
    });
  },
);
