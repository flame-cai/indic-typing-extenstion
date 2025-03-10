(function() {
    window.transliterationModules = window.transliterationModules || {};
    
    // Hindi transliteration module
    window.transliterationModules.hindi = {
      name: "Hindi",
      code: "hi",
      
      // Simple mappings (single character)
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
        'h': 'ह'
      },
      
      // Complex mappings (multi-character)
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
        'ri': 'ऋ'
      },
      
      // Custom processing logic specific to Hindi (if needed)
      processBuffer: function(buffer) {
        // Default processing - can be overridden for language-specific logic
        return this.defaultProcessBuffer(buffer);
      },
      
      // Default buffer processing logic that works with simpleMap and complexMap
      defaultProcessBuffer: function(buffer) {
        // First try complex mappings (longer sequences first)
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