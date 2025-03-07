document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('transliterationToggle');
  const statusText = document.getElementById('statusText');
  
  // Load saved state
  chrome.storage.local.get(['transliterationEnabled'], function(result) {
    toggleSwitch.checked = result.transliterationEnabled || false;
    updateStatusText(toggleSwitch.checked);
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
  
  function updateStatusText(isEnabled) {
    statusText.textContent = isEnabled ? 'Transliteration is ON' : 'Transliteration is OFF';
    statusText.style.color = isEnabled ? '#4CAF50' : '#F44336';
  }
});