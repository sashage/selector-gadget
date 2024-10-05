
/*
 The MIT License

 Copyright (c) 2012 Andrew Cantino
 Copyright (c) 2009 Andrew Cantino & Kyle Maxwell

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

(function() {
  var DomPredictionHelper;

  window.DomPredictionHelper = DomPredictionHelper = (function() {
    function DomPredictionHelper() {
      this.priorityWords = ['add', 'cart', 'remove', 'important', 'main', 'primary', 'essential'];
    }

    DomPredictionHelper.prototype.recursiveNodes = function(e) {
      var n;
      if (e.nodeName && e.parentNode && e !== document.body) {
        n = this.recursiveNodes(e.parentNode);
      } else {
        n = new Array();
      }
      n.push(e);
      return n;
    };

    DomPredictionHelper.prototype.escapeCssNames = function(name) {
      var e;
      if (name) {
        try {
          return name.replace(/\bselectorgadget_\w+\b/g, '').replace(/\\/g, '\\\\').replace(/[\#\;\&\,\.\+\*\~\'\:\"\!\^\$\[\]\(\)\=\>\|\/]/g, function(e) {
            return '\\' + e;
          }).replace(/\s+/, '');
        } catch (error) {
          e = error;
          if (window.console) {
            console.log('---');
            console.log("exception in escapeCssNames");
            console.log(name);
            console.log('---');
          }
          return '';
        }
      } else {
        return '';
      }
    };

    DomPredictionHelper.prototype.childElemNumber = function(elem) {
      var count;
      count = 0;
      while (elem.previousSibling && (elem = elem.previousSibling)) {
        if (elem.nodeType === 1) {
          count++;
        }
      }
      return count;
    };

    DomPredictionHelper.prototype.siblingsWithoutTextNodes = function(e) {
      var filtered_nodes, k, len, node, nodes;
      nodes = e.parentNode.childNodes;
      filtered_nodes = [];
      for (k = 0, len = nodes.length; k < len; k++) {
        node = nodes[k];
        if (node.nodeName.substring(0, 1) === "#") {
          continue;
        }
        if (node === e) {
          break;
        }
        filtered_nodes.push(node);
      }
      return filtered_nodes;
    };

    DomPredictionHelper.prototype.pathOf = function(elem) {
      var e, j, k, len, path, ref, siblings;
      path = "";
      ref = this.recursiveNodes(elem);
      for (k = 0, len = ref.length; k < len; k++) {
        e = ref[k];
        if (e) {
          siblings = this.siblingsWithoutTextNodes(e);
          if (e.nodeName.toLowerCase() !== "body") {
            j = siblings.length - 2 < 0 ? 0 : siblings.length - 2;
            while (j < siblings.length) {
              if (siblings[j] === e) {
                break;
              }
              if (!siblings[j].nodeName.match(/^(script|#.*?)$/i)) {
                path += this.cssDescriptor(siblings[j]) + (j + 1 === siblings.length ? "+ " : "~ ");
              }
              j++;
            }
          }
          path += this.cssDescriptor(e) + " > ";
        }
      }
      return this.cleanCss(path);
    };

    DomPredictionHelper.prototype.cssDescriptor = function(node) {
      var cssName, escaped, k, len, path, ref;
      path = node.nodeName.toLowerCase();
      escaped = node.id && this.escapeCssNames(new String(node.id));
      if (escaped && escaped.length > 0) {
        path += '#' + escaped;
      }
      if (node.className && typeof node.className === "string") {
        ref = node.className.split(" ");
        for (k = 0, len = ref.length; k < len; k++) {
          cssName = ref[k];
          escaped = this.escapeCssNames(cssName);
          if (cssName && escaped.length > 0) {
            path += '.' + escaped;
          }
        }
      }
      if (node.nodeName.toLowerCase() !== "body") {
        path += ':nth-child(' + (this.childElemNumber(node) + 1) + ')';
      }
      return path;
    };

    DomPredictionHelper.prototype.cssDiff = function(array) {
      var collective_common, cssElem, diff, dmp, e, encoded_css_array, existing_tokens, k, l, len, len1, part;
      try {
        dmp = new diff_match_patch();
      } catch (error) {
        e = error;
        throw "Please include the diff_match_patch library.";
      }
      if (typeof array === 'undefined' || array.length === 0) {
        return '';
      }
      existing_tokens = {};
      encoded_css_array = this.encodeCssForDiff(array, existing_tokens);
      collective_common = encoded_css_array.pop();
      for (k = 0, len = encoded_css_array.length; k < len; k++) {
        cssElem = encoded_css_array[k];
        diff = dmp.diff_main(collective_common, cssElem);
        collective_common = '';
        for (l = 0, len1 = diff.length; l < len1; l++) {
          part = diff[l];
          if (part[0] === 0) {
            collective_common += part[1];
          }
        }
      }
      return this.decodeCss(collective_common, existing_tokens);
    };

    DomPredictionHelper.prototype.tokenizeCss = function(css_string) {
      var char, k, len, ref, skip, tokens, word;
      skip = false;
      word = '';
      tokens = [];
      ref = this.cleanCss(css_string);
      for (k = 0, len = ref.length; k < len; k++) {
        char = ref[k];
        if (skip) {
          skip = false;
        } else if (char === '\\') {
          skip = true;
        } else if (char === '.' || char === ' ' || char === '#' || char === '>' || char === ':' || char === ',' || char === '+' || char === '~') {
          if (word.length > 0) {
            tokens.push(word);
          }
          word = '';
        }
        word += char;
        if (char === ' ' || char === ',') {
          tokens.push(word);
          word = '';
        }
      }
      if (word.length > 0) {
        tokens.push(word);
      }
      return tokens;
    };

    DomPredictionHelper.prototype.tokenizeCssForDiff = function(css_string) {
      var block, combined_tokens, k, len, ref, token;
      combined_tokens = [];
      block = [];
      ref = this.tokenizeCss(css_string);
      for (k = 0, len = ref.length; k < len; k++) {
        token = ref[k];
        block.push(token);
        if (token === ' ' && block.length > 0) {
          combined_tokens = combined_tokens.concat(block);
          block = [];
        } else if (token === '+' || token === '~') {
          block = [block.join('')];
        }
      }
      if (block.length > 0) {
        return combined_tokens.concat(block);
      } else {
        return combined_tokens;
      }
    };

    DomPredictionHelper.prototype.decodeCss = function(string, existing_tokens) {
      var character, inverted, k, len, out, ref;
      inverted = this.invertObject(existing_tokens);
      out = '';
      ref = string.split('');
      for (k = 0, len = ref.length; k < len; k++) {
        character = ref[k];
        out += inverted[character];
      }
      return this.cleanCss(out);
    };

    DomPredictionHelper.prototype.encodeCssForDiff = function(strings, existing_tokens) {
      var codepoint, k, l, len, len1, out, ref, string, strings_out, token;
      codepoint = 50;
      strings_out = [];
      for (k = 0, len = strings.length; k < len; k++) {
        string = strings[k];
        out = new String();
        ref = this.tokenizeCssForDiff(string);
        for (l = 0, len1 = ref.length; l < len1; l++) {
          token = ref[l];
          if (!existing_tokens[token]) {
            existing_tokens[token] = String.fromCharCode(codepoint++);
          }
          out += existing_tokens[token];
        }
        strings_out.push(out);
      }
      return strings_out;
    };

    DomPredictionHelper.prototype.tokenPriorities = function(tokens) {
      var epsilon, first, i, k, l, len, len1, priorities, ref, second, token, word;
      epsilon = 0.001;
      priorities = new Array();
      i = 0;
      for (k = 0, len = tokens.length; k < len; k++) {
        token = tokens[k];
        first = token.substring(0, 1);
        second = token.substring(1, 2);
        if (first === ':' && second === 'n') {
          priorities[i] = 0;
        } else if (first === '>') {
          priorities[i] = 2;
        } else if (first === '+' || first === '~') {
          priorities[i] = 3;
        } else if (first !== ':' && first !== '.' && first !== '#' && first !== ' ' && first !== '>' && first !== '+' && first !== '~') {
          priorities[i] = 4;
        } else if (first === '.') {
          priorities[i] = 5;
          ref = this.priorityWords;
          for (l = 0, len1 = ref.length; l < len1; l++) {
            word = ref[l];
            if (token.toLowerCase().includes(word)) {
              priorities[i] = 5.5;
              break;
            }
          }
        } else if (first === '#') {
          priorities[i] = 6;
          if (token.match(/\d{3,}/)) {
            priorities[i] = 2.5;
          }
        } else {
          priorities[i] = 0;
        }
        priorities[i] += i * epsilon;
        i++;
      }
      return priorities;
    };

    DomPredictionHelper.prototype.orderFromPriorities = function(priorities) {
      var i, k, l, ordering, ref, ref1, tmp;
      tmp = new Array();
      ordering = new Array();
      for (i = k = 0, ref = priorities.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        tmp[i] = {
          value: priorities[i],
          original: i
        };
      }
      tmp.sort(function(a, b) {
        return a.value - b.value;
      });
      for (i = l = 0, ref1 = priorities.length; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
        ordering[i] = tmp[i].original;
      }
      return ordering;
    };

    DomPredictionHelper.prototype.simplifyCss = function(css, selected, rejected) {
      var best_so_far, first, got_shorter, i, k, look_back_index, ordering, part, parts, priorities, ref, second, selector;
      parts = this.tokenizeCss(css);
      priorities = this.tokenPriorities(parts);
      ordering = this.orderFromPriorities(priorities);
      selector = this.cleanCss(css);
      look_back_index = -1;
      best_so_far = "";
      if (this.selectorGets('all', selected, selector) && this.selectorGets('none', rejected, selector)) {
        best_so_far = selector;
      }
      got_shorter = true;
      while (got_shorter) {
        got_shorter = false;
        for (i = k = 0, ref = parts.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
          part = ordering[i];
          if (parts[part].length === 0) {
            continue;
          }
          first = parts[part].substring(0, 1);
          second = parts[part].substring(1, 2);
          if (first === ' ') {
            continue;
          }
          if (this.wouldLeaveFreeFloatingNthChild(parts, part)) {
            continue;
          }
          this._removeElements(part, parts, first, (function(_this) {
            return function(selector) {
              if (_this.selectorGets('all', selected, selector) && _this.selectorGets('none', rejected, selector) && (selector.length < best_so_far.length || best_so_far.length === 0)) {
                best_so_far = selector;
                got_shorter = true;
                return true;
              } else {
                return false;
              }
            };
          })(this));
        }
      }
      return this.cleanCss(best_so_far);
    };

    DomPredictionHelper.prototype._removeElements = function(part, parts, firstChar, callback) {
      var j, k, l, look_back_index, ref, ref1, ref2, ref3, selector, tmp;
      if (firstChar === '+' || firstChar === '~') {
        look_back_index = this.positionOfSpaceBeforeIndexOrLineStart(part, parts);
      } else {
        look_back_index = part;
      }
      tmp = parts.slice(look_back_index, part + 1);
      for (j = k = ref = look_back_index, ref1 = part; ref <= ref1 ? k <= ref1 : k >= ref1; j = ref <= ref1 ? ++k : --k) {
        parts[j] = '';
      }
      selector = this.cleanCss(parts.join(''));
      if (selector === '' || !callback(selector)) {
        for (j = l = ref2 = look_back_index, ref3 = part; ref2 <= ref3 ? l <= ref3 : l >= ref3; j = ref2 <= ref3 ? ++l : --l) {
          parts[j] = tmp[j - look_back_index];
        }
      }
      return parts;
    };

    DomPredictionHelper.prototype.positionOfSpaceBeforeIndexOrLineStart = function(part, parts) {
      var i;
      i = part;
      while (i >= 0 && parts[i] !== ' ') {
        i--;
      }
      if (i < 0) {
        i = 0;
      }
      return i;
    };

    DomPredictionHelper.prototype.wouldLeaveFreeFloatingNthChild = function(parts, part) {
      var i, nth_child_is_on_right, space_is_on_left;
      space_is_on_left = nth_child_is_on_right = false;
      i = part + 1;
      while (i < parts.length && parts[i].length === 0) {
        i++;
      }
      if (i < parts.length && parts[i].substring(0, 2) === ':n') {
        nth_child_is_on_right = true;
      }
      i = part - 1;
      while (i > -1 && parts[i].length === 0) {
        i--;
      }
      if (i < 0 || parts[i] === ' ') {
        space_is_on_left = true;
      }
      return space_is_on_left && nth_child_is_on_right;
    };

    DomPredictionHelper.prototype.cleanCss = function(css) {
      var cleaned_css, last_cleaned_css;
      cleaned_css = css;
      last_cleaned_css = null;
      while (last_cleaned_css !== cleaned_css) {
        last_cleaned_css = cleaned_css;
        cleaned_css = cleaned_css.replace(/(^|\s+)(\+|\~)/, '').replace(/(\+|\~)\s*$/, '').replace(/>/g, ' > ').replace(/\s*(>\s*)+/g, ' > ').replace(/,/g, ' , ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '').replace(/\s*,$/g, '').replace(/^\s*,\s*/g, '').replace(/\s*>$/g, '').replace(/^>\s*/g, '').replace(/[\+\~\>]\s*,/g, ',').replace(/[\+\~]\s*>/g, '>').replace(/\s*(,\s*)+/g, ' , ');
      }
      return cleaned_css;
    };

    DomPredictionHelper.prototype.getPathsFor = function(nodeset) {
      var k, len, node, out;
      out = [];
      for (k = 0, len = nodeset.length; k < len; k++) {
        node = nodeset[k];
        if (node && node.nodeName) {
          out.push(this.pathOf(node));
        }
      }
      return out;
    };

    DomPredictionHelper.prototype.predictCss = function(s, r) {
      var css, k, len, selected, selected_paths, simplest, union;
      if (s.length === 0) {
        return '';
      }
      selected_paths = this.getPathsFor(s);
      css = this.cssDiff(selected_paths);
      simplest = this.simplifyCss(css, s, r);
      if (simplest.length > 0) {
        return simplest;
      }
      union = '';
      for (k = 0, len = s.length; k < len; k++) {
        selected = s[k];
        union = this.pathOf(selected) + ", " + union;
      }
      union = this.cleanCss(union);
      return this.simplifyCss(union, s, r);
    };

    DomPredictionHelper.prototype.selectorGets = function(type, list, the_selector) {
      var e;
      if (list.length === 0 && type === 'all') {
        return false;
      }
      if (list.length === 0 && type === 'none') {
        return true;
      }
      try {
        if (type === 'all') {
          return list.not(the_selector).length === 0;
        } else {
          return !(list.is(the_selector));
        }
      } catch (error) {
        e = error;
        if (window.console) {
          console.log("Error on selector: " + the_selector);
        }
        throw e;
      }
    };

    DomPredictionHelper.prototype.invertObject = function(object) {
      var key, new_object, value;
      new_object = {};
      for (key in object) {
        value = object[key];
        new_object[value] = key;
      }
      return new_object;
    };

    DomPredictionHelper.prototype.cssToXPath = function(css_string) {
      var css_block, k, len, out, token, tokens;
      tokens = this.tokenizeCss(css_string);
      if (tokens[0] && tokens[0] === ' ') {
        tokens.splice(0, 1);
      }
      if (tokens[tokens.length - 1] && tokens[tokens.length - 1] === ' ') {
        tokens.splice(tokens.length - 1, 1);
      }
      css_block = [];
      out = "";
      for (k = 0, len = tokens.length; k < len; k++) {
        token = tokens[k];
        if (token === ' ') {
          out += this.cssToXPathBlockHelper(css_block);
          css_block = [];
        } else {
          css_block.push(token);
        }
      }
      return out + this.cssToXPathBlockHelper(css_block);
    };

    DomPredictionHelper.prototype.cssToXPathBlockHelper = function(css_block) {
      var current, expressions, first, i, k, l, len, out, re, ref, rest;
      if (css_block.length === 0) {
        return '//';
      }
      out = '//';
      first = css_block[0].substring(0, 1);
      if (first === ',') {
        return " | ";
      }
      if (first === ':' || first === '#' || first === '.') {
        out += '*';
      }
      expressions = [];
      re = null;
      for (k = 0, len = css_block.length; k < len; k++) {
        current = css_block[k];
        first = current.substring(0, 1);
        rest = current.substring(1);
        if (first === ':') {
          if (re = rest.match(/^nth-child\((\d+)\)$/)) {
            expressions.push('(((count(preceding-sibling::*) + 1) = ' + re[1] + ') and parent::*)');
          }
        } else if (first === '.') {
          expressions.push('contains(concat( " ", @class, " " ), concat( " ", "' + rest + '", " " ))');
        } else if (first === '#') {
          expressions.push('(@id = "' + rest + '")');
        } else if (first === ',') {

        } else {
          out += current;
        }
      }
      if (expressions.length > 0) {
        out += '[';
      }
      for (i = l = 0, ref = expressions.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        out += expressions[i];
        if (i < expressions.length - 1) {
          out += ' and ';
        }
      }
      if (expressions.length > 0) {
        out += ']';
      }
      return out;
    };

    return DomPredictionHelper;

  })();

}).call(this);
