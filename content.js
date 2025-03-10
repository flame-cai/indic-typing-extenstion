(function() {
  let transliterationEnabled = false;
  let isComposing = false;
  
  // Check if transliteration was previously enabled
  chrome.storage.local.get(['transliterationEnabled', 'currentLanguage'], function(result) {
    transliterationEnabled = result.transliterationEnabled || false;
    
    // Set language if it was saved
    if (result.currentLanguage && window.Transliterator) {
      window.Transliterator.setLanguage(result.currentLanguage);
    }
    
    if (transliterationEnabled) {
      setupTransliteration();
    }
  });
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.action) {
      case 'toggleTransliteration':
        transliterationEnabled = request.enabled;
        
        if (transliterationEnabled) {
          setupTransliteration();
        } else {
          removeTransliteration();
        }
        
        sendResponse({success: true});
        break;
        
      case 'setLanguage':
        if (window.Transliterator && request.language) {
          const success = window.Transliterator.setLanguage(request.language);
          sendResponse({success: success});
        } else {
          sendResponse({success: false});
        }
        break;
        
      case 'getAvailableLanguages':
        if (window.Transliterator) {
          const languages = window.Transliterator.getAvailableLanguages();
          sendResponse({languages: languages});
        } else {
          sendResponse({languages: []});
        }
        break;
    }
    return true;
  });
  
  function setupTransliteration() {
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keypress', handleKeyPress, true);
    document.addEventListener('compositionstart', handleCompositionStart);
    document.addEventListener('compositionend', handleCompositionEnd);
    document.addEventListener('focusin', handleFocusIn);
    console.log('Transliteration enabled');
  }
  
  function removeTransliteration() {
    document.removeEventListener('keydown', handleKeyDown, true);
    document.removeEventListener('keypress', handleKeyPress, true);
    document.removeEventListener('compositionstart', handleCompositionStart);
    document.removeEventListener('compositionend', handleCompositionEnd);
    document.removeEventListener('focusin', handleFocusIn);
    
    // Clear all buffers
    if (window.Transliterator) {
      window.Transliterator.clearAllBuffers();
    }
    
    console.log('Transliteration disabled');
  }
  
  function handleCompositionStart() {
    isComposing = true;
  }
  
  function handleCompositionEnd() {
    isComposing = false;
  }
  
  function handleFocusIn(event) {
    const target = event.target;
    // Initialize buffer for newly focused element
    if (isInputElement(target) && window.Transliterator) {
      window.Transliterator.initBuffer(getElementId(target));
    }
  }
  
  function getElementId(element) {
    // Create a unique identifier for the element
    if (element.id) {
      return 'id_' + element.id;
    } else if (element.name) {
      return 'name_' + element.name;
    } else {
      // If no id or name, create a temporary id based on position in document
      if (!element._transliterationId) {
        element._transliterationId = 'temp_' + Math.random().toString(36).substr(2, 9);
      }
      return element._transliterationId;
    }
  }
  
  function isInputElement(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || element.isContentEditable;
  }
  
  function isTextInputElement(element) {
    if (!isInputElement(element)) return false;
    
    const tagName = element.tagName.toLowerCase();
    if (element.isContentEditable) return true;
    if (tagName === 'textarea') return true;
    if (tagName === 'input') {
      const nonTextTypes = ['checkbox', 'radio', 'file', 'submit', 'button', 'image', 'reset', 'range', 'color', 'date', 'datetime-local', 'month', 'week', 'time'];
      return !nonTextTypes.includes(element.type);
    }
    return false;
  }
  
  function handleKeyDown(event) {
    if (!transliterationEnabled || isComposing) {
      return;
    }
    
    const target = event.target;
    if (!isTextInputElement(target)) {
      return;
    }
    
    // Handle backspace to update the buffer
    if (event.key === 'Backspace' && window.Transliterator) {
      window.Transliterator.handleBackspace(getElementId(target));
    }
  }
  
  function handleKeyPress(event) {
    // Skip if transliteration is disabled or during IME composition
    if (!transliterationEnabled || isComposing) {
      return;
    }
    
    const target = event.target;
    if (!isTextInputElement(target)) {
      return;
    }
    
    // Don't interfere with key combinations (Ctrl, Alt, etc.)
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    // Get the pressed key
    const pressedKey = event.key;
    const elementId = getElementId(target);
    
    // Process the key press with the current language module
    if (window.Transliterator) {
      const result = window.Transliterator.processKey(elementId, pressedKey);
      
      if (result.found) {
        // Prevent default action (typing the original character)
        event.preventDefault();
        
        // Delete previously inserted characters if needed
        if (result.deleteCount > 0) {
          deleteChars(target, result.deleteCount);
        }
        
        // Insert transliterated character
        insertCharacter(target, result.replacement);
      }
    }
  }
  
  function deleteChars(element, count) {
    if (element.isContentEditable) {
      // For contentEditable elements
      deleteFromContentEditable(element, count);
    } else {
      // For standard input fields and textareas
      deleteFromInputField(element, count);
    }
  }
  
  function deleteFromInputField(input, count) {
    const startPos = input.selectionStart;
    const endPos = input.selectionEnd;
    
    if (startPos === endPos && startPos >= count) {
      // Delete 'count' characters before the cursor
      const textBefore = input.value.substring(0, startPos - count);
      const textAfter = input.value.substring(endPos);
      input.value = textBefore + textAfter;
      
      // Set cursor position
      input.selectionStart = input.selectionEnd = startPos - count;
      
      // Trigger input event
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
    }
  }
  
  function deleteFromContentEditable(element, count) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Create a new range for deletion
    const deleteRange = document.createRange();
    deleteRange.setStart(range.startContainer, Math.max(0, range.startOffset - count));
    deleteRange.setEnd(range.startContainer, range.startOffset);
    
    // Delete the content
    deleteRange.deleteContents();
    
    // Update selection
    selection.removeAllRanges();
    selection.addRange(deleteRange);
    
    // Trigger input event
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
  }
  
  function insertCharacter(element, char) {
    if (element.isContentEditable) {
      // For contentEditable elements
      insertIntoContentEditable(element, char);
    } else {
      // For standard input fields and textareas
      insertIntoInputField(element, char);
    }
  }
  
  function insertIntoInputField(input, char) {
    const startPos = input.selectionStart;
    const endPos = input.selectionEnd;
    
    // Create new text with the transliterated character
    const textBefore = input.value.substring(0, startPos);
    const textAfter = input.value.substring(endPos);
    input.value = textBefore + char + textAfter;
    
    // Set cursor position after inserted character
    input.selectionStart = input.selectionEnd = startPos + char.length;
    
    // Trigger input event for frameworks like React, Angular, etc.
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  }
  
  function insertIntoContentEditable(element, char) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Delete any selected text
    range.deleteContents();
    
    // Insert the new character
    const textNode = document.createTextNode(char);
    range.insertNode(textNode);
    
    // Move cursor after inserted character
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
  }
})();