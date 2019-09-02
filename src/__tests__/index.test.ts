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
  "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007" +
  "\u0008\u0009\u000a\u000b\u000c\u000d\u000e\u000f" +
  
  "\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017" +
  "\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f" +
  
  "\u0020\u0021\u0022\u0023\u0024\u0025\u0026\u0027" +
  "\u0028\u0029\u002a\u002b\u002c\u002d\u002e\u002f" +
  
  "\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037" +
  "\u0038\u0039\u003a\u003b\u003c\u003d\u003e\u003f"
);

const testVectors: {
  [str: string]: [u32, string, Uint8Array, string, Uint8Array],
} = {
  // Ignore for all chunk tests as this is an empty buffer.
  "": [
    0,
    "00000000000000000000000000000000",
    new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ]),
    "00000000000000000000000000000000",
    new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ]),
  ],
  "I will not buy this record, it is scratched.": [
    2832214938,
    "a0a9683b25ac5e40d9af2895890dddf5",
    new Uint8Array([
      160, 169, 104, 59, 37, 172, 94, 64,
      217, 175, 40, 149, 137, 13, 221, 245,
    ]),
    "c382657f9a06c49d4a71fdc6d9b0d48f",
    new Uint8Array([
      195, 130, 101, 127, 154, 6, 196, 157,
      74, 113, 253, 198, 217, 176, 212, 143,
    ]),
  ],
  "I will not buy this tobacconist's, it is scratched.": [
    1720269489,
    "9b5b7ba2ef3f7866889adeaf00f3f98e",
    new Uint8Array([
      155, 91, 123, 162, 239, 63, 120, 102,
      136, 154, 222, 175, 0, 243, 249, 142,
    ]),
    "d30654abbd8227e367d73523f0079673",
    new Uint8Array([
      211, 6, 84, 171, 189, 130, 39, 227,
      103, 215, 53, 35, 240, 7, 150, 115,
    ]),
  ],
  "My hovercraft is full of eels.": [
    2953494853,
    "e3a186aee169ba6c6a8bd9343c68fa9c",
    new Uint8Array([
      227, 161, 134, 174, 225, 105, 186, 108,
      106, 139, 217, 52, 60, 104, 250, 156,
    ]),
    "03e5e14d358c16d1e5ae86df7ed5cfcb",
    new Uint8Array([
      3, 229, 225, 77, 53, 140, 22, 209,
      229, 174, 134, 223, 126, 213, 207, 203,
    ]),
  ],
  // tslint:disable-next-line: object-literal-key-quotes
  "我的气垫船装满了鳗鱼": [
    1553108894,
    "3ffaf018ca173b58c4e26affcd6a7d02",
    new Uint8Array([
      63, 250, 240, 24, 202, 23, 59, 88,
      196, 226, 106, 255, 205, 106, 125, 2,
    ]),
    "e52c1f398ab5f107e77b2d1eab4e8cc9",
    new Uint8Array([
      229, 44, 31, 57, 138, 181, 241, 7,
      231, 123, 45, 30, 171, 78, 140, 201,
    ]),
  ],
  [ascendingBuf]: [
    2303633163,
    "cc32c3983052e6520858cfaa82d82209",
    new Uint8Array([
      204, 50, 195, 152, 48, 82, 230, 82,
      8, 88, 207, 170, 130, 216, 34, 9,
    ]),
    "ffd5522d8d812301a22238eb56338ea1",
    new Uint8Array([
      255, 213, 82, 45, 141, 129, 35, 1,
      162, 34, 56, 235, 86, 51, 142, 161,
    ]),
  ],
  // Cover remainder === 15 case.
  [ascendingBuf.slice(0, 31)]: [
    1682074326,
    "24ab92eeac1d89ca45f5bc189ad5dda3",
    new Uint8Array([
      36, 171, 146, 238, 172, 29, 137, 202,
      69, 245, 188, 24, 154, 213, 221, 163,
    ]),
    "053dd3e1a32cd0949ee59aefb4005490",
    new Uint8Array([
      5, 61, 211, 225, 163, 44, 208, 148,
      158, 229, 154, 239, 180, 0, 84, 144,
    ]),
  ],
  // Ignore for string chunk tests as emojis are multiple codepoints.
  "My 🚀 is full of 🦎.": [
    1818098979,
    "e616d85ffee7f678dab461995b5bb90f",
    new Uint8Array([
      230, 22, 216, 95, 254, 231, 246, 120,
      218, 180, 97, 153, 91, 91, 185, 15,
    ]),
    "d047391e58c6c9dfccde62c92e049f50",
    new Uint8Array([
      208, 71, 57, 30, 88, 198, 201, 223,
      204, 222, 98, 201, 46, 4, 159, 80,
    ]),
  ],
};

const testVectorsx86hash32: {[key: string]: u32} = {};
const testVectorsx86hash128str: {[key: string]: string} = {};
const testVectorsx86hash128buf: {[key: string]: Uint8Array} = {};
const testVectorsx64hash128str: {[key: string]: string} = {};
const testVectorsx64hash128buf: {[key: string]: Uint8Array} = {};

for (const [key, values] of Object.entries(testVectors)) {
  [
    testVectorsx86hash32[key],
    testVectorsx86hash128str[key],
    testVectorsx86hash128buf[key],
    testVectorsx64hash128str[key],
    testVectorsx64hash128buf[key],
  ] = values;
}


function chunk(data: string, size: number): string[];
function chunk(data: Uint8Array, size: number): Uint8Array[];
function chunk(data: string | Uint8Array, size: number): string[] | Uint8Array[] {
  if (size === 0) { throw new RangeError("Size cannot be 0."); }
  const chunks = [];
  
  if (typeof data === 'string') {
    for (let i = 0; i < data.length; i += size) {
      chunks.push(data.substr(i, size));
    }
    return chunks as string[];
  } else {
    for (let i = 0; i < data.byteLength; i += size) {
      chunks.push(data.subarray(i, i + size));
    }
    return chunks as Uint8Array[];
  }
}


describe.each(
  // tslint:disable-next-line: prefer-array-literal
  [...new Array(256).keys()]
    .map(i => [
      new Uint8Array([i, 255 - i]),
      `${`00${i.toString(16)}`.slice(-2)}${`00${(255 - i).toString(16)}`.slice(-2)}`,
    ] as [Uint8Array, string]),
)(
  "bufToHex(new Uint8Array(%p))",
  (buf: Uint8Array, expected: string) => {
    test(`returns ${expected}`, () => {
      expect(bufToHex(buf)).toBe(expected);
    });
  },
);


describe.each(Object.entries(testVectorsx86hash32)
  .map(([k, v]) => [JSON.stringify(k), k, v]) as [string, string, u32][],
)(
  "x86.hash32(%s)",
  (jsonStr, str: string, expected: u32) => {
    test(`returns ${expected}`, () => {
      expect(x86.hash32(str)).toBe(expected);
    });
  },
);

describe.each(Object.entries(testVectorsx86hash128str)
  .map(([k, v]) => [JSON.stringify(k), k, v]),
)(
  "x86.hash128(%s)",
  (jsonStr, str: string, expected: string) => {
    test(`returns ${expected}`, () => {
      expect(x86.hash128(str)).toBe(expected);
    });
  },
);

describe.each(Object.entries(testVectorsx86hash128buf)
  .map(([k, v]) => [strToBuf(k), v]),
)(
  "x86.hash128(%p)",
  (buf: Uint8Array, expected: Uint8Array) => {
    test(`returns ${expected}`, () => {
      expect(x86.hash128(buf)).toEqual(expected);
    });
  },
);

describe.each(Object.entries(testVectorsx64hash128str)
  .map(([k, v]) => [JSON.stringify(k), k, v]),
)(
  "x64.hash128(%s)",
  (jsonStr, str: string, expected: string) => {
    test(`returns ${expected}`, () => {
      expect(x64.hash128(str)).toBe(expected);
    });
  },
);

describe.each(Object.entries(testVectorsx64hash128buf)
  .map(([k, v]) => [strToBuf(k), v]),
)(
  "x64.hash128(%p)",
  (buf: Uint8Array, expected: Uint8Array) => {
    test(`returns ${expected}`, () => {
      expect(x64.hash128(buf)).toEqual(expected);
    });
  },
);


describe.each(
  Object.entries(testVectorsx86hash32)
    .slice(1, -1)
    .flatMap(([k, v]) => (
      // tslint:disable-next-line: prefer-array-literal
      [...new Array(k.length - 1).keys()].map(i => [
        JSON.stringify(k), i + 1, chunk(k, i + 1), v,
      ])
    )),
)(
  "x86.hash32(chunk(%s, %p))",
  (jsonStr, size, chunks, expected) => {
    test(`returns ${expected}`, () => {
      let state: u32 | x86hash32State = 0x0;
      for (const chunk of chunks as string[]) {
        state = x86.hash32(chunk, state, false);
      }
      
      expect(x86.hash32(undefined, state, true)).toBe(expected);
      expect(x86.hash32("", state, true)).toBe(expected);
    });
  },
);

describe.each(
  Object.entries(testVectorsx86hash128str)
    .slice(1, -1)
    .flatMap(([k, v]) => (
      // tslint:disable-next-line: prefer-array-literal
      [...new Array(k.length - 1).keys()].map(i => [
        JSON.stringify(k), i + 1, chunk(k, i + 1), v,
      ])
    ),
))(
  "x86.hash128(chunk(%s, %p))",
  (jsonStr, size, chunks, expected) => {
    test(`returns ${expected}`, () => {
      let state: u32 | x86hash128State = 0x0;
      for (const chunk of chunks as string[]) {
        state = x86.hash128(chunk, state, false);
      }
      
      expect(x86.hash128("", state, true)).toBe(expected);
    });
  },
);

describe.each(
  Object.entries(testVectorsx86hash128buf)
    .slice(1)
    .map(([k, v]) => [strToBuf(k), k, v] as [Uint8Array, string, Uint8Array])
    .flatMap(([k, s, v]) => (
      // tslint:disable-next-line: prefer-array-literal
      [...new Array(k.byteLength - 1).keys()].map(i => [
        JSON.stringify(s), i + 1, chunk(k, i + 1), v,
      ])
    )),
)(
  "x86.hash128(chunk(strToBuf(%s), %p))",
  (jsonStr, size, chunks, expected) => {
    test(`returns ${expected}`, () => {
      let state: u32 | x86hash128State = 0x0;
      for (const chunk of chunks as Uint8Array[]) {
        state = x86.hash128(chunk, state, false);
      }
      
      expect(x86.hash128(undefined, state, true)).toEqual(expected);
    });
  },
);

describe.each(
  Object.entries(testVectorsx64hash128str)
    .slice(1, -1)
    .flatMap(([k, v]) => (
      // tslint:disable-next-line: prefer-array-literal
      [...new Array(k.length - 1).keys()].map(i => [
        JSON.stringify(k), i + 1, chunk(k, i + 1), v,
      ])
    )),
)(
  "x64.hash128(chunk(%s, %p))",
  (jsonStr, size, chunks, expected) => {
    test(`returns ${expected}`, () => {
      let state: u32 | x64hash128State = 0x0;
      for (const chunk of chunks as string[]) {
        state = x64.hash128(chunk, state, false);
      }
      
      expect(x64.hash128("", state, true)).toBe(expected);
    });
  },
);

describe.each(
  Object.entries(testVectorsx64hash128buf)
    .slice(1)
    .map(([k, v]) => [strToBuf(k), k, v] as [Uint8Array, string, Uint8Array])
    .flatMap(([k, s, v]) => (
      // tslint:disable-next-line: prefer-array-literal
      [...new Array(k.byteLength - 1).keys()].map(i => [
        JSON.stringify(s), i + 1, chunk(k, i + 1), v,
      ])
    )),
)(
  "x64.hash128(chunk(strToBuf(%s), %p))",
  (jsonStr, size, chunks, expected) => {
    test(`returns ${expected}`, () => {
      let state: u32 | x64hash128State = 0x0;
      for (const chunk of chunks as Uint8Array[]) {
        state = x64.hash128(chunk, state, false);
      }
      
      expect(x64.hash128(undefined, state, true)).toEqual(expected);
    });
  },
);
