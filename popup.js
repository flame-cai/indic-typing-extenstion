document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('transliterationToggle');
  const statusText = document.getElementById('statusText');
  const languageSelector = document.getElementById('languageSelector');
  
  // Load available languages
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'getAvailableLanguages'
      }, function(response) {
        if (response && response.languages) {
          populateLanguageSelector(response.languages);
        }
      });
    }
  });
  
  // Load saved state
  chrome.storage.local.get(['transliterationEnabled', 'currentLanguage'], function(result) {
    toggleSwitch.checked = result.transliterationEnabled || false;
    updateStatusText(toggleSwitch.checked);
    
    // Set current language when selector is populated
    if (result.currentLanguage) {
      // Will be set once languages are loaded
      currentLanguage = result.currentLanguage;
    }
  });
  
  // Toggle transliteration
  toggleSwitch.addEventListener('change', function() {
    const isEnabled = toggleSwitch.checked;
    
    // Save state
    chrome.storage.local.set({transliterationEnabled: isEnabled}, function() {
      updateStatusText(isEnabled);
      
      // Send message to content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggleTransliteration',
            enabled: isEnabled
          });
        }
      });
    });
  });
  
  // Language selection changed
  languageSelector.addEventListener('change', function() {
    const selectedLanguage = languageSelector.value;
    
    // Save selected language
    chrome.storage.local.set({currentLanguage: selectedLanguage}, function() {
      // Send message to content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'setLanguage',
            language: selectedLanguage
          });
        }
      });
    });
  });
  
  function updateStatusText(isEnabled) {
    statusText.textContent = isEnabled ? 'Transliteration is ON' : 'Transliteration is OFF';
    statusText.style.color = isEnabled ? '#4CAF50' : '#F44336';
  }
  
  function populateLanguageSelector(languages) {
    // Clear existing options
    languageSelector.innerHTML = '';
    
    // Add each language
    languages.forEach(function(lang) {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = lang.name;
      languageSelector.appendChild(option);
    });
    
    // Set current language if it was saved
    chrome.storage.local.get(['currentLanguage'], function(result) {
      if (result.currentLanguage) {
        languageSelector.value = result.currentLanguage;
      }
    });
  }
});