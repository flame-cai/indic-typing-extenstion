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
            let rawText = this.rawKeyBuffer.join('');
            if (rawText.length < n) {
                return this.padLeft(rawText, n);
            }
            return rawText.slice(-n);
        },

        // The main processBuffer function that conforms to the interface
        processBuffer: function(buffer) {
            const key = buffer[buffer.length - 1];
            console.log('Raw buffer:', this.rawKeyBuffer);
            console.log('Last key pressed:', key);
            // Special key handling
            if (key === 'Enter' || key === 'Return') {
                return {
                    found: true,
                    replacement: '\n',
                    deleteCount: 0,
                    bufferUpdate: {
                        start: buffer.length - 1,
                        end: buffer.length,
                        replacement: ['\n']
                    }
                };
            } else if (key === 'Backspace' || key === 'ArrowLeft' || key === 'ArrowRight' || 
                    key === 'Shift' || key === 'Control' || key === 'Alt') {
                // Pass through navigation and control keys
                return {
                    found: false,
                    replacement: '',
                    deleteCount: 0,
                    bufferUpdate: {
                        start: buffer.length - 1,
                        end: buffer.length,
                        replacement: []
                    }
                };
            } else if (key === 'F5') {
                // Reset all flags
                this.flags.makeNextVowelDependent = false;
                this.flags.use2CharsVowelNext = true;
                return {
                    found: true,
                    replacement: '',
                    deleteCount: buffer.length,
                    bufferUpdate: {
                        start: 0,
                        end: buffer.length,
                        replacement: []
                    }
                };
            } else if (key === '`') {
                // Toggle English bypass mode
                this.flags.isBacktickPressed = true;
                return {
                    found: true,
                    replacement: '',
                    deleteCount: 0,
                    bufferUpdate: {
                        start: buffer.length - 1,
                        end: buffer.length,
                        replacement: []
                    }
                };
            } else if (this.flags.englishBypass === true) {
                return {
                    found: true,
                    replacement: key,
                    deleteCount: 0,
                    bufferUpdate: {
                        start: buffer.length - 1,
                        end: buffer.length,
                        replacement: [key]
                    }
                };
            } else if (this.flags.isBacktickPressed) {
                if (/^[a-zA-Z]$/.test(key)) {
                    this.flags.isBacktickPressed = false;
                    return {
                        found: true,
                        replacement: key,
                        deleteCount: 0,
                        bufferUpdate: {
                            start: buffer.length - 1,
                            end: buffer.length,
                            replacement: [key]
                        }
                    };
                }
                return {
                    found: false,
                    replacement: '',
                    deleteCount: 0,
                    bufferUpdate: {
                        start: buffer.length - 1,
                        end: buffer.length,
                        replacement: []
                    }
                };
            }

            this.rawKeyBuffer.push(key);

            // // Make a copy of the buffer for our processing
            // // this.rawKeyBuffer = buffer.slice();
            // if (!this.rawKeyBuffer || this.rawKeyBuffer.length === 0) {
            //     // Initialize if empty
            //     this.rawKeyBuffer = buffer.slice();
            // } else {
            //     // Just add the new key
            //     this.rawKeyBuffer.push(key);
            // }
            
            // Get the last 5, 4, 3, 2, 1 characters from raw buffer
            let key_5 = this.getLastChars(5);
            let key_4 = this.getLastChars(4);
            let key_3 = this.getLastChars(3);
            let key_2 = this.getLastChars(2);
            let key_1 = this.getLastChars(1);
            
            // Process 5-character sequences
            if (key_5 in this.C) {
                if (key_5 === 'sqhqr') {
                    return {
                        found: true,
                        replacement: this.C[key_5],
                        deleteCount: 4,
                        bufferUpdate: {
                            start: buffer.length - 5,
                            end: buffer.length,
                            replacement: [this.C[key_5]]
                        }
                    };
                } else {
                    const replacement = key_5 !== 'DqDqA' ? this.C[key_5] + this.misc['q'] : this.C[key_5];
                    this.flags.makeNextVowelDependent = true;
                    this.flags.use2CharsVowelNext = true;
                    return {
                        found: true,
                        replacement: replacement,
                        deleteCount: 4,
                        bufferUpdate: {
                            start: buffer.length - 5,
                            end: buffer.length,
                            replacement: [replacement]
                        }
                    };
                }
            }
            
            // Special edge case for consonant + 'r' + 'u'
            if (key_5[0] in this.C && key_5[2] === 'r' && key_5[4] === 'u') {
                const replacement = this.C[key_5[0]] + this.v['Rri'];
                this.flags.makeNextVowelDependent = true;
                return {
                    found: true,
                    replacement: replacement,
                    deleteCount: 4,
                    bufferUpdate: {
                        start: buffer.length - 5,
                        end: buffer.length,
                        replacement: [replacement]
                    }
                };
            }
            
            // Process 4-character sequences
            if (key_4 in this.C) {
                let replacement = '';
                if (['Qkqh', 'QDqh'].includes(key_4)) {
                    replacement = this.C[key_4] + this.misc['q'];
                } else if (key_4 === 'chqh') {
                    replacement = this.C[key_4] + this.misc['q'];
                } else if (key_4 === 'JYqA') {
                    replacement = this.C[key_4];
                } else {
                    replacement = this.C[key_4] + this.misc['q'];
                }
                
                this.flags.makeNextVowelDependent = true;
                this.flags.use2CharsVowelNext = true;
                
                return {
                    found: true,
                    replacement: replacement,
                    deleteCount: 3,
                    bufferUpdate: {
                        start: buffer.length - 4,
                        end: buffer.length,
                        replacement: [replacement]
                    }
                };
            }
            
            // Process vowels - check LqLqi type first
            if (['LqLqi', 'LqLqI'].includes(key_5)) {
                this.flags.makeNextVowelDependent = false;
                return {
                    found: true,
                    replacement: this.v[key_5],
                    deleteCount: 4,
                    bufferUpdate: {
                        start: buffer.length - 5,
                        end: buffer.length,
                        replacement: [this.v[key_5]]
                    }
                };
            }
            
            if (['LqLqi', 'LqLqI'].includes(key_5)) {
                this.flags.makeNextVowelDependent = false;
                return {
                    found: true,
                    replacement: this.V[key_5],
                    deleteCount: 4,
                    bufferUpdate: {
                        start: buffer.length - 5,
                        end: buffer.length,
                        replacement: [this.V[key_5]]
                    }
                };
            }
            
            // Process 3-character sequences
            if (key_3 in this.C) {
                let replacement = '';
                if (key_3 === 'ZHA') {
                    replacement = this.C[key_3];
                } else {
                    replacement = this.C[key_3] + this.misc['q'];
                }
                
                this.flags.makeNextVowelDependent = true;
                this.flags.use2CharsVowelNext = true;
                
                return {
                    found: true,
                    replacement: replacement,
                    deleteCount: 2,
                    bufferUpdate: {
                        start: buffer.length - 3,
                        end: buffer.length,
                        replacement: [replacement]
                    }
                };
            }
            
            if (key_3 in this.misc) {
                this.flags.makeNextVowelDependent = false;
                this.flags.use2CharsVowelNext = true;
                return {
                    found: true,
                    replacement: this.misc[key_3],
                    deleteCount: 2,
                    bufferUpdate: {
                        start: buffer.length - 3,
                        end: buffer.length,
                        replacement: [this.misc[key_3]]
                    }
                };
            }
            
            // Process 2-character sequences
            if (key_2 in this.C) {
                let replacement = '';
                if (['Zg', 'Zj', 'ZD', 'Zb', 'ZK'].includes(key_2)) {
                    replacement = this.C[key_2];
                } else {
                    replacement = this.C[key_2] + this.misc['q'];
                }
                
                this.flags.makeNextVowelDependent = true;
                this.flags.use2CharsVowelNext = true;
                
                return {
                    found: true,
                    replacement: replacement,
                    deleteCount: 1,
                    bufferUpdate: {
                        start: buffer.length - 2,
                        end: buffer.length,
                        replacement: [replacement]
                    }
                };
            }
            
            if (key_2 in this.misc) {
                this.flags.makeNextVowelDependent = false;
                this.flags.use2CharsVowelNext = true;
                return {
                    found: true,
                    replacement: this.misc[key_2],
                    deleteCount: 1,
                    bufferUpdate: {
                        start: buffer.length - 2,
                        end: buffer.length,
                        replacement: [this.misc[key_2]]
                    }
                };
            }
            
            // Process 2-character vowels
            if (key_2 in this.v && this.flags.makeNextVowelDependent) {
                this.flags.makeNextVowelDependent = false;
                return {
                    found: true,
                    replacement: this.v[key_2],
                    deleteCount: 1,
                    bufferUpdate: {
                        start: buffer.length - 2,
                        end: buffer.length,
                        replacement: [this.v[key_2]]
                    }
                };
            }
            
            if (key_2 in this.V && !this.flags.makeNextVowelDependent) {
                this.flags.makeNextVowelDependent = false;
                return {
                    found: true,
                    replacement: this.V[key_2],
                    deleteCount: 1,
                    bufferUpdate: {
                        start: buffer.length - 2,
                        end: buffer.length,
                        replacement: [this.V[key_2]]
                    }
                };
            }
            
            // Process 1-character sequences
            if (key_1 in this.misc) {
                if (key_2 === 'q ') {
                    this.flags.makeNextVowelDependent = false;
                    return {
                        found: true,
                        replacement: this.misc[' '],
                        deleteCount: 1,
                        bufferUpdate: {
                            start: buffer.length - 2,
                            end: buffer.length,
                            replacement: [this.misc[' ']]
                        }
                    };
                } else if (['w', 'W'].includes(key_1)) {
                    return {
                        found: true,
                        replacement: this.misc[key_1],
                        deleteCount: 0,
                        bufferUpdate: {
                            start: buffer.length - 1,
                            end: buffer.length,
                            replacement: [this.misc[key_1]]
                        }
                    };
                } else {
                    this.flags.makeNextVowelDependent = false;
                    this.flags.use2CharsVowelNext = true;
                    return {
                        found: true,
                        replacement: this.misc[key_1],
                        deleteCount: 0,
                        bufferUpdate: {
                            start: buffer.length - 1,
                            end: buffer.length,
                            replacement: [this.misc[key_1]]
                        }
                    };
                }
            }
            
            // Handle single-character vowels
            if (this.V[key_1] && !this.flags.makeNextVowelDependent) {
                this.flags.makeNextVowelDependent = false;
                this.flags.use2CharsVowelNext = true;
                return {
                    found: true,
                    replacement: this.V[key_1],
                    deleteCount: 0,
                    bufferUpdate: {
                        start: buffer.length - 1,
                        end: buffer.length,
                        replacement: [this.V[key_1]]
                    }
                };
            }
            
            if (this.v[key_1] && this.flags.makeNextVowelDependent) {
                this.flags.makeNextVowelDependent = false;
                return {
                    found: true,
                    replacement: this.v[key_1],
                    deleteCount: 0,
                    bufferUpdate: {
                        start: buffer.length - 1,
                        end: buffer.length,
                        replacement: [this.v[key_1]]
                    }
                };
            }
            
            // If key_1 is a consonant, insert it with auto-halant
            if (this.C[key_1]) {
                const replacement = this.C[key_1] + this.misc['q'];
                this.flags.makeNextVowelDependent = true;
                this.flags.use2CharsVowelNext = true;

                this.rawKeyBuffer.push('q');

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
            }

            if (!found) {
                console.log('No mapping found for:', key);
                return {
                    found: true,
                    replacement: key,
                    deleteCount: 0,
                    bufferUpdate: {
                        start: buffer.length - 1,
                        end: buffer.length,
                        replacement: [key]
                    }
                };
            }

            // If no mapping was found, just keep the key as-is in the output
            return {
                found: true,
                replacement: key,
                deleteCount: 0,
                bufferUpdate: {
                    start: buffer.length - 1,
                    end: buffer.length,
                    replacement: [key]
                }
            };
            
        },

        // Function to reset the system completely
        reset: function() {
            this.rawKeyBuffer = [];
            this.flags.makeNextVowelDependent = false;
            this.flags.use2CharsVowelNext = true;
            this.flags.isBacktickPressed = false;
            this.flags.englishBypass = false;
            return {
                found: true,
                replacement: '',
                deleteCount: 0,
                bufferUpdate: {
                    start: 0,
                    end: 0,
                    replacement: []
                }
            };
        },

        // Additional method for API compatibility
        defaultProcessBuffer: function(buffer) {
            return this.processBuffer(buffer);
        },

        // Toggle English bypass mode
        toggleEnglishBypass: function() {
            this.flags.englishBypass = !this.flags.englishBypass;
            return this.flags.englishBypass;
        }
    };
})();