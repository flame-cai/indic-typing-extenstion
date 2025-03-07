let transliterationEnabled = false;
let isComposing = false;

// Transliteration mapping (Latin to Devanagari)
const transliterationMap = {
  'k': 'क',
  'g': 'ग',
  'j': 'ज',
  // Add more mappings as needed
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
  console.log('Transliteration enabled');
}

function removeTransliteration() {
  document.removeEventListener('keydown', handleKeyDown, true);
  document.removeEventListener('keypress', handleKeyPress, true);
  document.removeEventListener('compositionstart', handleCompositionStart);
  document.removeEventListener('compositionend', handleCompositionEnd);
  console.log('Transliteration disabled');
}

function handleCompositionStart() {
  isComposing = true;
}

function handleCompositionEnd() {
  isComposing = false;
}

function handleKeyDown(event) {
  // Don't interfere with key combinations (Ctrl, Alt, etc.)
  if (event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }
  
  // Don't interfere with special keys like backspace, enter, etc.
  const specialKeys = ['Backspace', 'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 
                       'Escape', 'Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                       'Delete', 'Home', 'End', 'PageUp', 'PageDown'];
  
  if (specialKeys.includes(event.key)) {
    return;
  }
}

function handleKeyPress(event) {
  // Skip if transliteration is disabled or during IME composition
  if (!transliterationEnabled || isComposing) {
    return;
  }
  
  // Skip if it's a non-input element
  const tagName = event.target.tagName.toLowerCase();
  const isContentEditable = event.target.isContentEditable;
  
  if (!(tagName === 'input' || tagName === 'textarea' || isContentEditable)) {
    return;
  }
  
  // Skip for input types that shouldn't be transliterated
  if (tagName === 'input') {
    const nonTextTypes = ['checkbox', 'radio', 'file', 'submit', 'button', 'image', 'reset', 'range', 'color', 'date', 'datetime-local', 'month', 'week', 'time'];
    if (nonTextTypes.includes(event.target.type)) {
      return;
    }
  }

  // Get the pressed key
  const pressedKey = event.key;
  
  // Check if we have a transliteration for this key
  if (transliterationMap[pressedKey]) {
    // Prevent default action (typing the original character)
    event.preventDefault();
    
    // Insert transliterated character
    insertCharacter(event.target, transliterationMap[pressedKey]);
  }
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