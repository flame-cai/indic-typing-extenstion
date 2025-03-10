(function() {
    window.transliterationModules = window.transliterationModules || {};
    
    // Marathi transliteration module
    // Note: Marathi uses the same Devanagari script as Hindi but with some differences
    window.transliterationModules.marathi = {
      name: "Marathi",
      code: "mr",
      
      // Simple mappings (same as Hindi with some modifications)
      simpleMap: {
        'a': 'अ',
        'i': 'इ',
        'u': 'उ',
        'e': 'ए',
        'o': 'ओ',
        'k': 'क',
        'g': 'ग',
        'c': 'च',
        'j': 'ज',
        't': 'त',
        'd': 'द',
        'n': 'न',
        'p': 'प',
        'b': 'ब',
        'm': 'म',
        'y': 'य',
        'r': 'र',
        'l': 'ल',
        'v': 'व',
        's': 'स',
        'h': 'ह',
        'L': 'ळ'  // Special Marathi character
      },
      
      // Complex mappings (with Marathi-specific additions)
      complexMap: {
        'kh': 'ख',
        'gh': 'घ',
        'ch': 'छ',
        'jh': 'झ',
        'th': 'थ',
        'dh': 'ध',
        'ph': 'फ',
        'bh': 'भ',
        'sh': 'श',
        'Sh': 'ष',
        'ng': 'ङ',
        'ny': 'ञ',
        'aa': 'आ',
        'ii': 'ई',
        'uu': 'ऊ',
        'ee': 'ई',
        'oo': 'ऊ',
        'ai': 'ऐ',
        'au': 'औ',
        'ri': 'ऋ',
        'dny': 'ज्ञ',  // Marathi specific
        'La': 'ळा',    // Marathi specific
        'zh': 'झ़'      // Marathi specific
      },
      
      // Custom processing for Marathi (if needed)
      processBuffer: function(buffer) {
        // For now, using the default processing
        return this.defaultProcessBuffer(buffer);
      },
      
      // Same default processor as Hindi
      defaultProcessBuffer: function(buffer) {
        // First try complex mappings
        for (let i = buffer.length - 1; i >= 0; i--) {
          const sequence = buffer.slice(i).join('');
          if (this.complexMap[sequence]) {
            return {
              found: true,
              replacement: this.complexMap[sequence],
              deleteCount: sequence.length - 1,
              bufferUpdate: {
                start: i,
                end: buffer.length,
                replacement: [this.complexMap[sequence]]
              }
            };
          }
        }
        
        // Then try simple mapping for the last character
        const lastChar = buffer[buffer.length - 1];
        if (this.simpleMap[lastChar]) {
          return {
            found: true,
            replacement: this.simpleMap[lastChar],
            deleteCount: 0,
            bufferUpdate: {
              start: buffer.length - 1,
              end: buffer.length,
              replacement: [this.simpleMap[lastChar]]
            }
          };
        }
        
        // No mapping found
        return { found: false };
      }
    };
  })();