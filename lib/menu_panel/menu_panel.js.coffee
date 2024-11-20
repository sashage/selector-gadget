# lib/menu_panel/menu_panel.js.coffee

class MenuPanel
  constructor: ->
    @createPanel()
    @makeDraggable()

  createPanel: ->
    # Create panel elements
    @panel = document.createElement 'div'
    @panel.id = 'menu-panel'
    @panel.innerHTML = """
      <button id="toggle-selector">Toggle Selector</button>
      <input type="text" id="selector-input" readonly />
    """
    document.body.appendChild @panel

    # Add event listeners
    document.getElementById('toggle-selector').addEventListener 'click', @toggleSelector.bind(@)
    selector_output = window.sg_options?.path_output_field?.value
    @updateInput(selector_output)

    # Listen for selector updates
    window.addEventListener 'selectorgadget.update', (e) =>
      @updateInput e.detail.prediction

  toggleSelector: ->
    SG = window.selector_gadget
    SG.on = not SG.on
    if SG.on
      SG.activate()
    else
      SG.deactivate()

  updateInput: (selector) ->
    document.getElementById('selector-input').value = selector

  makeDraggable: ->
    # Style the panel for positioning
    @panel.style.position = 'fixed'
    @panel.style.top = '10px'
    @panel.style.right = '10px'
    @panel.style.backgroundColor = '#fff'
    @panel.style.border = '1px solid #ccc'
    @panel.style.padding = '10px'
    @panel.style.borderRadius = '5px'
    @panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)'
    @panel.style.zIndex = '1000'
    @panel.style.cursor = 'move'

    # Dragging variables
    dragging = false
    offsetX = 0
    offsetY = 0

    @panel.addEventListener 'mousedown', (e) =>
      dragging = true
      offsetX = e.clientX - @panel.offsetLeft
      offsetY = e.clientY - @panel.offsetTop
      e.preventDefault()

    document.addEventListener 'mousemove', (e) =>
      if dragging
        @panel.style.left = (e.clientX - offsetX) + 'px'
        @panel.style.top = (e.clientY - offsetY) + 'px'
        @panel.style.right = 'auto'
        @panel.style.bottom = 'auto'

    document.addEventListener 'mouseup', (e) =>
      dragging = false

# Initialize the MenuPanel
window.addEventListener 'DOMContentLoaded', ->
  new MenuPanel()