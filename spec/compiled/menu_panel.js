(function() {
  var MenuPanel;

  MenuPanel = (function() {
    function MenuPanel() {
      this.createPanel();
      this.makeDraggable();
    }

    MenuPanel.prototype.createPanel = function() {
      var ref, ref1, selector_output;
      this.panel = document.createElement('div');
      this.panel.id = 'menu-panel';
      this.panel.innerHTML = "<button id=\"toggle-selector\">Toggle Selector</button>\n<input type=\"text\" id=\"selector-input\" readonly />";
      document.body.appendChild(this.panel);
      document.getElementById('toggle-selector').addEventListener('click', this.toggleSelector.bind(this));
      selector_output = (ref = window.sg_options) != null ? (ref1 = ref.path_output_field) != null ? ref1.value : void 0 : void 0;
      this.updateInput(selector_output);
      return window.addEventListener('selectorgadget.update', (function(_this) {
        return function(e) {
          return _this.updateInput(e.detail.prediction);
        };
      })(this));
    };

    MenuPanel.prototype.toggleSelector = function() {
      var SG;
      SG = window.selector_gadget;
      SG.on = !SG.on;
      if (SG.on) {
        return SG.activate();
      } else {
        return SG.deactivate();
      }
    };

    MenuPanel.prototype.updateInput = function(selector) {
      return document.getElementById('selector-input').value = selector;
    };

    MenuPanel.prototype.makeDraggable = function() {
      var dragging, offsetX, offsetY;
      this.panel.style.position = 'fixed';
      this.panel.style.top = '10px';
      this.panel.style.right = '10px';
      this.panel.style.backgroundColor = '#fff';
      this.panel.style.border = '1px solid #ccc';
      this.panel.style.padding = '10px';
      this.panel.style.borderRadius = '5px';
      this.panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
      this.panel.style.zIndex = '1000';
      this.panel.style.cursor = 'move';
      dragging = false;
      offsetX = 0;
      offsetY = 0;
      this.panel.addEventListener('mousedown', (function(_this) {
        return function(e) {
          dragging = true;
          offsetX = e.clientX - _this.panel.offsetLeft;
          offsetY = e.clientY - _this.panel.offsetTop;
          return e.preventDefault();
        };
      })(this));
      document.addEventListener('mousemove', (function(_this) {
        return function(e) {
          if (dragging) {
            _this.panel.style.left = (e.clientX - offsetX) + 'px';
            _this.panel.style.top = (e.clientY - offsetY) + 'px';
            _this.panel.style.right = 'auto';
            return _this.panel.style.bottom = 'auto';
          }
        };
      })(this));
      return document.addEventListener('mouseup', (function(_this) {
        return function(e) {
          return dragging = false;
        };
      })(this));
    };

    return MenuPanel;

  })();

  window.addEventListener('DOMContentLoaded', function() {
    return new MenuPanel();
  });

}).call(this);
