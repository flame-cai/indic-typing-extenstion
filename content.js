let transliterationEnabled = false;
let isComposing = false;
let inputBuffer = {};  // Buffer to track keypresses for each input element

// Transliteration mapping (Latin to Devanagari)
// Simple mappings (single character)
const simpleMap = {
  'k': 'क',
  'g': 'ग',
  'j': 'ज',
  'a': 'अ',
  'i': 'इ',
  'u': 'उ',
  'e': 'ए',
  'o': 'ओ',
  'p': 'प',
  'c': 'च',
  't': 'त',
  'd': 'द',
  'n': 'न',
  'm': 'म',
  'y': 'य',
  'r': 'र',
  'l': 'ल',
  'v': 'व',
  's': 'स',
  'h': 'ह',
  'b': 'ब'
};

// Complex mappings (multi-character)
const complexMap = {
  'kh': 'ख',
  'gh': 'घ',
  'ch': 'छ',
  'jh': 'झ',
  'th': 'थ',
  'dh': 'ध',
  'ph': 'फ',
  'bh': 'भ',
  'sh': 'श',
  'ng': 'ङ',
  'ny': 'ञ'
  // Add more as needed
};

// Check if transliteration was previously enabled
chrome.storage.local.get(['transliterationEnabled'], function(result) {
  transliterationEnabled = result.transliterationEnabled || false;
  if (transliterationEnabled) {
    setupTransliteration();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleTransliteration') {
    transliterationEnabled = request.enabled;
    
    if (transliterationEnabled) {
      setupTransliteration();
    } else {
      removeTransliteration();
    }
    
    sendResponse({success: true});
  }
  return true;
});

function setupTransliteration() {
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('keypress', handleKeyPress, true);
  document.addEventListener('compositionstart', handleCompositionStart);
  document.addEventListener('compositionend', handleCompositionEnd);
  // Track focus changes to manage buffers
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
  inputBuffer = {};
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
  if (isInputElement(target) && !inputBuffer[getElementId(target)]) {
    inputBuffer[getElementId(target)] = [];
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

function handleKeyDown(event) {
  if (!transliterationEnabled || isComposing) {
    return;
  }
  
  const target = event.target;
  if (!isInputElement(target)) {
    return;
  }
  
  // Skip for input types that shouldn't be transliterated
  if (target.tagName.toLowerCase() === 'input') {
    const nonTextTypes = ['checkbox', 'radio', 'file', 'submit', 'button', 'image', 'reset', 'range', 'color', 'date', 'datetime-local', 'month', 'week', 'time'];
    if (nonTextTypes.includes(target.type)) {
      return;
    }
  }
  
  // Handle backspace to update the buffer
  if (event.key === 'Backspace') {
    const elementId = getElementId(target);
    if (inputBuffer[elementId] && inputBuffer[elementId].length > 0) {
      inputBuffer[elementId].pop(); // Remove the last character from buffer
    }
  }
}

function handleKeyPress(event) {
  // Skip if transliteration is disabled or during IME composition
  if (!transliterationEnabled || isComposing) {
    return;
  }
  
  const target = event.target;
  if (!isInputElement(target)) {
    return;
  }
  
  // Skip for input types that shouldn't be transliterated
  if (target.tagName.toLowerCase() === 'input') {
    const nonTextTypes = ['checkbox', 'radio', 'file', 'submit', 'button', 'image', 'reset', 'range', 'color', 'date', 'datetime-local', 'month', 'week', 'time'];
    if (nonTextTypes.includes(target.type)) {
      return;
    }
  }

  // Get the pressed key
  const pressedKey = event.key;
  const elementId = getElementId(target);
  
  // Initialize buffer for this element if not exists
  if (!inputBuffer[elementId]) {
    inputBuffer[elementId] = [];
  }
  
  // Check for complex mappings
  let shouldPreventDefault = false;
  let charToInsert = null;
  
  // Add the current key to buffer (keeping only the last 5 characters)
  inputBuffer[elementId].push(pressedKey);
  if (inputBuffer[elementId].length > 5) {
    inputBuffer[elementId].shift();
  }
  
  // Check for complex mappings
  for (let i = inputBuffer[elementId].length - 1; i >= 0; i--) {
    const sequence = inputBuffer[elementId].slice(i).join('');
    if (complexMap[sequence]) {
      // Calculate how many characters to delete (sequence length - 1)
      // because we're replacing the previously inserted characters
      const charsToDelete = sequence.length - 1;
      
      // The complex mapping applies
      charToInsert = complexMap[sequence];
      shouldPreventDefault = true;
      
      // Delete previously inserted characters
      if (charsToDelete > 0) {
        deleteChars(target, charsToDelete);
      }
      
      // Replace the buffer content with the result
      inputBuffer[elementId] = inputBuffer[elementId].slice(0, i);
      inputBuffer[elementId].push(charToInsert);
      
      break;
    }
  }
  
  // If no complex mapping matched, try simple mapping
  if (!charToInsert && simpleMap[pressedKey]) {
    charToInsert = simpleMap[pressedKey];
    shouldPreventDefault = true;
  }
  
  if (shouldPreventDefault) {
    // Prevent default action (typing the original character)
    event.preventDefault();
    
    // Insert transliterated character
    insertCharacter(target, charToInsert);
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