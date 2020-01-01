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
  "9b5b7ba2ef3f7866889adeaf00f3f98e"
> murmurHash3.x64.hash128("I will not buy this tobacconist's, it is scratched.");
  "d30654abbd8227e367d73523f0079673"

// Specify a seed (defaults to 0x0):
> murmurHash3.x86.hash32("My hovercraft is full of eels.", 25);
  2520298415

// Hash buffers:
> const buf = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
> murmurHash3.x86.hash32(buf);
  420836317

// Progressively hash streams of data as either buffers or strings:
> const state = murmurHash3.x86.hash32(buf.slice(0, 8), 0x0, false);
> murmurHash3.x86.hash32(buf.slice(8), state, true);
  420836317
```

Requires [`TextEncoder`](https://caniuse.com/#feat=textencoder),
[`TypedArray`s & `DataView`](https://caniuse.com/#feat=typedarrays), and additional
[es6/es2015](https://caniuse.com/#feat=es6) features; bring your own transpiler and
polyfills to target the past.
