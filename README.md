# MurmurHash3.js
**A javascript implementation of [MurmurHash3](http://code.google.com/p/smhasher/source/browse/trunk/MurmurHash3.cpp?spec=svn145&r=144)'s hashing algorithms.**

## Usage
```javascript
// Return a 32bit hash as a unsigned int:
murmurHash3.x86.hash32("I will not buy this record, it is scratched.") // 2832214938

// Return a 128bit hash as a unsigned hex:
murmurHash3.x86.hash128("I will not buy this tobacconist's, it is scratched.") // "ef3f78669b5b7ba200f3f98e889adeaf"
murmurHash3.x64.hash128("I will not buy this tobacconist's, it is scratched.") // "d30654abbd8227e367d73523f0079673"

// Specify a seed (defaults to 0):
murmurHash3.x86.hash32("My hovercraft is full of eels.", 25) // 2520298415

// Rebind murmurHash3:
somethingCompletelyDifferent = murmurHash3.noConflict()
```

## License

Copyright © 2012 Karan Lyons

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
