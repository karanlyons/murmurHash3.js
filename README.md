[![npm version](https://badge.fury.io/js/murmurhash3.js.svg)](https://badge.fury.io/js/murmurhash3.js)

# MurmurHash3.js
**A javascript implementation of 
[MurmurHash3](https://github.com/aappleby/smhasher/blob/master/src/MurmurHash3.cpp)'s 
hashing algorithms.**

## Usage
```javascript
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

## License

Copyright © 2012–2019 Karan Lyons

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

The software is provided "as is", without warranty of any kind, express or implied,
including but not limited to the warranties of merchantability, fitness for a particular
purpose and non-infringement. In no event shall the authors or copyright holders be liable
for any claim, damages or other liability, whether in an action of contract, tort or
otherwise, arising from, out of or in connection with the software or the use or other
dealings in the software.
