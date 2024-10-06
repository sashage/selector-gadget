let active = false;

chrome.action.onClicked.addListener(async (tab) => {
  active = !active;
  if (active) {
    await chrome.scripting.insertCSS({
      target: {tabId: tab.id},
      files: ['combined.css']
    });
    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['combined.js']
    });
    chrome.action.setTitle({
      title: "SelectorGadget (Active)",
      tabId: tab.id
    });
  } else {
    await chrome.scripting.removeCSS({
      target: {tabId: tab.id},
      files: ['combined.css']
    });
    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: () => {
        if (window.selector_gadget) {
          window.selector_gadget.unbindAndRemoveInterface();
          delete window.selector_gadget;
        }
      }
    });
    chrome.action.setTitle({
      title: "SelectorGadget",
      tabId: tab.id
    });
  }
});
