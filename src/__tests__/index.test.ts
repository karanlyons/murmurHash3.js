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

const testVectors: Record<string, [u32, string, string]> = {
  // Ignore for all chunk tests as this is an empty buffer.
  "": [
    0,
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
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
  "我的气垫船装满了鳗鱼": [
    1553108894,
    "3ffaf018ca173b58c4e26affcd6a7d02",
    "e52c1f398ab5f107e77b2d1eab4e8cc9",
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
    chunk(testVectorsx86hash128str[key], 2).map(s => parseInt(s, 16))
  );
  testVectorsx64hash128buf[key] = new Uint8Array(
    chunk(testVectorsx64hash128str[key], 2).map(s => parseInt(s, 16))
  );
}


describe.each(
  // tslint:disable-next-line: prefer-array-literal
  [...new Array(256).keys()]
    .map(i => [
      new Uint8Array([i, 255 - i]),
      `${i.toString(16).padStart(2, "0")}${(255 - i).toString(16).padStart(2, "0")}`,
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
