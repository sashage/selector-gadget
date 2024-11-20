// lib/menu_panel/sg_interface.js

var SG = window.selector_gadget;

// Check if MenuPanel is defined
if (typeof MenuPanel === 'undefined') {
  console.error('MenuPanel is not defined. Ensure that menu_panel.js.coffee is loaded before this script.');
} else {
  // Add field to display current selection
  var path = jQuerySG('<input>', { id: 'sg-status', class: 'selectorgadget_ignore' });
  SG.sg_div.append(path);
  SG.path_output_field = path.get(0);

  // Add toggle button to control SelectorGadget
  var toggleBtn = jQuerySG('<button>', { id: 'sg-toggle', class: 'selectorgadget_ignore' }).text('Toggle Selector');
  SG.sg_div.append(toggleBtn);
  jQuerySG(toggleBtn).on('click', function(event) {
    SG.toggle();
  });

  // Add input field to display the current selector
  var selectorInput = jQuerySG('<input>', { type: 'text', id: 'selector-input', class: 'selectorgadget_ignore', readonly: true });
  SG.sg_div.append(selectorInput);

  // Listen for selector updates from SelectorGadget
  window.addEventListener('selectorgadget.update', function(e) {
    selectorInput.val(e.detail.prediction);
  });
}