# SelectorGadget

[SelectorGadget](http://www.selectorgadget.com) is an open source bookmarklet that makes CSS selector generation and discovery on complicated sites a breeze.

Please visit [http://www.selectorgadget.com](http://www.selectorgadget.com) to try it out.

## Table of Contents

1. [Technologies](#technologies)
2. [Features](#features)
   - [Remote Interface](#remote-interface)
3. [Project Structure](#project-structure)
   - [Key Files and Directories](#key-files-and-directories)
   - [Core Implementation](#core-implementation)
4. [Build Process](#build-process)
5. [Versions](#versions)
6. [Local Development](#local-development)
   - [Compiling](#compiling)
   - [Testing](#testing)
7. [Chrome Extension](#chrome-extension)

## Technologies

* CoffeeScript
* JavaScript
* jQuery
* SASS
* [diff-match-patch](https://code.google.com/p/google-diff-match-patch/)
* Ruby (for build process)

## Features

### Remote Interface

SelectorGadget provides a remote interface feature that allows for custom integration and extended functionality. This feature enables users to replace the standard display and controls with a custom implementation, making it possible to adapt SelectorGadget for specific workflows or applications.

Here's a detailed explanation of how the remote interface works:

1. **Activation**: The remote interface is activated by setting the `remote_interface` option in the `sg_options` object before instantiating SelectorGadget:

   ```javascript
   window.sg_options = {
     remote_interface: 'https://example.com/path/to/remote_interface.js'
   };
   ```

2. **Implementation**: When the remote interface is enabled:
   - SelectorGadget doesn't create its standard UI elements.
   - Instead, it sets up a `path_output_field` object with a `value` property to store the current CSS selector.
   - It also initializes a `remote_data` object to store any additional data for the remote interface.

3. **Communication**: SelectorGadget communicates with the remote interface through a few key mechanisms:
   - It calls `updateRemoteInterface()` when initialized and when significant events occur.
   - This method constructs a URL with the current state (including the current CSS selector and any custom data) and loads it as a script.
   - The remote interface can then respond to these updates and modify SelectorGadget's behavior.

4. **Customization**: The remote interface can customize SelectorGadget's behavior by:
   - Providing its own UI elements and controls.
   - Modifying the `path_output_field.value` to change the current selector.
   - Adding data to the `remote_data` object, which will be included in future remote interface calls.

5. **Event Handling**: SelectorGadget dispatches a custom event `selectorgadget.update` whenever the selector changes, allowing the remote interface to react to changes in real-time.

Here's a simple example of a remote interface script:

```javascript
// remote_interface.js

(function() {
  var SG = window.selector_gadget;
  
  // Create custom UI
  var customUI = document.createElement('div');
  customUI.id = 'custom-sg-ui';
  customUI.innerHTML = '<input id="custom-sg-input" type="text"><button id="custom-sg-button">Update</button>';
  document.body.appendChild(customUI);

  // Handle selector updates
  window.addEventListener('selectorgadget.update', function(e) {
    document.getElementById('custom-sg-input').value = e.detail.prediction;
  });

  // Handle custom button click
  document.getElementById('custom-sg-button').addEventListener('click', function() {
    var newSelector = document.getElementById('custom-sg-input').value;
    SG.path_output_field.value = newSelector;
    SG.refreshFromPath();
  });

  // Add custom data
  SG.remote_data.customField = 'Custom Value';
})();
```

This remote interface feature allows for powerful customizations and integrations, making SelectorGadget adaptable to a wide range of use cases beyond its standard functionality.

## Project Structure

The SelectorGadget project is organized to separate source files, build outputs, and various components of the tool. Here's a detailed breakdown of the project structure:

### Key Files and Directories

- `lib/`: Contains the core source files
  - `js/`: CoffeeScript source files
    - `core/`: Core functionality of SelectorGadget
      - `core.js.coffee`: Main SelectorGadget class and logic
      - `dom.js.coffee`: DOM manipulation and prediction helper
    - `jquery-include.js.coffee`: jQuery integration
    - `wizard/`: Files related to the SelectorGadget wizard functionality
  - `css/`: SASS source files
    - `selectorgadget.css.scss`: Main stylesheet for SelectorGadget
  - `archived/`: Contains different versions of SelectorGadget
    - `selectorgadget.js`: Stable version for direct inclusion in web pages
    - `selectorgadget_edge.js`: Edge version for testing new features
    - `selectorgadget_local.js`: Local version for development
- `build/`: Output directory for compiled and combined files (ignored by Git)
  - `js/`: Compiled JavaScript files
  - `css/`: Compiled CSS files
  - `selectorgadget_combined.js`: Combined JavaScript file
  - `selectorgadget_combined.min.js`: Minified combined JavaScript file
  - `selectorgadget_combined.css`: Combined CSS file
- `spec/`: Contains test files and test sites
  - `core-spec.js.coffee`, `dom-spec.js.coffee`: Jasmine test specs
  - `SpecRunner.html`: HTML file to run Jasmine tests
  - `test_sites/`: Sample web pages for manual testing
- `src/`: Contains files for the Chrome extension
  - `manifest.json`: Chrome extension manifest file
  - `background.js`: Background script for the Chrome extension
  - `header.js`, `footer.js`: Scripts to wrap the combined JS file
- `bin/`: Contains build and deployment scripts
  - `bundle_chrome.sh`: Script to package the Chrome extension
  - `upload_to_s3.sh`: Script to upload files to S3 (for distribution)
- `chrome/`: Output directory for the Chrome extension (ignored by Git)
- `Gemfile`: Ruby gem dependencies
- `Guardfile`: Configuration for Guard (build process)
- `README.md`: This file, containing project documentation
- `.gitignore`: Specifies intentionally untracked files to ignore

Note: The `build/` and `chrome/` directories are ignored by Git as they contain generated files. These directories are created and populated during the build process.

### Core Implementation

The heart of SelectorGadget is implemented in `lib/js/core/core.js.coffee`. This file defines the `SelectorGadget` class, which includes:

1. **Initialization and Setup**:
   - `constructor`: Sets up initial state and configuration
   - `makeInterface`: Creates the user interface elements
   - `setupEventHandlers`: Binds necessary event listeners

2. **Core Functionality**:
   - `sgMouseover`, `sgMousedown`: Handle mouse interactions for selecting elements
   - `makeBorders`: Visualizes selected elements
   - `predictCss`: Generates CSS selectors based on selected elements

3. **Path Management**:
   - `setPath`: Updates the current CSS selector path
   - `refreshFromPath`: Refreshes the UI based on a given path

4. **Remote Interface**:
   - `useRemoteInterface`: Checks if remote interface should be used
   - `updateRemoteInterface`: Communicates with the remote interface

5. **Utility Functions**:
   - `showXPath`: Converts CSS selector to XPath
   - `clearSelected`: Clears all selected elements

The `DomPredictionHelper` class in `lib/js/core/dom.js.coffee` assists with DOM traversal and CSS selector generation.

This structure allows for a clear separation of concerns, with core logic, DOM manipulation, and user interface elements kept separate. The build process then combines these files into a single, efficient script for deployment.

## Build Process

The build process is managed by Guard, a Ruby-based file watcher and task runner. The main steps in the build process are:

1. Compile CoffeeScript files from `lib/js` to `build/js`
2. Compile SASS files from `lib/css` to `build/css`
3. Concatenate JS files: vendor/jquery, build/js/jquery-include, vendor/diff/diff_match_patch, build/js/dom, build/js/core
4. Concatenate CSS files: build/css/selectorgadget
5. Minify the combined JS file
6. Run the Chrome extension packaging script

The build process is defined in the `Guardfile` at the root of the project. Here's a brief overview of what the Guardfile does:

1. Watches for changes in CoffeeScript and SASS files and recompiles them.
2. Concatenates the compiled files into combined JS and CSS files.
3. Minifies the combined JS file.
4. Triggers the Chrome extension build script when the minified JS file changes.

This setup allows for efficient development with automatic rebuilding of the project as files are modified.

## Versions

SelectorGadget has three main versions:

1. Stable Version (`lib/selectorgadget.js`): Used for direct inclusion in web pages
2. Edge Version (`lib/archived/selectorgadget_edge.js`): Used for testing new features
3. Local Version (`lib/archived/selectorgadget_local.js`): Used for local development

The build process primarily uses the source files in `lib/js` and `lib/css` rather than these specific versions. These different versions allow for a staged development process:

- Local version for initial development and testing
- Edge version for broader testing of new features
- Stable version for production use

## Local Development

### Compiling

Start by installing development dependencies with

    bundle

and then run

    bundle exec guard


to watch and regenerate SelectorGadget's `.coffee` and `.scss` files.

### Testing

SelectorGadget is tested with [jasmine](http://github.com/jasmine/jasmine/).  With guard running, 
open _spec/SpecRunner.html_ in your browser to run the tests.  (On a Mac, just do `open spec/SpecRunner.html`)

To manually test during local development, `open spec/test_sites/bookmarklet_local.html` and use that local bookmarklet on the contents of _spec/test\_sites_.

## Chrome Extension

SelectorGadget is also available as a Chrome extension. The extension is built using the `bin/bundle_chrome.sh` script, which:

1. Creates a `chrome` directory
2. Copies necessary files from `src` and `build` directories
3. Combines and minifies JS and CSS files
4. Packages the extension into a zip file

The Chrome extension can be found in the `chrome` directory after building. The extension allows users to easily access SelectorGadget functionality directly from their browser, without needing to use a bookmarklet.

---

For more information or to contribute to the project, please visit the [SelectorGadget website](http://www.selectorgadget.com) or the project's repository.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/cantino/selectorgadget/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
