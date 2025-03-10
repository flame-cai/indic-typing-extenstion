(function() {
    // Core transliteration engine
    window.Transliterator = {
      // Maximum buffer size to track
      MAX_BUFFER_SIZE: 10,
      
      // Input buffers for each element
      inputBuffers: {},
      
      // Currently selected language module
      currentLanguage: 'hindi', // Default
      
      // Set current language
      setLanguage: function(langCode) {
        if (window.transliterationModules[langCode]) {
          this.currentLanguage = langCode;
          return true;
        }
        return false;
      },
      
      // Get current language module
      getCurrentModule: function() {
        return window.transliterationModules[this.currentLanguage];
      },
      
      // Get available languages
      getAvailableLanguages: function() {
        const languages = [];
        for (const lang in window.transliterationModules) {
          if (window.transliterationModules.hasOwnProperty(lang)) {
            languages.push({
              code: lang,
              name: window.transliterationModules[lang].name
            });
          }
        }
        return languages;
      },
      
      // Initialize buffer for an element
      initBuffer: function(elementId) {
        if (!this.inputBuffers[elementId]) {
          this.inputBuffers[elementId] = [];
        }
      },
      
      // Update buffer with a new character
      updateBuffer: function(elementId, char) {
        this.initBuffer(elementId);
        this.inputBuffers[elementId].push(char);
        if (this.inputBuffers[elementId].length > this.MAX_BUFFER_SIZE) {
          this.inputBuffers[elementId].shift();
        }
      },
      
      // Update buffer based on specific instructions
      updateBufferWithInstructions: function(elementId, instructions) {
        if (!instructions || !instructions.bufferUpdate) return;
        
        const update = instructions.bufferUpdate;
        const buffer = this.inputBuffers[elementId];
        
        // Replace the specified range in the buffer
        buffer.splice(update.start, update.end - update.start, ...update.replacement);
      },
      
      // Handle backspace
      handleBackspace: function(elementId) {
        if (this.inputBuffers[elementId] && this.inputBuffers[elementId].length > 0) {
          this.inputBuffers[elementId].pop();
        }
      },
      
      // Process key input
      processKey: function(elementId, key) {
        // Add key to buffer
        this.updateBuffer(elementId, key);
        
        // Get current language module
        const module = this.getCurrentModule();
        if (!module) return { found: false };
        
        // Process using language-specific logic
        const result = module.processBuffer(this.inputBuffers[elementId]);
        
        // Update buffer if needed
        if (result.found && result.bufferUpdate) {
          this.updateBufferWithInstructions(elementId, result);
        }
        
        return result;
      },
      
      // Clear all buffers
      clearAllBuffers: function() {
        this.inputBuffers = {};
      }
    };
  })();