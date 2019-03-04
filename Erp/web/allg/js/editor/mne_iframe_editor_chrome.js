// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
// ================================================================================
function MneIframeEditorNavigator()
{
  this.focus = function(e)
  {
    this.designMode = "on";
  };

  this.blur = function(e)
  {
  };

  this.paste = function(e)
  {
    var str = e.clipboardData.getData("text/html");
    if ( typeof this.mne_editor.clipboardData == 'undefined' ) 
      str = e.clipboardData.getData("text");
    
    var i = str.indexOf('StartFragment');
    if ( i != -1 ) str = str.substr(i + 16);
    
    i = str.indexOf('<!--EndFragment')
    if ( i != -1 ) str = str.substr(0,i);
    
    this.mne_editor.clipboardData = str;
    this.mne_editor.clipboardPaste();
    
    e.preventDefault();
    return false;
  };
  
  this.keydown = function(evt)
  {
    if (this.mne_editor.dispatch_keydown(evt.keyCode, evt) == false)
    {
      evt.preventDefault();
      return false;
    }
    return true;
  };

  this.keyup = function(evt)
  {
    if (this.mne_editor.dispatch_keyup(evt.keyCode, evt) == false)
    {
      evt.preventDefault();
      return false;
    }
    return true;
  };

  this.keypress = function(evt)
  {
    if (this.mne_editor.dispatch_keypress(evt.keyCode, evt) == false && evt.keyCode != 32)
    {
      evt.preventDefault();
      return false;
    }
    return true;
  };

  this.mousedown = function(e)
  {
    try
    {
      this.designMode = "on";
      this.mne_editor.partCount = 0;
      if (this.mne_editor.act_element != null)
        this.mne_editor.clearActelement();
      var sel = this.mne_editor.win.getSelection();
      if ( sel.isCollapsed == false ) sel.collapseToEnd();
    }
    catch (err)
    {
    }
  };

  this.mouseup = function(e)
  {
    try
    {
      this.designMode = "on";
      var wsel = this.mne_editor.win.getSelection();
      var sel = this.mne_editor.getSelection();
      if (wsel.rangeCount > 1)
      {
        var r = wsel.getRangeAt(wsel.rangeCount - 1);
        wsel.getRangeAt(0).setEnd(r.endContainer, r.endOffset);
        while (wsel.rangeCount > 1)
          wsel.removeRange(wsel.getRangeAt(1));
      }
      if ( sel.rangeCount != 0 ) this.mne_editor.buttons.showAttr(sel.focusNode);
      this.mne_editor.undo_need = true;
    } catch (err)
    {
      this.mne_editor.error(err.message + "\n" + err.stack);
    }
  };

  this.mouseclick = function(e)
  {
    this.designMode = "on";
  };

  this.dblclick = function(e)
  {
    this.designMode = "on";
  };

  this.stopEvent = function(e)
  {
    e.preventDefault();
    return false;
  };
  
  this.addEvents = function()
  {
    this.doc.mouseupElement = null;

    this.doc.addEventListener("focus", this.focus, false);
    this.doc.addEventListener("blur", this.blur, false);
    this.doc.addEventListener("dblclick", this.dblclick, false);
    this.doc.addEventListener("click", this.mouseclick, false);
    this.doc.addEventListener("mousedown", this.mousedown, false);
    this.doc.addEventListener("mouseup", this.mouseup, false);
    this.doc.addEventListener("keydown", this.keydown, false);
    this.doc.addEventListener("keyup", this.keyup, false);
    this.doc.addEventListener("keypress", this.keypress, false);
    this.doc.addEventListener("paste", this.paste, false);
    
    try
    {
      this.doc.execCommand("useCSS", false, true);
    } catch (ex)
    {
    }
    try
    {
      this.doc.execCommand("styleWithCSS", false, true);
    } catch (ex)
    {
    }
    try
    {
      this.doc.execCommand('enableObjectResizing', false, false);
    } catch (ex)
    {
    }
    try
    {
      this.doc.execCommand('enableInlineTableEditing', false, false);
    } catch (ex)
    {
    }
    try
    {
      this.doc.execCommand('insertBrOnReturn', false, false);
    } catch (ex)
    {
    }
  };
  
  this.moveCursor = function(n, t)
  {
    var node = n;
    var r = this.doc.createRange();
    
    if (t == 'b')
      r.setStart(node, 0);
    else if (node.nodeType == 3)
      r.setStart(node, node.length);
    else
      r.setStart(node, node.childNodes.length);

    try
    {
      this.win.getSelection().removeAllRanges();
      this.win.getSelection().addRange(r);
    }
    catch (e)
    {
    }

    if (this.mne_editor.act_element != null)
      this.mne_editor.clearActelement();
    if (node.nodeType == 3)
      node = node.parentNode;
    this.buttons.showAttr(node);
    this.clearNode();
  };

  this.moveCursorSelect = function(sel)
  {
    
    var r = this.doc.createRange();

    if ( sel == null ) return;
    if (this.mne_editor.act_element != null && sel.startContainer != this.mne_editor.act_element && sel.endContainer != this.mne_editor.act_element)
      this.mne_editor.clearActelement();

    r.setStart(sel.startContainer, sel.startOffset);
    r.setEnd(sel.endContainer, sel.endOffset);
    this.win.getSelection().removeAllRanges();
    this.win.getSelection().addRange(r);

    if (sel.startContainer.nodeType == 3)
      this.buttons.showAttr(sel.startContainer.parentNode);
    else
      this.buttons.showAttr(sel.startContainer);
  };

  this.getActnode = function()
  {
    return this.win.getSelection().getRangeAt(0).startContainer.parentNode;
  };

  this.getSelection = function()
  {
    var result = new Object;
    var wsel = this.win.getSelection();

    if ( typeof wsel == 'undefined' || wsel == null || wsel.rangeCount == 0 ) return null;
    
    var s = wsel.getRangeAt(0);

    result.startContainer = s.startContainer;
    result.startOffset = s.startOffset;

    s = wsel.getRangeAt(wsel.rangeCount - 1);
    result.endContainer = s.endContainer;
    result.endOffset = s.endOffset;

    if (result.startContainer.nodeType != 3 && result.startContainer == result.endContainer && (result.endOffset - result.startOffset) == 1)
      result.endOffset--;
    while (result.startContainer.nodeType != 3 && result.startContainer.lastChild && result.startContainer.childNodes.length == result.startOffset)
    {
      result.startContainer = result.startContainer.lastChild;
      if (result.startContainer.nodeType == 3)
        result.startOffset = result.startContainer.length;
      else
        result.startOffset = result.startContainer.childNodes.length;
    }

    while (result.startContainer.nodeType != 3 && result.startContainer.childNodes[result.startOffset] != null)
    {
      result.startContainer = result.startContainer.childNodes[result.startOffset];
      result.startOffset = 0;
    }

    while (result.endContainer.nodeType != 3 && result.endContainer.lastChild != null && result.endContainer.childNodes.length == result.endOffset)
    {
      result.endContainer = result.endContainer.lastChild;
      if (result.endContainer.nodeType == 3)
        result.endOffset = result.endContainer.length;
      else
        result.endOffset = result.endContainer.childNodes.length;
    }

    while (result.endContainer.nodeType != 3 && result.endContainer.childNodes[result.endOffset] != null)
    {
      result.endContainer = result.endContainer.childNodes[result.endOffset];
      if ( result.endContainer.nodeType == 3 ) result.endOffset = result.endContainer.length; else result.endOffset = ( result.endContainer.childNodes.length - 1);
    }

    if (s.endContainer == wsel.focusNode)
      result.focusNode = result.endContainer;
    else
      result.focusNode = result.startContainer;
    return result;
  };

  this.getRawTextContent = function(node)
  {
    return node.textContent;
  };

  this.getPasteHTML = function()
  {
      var tmp = this.doc.createElement("div");
      tmp.innerHTML = this.clipboardData;
      return tmp;
  };

}
