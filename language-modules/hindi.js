(function() {
    window.transliterationModules = window.transliterationModules || {};
    
    // Hindi transliteration module
    window.transliterationModules.hindi = {
        name: "Hindi",
        code: "hi",

      // Mapping dictionaries (converted from mappings_hindi.py)
        C: {
            'k': 'क', 
            'kqh': 'ख',
            'g': 'ग',
            'gqh': 'घ',
            'ch': 'च',
            'chqh': 'छ', 
            'j': 'ज',
            'jqh': 'झ',
            'T': 'ट', 
            't': 'त',
            'Tqh': 'ठ',
            'tqh': 'थ',
            'D': 'ड',
            'd': 'द',
            'Dqh': 'ढ',
            'dqh': 'ध',
            'N': 'ण', 
            'n': 'न',
            'p': 'प',
            'pqh': 'फ',
            'b': 'ब',
            'bqh': 'भ',
            'm': 'म',
            'y': 'य',
            'Y': 'ञ',
            'r': 'र', 
            'l': 'ल',
            'v': 'व',
            'V': 'ङ',
            'sqh': 'श', 
            'S': 'ष',
            's': 'स',
            'h': 'ह',
            'L': 'ळ',
            'kqS': 'क्ष',
            'kqSqh': 'क्ष',
            'kqsqh': 'क्ष',
            'dqnqy': 'ज्ञ',
            'gqnqy': 'ज्ञ', 
            'sqhqr': 'श्र', 
            'Qk': 'क़',
            'Qkqh': 'ख़',
            'Qg': 'ग़',
            'Qj': 'ज़',
            'QP': 'फ़',
            'QD': 'ड़',
            'Qy': 'य़',
            'Qn': 'ऩ',
            'Qr': 'ऱ',
            'QL': 'ऴ',
            'QDqh': 'ढ़',
            'Qv': 'व़',
            'Zg': '\u097B',
            'Zj': '\u097C',
            'ZD': '\u097E',
            'Zb': '\u097F',
            'DqDqA': '\u0978',
            'ZHA': '\u0979',
            'JYqA': '\u097A',
            'ZK': '\u097D'
        },
        
        // Dependent vowels (matras)
        v: {
            'aa': 'ा', 
            'a': 'ा', 
            'i': 'ि',
            'ii': 'ी', 
            'ee': 'ी',
            'u': 'ु',
            'uu': 'ू',
            'oo': 'ू', 
            'e': 'े',
            'ai': 'ै',
            'o': 'ो',
            'au': 'ा' + 'ै',
            'ou': 'ा' + 'ै',
            'aE': 'ॅ',
            'aO': 'ॉ',
            // The following keys for AO/AE have been left empty per the original mapping
            'AO': '',
            'AE': '',
            'zau': '\u094F',
            'zo': '\u094A',
            'ze': 'ॆ',
            'Rri': 'ृ',
            'RrI': '\u0944',
            'Lqlqi': '\u0962',
            'LqlqI': '\u0963'
        },
        
        // Independent vowels
        V: {
            'a': 'अ',
            'aa': 'आ',
            'A': 'अ',
            'AA': 'आ',
            'i': 'इ',
            'ii': 'ई',
            'I': 'इ',
            'II': 'ई',
            'ee': 'ई',
            'u': 'उ',
            'uu': 'ऊ',
            'U': 'उ',
            'UU': 'ऊ',
            'oo': 'ऊ',
            'e': 'ए',
            'ai': 'ऐ',
            'E': 'ए',
            'EE': 'ऐ',
            'o': 'ओ',
            'O': 'ओ',
            'au': 'औ',
            'AU': 'औ',
            'ou': 'औ',
            'RRi': 'ऋ',  
            'RRI': 'ॠ',
            'LqLqi': 'ऌ',
            'LqLqI': 'ॡ',
            'zAU': 'ॵ',
            'zO': '\u0912',
            'zEE': 'ऎ',
            'zA': 'ऄ',
            'zau': "\u094F",
            'zo': '\u094A',
            'ze': '\u0943',
            // The following empty keys from the python mapping have been omitted.
            'AO': 'ऑ',
            'AE': 'ॲ',
            'aE': '',
            'aO': ''
        },
        
        // Miscellaneous symbols: halant, nukta, punctuation, numerals etc.
        misc: {
            'M': 'ं',
            'H': 'ः',
            'MM': 'ँ',
            'F': 'ऽ',
            'q': '्',  // halant
            '.N': '◌़', 
            ' ': ' ',
            '.': '.',
            'f': '।',
            'ff': '॥',
            // Abbreviation and spacing signs – keys with empty names in Python are omitted.
            '0': '०',
            '1': '१',
            '2': '२',
            '3': '३',
            '4': '४',
            '5': '५',
            '6': '६',
            '7': '७',
            '8': '८',
            '9': '९',
            'om': 'ॐ',
            'AUM': 'ॐ',
            'W': '\u200D', // ZWJ
            'w': '\u200C'  // ZWNJ
        },
        
        // Flags to handle language rules
        flags: {
            makeNextVowelDependent: false,
            use2CharsVowelNext: true
        },
        
        /**
         * Process the current input buffer and determine if a mapping should occur.
         * The function examines the last 5, 4, 3, 2, and 1 characters (padding with spaces if needed)
         * and then applies logic similar to the Python keyPressEvent.
         *
         * @param {Array} buffer - An array of strings (each a key pressed).
         * @returns {Object} An object with keys:
         *   found (boolean),
         *   replacement (string),
         *   deleteCount (number),
         *   bufferUpdate: { start, end, replacement: [string] }
         */
        processBuffer: function(buffer) {
            let text = buffer.join('');
            let len = text.length;
            
            // Helper: pad a string on the left to a given length with spaces.
            function padLeft(str, length) {
            return (" ".repeat(length) + str).slice(-length);
            }
            
            let key5 = padLeft(text.slice(-5), 5);
            let key4 = padLeft(text.slice(-4), 4);
            let key3 = padLeft(text.slice(-3), 3);
            let key2 = padLeft(text.slice(-2), 2);
            let key1 = text.slice(-1);
            
            // 1. EDGE CASE: if first char of key5 is a consonant and key5[2]=='r' and key5[4]=='u'
            if (this.C[key5[0]] && key5[2] === 'r' && key5[4] === 'u') {
            return {
                found: true,
                replacement: this.C[key5[0]] + this.v['Rri'],
                deleteCount: 4,
                bufferUpdate: { start: len - 4, end: len, replacement: [this.C[key5[0]] + this.v['Rri']] }
            };
            }
            
            // 2. Check if key5 (last 5 chars) exactly matches a consonant mapping.
            if (this.C[key5]) {
            if (key5 === 'sqhqr') {
                return {
                found: true,
                replacement: this.C[key5],
                deleteCount: 2,
                bufferUpdate: { start: len - 2, end: len, replacement: [this.C[key5]] }
                };
            } else {
                let rep = this.C[key5];
                if (key5 !== 'DqDqA') {
                rep += this.misc['q'];  // auto-add halant
                }
                this.flags.makeNextVowelDependent = true;
                this.flags.use2CharsVowelNext = true;
                return {
                found: true,
                replacement: rep,
                deleteCount: 4,
                bufferUpdate: { start: len - 4, end: len, replacement: [rep] }
                };
            }
            }
            
            // 3. If key4 is in C, with special cases
            if (this.C[key4]) {
            if (['Qkqh','QDqh','chqh'].indexOf(key4) !== -1) {
                let rep = this.C[key4] + this.misc['q'];
                this.flags.makeNextVowelDependent = true;
                this.flags.use2CharsVowelNext = true;
                return {
                found: true,
                replacement: rep,
                deleteCount: 3,
                bufferUpdate: { start: len - 3, end: len, replacement: [rep] }
                };
            }
            if (key4 === 'JYqA') {
                return {
                found: true,
                replacement: this.C[key4],
                deleteCount: 3,
                bufferUpdate: { start: len - 3, end: len, replacement: [this.C[key4]] }
                };
            }
            // Default for key4
            let rep = this.C[key4] + this.misc['q'];
            this.flags.makeNextVowelDependent = true;
            this.flags.use2CharsVowelNext = true;
            return {
                found: true,
                replacement: rep,
                deleteCount: 3,
                bufferUpdate: { start: len - 3, end: len, replacement: [rep] }
            };
            }
            
            // 4. If key3 is in C
            if (this.C[key3]) {
            if (key3 === 'ZHA') {
                return {
                found: true,
                replacement: this.C[key3],
                deleteCount: 1,
                bufferUpdate: { start: len - 1, end: len, replacement: [this.C[key3]] }
                };
            } else {
                let rep = this.C[key3] + this.misc['q'];
                this.flags.makeNextVowelDependent = true;
                this.flags.use2CharsVowelNext = true;
                return {
                found: true,
                replacement: rep,
                deleteCount: 2,
                bufferUpdate: { start: len - 2, end: len, replacement: [rep] }
                };
            }
            }
            
            // 5. If key3 is in misc (for items like AUM)
            if (this.misc[key3]) {
            this.flags.makeNextVowelDependent = false;
            this.flags.use2CharsVowelNext = true;
            return {
                found: true,
                replacement: this.misc[key3],
                deleteCount: 1,
                bufferUpdate: { start: len - 1, end: len, replacement: [this.misc[key3]] }
            };
            }
            
            // 6. If key2 is in C
            if (this.C[key2]) {
            if (['Zg','Zj','ZD','Zb','ZK'].indexOf(key2) !== -1) {
                return {
                found: true,
                replacement: this.C[key2],
                deleteCount: 1,
                bufferUpdate: { start: len - 1, end: len, replacement: [this.C[key2]] }
                };
            } else if (['ch','Qk','Qg','Qj','QP','QD','Qy','Qn','Qr','QL','Qv'].indexOf(key2) !== -1) {
                let rep = this.C[key2] + this.misc['q'];
                this.flags.makeNextVowelDependent = true;
                this.flags.use2CharsVowelNext = true;
                return {
                found: true,
                replacement: rep,
                deleteCount: 1,
                bufferUpdate: { start: len - 1, end: len, replacement: [rep] }
                };
            } else {
                let rep = this.C[key2] + this.misc['q'];
                this.flags.makeNextVowelDependent = true;
                this.flags.use2CharsVowelNext = true;
                return {
                found: true,
                replacement: rep,
                deleteCount: 1,
                bufferUpdate: { start: len - 1, end: len, replacement: [rep] }
                };
            }
            }
            
            // 7. If key2 is in misc
            if (this.misc[key2]) {
            this.flags.makeNextVowelDependent = false;
            this.flags.use2CharsVowelNext = true;
            return {
                found: true,
                replacement: this.misc[key2],
                deleteCount: 1,
                bufferUpdate: { start: len - 1, end: len, replacement: [this.misc[key2]] }
            };
            }
            
            // 8. If key1 is in misc
            if (this.misc[key1]) {
            if (key2 === 'q ') {
                return {
                found: true,
                replacement: this.misc[' '],
                deleteCount: 1,
                bufferUpdate: { start: len - 1, end: len, replacement: [this.misc[' ']] }
                };
            } else if (['w','W'].indexOf(key1) !== -1) {
                return {
                found: true,
                replacement: this.misc[key1],
                deleteCount: 0,
                bufferUpdate: { start: len, end: len, replacement: [this.misc[key1]] }
                };
            } else {
                this.flags.makeNextVowelDependent = false;
                this.flags.use2CharsVowelNext = true;
                return {
                found: true,
                replacement: this.misc[key1],
                deleteCount: 0,
                bufferUpdate: { start: len - 1, end: len, replacement: [this.misc[key1]] }
                };
            }
            }
            
            // 9. Vowel logic for key5
            if (['LqLqi','LqLqI'].indexOf(key5) !== -1) {
            this.flags.makeNextVowelDependent = false;
            return {
                found: true,
                replacement: this.V[key5],
                deleteCount: 4,
                bufferUpdate: { start: len - 4, end: len, replacement: [this.V[key5]] }
            };
            }
            if (['Lqlqi','LqlqI'].indexOf(key5) !== -1) {
            this.flags.makeNextVowelDependent = false;
            return {
                found: true,
                replacement: this.v[key5],
                deleteCount: 4,
                bufferUpdate: { start: len - 4, end: len, replacement: [this.v[key5]] }
            };
            }
            
            // 10. Vowel logic for single-character vowels:
            if (this.V[key1] || this.v[key1]) {
            if (!this.flags.makeNextVowelDependent) {
                // Insert as independent vowel
                this.flags.makeNextVowelDependent = false;
                this.flags.use2CharsVowelNext = true;
                return {
                found: true,
                replacement: this.V[key1],
                deleteCount: 0,
                bufferUpdate: { start: len - 1, end: len, replacement: [this.V[key1]] }
                };
            } else {
                // Insert as dependent vowel
                return {
                found: true,
                replacement: this.v[key1],
                deleteCount: 0,
                bufferUpdate: { start: len - 1, end: len, replacement: [this.v[key1]] }
                };
            }
            }
            
            // 11. If key1 is a consonant, insert it with auto-halant.
            if (this.C[key1]) {
            let rep = this.C[key1] + this.misc['q'];
            this.flags.makeNextVowelDependent = true;
            this.flags.use2CharsVowelNext = true;
            return {
                found: true,
                replacement: rep,
                deleteCount: 0,
                bufferUpdate: { start: len - 1, end: len, replacement: [rep] }
            };
            }
            
            // If no mapping was found, return false.
            return { found: false };
        },
        
        // (Optionally, you could keep a defaultProcessBuffer that falls back to simple character mapping.)
        defaultProcessBuffer: function(buffer) {
            // Fallback: simply return the last key as-is.
            return { found: false };
        },
        
        // A sample function to process a key event (to be wired into your text input)
        // This function would call processBuffer() on the current buffer (an array of key strings)
        // and then update the display accordingly.
        handleKeyEvent: function(event, buffer) {
            // (In an actual implementation you would update the buffer based on the key event)
            // For example:
            buffer.push(event.key);
            let result = this.processBuffer(buffer);
            if (result.found) {
            // Delete result.deleteCount keys from buffer and append the replacement.
            buffer.splice(buffer.length - result.deleteCount, result.deleteCount);
            buffer.push(result.replacement);
            }
            // Return the updated output string.
            return buffer.join('');
        }
    }; 
})();
        