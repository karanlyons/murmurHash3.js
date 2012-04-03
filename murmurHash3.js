// +----------------------------------------------------------------------+
// | murmurHash3.js v1.0.0 (http://github.com/karanlyons/murmurHash.js)   |
// | A javascript implementation of MurmurHash3's x86 hashing algorithms. |
// |----------------------------------------------------------------------|
// | Copyright (c) 2012 Karan Lyons                                       |
// | Freely distributable under the MIT license.                          |
// +----------------------------------------------------------------------+


;(function (root, undefined) {
	'use strict';
	
	// Create a local object that'll be exported or referenced globally.
	var library = {
		'version': '1.0.0'
	};
	
	
	
	// PRIVATE FUNCTIONS
	// -----------------
	
	function _add(m, n) {
		//
		// Given two 32bit ints, returns the two added together as a 32bit int.
		//
		
		return (((m & 0xffff) + (n & 0xffff)) + ((((m >>> 16) + (n >>> 16)) & 0xffff) << 16));
	}
	
	function _multiply(m, n) {
		//
		// Given a 32bit int and a multiplier, returns the multiplied
		// 32bit int.
		//
		
		return ((((m & 0xffff) * n) + ((((m >>> 16) * n) & 0xffff) << 16))) & 0xffffffff;
	}
	
	function _rotl(m, n) {
		//
		// Given a 32bit int and an int representing a number of bit positions,
		// returns the 32bit int rotated left by that number of positions.
		//
		
		return (m << n) | (m >>> (32 - n));
	}
	
	function _fmix(h) {
		//
		// Given a block, returns murmurHash3's final mix of that block.
		//
		
		h ^= h >>> 16;
		h  = _multiply(h, 0x85ebca6b);
		h ^= h >>> 13;
		h  = _multiply(h, 0xc2b2ae35);
		h ^= h >>> 16;
		
		return h;
	}
	
	
	
	// PUBLIC FUNCTIONS
	// ----------------
	
	library.hash32 = function (key, seed) {
		//
		// Given a string, returns a 32 bit hash using the x86 flavor
		// of MurmurHash3, as an unsigned int.
		// (Source: 
		//	http://code.google.com/p/smhasher/source/browse/trunk/MurmurHash3.cpp)
		//
		
		var key = key || '';
		var seed = seed || 0;
		
		var remainder = key.length % 4;
		var bytes = key.length - remainder;
		
		var h1 = seed;
		
		var c1 = 0xcc9e2d51;
		var c2 = 0x1b873593;
		
		for (var i = 0; i < bytes; i = i + 4) {
			var k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24);
			
			k1 = _multiply(k1, c1);
			k1 = _rotl(k1, 15);
			k1 = _multiply(k1, c2);
			
			h1 ^= k1;
			h1 = _rotl(h1, 13);
			h1 = _add(_multiply(h1, 5), 0xe6546b64);
		}
		
		k1 = 0;
		
		switch (remainder) {
			case 3:
				k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
			
			case 2:
				k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
			
			case 1:
				k1 ^= (key.charCodeAt(i) & 0xff);
				k1 = _multiply(k1, c1);
				k1 = _rotl(k1, 15);
				k1 = _multiply(k1, c2);
				h1 ^= k1;
		}
		
		h1 ^= key.length;
		h1 = _fmix(h1);
		
		return h1 >>> 0;
	}
	
	
	library.hash128 = function (key, seed) {
		//
		// Given a string, returns a 128 bit hash using the x86 flavor
		// of MurmurHash3, as an unsigned hex.
		// (Source: 
		//	http://code.google.com/p/smhasher/source/browse/trunk/MurmurHash3.cpp)
		//
		
		var key = key || '';
		var seed = seed || 0;
		
		var remainder = key.length % 16;
		var bytes = key.length - remainder;
		
		var h1 = seed;
		var h2 = seed;
		var h3 = seed;
		var h4 = seed;
		
		var c1 = 0x239b961b;
		var c2 = 0xab0e9789;
		var c3 = 0x38b34ae5;
		var c4 = 0xa1e38b93;
		
		for (var i = 0; i < bytes; i = i + 16) {
			var k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24);
			var k2 = ((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24);
			var k3 = ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24);
			var k4 = ((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24);
			
			k1 = _multiply(k1, c1);
			k1 = _rotl(k1, 15);
			k1 = _multiply(k1, c2);
			h1 ^= k1;
			
			h1 = _rotl(h1, 19);
			h1 = _add(h1, h2);
			h1 = _add(_multiply(h1, 5), 0x561ccd1b);
			
			k2 = _multiply(k2, c2);
			k2 = _rotl(k2, 16);
			k2 = _multiply(k2, c3);
			h2 ^= k2;
			
			h2 = _rotl(h2, 17);
			h2 = _add(h2, h3);
			h2 = _add(_multiply(h2, 5), 0x0bcaa747);
			
			k3 = _multiply(k3, c3);
			k3 = _rotl(k3, 17);
			k3 = _multiply(k3, c4);
			h3 ^= k3;
			
			h3 = _rotl(h3, 15);
			h3 = _add(h3, h4);
			h3 = _add(_multiply(h3, 5), 0x96cd1c35);
			
			k4 = _multiply(k4, c4);
			k4 = _rotl(k4, 18);
			k4 = _multiply(k4, c1);
			h4 ^= k4;
			
			h4 = _rotl(h4, 13);
			h4 = _add(h4, h1);
			h4 = _add(_multiply(h4, 5), 0x32ac3b17);
		}
		
		k1 = 0;
		k2 = 0;
		k3 = 0;
		k4 = 0;
		
		switch (remainder) {
			case 15:
				k4 ^= key.charCodeAt(i + 14) << 16;
			
			case 14:
				k4 ^= key.charCodeAt(i + 13) << 8;
			
			case 13:
				k4 ^= key.charCodeAt(i + 12) << 0;
				k4 = _multiply(k4, c4);
				k4 = _rotl(k4, 18);
				k4 = _multiply(k4, c1);
				h4 ^= k4;
			
			case 12:
				k3 ^= key.charCodeAt(i + 11) << 24;
			
			case 11:
				k3 ^= key.charCodeAt(i + 10) << 16;
			
			case 10:
				k3 ^= key.charCodeAt(i + 9) << 8;
			
			case 9:
				k3 ^= key.charCodeAt(i + 8) << 0;
				k3 = _multiply(k3, c3);
				k3 = _rotl(k3, 17);
				k3 = _multiply(k3, c4);
				h3 ^= k3;
			
			case 8:
				k2 ^= key.charCodeAt(i + 7) << 24;
			
			case 7:
				k2 ^= key.charCodeAt(i + 6) << 16;
			
			case 6:
				k2 ^= key.charCodeAt(i + 5) << 8;
			
			case 5:
				k2 ^= key.charCodeAt(i + 4) << 0;
				k2 = _multiply(k2, c2);
				k2 = _rotl(k2, 16);
				k2 = _multiply(k2, c3);
				h2 ^= k2;
			
			case 4:
				k1 ^= key.charCodeAt(i + 3) << 24;
			
			case 3:
				k1 ^= key.charCodeAt(i + 2) << 16;
			
			case 2:
				k1 ^= key.charCodeAt(i + 1) << 8;
			
			case 1:
				k1 ^= key.charCodeAt(i + 0) << 0;
				k1 = _multiply(k1, c1);
				k1 = _rotl(k1, 15);
				k1 = _multiply(k1, c2);
				h1 ^= k1;
		};
		
		h1 ^= key.length;
		h2 ^= key.length;
		h3 ^= key.length;
		h4 ^= key.length;
		
		h1 = _add(h1, h2);
		h1 = _add(h1, h3);
		h1 = _add(h1, h4);
		h2 = _add(h2, h1);
		h3 = _add(h3, h1);
		h4 = _add(h4, h1);
		
		h1 = _fmix(h1);
		h2 = _fmix(h2);
		h3 = _fmix(h3);
		h4 = _fmix(h4);
		
		h1 = _add(h1, h2);
		h1 = _add(h1, h3);
		h1 = _add(h1, h4);
		h2 = _add(h2, h1);
		h3 = _add(h3, h1);
		h4 = _add(h4, h1);
		
		return ("00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(16)).slice(-8) + ("00000000" + (h3 >>> 0).toString(16)).slice(-8);
	}
	
	
	
	// INITIALIZATION
	// --------------
	
	// Export murmurHash3 for CommonJS, either as an AMD module or just as part
	// of the global object.
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = library;
		}
		
		exports.murmurHash3 = library;
	}
	
	else if (typeof define === 'function' && define.amd) {
		define([], function() {
			return library;
		});
	}
	
	else {
		// Use murmurHash3.noConflict to restore `murmurHash3` back to its
		// original value. Returns a reference to the library object, to allow
		// it to be used under a different name.
		library.noConflict = (function (oldmurmurHash3) {
			return function () {
				root.murmurHash3 = oldmurmurHash3;
				library.noConflict = undefined;
				return library;
			};
		})(root.murmurHash3);
		
		root['murmurHash3'] = library;
	}
})(this);