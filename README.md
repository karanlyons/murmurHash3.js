[![npm version](https://badge.fury.io/js/murmurhash3.js.svg)](https://badge.fury.io/js/murmurhash3.js)

## MurmurHash3.js
A javascript implementation of
[MurmurHash3](https://github.com/aappleby/smhasher/blob/master/src/MurmurHash3.cpp)’s
hashing algorithms.

```javascript
> murmurHash3 = require('mumurHash3.js');

// Return a 32bit hash as an unsigned integer:
> murmurHash3.x86.hash32("I will not buy this record, it is scratched.");
  2832214938

// Return a 128bit hash as a hexadecimal string:
> murmurHash3.x86.hash128("I will not buy this tobacconist's, it is scratched.");
  '9b5b7ba2ef3f7866889adeaf00f3f98e'
> murmurHash3.x64.hash128("I will not buy this tobacconist's, it is scratched.");
  'd30654abbd8227e367d73523f0079673'

// Specify a starting seed (defaults to 0x0):
> murmurHash3.x86.hash32("My hovercraft is full of eels.", 25);
  2520298415

// Hash buffers:
> const buf = new Uint8Array([...new Array(256).keys()]);
> murmurHash3.x86.hash32(buf);
  3825864278
> murmurHash3.x86.hash128(buf);
  Uint8Array [44, 86, 200, 143, 219, 69, 3, 223, 211, 82, 178, 26, 73, 76, 162, 192];

// Progressively hash streams of data as either buffers or strings:
> const state32 = murmurHash3.x86.hash32(buf.slice(0, 127), 0x0, false);
> murmurHash3.x86.hash32(buf.slice(127), state32, true);
  3825864278
> const state128 = murmurHash3.x86.hash128(buf.slice(0, 127), 0x0, false);
> murmurHash3.x86.hash128(buf.slice(127), state128, true);
  Uint8Array [44, 86, 200, 143, 219, 69, 3, 223, 211, 82, 178, 26, 73, 76, 162, 192];
```

```javascript
murmurHash3 = {
  version: string,
  strToBuf: (str: string = ""): Uint8Array,
  bufToHex: (buf: Uint8Array = new Uint8Array(0)): string,
  x86: {
    hash32: (
      buf: Uint8Array | string = new Uint8Array(0),
      state: u32 | x86hash32State = 0x0,
      finalize: boolean = true,
    ): u32 | x86hash32State,
    hash128: (
      buf: Uint8Array | string = new Uint8Array(0),
      state: u32 | x86hash128State = 0x0,
      finalize: boolean = true
    ): Uint8Array | string | x86hash128State,
  },
  x64: {
    hash128: (
      buf: Uint8Array | string = new Uint8Array(0),
      state: u32 | x64hash128State = 0x0,
      finalize: boolean = true
    ): Uint8Array| string | x64hash128State,
  },
}
```

Requires [`TextEncoder`](https://caniuse.com/#feat=textencoder),
[Typed Arrays & `DataView`](https://caniuse.com/#feat=typedarrays), and additional
[es6/es2015](https://caniuse.com/#feat=es6) features; bring your own transpiler and
polyfills to target the past.
