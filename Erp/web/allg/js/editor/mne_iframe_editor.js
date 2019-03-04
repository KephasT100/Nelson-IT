// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
// ================================================================================
function MneIframeEditor(win, bframe, parameter)
{
  this.win = win;
  this.doc = win.document;
  this.parameter = parameter;
  this.doc.designMode = "on";

  this.win.mne_editor = this;
  this.doc.mne_editor = this;
  this.mne_editor = this;

  if (typeof parameter.output == 'string') this.output = this.win.parent.document.getElementById(parameter.output);
  if (typeof parameter.output == 'object') this.output = parameter.output;

  this.default_class = new Object;
  this.default_class.div = "mne_alignj";
  this.default_class.span = "mne_fontn";

  this.parts = new Array();
  this.parts[this.parts.length] = "DIV";

  this.texts = new Array();
  this.texts[this.texts.length] = "SPAN";

  if (typeof bframe == "string" || typeof bframe.tagName != 'undefined') this.buttons = new MneEditorButtons(win.parent, bframe, this);
  else this.buttons = bframe;
  this.buttons.mne_editor = this;

  this.editarea = this.doc.getElementsByTagName("body")[0];
  this.editarea.className = "MneEditorEditArea";
  this.editarea.mne_editor = this;

  this.destructor = function()
  {
    this.buttons.destructor();
  }

  this.getTextContent = function(node)
  {
    var str;
    str = this.getRawTextContent(node);

    return str.replace(/[\r\n\f]/g, "");
  };

  this.dispatch_keydown = function(keyCode, evt)
  {
    try
    {
      this.buttons.setModify(true);
      if (keyCode == 8 && this.lastKeyCode != 8) { this.undo_add(); }
      this.keyCode = this.lastKeyCode = keyCode;

      if (keyCode == 8) { return false; }
      else if (keyCode == 9) { return false; }
      else if (keyCode == 27) { this.findUpElement(); }

      else if (keyCode == 37 && evt.shiftKey == true) { return true; }
      else if (keyCode == 38 && evt.shiftKey == true) { return true; }
      else if (keyCode == 39 && evt.shiftKey == true) { return true; }
      else if (keyCode == 40 && evt.shiftKey == true) { return true; }

      else if (keyCode == 37) { this.findPrevChar(); }
      else if (keyCode == 39) { this.findNextChar(); }

      return true;
    }
    catch (err)
    {
      console.log(err.message + "\n" + err.stack);
      return false;
    }
  };

  this.dispatch_keyup = function(keyCode, evt)
  {
    try
    {
      if (keyCode == 8)
      {
        var sel = this.getSelection();
        this.delChar(sel);
        if (this.editarea.firstChild == null) this.clearEditarea(sel);
        this.moveCursorSelect(sel);
      }

      else if (keyCode == 37 && evt.shiftKey == true) { return true; }
      else if (keyCode == 38 && evt.shiftKey == true) { return true; }
      else if (keyCode == 39 && evt.shiftKey == true) { return true; }
      else if (keyCode == 40 && evt.shiftKey == true) { return true; }

      else if (keyCode == 67 && evt.ctrlKey == true) { return true; }
      else if (keyCode == 88 && evt.ctrlKey == true) { return true; }
      else if (keyCode == 86 && evt.ctrlKey == true) { return true; }

      // MAC OS X Clipboard
      else if (evt.metaKey == true && evt.keyCode == 67) { return true; }
      else if (evt.metaKey == true && evt.keyCode == 88) { return true; }
      else if (evt.metaKey == true && evt.keyCode == 86) { return true; }

      else if (typeof this.keypressListener[keyCode] == 'function') this.keypressListener[keyCode](keyCode);

      return false;
    }
    catch (err)
    {
      console.log(err.message + "\n" + err.stack);
      return false;
    }
  };

  this.dispatch_keypress = function(keyCode, evt)
  {
    try
    {
      if (keyCode != 13) this.partCount = 0;
      else { this.partCount++; this.addPart(); }

      if (keyCode == 0 && this.shift == true && this.keyCode == 37) { return true; }
      else if (keyCode == 0 && evt.ctrlKey == true && this.keyCode == 38) { return true; }
      else if (keyCode == 0 && evt.ctrlKey == true && this.keyCode == 39) { return true; }
      else if (keyCode == 0 && evt.ctrlKey == true && this.keyCode == 40) { return true; }

      else if (this.keyCode == 37 && evt.shiftKey == true) { return true; }
      else if (this.keyCode == 38 && evt.shiftKey == true) { return true; }
      else if (this.keyCode == 39 && evt.shiftKey == true) { return true; }
      else if (this.keyCode == 40 && evt.shiftKey == true) { return true; }

      // Other Clipboard
      else if (evt.ctrlKey == true && keyCode == 99) { return true; }
      else if (evt.ctrlKey == true && keyCode == 118) { return true; }
      else if (evt.ctrlKey == true && keyCode == 120) { return true; }

      // MAC OS X Clipboard
      else if (evt.metaKey == true && evt.keyCode == 99) { return true; }
      else if (evt.metaKey == true && evt.keyCode == 118) { return true; }
      else if (evt.metaKey == true && evt.keyCode == 120) { return true; }

      else if (keyCode == 32 && evt.ctrlKey == true) { node = this.doc.createElement("span"); node.innerHTML = "&nbsp;"; this.addChar(node.firstChild.data); }
      else if (evt.ctrlKey != true && evt.altKey != true && evt.metaKey != true && keyCode > 31) { this.addChar(String.fromCharCode(keyCode)); }
      else if (typeof this.keypressListener[keyCode] == 'function') this.keypressListener[keyCode](keyCode);

      return false;
    }
    catch (err)
    {
      console.log(err.message + "\n" + err.stack);
    }

  };

  this.keypressListener = new Array();
  this.keypressListener.mne_editor = this;
  this.addKeypressListener = function(keycode, func)
  {
    this.keypressListener[keycode] = func;
  };

  this.mkClass = function(node, name, value, clear_name)
  {
    var c;
    var a;
    if (typeof clear_name == "string" && clear_name != "") this.mkClass(node, clear_name, false);

    if (value)
    {
      if (typeof node.className == 'undefined') node.className = name;
      else if (node.className.indexOf(name) == -1) node.className = node.className + " " + name;
    }
    else
    {
      if (typeof node.className == "undefined") return;
      eval("node.className = node.className.replace(/ *" + name + "[^ ]* */, ' ' )");
    }

    c = node.className;
    c = c.replace(/ +/g, ' ');
    a = c.split(" ");
    a.sort();
    node.className = a.join(" ");
  };

  this.equalSpan = function(ele1, ele2)
  {
    var c1, c2;
    if (typeof ele1.className == 'undefined') c1 = "";
    else c1 = ele1.className;
    if (typeof ele2.className == 'undefined') c2 = "";
    else c2 = ele2.className;

    return (ele1 != null && ele2 != null && c1 == c2);
  };

  this.clearEditarea = function(sel)
  {
    var part, span;
    this.partCount = 0;

    this.act_element = null;

    while (this.editarea.hasChildNodes())
      this.editarea.removeChild(this.editarea.firstChild);

    part = this.doc.createElement("div");
    part.className = this.default_class.div;
    this.editarea.appendChild(part);

    part.appendChild(this.doc.createElement("span"));
    part.firstChild.className = this.default_class.span;

    span = part.firstChild;
    span.innerHTML = "&nbsp;";
    if (typeof sel != 'undefined' && sel != null)
    {
      sel.startContainer = sel.endContainer = span.firstChild;
      sel.startOffset = sel.endOffset = 1;
    }
    else
    {
      this.moveCursor(span.firstChild, 'e');
    }
    this.addCleanit(span);
  };

  this.setContentListener = new Array();
  this.setContentListener.mne_editor = this;
  this.addSetContentListener = function(func)
  {
    this.setContentListener[this.setContentListener.length] = func;
  };

  this.getContentListener = new Array();
  this.getContentListener.mne_editor = this;
  this.addGetContentListener = function(func)
  {
    this.getContentListener[this.getContentListener.length] = func;
  };

  this.setContent = function(html)
  {
    var i;
    this.clearEditarea();
    this.undoit = new Array();
    this.undonum = -1;
    if (html != "")
    {
      this.editarea.innerHTML = html;
      this.findLastChar();
    }
    this.buttons.setModify(false);
    for (i = 0; i < this.setContentListener.length; i++)
      this.setContentListener[i]();
  };

  this.getContent = function()
  {
    var i;
    var result;

    this.win.focus();
    if (this.act_element != null) this.mkClass(this.act_element, "active", false);
    this.act_element = null;
    this.clearNode(this.getSelection());
    this.clearEmpty(this.editarea);
    for (i = 0; i < this.getContentListener.length; i++)
      this.getContentListener[i]();
    result = this.editarea.innerHTML;
    for (i = 0; i < this.setContentListener.length; i++)
      this.setContentListener[i]();
    return result;
  };

  this.clear = function()
  {
    this.setContent("");
  };

  this.clearEmpty = function(p)
  {
    var c, n;
    for (n = p.firstChild; n != null;)
    {
      c = n;
      n = n.nextSibling;
      if (c.tagName == "SPAN")
      {
        if (c.innerHTML == "") c.parentNode.removeChild(c);
      }
      else if (!this.isText(c))
      {
        this.clearEmpty(c);
        if (c.firstChild == null) c.parentNode.removeChild(c);
      }
    }
  };

  this.clearNodeListener = new Array();
  this.clearNodeListener.mne_editor = this;
  this.addClearNodeListener = function(tagname, func)
  {
    var i;
    if (typeof tagname == 'string')
    {
      this.clearNodeListener[tagname] = func;
      return this.clearNodeListener.length - 1;
    }
    for (i = 0; i < tagname.length; i++)
      this.clearNodeListener[tagname[i]] = func;
    return this.clearNodeListener.length - i;
  };

  this.addCleanit = function(node, only_empty)
  {
    try
    {
      if (node.nodeType != 1 && node.tagName != "SPAN") (null).i = 42;
    }
    catch (e)
    {
      this.error("Falscher Nodetype: " + node.nodeType + "\n" + e.stack);
    }
    if (only_empty) this.mkClass(node, "mne_editor_cleanit_empty", true);
    else this.mkClass(node, "mne_editor_cleanit", true);
  };

  this.clearNode = function(isel, node)
  {
    var c1, c2;
    var node;

    var sel, start, end;
    var rval = false;

    if (typeof isel == 'undefined') sel = this.getSelection();
    else sel = isel;
    if (typeof node == 'undefined') node = this.editarea;

    start = end = null;
    if (sel != null)
    {
      start = sel.startContainer.parentNode;
      end = sel.startContainer.parentNode;
    }

    for (c1 = node.firstChild; c1 != null; c1 = c2)
    {
      var clear = true;
      c2 = c1.nextSibling;
      if (c1.tagName == "SPAN" && c1.className.indexOf("mne_editor_cleanit") != -1)
      {
        if (c1.innerHTML == "&nbsp;")
        {
          if (c1 != start && c1 != end) c1.removeChild(c1.firstChild);
        }
        else
        {
          if (c1.innerHTML.substring(0, 6) == "&nbsp;")
          {
            this.mkClass(c1, "mne_editor_cleanit", false);
            c1.firstChild.data = c1.firstChild.data.substring(1);
            if (c1 == start && sel.startOffset > 1) sel.startOffset--;
            if (c1 == end && sel.endOffset > 1) sel.endOffset--;
          }
        }
      }
      else if (c1.tagName != "SPAN")
      {
        var func;
        this.clearNode(isel, c1);
        if (typeof (func = this.clearNodeListener[c1.tagName]) == 'function') clear = func(c1);
      }
      if (clear && c1.firstChild == null) c1.parentNode.removeChild(c1);
    }

    if (this.editarea.firstChild == null)
    {
      rval = true;
      this.clearEditarea(sel);
    }
    if (typeof isel == 'undefined' && sel != null ) this.moveCursorSelect(sel);

    return rval;
  };

  this.setActelement = function(node)
  {
    if (this.act_element != null) this.mkClass(this.act_element, "active", false);
    this.mkClass(node, "active", true);
    this.act_element = node;
  };
  this.clearActelement = function()
  {
    if (this.act_element != null) this.mkClass(this.act_element, "active", false);
    this.act_element = null;
  };

  this.findUpElement = function(tagName)
  {
    if (typeof this.infindUpElement == true) return;
    try
    {
      this.infindUpElement = true;
      this.win.focus();

      if (this.act_element != null) this.mkClass(this.act_element, "active", false);
      else this.act_element = this.getActnode();

      if (typeof tagName == 'undefined') while (this.buttons.haveAttr(this.act_element.parentNode) != true && this.act_element.parentNode != this.editarea)
        this.act_element = this.act_element.parentNode;
      else while (this.act_element.parentNode.tagName != tagName && this.act_element.parentNode != this.editarea)
        this.act_element = this.act_element.parentNode;

      this.act_element = this.act_element.parentNode;
      if (this.act_element != this.editarea)
      {
        this.buttons.showAttr(this.act_element);
        this.mkClass(this.act_element, "active", true);
      }
      else
      {
        this.act_element = null;
        this.buttons.showAttr(this.getActnode());
      }
    }
    catch (e)
    {
      this.infindUpElement = false;
      throw e;
    }
    this.infindUpElement = false;
  };

  this.findPrevChar = function(isel)
  {
    var sel;
    if (typeof isel == 'undefined') sel = this.getSelection();
    else sel = isel;
    var n = sel.startContainer;
    var k = sel.startOffset;
    var r = new Object;

    if (this.act_element != null) this.clearActelement();
    if (n.nodeType == 3 && k > 0)
    {
      r.startContainer = r.endContainer = n;
      r.startOffset = r.endOffset = k - 1;
      if (typeof isel == 'undefined') this.moveCursorSelect(r);
      return true;
    }

    while (n != this.editarea && n.previousSibling == null)
      n = n.parentNode;

    if (n == this.editarea)
    {
      if (n.firstChild.tagName != 'DIV')
      {
        var part, span;

        part = this.doc.createElement("div");
        part.className = this.default_class.div;
        this.insertBefore(n.firstChild, part);

        part.appendChild(this.doc.createElement("span"));
        part.firstChild.className = this.default_class.span;

        span = part.firstChild;
        span.innerHTML = "&nbsp;";
        this.addCleanit(span);
      }

      while (n.firstChild != null)
        n = n.firstChild;
      r.startContainer = r.endContainer = n;
      r.startOffset = r.endOffset = 0;
    }
    else
    {
      n = n.previousSibling;
      while (n.lastChild != null)
        n = n.lastChild;
      r.startContainer = r.endContainer = n;
      r.startOffset = r.endOffset = n.length;
    }

    if (r.startContainer.nodeType != 3) this.setActelement(r.startContainer);

    if (typeof isel == 'undefined') this.moveCursorSelect(r);
    if (r.startContainer == sel.startContainer && r.startOffset == sel.startOffset) return false;
    sel.startContainer = sel.endContainer = r.startContainer;
    sel.startOffset = sel.endOffset = r.startOffset;
    return true;
  };

  this.findNextChar = function(isel)
  {

    var sel;

    if (typeof isel == 'undefined') sel = this.getSelection();
    else sel = isel;
    var c = sel.startContainer;
    var n = c.parentNode;
    var k = sel.startOffset;
    var r = new Object;

    if (c.nodeType == 3 && k < c.length)
    {
      r.startContainer = r.endContainer = c;
      r.startOffset = r.endOffset = k + 1;
      if (typeof isel == 'undefined') this.moveCursorSelect(r);
      return true;
    }

    while (c != this.editarea && c == n.lastChild && n != this.editarea)
    {
      c = n;
      n = n.parentNode;
    }
    if (c != this.editarea) c = c.nextSibling;
    if (c == null) return false;

    while (c.nodeType != 3 && c.firstChild != null)
      c = c.firstChild;
    if (c.nodeType != 3) this.setActelement(c);

    r.startContainer = r.endContainer = c;
    r.startOffset = r.endOffset = 0;
    if (typeof isel == 'undefined') this.moveCursorSelect(r);
    if (r.startOffset == sel.endOffset && r.startContainer == sel.startContainer) return false;
    sel.startOffset = sel.endOffset = r.startOffset;
    sel.startContainer = sel.endContainer = r.startContainer;
    return true;
  };

  this.findLastChar = function(ic)
  {
    var c = ic;

    if (typeof c == 'undefined') c = this.editarea;
    while (c.lastChild != null)
      c = c.lastChild;

    if (c.nodeType != 3 && c.tagName != "SPAN" && this.isText(c))
    {
      var s = this.doc.createElement("SPAN");
      s.className = this.default_class.span;
      s.innerHTML = "&nbsp;";
      this.addCleanit(s);
      this.insertAfter(c, s);
      c = s;
    }

    if (c.nodeType != 3 && this.isPart(c))
    {
      var s = this.doc.createElement("SPAN");
      s.className = this.default_class.span;
      s.innerHTML = "&nbsp;";
      this.addCleanit(s);
      c.appendChild(s);
      c = s;
    }
    if (c.nodeType != 3 && c.tagName == "SPAN" && c.innerHTML == "")
    {
      c.innerHTML = "&nbsp;";
      this.addCleanit(c);
    }

    if (c.nodeType != 3 && c.tagName != "SPAN") this.error("#mne_lang#Letzter Kindknoten ist kein Textknoten");

    this.moveCursor(c, 'e');
  };

  this.addChar = function(c)
  {
    var sel = this.getSelection();
    var node;

    if (this.isText(this.act_element)) this.clearActelement();
    if (this.undo_need) this.undo_add(sel);
    this.delSelection(sel);

    if ( sel.startContainer.nodeType != 3)
    {
      if (sel != null && sel.startContainer.previousSibling == null && sel.startContainer.nextSibling != null)
      {
        node = this.doc.createElement('span');
        node.className = this.default_class.span;
        node.innerHTML = c;
        this.insertBefore(sel.startContainer, node);
        sel.startContainer = sel.endContainer = node.firstChild;
        sel.startOffset = sel.endOffset = 1;
      }
      else if ( sel.startContainer.nextSibling != null && sel.startContainer.nextSibling.tagName == 'SPAN')
      {
        sel.startContainer = sel.endContainer = sel.startContainer.nextSibling.firstChild;
        sel.startContainer.data = c + sel.startContainer.data;
        sel.startOffset = sel.endOffset = 1;
      }
      else
      {
        node = this.doc.createElement('span');
        node.className = this.default_class.span;
        node.innerHTML = c;
        this.insertAfter(sel.startContainer, node);
        sel.startContainer = sel.endContainer = node.firstChild;
        sel.startOffset = sel.endOffset = 1;
      }
    }
    else
    {
      sel.startContainer.data = sel.startContainer.data.substr(0, sel.startOffset) + c + sel.startContainer.data.substr(sel.endOffset);
      sel.startOffset++;

      node = sel.startContainer.parentNode;
      this.clearNode(sel);

      sel.startContainer = sel.endContainer = node.firstChild;
      if (sel.startOffset > sel.startContainer.data.length) sel.startOffset = sel.startContainer.length;
      sel.endOffset = sel.startOffset;
    }

    this.moveCursorSelect(sel);
  };

  this.delCharListener = new Array();
  this.delCharListener.mne_editor = this;
  this.addDelCharListener = function(tagname, func)
  {
    if (typeof tagname == 'string')
    {
      this.delCharListener[tagname] = func;
    }
    else
    {
      var i;
      for (i = 0; i < tagname.length; i++)
        this.delCharListener[tagname[i]] = func;
    }
  };

  this.addDelCharListener('DIV', function(node, sel)
  {
    if (node.previousSibling != null && node.previousSibling.tagName == "DIV")
    {
      var prev = node.previousSibling;
      while (node.firstChild != null)
        prev.appendChild(node.firstChild);
      node.parentNode.removeChild(node);
      return true;
    }
    return false;
  });

  this.delChar = function(isel)
  {

    var node;
    var parent;
    var sel;

    if (typeof isel == 'undefined') sel = this.getSelection();
    else sel = isel;
    if ( sel == null ) return;
    if (this.delSelection(sel).length > 0 ) return;

    if (sel.startOffset == 0 && sel.startContainer.nodeType == 3 && sel.startContainer.parentNode.previousSibling == null)
    {
      node = sel.startContainer.parentNode;
      while (node != this.editarea)
      {
        if (typeof this.delCharListener[node.tagName] == 'function') if (this.delCharListener[node.tagName](node, sel) == true) return;
        node = node.parentNode;
      }
    }

    if (sel.startOffset == 0) if (this.findPrevChar(sel) == false) return;

    sel.startContainer.data = sel.startContainer.data.substring(0, sel.startOffset - 1) + sel.startContainer.data.substring(sel.startOffset);
    sel.startOffset = sel.endOffset = sel.startOffset - 1;
    if (sel.startContainer.data == '')
    {
      node = sel.startContainer.parentNode;
      parent = node.parentNode;
      if (this.findPrevChar(sel) == false) this.findNextChar(sel);

      parent.removeChild(node);
      while (node != this.editarea && parent.firstChild == null)
      {
        node = parent;
        parent = parent.parentNode;
        if (typeof (func = this.clearNodeListener[node.tagName]) == 'function') func(node);
        else if (node != this.editarea && parent != null) parent.removeChild(node);
      }
    }

    if (typeof isel == 'undefined') this.moveCursorSelect(sel);
  };

  this.isText = function(n)
  {
    var i;
    try
    {
      for (i = 0; i < this.texts.length; i++)
        if (n.tagName == this.texts[i]) return true;
    }
    catch (e)
    {
      return false;
    }
  };

  this.isPart = function(n)
  {
    var i;
    try
    {
      for (i = 0; i < this.parts.length; i++)
        if (n.tagName == this.parts[i]) return true;
    }
    catch (e)
    {
      return false;
    }
  };

  this.partCountListener = new Array();
  this.partCountListener[0] = new Array();
  this.partCountListener[1] = new Array();
  this.partCountListener[2] = new Array();
  this.partCountListener[3] = new Array();

  this.isPartCountListener = function(num, node)
  {
    try
    {
      var i;
      for (i = 0; i < this.partCountListener[num].length; i++)
        if (this.partCountListener[num][i].tagname == '' || node.tagName == this.partCountListener[num][i].tagname) return this.partCountListener[num][i].func;
    }
    catch (err)
    {
      return null;
    }
    return null;
  };

  this.addPartCountListener = function(num, tagname, func)
  {
    if (this.partCountListener[num].length > 0 && this.partCountListener[num][this.partCountListener[num].length - 1].tagname == '')
    {
      this.partCountListener[num][this.partCountListener[num].length] = this.partCountListener[num][this.partCountListener[num].length - 1];
      this.partCountListener[num][this.partCountListener[num].length - 2] =
      {
        'tagname' : tagname,
        'func' : func
      };
      return this.partCountListener[num].length - 2;
    }
    this.partCountListener[num][this.partCountListener[num].length] =
    {
      'tagname' : tagname,
      'func' : func
    };
    return this.partCountListener[num].length - 1;
  };

  this.addPartCountListener(1, 'DIV', function(node, span, sel)
  {
    this.mne_editor.undo_add(sel);

    var part = this.mne_editor.doc.createElement('div');
    part.className = node.className;
    this.mne_editor.insertAfter(node, part);

    if (sel.endContainer.nodeType == 3 && sel.endOffset != sel.endContainer.data.length)
    {
      part.appendChild(this.mne_editor.doc.createElement('span'));
      part.lastChild.className = this.mne_editor.default_class.span;
      part.lastChild.innerHTML = sel.endContainer.data.substring(sel.endOffset);
      sel.endContainer.data = sel.endContainer.data.substring(0, sel.endOffset);
    }

    if (this.mne_editor.isText(span)) while (span.nextSibling != null)
      part.appendChild(span.nextSibling);

    if (part.firstChild == null)
    {
      if (span.tagName == "SPAN") part.appendChild(span.cloneNode(false));
      else part.innerHTML = '<span class="' + this.mne_editor.default_class.span + '"></span>';
      part.firstChild.innerHTML = "&nbsp;";
      this.mne_editor.addCleanit(part.firstChild);
      this.mne_editor.moveCursor(part.firstChild.firstChild, 'e');
    }
    else if (sel.endContainer.nodeType == 3 && sel.endContainer.data.length == 0)
    {
      var p = sel.endContainer.parentNode;
      sel.endContainer.parentNode.innerHTML = "&nbsp;";
      sel.endContainer = p.firstChild;
      sel.endOffset = 1;
      this.mne_editor.addCleanit(p);
      this.mne_editor.moveCursor(p, 'e');
    }
    else
    {
      this.mne_editor.moveCursor(part.firstChild.firstChild, 'b');
    }

    return false;
  });

  this.addPart = function()
  {
    var span, sel;
    var func;

    sel = this.getSelection();
    span = sel.endContainer.parentNode;

    p = span;
    while ((func = this.isPartCountListener(this.partCount, p)) == null && p != this.editarea)
      p = p.parentNode;
    if (func != null)
    {
      if (func(p, span, sel) == true) this.partCount = 0;
    }
    else this.partCount = 0;
  };

  this.setFontStyle = function(node, end, attr, value, sel)
  {
    var i;
    if (node.tagName == "SPAN")
    {
      this.mkClass(node, attr, value);
      if (node.previousSibling != null && node.previousSibling.tagName == "SPAN" && this.equalSpan(node.previousSibling, node))
      {
        node.firstChild.data = node.previousSibling.firstChild.data + node.firstChild.data;
        if (sel.startContainer == node.firstChild) sel.startOffset += node.previousSibling.firstChild.data.length;
        else if (sel.startContainer == node.previousSibling.firstChild) sel.startContainer = node.firstChild;
        if (sel.endContainer == node.firstChild) sel.endOffset += node.previousSibling.firstChild.data.length;
        node.previousSibling.parentNode.removeChild(node.previousSibling);
      }
    }
    else
    {
      for (i = node.firstChild; i != null; i = i.nextSibling)
      {
        if (this.setFontStyle(i, end, attr, value, sel) == true) return true;
      }
    }
    return node.firstChild == end;
  };

  this.setFont = function(attr, value, from_button)
  {
    this.win.focus();

    var sel = this.getSelection();
    var pre, end;
    var span;
    var c1, found;

    this.undo_add(sel);

    if (sel.startOffset != 0)
    {
      pre = sel.startContainer.data.substring(0, sel.startOffset);
      sel.startContainer.data = sel.startContainer.data.substring(sel.startOffset);
      if (pre != '')
      {
        span = sel.startContainer.parentNode.cloneNode(false);
        span.appendChild(this.doc.createTextNode(pre));
        this.insertBefore(sel.startContainer.parentNode, span);
      }
      if (sel.startContainer == sel.endContainer)
      {
        if (sel.endOffset == sel.startOffset)
        {
          span = sel.startContainer.parentNode.cloneNode(false);
          span.innerHTML = "&nbsp;";
          this.insertBefore(sel.startContainer.parentNode, span);
          this.mkClass(span, attr, value);
          this.addCleanit(span);
          sel.startContainer = sel.endContainer = span.firstChild;
          sel.startOffset = sel.endOffset = 1;
          this.moveCursorSelect(sel);
          return span;
        }
      }
      sel.endOffset -= sel.startOffset;
      sel.startOffset = 0;
    }

    if (sel.endOffset != 0)
    {
      end = sel.endContainer.data.substring(sel.endOffset);
      sel.endContainer.data = sel.endContainer.data.substring(0, sel.endOffset);
      if (end != '')
      {
        span = sel.endContainer.parentNode.cloneNode(false);
        span.appendChild(this.doc.createTextNode(end));
        this.insertAfter(sel.endContainer.parentNode, span);
      }
      sel.endOffset = sel.endContainer.data.length;
    }

    c1 = sel.startContainer.parentNode;
    found = false;
    while (found == false && c1 != this.editarea)
    {
      found = this.setFontStyle(c1, sel.endContainer, attr, value, sel);
      if (c1.nextSibling != null) c1 = c1.nextSibling;
      else
      {
        while (c1.parentNode.nextSibling == null && c1 != this.editarea)
          c1 = c1.parentNode;
        if (c1 != this.editarea) c1 = c1.parentNode.nextSibling;
      }
    }

    if (sel.endContainer.parentNode.nextSibling != null && sel.endContainer.parentNode.nextSibling.tagName == "SPAN" && this.equalSpan(sel.endContainer.parentNode.nextSibling, sel.endContainer.parentNode))
    {
      sel.endContainer.data = sel.endContainer.data + sel.endContainer.parentNode.nextSibling.firstChild.data;
      sel.endContainer.parentNode.nextSibling.parentNode.removeChild(sel.endContainer.parentNode.nextSibling);
    }

    this.moveCursorSelect(sel);
    return sel.startContainer.parentNode;

  };

  this.setAttrTEXT = function(clear, attr, from_button)
  {
    var result = null;
    if (clear != "") result = this.setFont(clear, false, from_button);
    if (attr != "") result = this.setFont(attr, true, from_button);
    this.buttons.showAttr(result);
  };

  this.setAttrPART = function(clear, attr, from_button)
  {
    var d;
    this.win.focus();
    this.undo_add();

    if (this.act_element != null) d = this.act_element;
    else d = this.getActnode();
    while (d.nodeType == 3 || (d.tagName != 'TABLE' && d.tagName != 'DIV' && d != this.editarea))
      d = d.parentNode;
    if (d == this.editarea) return;

    if (clear != '') this.mkClass(d, clear, false);
    if (attr != '') this.mkClass(d, attr, true);
    this.buttons.showAttr(d);
    this.buttons.setModify(true);
  };

  this.setAttr = function(tagname, attr, value, clear, par1, from_button)
  {
    var p = this.act_element;

    if (p == null) p = this.act_font;
    if (p == null || typeof p == 'undefined') p = this.getActnode();

    while (p.tagName != tagname && p != this.editarea)
      p = p.parentNode;
    if (p == this.editarea) return false;

    eval("this.setAttr" + tagname.toUpperCase() + "(p,'" + attr + "','" + value + "','" + clear + "','" + par1 + "')");
    this.buttons.setModify(true);
    return p;
  };

  this.delSelectionNode = function(node, end, retval)
  {
    if (node.tagName == "DIV")
    {
      retval[retval.length] = node.cloneNode(false);
    }

    if (node.tagName == "SPAN")
    {
      retval[retval.length - 1].appendChild(node);
    }
    else
    {
      var n1, n2;
      for (n1 = node.firstChild; n1 != null; n1 = n2)
      {
        n2 = n1.nextSibling;
        if (n1 == end) return true;
        if (this.delSelectionNode(n1, end, retval) == true) return true;
      }

      if (typeof (func = this.clearNodeListener[node.tagName]) == 'function') func(node);
      if (node.firstChild == null) node.parentNode.removeChild(node);

    }
    return false;
  };

  this.delSelection = function(isel)
  {
    var c1, c2;
    var retval = new Array();
    var node;
    var sel;

    this.win.focus();
    this.undo_add(isel);

    if (typeof isel == 'undefined' || isel == null) sel = this.getSelection();
    else sel = isel;
    if (this.act_element != null && this.isText(this.act_element))
    {
      retval[0] = this.act_element;
      this.clearActelement();
      if (this.findPrevChar(sel) == false)
      {
        node = this.doc.createElement("span");
        node.className = this.default_class.span;
        node.innerHTML = "&nbsp;";
        this.addCleanit(node);
        sel.startContainer = sel.endContainer = node.firstChild;
        sel.startOffset = sel.endOffset = 1;
      }
      node = retval[0];
      node.parentNode.removeChild(node);
      this.clearNode(sel);
      return retval;
    }

    if (sel.startContainer == sel.endContainer && sel.startOffset == sel.endOffset) return retval;

    if (sel.startContainer == sel.endContainer)
    {
      retval[0] = this.doc.createElement("div");
      retval[0].appendChild(sel.startContainer.parentNode.cloneNode(false));
      retval[0].firstChild.innerHTML = sel.startContainer.data.substring(sel.startOffset, sel.endOffset);

      sel.startContainer.data = sel.startContainer.data.substring(0, sel.startOffset) + sel.endContainer.data.substring(sel.endOffset);
      if (sel.startContainer.data == "")
      {
        node = sel.startContainer.parentNode;
        node.innerHTML = "&nbsp;";
        sel.startContainer = node.firstChild;
        sel.startOffset = 1;
        this.addCleanit(sel.startContainer.parentNode);
      }
      sel.endContainer = sel.startContainer;
      sel.endOffset = sel.startOffset;
      if (typeof isel == 'undefined' || isel == null) this.moveCursorSelect(sel);
      return retval;
    }

    retval[0] = this.doc.createElement("div");
    retval[0].appendChild(sel.startContainer.parentNode.cloneNode(false));
    retval[0].firstChild.innerHTML = sel.startContainer.data.substring(sel.startOffset);

    sel.startContainer.data = sel.startContainer.data.substring(0, sel.startOffset);
    if (sel.startContainer.data == "")
    {
      node = sel.startContainer.parentNode;
      node.innerHTML = "&nbsp;";
      this.addCleanit(node);
      sel.startContainer = node.firstChild;
      sel.startOffset = 1;
    }

    c1 = sel.startContainer.parentNode.nextSibling;
    while (c1 != sel.endContainer.parentNode && c1 != null)
    {
      c2 = c1;
      c1 = c1.nextSibling;
      retval[0].appendChild(c2);
    }

    if (c1 == null)
    {
      c1 = sel.startContainer.parentNode.parentNode;
      c2 = c1.nextSibling;

      var found = false;
      while (found == false && c1 != this.editarea)
      {
        if (c2 == null)
        {
          while (c1.nextSibling == null && c1 != this.editarea)
            c1 = c1.parentNode;
          if (c1 != this.editarea) c1 = c1.nextSibling;
          else found = true;
        }
        else
        {
          c1 = c2;
        }
        if (c1 != this.editarea)
        {
          c2 = c1.nextSibling;
          if (c2 == null)
          {
            c2 = c1;
            while (c2.nextSibling == null && c2 != this.editarea)
              c2 = c2.parentNode;
            if (c2 != this.editarea) c2 = c2.nextSibling;
          }
          found = this.delSelectionNode(c1, sel.endContainer.parentNode, retval);
        }
      }
      c1 = null;
    }

    retval[retval.length - 1].appendChild(sel.endContainer.parentNode.cloneNode(false));
    retval[retval.length - 1].lastChild.innerHTML = sel.endContainer.data.substring(0, sel.endOffset);

    sel.endContainer.data = sel.endContainer.data.substring(sel.endOffset);

    sel.endContainer = sel.startContainer;
    sel.endOffset = sel.startOffset;

    if (typeof isel == 'undefined' || isel == null) this.moveCursorSelect(sel);
    return retval;
  };
}
