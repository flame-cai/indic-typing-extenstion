(function() {
    window.transliterationModules = window.transliterationModules || {};
    
    // Hindi transliteration module
    window.transliterationModules.hindi = {
        name: "Hindi",
        code: "hi",

        // Consonants
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
            'Qy': 'य़',
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
        
        // For easier comparison with simpler mappings
        simpleMap: {},
        complexMap: {},
        
        // Flags to handle language rules
        flags: {
            makeNextVowelDependent: false,
            use2CharsVowelNext: true,
            isBacktickPressed: false,
            englishBypass: false
        },
        
        // Internal state
        rawKeyBuffer: [],    // For tracking raw roman keys
        outputBuffer: [],    // For the output Hindi text
        
        // Helper function to pad strings with spaces
        padLeft: function(str, length) {
            return (" ".repeat(length) + str).slice(-length);
        },
        
        // Function to get last N characters from raw key buffer
        getLastChars: function(n) {
            console.log("Raw Key Buffer:", this.rawKeyBuffer); // Log the buffer
            let rawText = this.rawKeyBuffer.join('');
            if (rawText.length < n) {
                return this.padLeft(rawText, n);
            }
            return rawText.slice(-n);
        },
        
        // Function to delete previous N characters from output buffer
        deletePreviousChars: function(n) {
            if (this.outputBuffer.length >= n) {
                this.outputBuffer = this.outputBuffer.slice(0, -n);
            }
            return this.outputBuffer.join('');
        },
        
        // The required processBuffer function that conforms to the interface
        processBuffer: function(buffer) {
            this.rawKeyBuffer = buffer.slice(0, -1);
            const key = buffer[buffer.length - 1];
            
            // Save current state
            const oldOutput = this.outputBuffer.slice();
            
            // Process the key
            const result = this.processKey(key);
            
            // Determine what changed
            const oldOutputStr = oldOutput.join('');
            const replacement = result.substring(oldOutputStr.length);
            
            return {
                found: true,
                replacement: replacement,
                deleteCount: 0,
                bufferUpdate: {
                    start: buffer.length - 1,
                    end: buffer.length,
                    replacement: [replacement]
                }
            };
        },
        
        // Main function to process key input (keeping the original logic)
        processKey: function(key) {
            // Special key handling
            if (key === 'Enter' || key === 'Return') {
                this.flags.makeNextVowelDependent = false;
                this.rawKeyBuffer.push('\n');
                this.outputBuffer.push('\n');
                return this.outputBuffer.join('');
            } else if (key === 'ArrowLeft' || key === 'ArrowRight') {
                // Navigation keys - pass through
                return this.outputBuffer.join('');
            } else if (key === 'Shift') {
                // Modifier - pass through
                return this.outputBuffer.join('');
            } else if (key === 'F5') {
                // Reset all flags and clear context
                this.rawKeyBuffer = ['   '];
                this.outputBuffer = [];
                this.flags.makeNextVowelDependent = false;
                this.flags.use2CharsVowelNext = true;
                return '';
            } else if (key === 'Control' || key === 'Alt') {
                // Handle modifiers
                return this.outputBuffer.join('');
            } else if (key === 'Backspace') {
                if (this.outputBuffer.length > 1) {
                    this.rawKeyBuffer.pop();
                    this.outputBuffer.pop();
                    return this.outputBuffer.join('');
                } else {
                    this.rawKeyBuffer = [];
                    this.outputBuffer = [];
                    return '';
                }
            } else if (key === 'ArrowDown') {
                // Move cursor to start (implementation depends on your text input system)
                return this.outputBuffer.join('');
            } else if (key === 'ArrowUp') {
                // Move cursor to end (implementation depends on your text input system)
                return this.outputBuffer.join('');
            } else if (this.flags.englishBypass === true) {
                this.rawKeyBuffer.push(key);
                this.outputBuffer.push(key);
                return this.outputBuffer.join('');
            } else if (this.flags.isBacktickPressed) {
                if (/^[a-zA-Z]$/.test(key)) {
                    this.rawKeyBuffer.push(key);
                    this.outputBuffer.push(key);
                    this.rawKeyBuffer = ['   '];
                    this.flags.makeNextVowelDependent = false;
                    this.flags.use2CharsVowelNext = true;
                    this.flags.isBacktickPressed = false;
                }
                return this.outputBuffer.join('');
            } else if (key === '`') {  // Backtick key
                this.flags.isBacktickPressed = true;
                return this.outputBuffer.join('');
            } else {
                // Normal key processing
                this.rawKeyBuffer.push(key);
                
                // Get the last 5, 4, 3, 2, 1 characters from raw buffer
                let key_5 = this.getLastChars(5);
                let key_4 = this.getLastChars(4);
                let key_3 = this.getLastChars(3);
                let key_2 = this.getLastChars(2);
                let key_1 = this.getLastChars(1);
                
                // EDGE CASES
                if (key_5[0] in this.C && key_5[2] === 'r' && key_5[4] === 'u') {
                    // Remove the last 4 characters from raw buffer
                    this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -4);
                    
                    // Remove corresponding characters from output buffer and add new text
                    this.deletePreviousChars(4);
                    this.outputBuffer.push(this.C[key_5[0]] + this.v['Rri']);
                }
                
                // CONSONANTS AND MISC
                else if (key_5 in this.C) {
                    if (key_5 === 'sqhqr') {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -2);
                        this.deletePreviousChars(2);
                        this.outputBuffer.push(this.C[key_5]);
                    } else {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -4);
                        this.deletePreviousChars(4);
                        this.outputBuffer.push(this.C[key_5]);
                        if (key_5 !== 'DqDqA') {
                            // AUTO ADD HALANT
                            this.outputBuffer.push(this.misc['q']);
                            this.rawKeyBuffer.push('q'); // logging in english
                        }
                    }
                    
                    this.flags.makeNextVowelDependent = true;
                    this.flags.use2CharsVowelNext = true; // every consonant resets this FLAG aai, taai vs m'ou'
                }
                
                else if (key_4 in this.C) {
                    if (['Qkqh', 'QDqh'].includes(key_4)) {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -3);
                        this.deletePreviousChars(3);
                        this.outputBuffer.push(this.C[key_4]);
                        // AUTO ADD HALANT
                        this.outputBuffer.push(this.misc['q']);
                        this.rawKeyBuffer.push('q');
                    } else if (key_4 === 'chqh') {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -2);
                        this.deletePreviousChars(2);
                        this.outputBuffer.push(this.C[key_4]);
                        // AUTO ADD HALANT
                        this.outputBuffer.push(this.misc['q']);
                        this.rawKeyBuffer.push('q');
                    } else if (key_4 === 'JYqA') {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -3);
                        this.deletePreviousChars(3);
                        this.outputBuffer.push(this.C[key_4]);
                    } else {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -3);
                        this.deletePreviousChars(3);
                        this.outputBuffer.push(this.C[key_4]);
                        // AUTO ADD HALANT
                        this.outputBuffer.push(this.misc['q']);
                        this.rawKeyBuffer.push('q');
                    }
                    
                    this.flags.makeNextVowelDependent = true;
                    this.flags.use2CharsVowelNext = true;
                }
                
                else if (key_3 in this.C) {
                    if (key_3 === 'ZHA') { // no auto-halant after sindhi letters, and other rare consonants
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -1);
                        this.deletePreviousChars(1);
                        this.outputBuffer.push(this.C[key_3]);
                    } else {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -2);
                        this.deletePreviousChars(2);
                        this.outputBuffer.push(this.C[key_3]);
                        this.outputBuffer.push(this.misc['q']);
                        this.rawKeyBuffer.push('q');
                    }
                    
                    this.flags.makeNextVowelDependent = true;
                    this.flags.use2CharsVowelNext = true;
                }
                
                else if (key_3 in this.misc) { // AUM
                    this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -1);
                    this.deletePreviousChars(1);
                    this.outputBuffer.push(this.misc[key_3]);
                    this.flags.makeNextVowelDependent = false;
                    this.flags.use2CharsVowelNext = true;
                }
                
                else if (key_2 in this.C) {
                    if (['Zg', 'Zj', 'ZD', 'Zb', 'ZK'].includes(key_2)) {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -1);
                        this.deletePreviousChars(1);
                        this.outputBuffer.push(this.C[key_2]);
                    } else if (['ch', 'Qk', 'Qg', 'Qj', 'QP', 'QD', 'Qy', 'Qn', 'Qr', 'QL', 'Qv'].includes(key_2)) {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -1);
                        this.deletePreviousChars(1);
                        this.outputBuffer.push(this.C[key_2]);
                        // AUTO ADD HALANT
                        this.outputBuffer.push(this.misc['q']);
                        this.rawKeyBuffer.push('q');
                    } else {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -1);
                        this.deletePreviousChars(1);
                        this.outputBuffer.push(this.C[key_2]);
                        // AUTO ADD HALANT
                        this.outputBuffer.push(this.misc['q']);
                        this.rawKeyBuffer.push('q');
                    }
                    
                    this.flags.makeNextVowelDependent = true;
                    this.flags.use2CharsVowelNext = true;
                }
                
                else if (key_2 in this.misc) {
                    this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -1);
                    this.deletePreviousChars(1);
                    this.outputBuffer.push(this.misc[key_2]);
                    this.flags.makeNextVowelDependent = false;
                    this.flags.use2CharsVowelNext = true;
                }
                
                else if (key_1 in this.misc) {
                    if (key_2 === 'q ') {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -1);
                        this.deletePreviousChars(1);
                        this.outputBuffer.push(this.misc[' ']);
                    } else if (['w', 'W'].includes(key_1)) {
                        this.outputBuffer.push(this.misc[key_1]);
                    } else {
                        this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -1);
                        this.deletePreviousChars(1);
                        this.outputBuffer.push(this.misc[key_1]);
                    }
                    
                    this.flags.makeNextVowelDependent = false;
                    this.flags.use2CharsVowelNext = true;
                }
                
                // VOWEL LOGIC
                else if (['LqLqi', 'LqLqI'].includes(key_5)) {
                    this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -4);
                    this.deletePreviousChars(4);
                    this.outputBuffer.push(this.V[key_5]);
                    this.flags.makeNextVowelDependent = false;
                }
                
                else if (['Lqlqi', 'LqlqI'].includes(key_5)) {
                    this.rawKeyBuffer = this.rawKeyBuffer.slice(0, -4);
                    this.deletePreviousChars(4);
                    this.outputBuffer.push(this.v[key_5]);
                    this.flags.makeNextVowelDependent = false;
                }
                
                // Handle single-character vowels
                else if (this.V[key_1] || this.v[key_1]) {
                    if (!this.flags.makeNextVowelDependent) {
                        // Insert as independent vowel
                        if (this.V[key_1]) {
                            this.outputBuffer.push(this.V[key_1]);
                        }
                        this.flags.makeNextVowelDependent = false;
                        this.flags.use2CharsVowelNext = true;
                    } else {
                        // Insert as dependent vowel
                        if (this.v[key_1]) {
                            this.outputBuffer.push(this.v[key_1]);
                        }
                    }
                }
                
                // If key_1 is a consonant, insert it with auto-halant
                else if (this.C[key_1]) {
                    this.outputBuffer.push(this.C[key_1]);
                    this.outputBuffer.push(this.misc['q']);  // auto-halant
                    this.rawKeyBuffer.push(key_1);   
                    this.rawKeyBuffer.push('q');             // log the auto-halant
                    this.flags.makeNextVowelDependent = true;
                    this.flags.use2CharsVowelNext = true;
                }
                
                // If no mapping was found, just keep the key as-is in the output
                else {
                    // Do nothing or add the character as-is
                    this.outputBuffer.push(key_1);
                }
            }
            
            return this.outputBuffer.join('');
        },

        // Additional method for API compatibility
        defaultProcessBuffer: function(buffer) {
            return this.processBuffer(buffer);
        },

        // Function to reset the system completely
        reset: function() {
            this.rawKeyBuffer = [];
            this.outputBuffer = [];
            this.flags.makeNextVowelDependent = false;
            this.flags.use2CharsVowelNext = true;
            this.flags.isBacktickPressed = false;
            this.flags.englishBypass = false;
            return '';
        },
        
        // Function to get current raw key buffer (for debugging or display)
        getRawKeyBuffer: function() {
            return this.rawKeyBuffer.join('');
        },
        
        // Toggle English bypass mode
        toggleEnglishBypass: function() {
            this.flags.englishBypass = !this.flags.englishBypass;
            return this.flags.englishBypass;
        }
    };
})();