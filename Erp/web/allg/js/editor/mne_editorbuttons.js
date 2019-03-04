//================================================================================

//Copyright: M.Nelson - technische Informatik
//Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//Genehmigung gestattet. 

//================================================================================
function MneEditorButtons(win, frame, mne_editor )
{
  MneMisc.call(this, win);

  this.mne_editor = mne_editor;

  this.classnames = new Object;
  this.classnames.bold    = "mne_bold";
  this.classnames.italic  = "mne_italic";
  this.classnames.align   = "mne_align";
  this.classnames.valign  = "mne_valign";
  this.classnames.font    = "mne_font";
  this.classnames.padding = "mne_padding";
  this.classnames.border  = "mne_border";
  this.classnames.float   = "mne_float";

  this.ajax = new Object;
  this.ajax.listdir = null;
  this.frame = this.doc.createElement("div");
  this.frame.className  = "MneEditorButtons";
  this.frame.buttons = this;
  this.buttons = new Array();

  if ( typeof    frame == "string" )
  {
    this.doc.getElementById(frame).innerHTML = "";
    this.doc.getElementById(frame).appendChild(this.frame);
  }
  else
  {
    frame.innerHTML = "";
    frame.appendChild(this.frame);
  }
  if ( typeof this.mne_editor.parameter.iconbase == 'string' ) this.iconbase = this.mne_editor.parameter.iconbase; else this.iconbase = "allg/images/mne_editor/";

  this.allAttr = ! ( typeof this.mne_editor.parameter.allAttr == 'undefined' || this.mne_editor.param.allAttr == false );

  this.destructor = function()
  {

    var i;
    for ( i=0; i < this.buttons.length; i++ )
    {
      try
      {
        if ( typeof this.buttons[i].div != 'undefined' )
          this.buttons[i].win.body[0].removeChild(this.buttons[i].div);
      }
      catch(e)
      {
      }
    }
  }

  this.setModify = function(modify)
  {
    this.mne_editor.mkClass(this.frame, "modifyok", modify, "modify");
    this.mne_editor.ismodifed = modify;
  };

  this.getText = function(str)
  {
    if ( typeof str == 'string' && str.indexOf('#mne_lang') == 0 ) return str.substring(10, str.length);
    return str;
  };

  this.doc.move_client = null;
  this.onmousemove = function (ie)
  {
    var e = ie;
    if ( this.move_client == null ) return;
    if ( typeof e == "undefined" ) e = win.event;
    this.move_client.move(e.clientX, e.clientY );
  };

  this.onmouseup = function (e)
  {
    this.move_client = null;
    delete this.doc.onmousemove;
  };

  this.newSelect = function (itr, value, text, onclick )
  {
    var td, s, e, i, pos;
    var tr = itr;

    if ( typeof tr == 'object' && typeof tr.tagName == 'undefined' ) { pos = tr.pos; tr = this.lines[tr.line]; }
    if ( typeof tr == 'number' ) { tr = this.lines[tr]; pos = tr.cells.length; }
    if ( tr.tagName == "TR" ) { if ( typeof pos == 'undefined' ) pos = tr.cells.length; td = tr.insertCell(pos); } else td = tr;

    s = this.doc.createElement("select");
    td.appendChild(s);
    td.className = "MneEditor";
    s.className = "MneEditor";
    s.buttons = this;

    s.onclick_real = onclick;
    s.onchange = function(e) { try { this.onclick_real(e); } catch(err) { this.buttons.mne_editor.error(err.message + "\n" + err.stack); }};
    for ( i=0; i<value.length; i++ )
    {
      e = this.doc.createElement('option');
      e.value = value[i];
      if ( typeof text == 'object' && typeof text[i] != 'undefined' ) e.text = text[i]; else e.text = e.value;
      s.appendChild(e);
    }
    return s;
  };

  this.newSeperator = function(itr)
  {
    var td, pos;
    var tr = itr;

    if ( typeof tr == 'object' && typeof tr.tagName == 'undefined' ) { pos = tr.pos; tr = this.lines[tr.line]; }
    if ( typeof tr == 'number' ) { tr = this.lines[tr]; pos = tr.cells.length; }
    if ( tr.tagName == "TR" ) { if ( typeof pos == 'undefined' ) pos = tr.cells.length; td = tr.insertCell(pos); } else td = tr;

    td.className = "MneEditor";
    var d = this.doc.createElement("div");
    d.className = "MneEditorButtonSep";
    td.appendChild(d);
    return d;
  };

  this.newButton = function(itr, icon, onclick, text, pressit )
  {
    var b, pos;
    var tr = itr;

    if ( typeof tr == 'object' && typeof tr.tagName == 'undefined' ) {  pos = tr.pos;tr = this.lines[tr.line]; }
    if ( typeof tr == 'number' ) { tr = this.lines[tr]; pos = tr.cells.length; }
    if ( tr.tagName == "TR" ) { if ( typeof pos == 'undefined' ) pos = tr.cells.length; b = tr.insertCell(pos); } else b = tr;

    b.className = "MneEditor";
    b.appendChild(this.doc.createElement("div"));
    b = b.lastChild;
    b.className = "MneEditorButton " + icon.split('.')[0];
    b.src = this.iconbase + icon;
    b.buttons = this;
    b.onclick_real = onclick;
    b.addEventListener("click", function(e) { try { this.onclick_real(e); } catch (err) { this.buttons.mne_editor.error(err.message + "\n" + err.stack); }}, false );
    if ( pressit != false )
    {
      b.addEventListener("mousedown", function() { this.buttons.eleMkClass(this, "MneEditorButtonPressed", true, "MneEditorButton"); }, false);
      b.addEventListener("mouseup",   function() { this.buttons.eleMkClass(this, "MneEditorButton", true, "MneEditorButton"); }, false);
    }

    if ( typeof text != 'undefined' && text != null )
    {
      var d = this.doc.createElement("div");

      d.appendChild(this.doc.createTextNode(this.getText(text)));
      d.className = "MneEditorButtonHint";
      d.style.position = "absolute";
      d.style.visibility = "hidden";
      d.style.zIndex = 10000;
      this.win.document.body.appendChild(d);

      b.div = d;
      b.win = this.win;
      b.addEventListener ("mouseover", function()
          {
        this.div.style.visibility = "visible";
        this.div.style.top = MneMisc.prototype.posGetTop(this) + 15 + "px";
        this.div.style.left = MneMisc.prototype.posGetLeft(this)  + 15 + "px";
          }, false);
      b.addEventListener("mouseout", function()
          {
        this.div.style.visibility = "hidden";
          }, false);
    }
    this.buttons[this.buttons.length] = b;
    return b;
  };

  this.clear = function()
  {
    var i;
    for ( i =0; i<this.buttons.length; i++)
      if ( this.buttons[i].div != null && this.buttons[i].div.parentNode != null ) this.buttons[i].div.parentNode.removeChild(this.buttons[i].div);
    this.move_client = null;
  };

  this.lines = new Array();
  this.tab = this.doc.createElement("table");
  this.tab.className = "borderno";
  this.tab.appendChild(this.doc.createElement("tbody"));
  this.lines[this.lines.length] = this.tr  = this.tab.lastChild.insertRow(0);

  this.fontSelect = this.newSelect(this.tr, new Array("xxs", "xs", "s", "n", "l", "xl", "xxl"), new Array("fontnotesize", "tiny", "small", "normalsize", "large", "Large", "LARGE"), function() { if ( this.selectedIndex < 0 ) return; this.buttons.mne_editor.setAttrTEXT(this.buttons.classnames.font, this.buttons.classnames.font + this.options[this.selectedIndex].value, true); this.buttons.mne_editor.win.focus();});
  this.newSeperator(this.tr);

  this.boldButton   = this.newButton(this.tr, "bold.gif",   function() { if ( this.className.indexOf("Pressed") < 0 ) this.buttons.mne_editor.setAttrTEXT('', this.buttons.classnames.bold, true); else this.buttons.mne_editor.setAttrTEXT(this.buttons.classnames.bold , '', true); return false; }, "#mne_lang#Text fett schreiben", false);
  this.italicButton = this.newButton(this.tr, "italic.gif", function() { if ( this.className.indexOf("Pressed") < 0 ) this.buttons.mne_editor.setAttrTEXT('', this.buttons.classnames.italic, true); else  this.buttons.mne_editor.setAttrTEXT(this.buttons.classnames.italic , '', true); return false; }, "#mne_lang#Text kursiv schreiben", false);
  this.newSeperator(this.tr);

  this.raggedleftButton  = this.newButton(this.tr, "raggedleft.gif",  function() { if ( this.className.indexOf("Pressed") < 0 ) this.buttons.mne_editor.setAttrPART(this.buttons.classnames.align, this.buttons.classnames.align + 'l', true); else this.buttons.mne_editor.setAttrPART(this.buttons.classnames.align, this.buttons.classnames.align + 'j', true);},  "#mne_lang#Abschnitt links justiert formatieren", false);
  this.raggedrightButton = this.newButton(this.tr, "raggedright.gif", function() { if ( this.className.indexOf("Pressed") < 0 ) this.buttons.mne_editor.setAttrPART(this.buttons.classnames.align, this.buttons.classnames.align + 'r', true); else this.buttons.mne_editor.setAttrPART(this.buttons.classnames.align, this.buttons.classnames.align + 'j', true);}, "#mne_lang#Abschnitt rechts justiert formatieren", false);
  this.centerButton      = this.newButton(this.tr, "center.gif",      function() { if ( this.className.indexOf("Pressed") < 0 ) this.buttons.mne_editor.setAttrPART(this.buttons.classnames.align, this.buttons.classnames.align + 'c', true); else this.buttons.mne_editor.setAttrPART(this.buttons.classnames.align, this.buttons.classnames.align + 'j', true);},      "#mne_lang#Abschitt zentrieren", false);

  this.frame.appendChild(this.tab);

  this.tab = this.doc.createElement("table");
  this.tab.className = "borderno";
  this.tab.appendChild(this.doc.createElement("tbody"));
  this.lines[this.lines.length] = this.tr  = this.tab.lastChild.insertRow(0);


  this.frame.appendChild(this.tab);

  this.tab = this.doc.createElement("table");
  this.tab.className = "borderno";
  this.tab.appendChild(this.doc.createElement("tbody"));
  this.attrEdit = this.tab.lastChild.insertRow(0).insertCell(0);
  this.attrEdit.style.whiteSpace = "nowrap";

  this.attrSelect = this.newSelect(this.attrEdit, new Array(), new Array(), function() 
  {
    this.buttons.mne_editor.win.focus();
    if ( this.buttons.mne_editor.parameter.nohtml != true && this.buttons.attrEdit.lastChild != this.buttons.attrSelect ) this.buttons.attrEdit.removeChild(this.buttons.attrEdit.lastChild);
    this.buttons.mne_editor.findUpElement(this.value);
  });
  this.eleMkElements(this.attrEdit);

  if ( this.allAttr == true )
    this.attrSelect.addEventListener("focus", function() { this.buttons.htmlAttr.nameNode.data = this.buttons.getText("#mne_lang#Element"); }, false);


  this.addAttrShowSetFunctions = function(root, ele, func)
  {
    var i;
    if ( typeof ele.id == 'string' && typeof func[ele.id] == 'object')
    {
      var n = null;
      eval('root.' + ele.id  + ' = ele ');
      for ( n in  func[ele.id] )
      {
        if ( n == 'remove' )
          ele.parentNode.removeChild(ele);
        ele.buttons = this;
        ele.mne_editor = this.mne_editor;
        ele.root = root;
        eval('ele.' + n + ' = func[ele.id][n]' );
      }
    }
    for ( i=0; i<ele.childNodes.length; i++ )
      this.addAttrShowSetFunctions (root, ele.childNodes[i], func);
  };

  this.addAttrShow = function(tag, name, html, func)
  {
    var ele;

    this.attrSelect.appendChild(this.doc.createElement('option'));
    this.attrSelect.lastChild.value = tag.toUpperCase();
    this.attrSelect.lastChild.appendChild(this.doc.createTextNode(this.getText(name)));

    ele = this.doc.createElement('span');
    ele.style.whiteSpace ="nowrap";

    eval('this.' + tag.toLowerCase() + 'Attr = ele');

    ele.innerHTML = html;
    ele.mne_editor = this.mne_editor;
    ele.buttons = this;
    this.eleMkElements(ele);
    ele.setAttr = function() { this.mne_editor.error("#mne_lang# keine Funktion zum setzen der Attribute definiert"); };

    this.addAttrShowSetFunctions(ele, ele, func);
    return ele;
  };

  this.attrClass = this.doc.createElement("span");
  this.attrEdit.appendChild(this.attrClass);
  if ( this.mne_editor.have_plugin("Cssselect") ) 
  {
    this.htmlClass = this.doc.createElement('input');
    this.htmlClass.buttons = this;
    this.htmlClass.type = "button";
    this.htmlClass.className = "MneEditorAttr";
    this.htmlClass.value = this.getText("#mne_lang#Klassen");
    this.attrClass.appendChild(this.htmlClass);
  }
  else if ( ! (this.mne_editor.parameter.nohtml == true ))
  {
    this.attrClass.appendChild(this.doc.createElement("span"));
    this.attrClass.lastChild.appendChild(this.doc.createTextNode(" " + this.getText("#mne_lang#Klassen") + ":"));
    this.attrClass.lastChild.className = "MneEditorAttr";
    this.htmlClass = this.doc.createElement('input');
    this.htmlClass.className = "MneEditorAttr";
    this.htmlClass.buttons = this;
    this.htmlClass.type = "text";
    this.htmlClass.className = "MneEditorAttr";
    this.htmlClass.addEventListener("keydown", this.inKeydown, false);
    this.htmlClass.setValue = function() { this.obj.className = this.value; };
    this.htmlClass.onkeyup = function(e) {};
    this.attrClass.appendChild(this.htmlClass);
  }

  if ( ! (this.mne_editor.parameter.nohtml == true ))
  {
    this.attrClass.appendChild(this.doc.createElement("span"));
    this.attrClass.lastChild.appendChild(this.doc.createTextNode(" " + this.getText("#mne_lang#Id") + ":"));
    this.attrClass.lastChild.className = "MneEditorAttr";
    this.htmlId = this.doc.createElement('input');
    this.htmlId.className = "MneEditorAttr";
    this.htmlId.buttons = this;
    this.htmlId.mne_editor = this.mne_editor;
    this.htmlId.type = "text";
    this.htmlId.className = "MneEditorAttr";
    this.htmlId.addEventListener("keydown", this.inKeydown, false);
    this.htmlId.onkeyup = function(e) {};
    this.htmlId.setValue = function() { this.obj.id = this.value; };
    this.attrClass.appendChild(this.htmlId);
  }

  this.createHtmlAttr = function () 
  {
    this.attrSelect.appendChild(this.doc.createElement('option'));
    this.attrSelect.lastChild.value = "object";
    this.attrSelect.lastChild.appendChild(this.doc.createTextNode(this.getText("#mne_lang#Element")));

    this.htmlAttr = this.doc.createElement('span');
    this.htmlAttr.nameNode = this.attrSelect.lastChild.lastChild;
    this.htmlAttr.style.whiteSpace ="nowrap";

    this.htmlAttr.buttons = this;
    this.htmlAttr.setAttr = function( obj )
    {
      this.buttons.attrSelect.value = "object";
      this.nameNode.data = obj.tagName.toLowerCase();
    };
  };

  this.createSpanAttr = function () 
  {
    this.attrSelect.appendChild(this.doc.createElement('option'));
    this.attrSelect.lastChild.value = "SPAN";
    this.attrSelect.lastChild.appendChild(this.doc.createTextNode(this.getText("#mne_lang#Text")));

    this.spanAttr = this.doc.createElement('span');
    this.spanAttr.style.whiteSpace ="nowrap";

    this.spanAttr.buttons = this;
    this.spanAttr.setAttr = function( obj )
    {
      this.buttons.attrSelect.value = "SPAN";
    };
  };

  this.createDivAttr = function () 
  {
    this.attrSelect.appendChild(this.doc.createElement('option'));
    this.attrSelect.lastChild.value = "DIV";
    this.attrSelect.lastChild.appendChild(this.doc.createTextNode(this.getText("#mne_lang#Absatz")));

    this.divAttr = this.doc.createElement('span');
    this.divAttr.style.whiteSpace ="nowrap";

    this.divFloat = this.doc.createElement("select");
    this.divFloat.className = "MneEditorAttr";
    this.divFloat.buttons = this;
    this.divFloat.onchange = function() { this.buttons.mne_editor.setAttrPART(this.buttons.classnames.float, this.buttons.classnames.float + this.options[this.selectedIndex].value, true ); };

    this.divFloat.appendChild(this.doc.createElement('option'));
    this.divFloat.lastChild.value = "n";
    this.divFloat.lastChild.appendChild(this.doc.createTextNode("keine"));
    this.divFloat.lastChild.selected = true;

    this.divFloat.appendChild(this.doc.createElement('option'));
    this.divFloat.lastChild.value = "l";
    this.divFloat.lastChild.appendChild(this.doc.createTextNode("links"));

    this.divFloat.appendChild(this.doc.createElement('option'));
    this.divFloat.lastChild.value = "r";
    this.divFloat.lastChild.appendChild(this.doc.createTextNode("rechts"));
    this.divAttr.appendChild(this.divFloat);

    this.divFloat.appendChild(this.doc.createElement('option'));
    this.divFloat.lastChild.value = "s";
    this.divFloat.lastChild.appendChild(this.doc.createTextNode("stop"));
    this.divFloat.lastChild.selected = true;

    this.divAttr.buttons = this;
    this.divAttr.setAttr = function( obj )
    {
      this.buttons.attrSelect.value = "DIV";

      var f = new RegExp(this.buttons.classnames.float + "[^ ]*");
      var r;
      if ( ( r = f.exec(obj.className) )  != null ) this.buttons.divFloat.value = r[0].substring(this.buttons.classnames.float.length); else this.buttons.divFloat.value = "n";
    };
  };

  if ( ! (this.mne_editor.parameter.nohtml == true ))
  {
    if ( this.allAttr == true )
      this.createHtmlAttr();
    this.createSpanAttr();
    this.createDivAttr();
  }

  this.frame.appendChild(this.tab);

  this.haveAttr = function(obj)
  {
    return this.allAttr || eval("typeof this." + obj.tagName.toLowerCase() + "Attr != 'undefined'" );
  };

  this.showAttr = function(iobj)
  { 
    var s;
    var obj = iobj;

    try
    {
      if ( obj == null ) return;
      if ( obj != this.mne_editor.act_element) this.mne_editor.clearActelement();
      if ( obj.nodeType == 3 ) obj = obj.parentNode;

      if ( ! (this.mne_editor.parameter.nohtml == true ) )
      {
        this.htmlClass.obj = obj;
        this.htmlId.obj = obj;

        this.mne_editor.mkClass(this.htmlClass, "MneInputModifyNo", true, "MneInputModify");
        this.mne_editor.mkClass(this.htmlId, "MneInputModifyNo", true, "MneInputModify");

        if ( this.htmlClass.type == 'button' ) { this.htmlClass.onclick = this.cssSelect.onclick; if ( this.cssSelect.container.style.visibility == 'visible' ) this.htmlClass.onclick(); } else this.htmlClass.value = obj.className;
        this.htmlId.value = obj.id;

      } 

      if ( obj.tagName == "SPAN" )
      {
        var f = new RegExp(this.classnames.font + "[^ ]*");
        var r;
        if ( obj.className.indexOf(this.classnames.bold)   >= 0 ) this.eleMkClass(this.boldButton, "MneEditorButtonPressed", true, "MneEditorButton"); else this.eleMkClass(this.boldButton, "MneEditorButton", true, "MneEditorButton");
        if ( obj.className.indexOf(this.classnames.italic) >= 0 ) this.eleMkClass(this.italicButton, "MneEditorButtonPressed", true, "MneEditorButton"); else this.eleMkClass(this.italicButton, "MneEditorButton", true, "MneEditorButton");
        r = f.exec(obj.className);
        if ( r != null )
          this.fontSelect.value = r[0].substr(this.classnames.font.length);
        else
          this.fontSelect.value = "n";
      }

      if ( this.attrEdit.lastChild != this.attrClass ) this.attrEdit.removeChild(this.attrEdit.lastChild);

      this.eleMkClass(this.centerButton, "MneEditorButton", true, "MneEditorButton");
      this.eleMkClass(this.raggedrightButton, "MneEditorButton", true, "MneEditorButton");
      this.eleMkClass(this.raggedleftButton, "MneEditorButton", true, "MneEditorButton");

      while (obj != null && obj != this.editarea && ! ( obj.tagName == 'TABLE' || obj.tagName == 'DIV' )  ) obj = obj.parentNode;
      if ( obj == this.editarea || obj == null ) return;

      if ( obj.className.indexOf(this.classnames.align + "c") >= 0 ) this.eleMkClass(this.centerButton, "MneEditorButtonPressed", true, "MneEditorButton");
      if ( obj.className.indexOf(this.classnames.align + "r") >= 0 ) this.eleMkClass(this.raggedrightButton, "MneEditorButtonPressed", true, "MneEditorButton");
      if ( obj.className.indexOf(this.classnames.align + "l") >= 0 ) this.eleMkClass(this.raggedleftButton, "MneEditorButtonPressed", true, "MneEditorButton");

      if ( this.mne_editor.parameter.nohtml == true )
      {
        while ( typeof s == 'undefined' && obj != this.mne_editor.editarea )
        { 
          eval("s = this." + obj.tagName.toLowerCase() + "Attr");
          if ( typeof s == 'undefined') obj = obj.parentNode;
        }
      }
      else
      {
        eval("s = this." + obj.tagName.toLowerCase() + "Attr");
      }

      if ( typeof s == 'undefined' && ! (this.mne_editor.parameter.nohtml == true ) )
      {
        if ( this.allAttr == true ) s = this.htmlAttr; else s = this.spanAttr;
      }

      if ( typeof s != 'undefined' )
      {
        this.attrEdit.appendChild(this.attrSelect.wrapper);
        this.attrEdit.appendChild(s);
        s.setAttr(obj);
      }
      else
      {
        if ( this.attrSelect.wrapper.parentNode != null ) this.attrSelect.wrapper.parentNode.removeChild(this.attrSelect.wrapper);
      }
    }
    catch(e)
    {
      this.mne_editor.error(e.message + "\n" + e.stack );
    }
  };
}

MneEditorButtons.prototype.input = { 'keydown' : function(e)
    {
  var key;
  if ( typeof e == "undefined" ) key = window.parent.event.keyCode; else key = e.which;
  if ( key == 13 )
  { 
    this.setValue();
    this.mne_editor.mkClass(this, "MneInputModifyNo", true, "MneInputModify");
    this.mne_editor.buttons.setModify(true);
  }
  else
  {
    this.mne_editor.mkClass(this, "MneInputModifyOk", true, "MneInputModify");
  }
  return true;
    }
};
MneEditorButtons.prototype.popup = { 'startmove' : function(evt)
    {
  var src;
  var e = evt;
  if ( typeof e == "undefined" ) { e = this.mne_editor.buttons.win.event; src = e.srcElement;  } else src = e.target;
  if ( src != this ) return;
  this.root.posx = this.root.offsetLeft - e.clientX;
  this.root.posy = this.root.offsetTop - e.clientY;
  this.root.move = this.mne_editor.buttons.popup.position;
  this.mne_editor.buttons.doc.move_client = this.root;
  this.mne_editor.buttons.doc.onmousemove = this.mne_editor.buttons.onmousemove;
    },
    'position'   :  function(x,y)
    { 
      this.style.left = x + this.posx + "px";
      this.style.top  = y + this.posy + "px";
    },
    'startresize' : function(evt)
    {
      var src;
      var e = evt;
      if ( typeof e == "undefined" ) { e = this.mne_editor.buttons.win.event; src = e.srcElement;  } else src = e.target;
      if ( src != this ) return;
      this.root.posx = this.root.offsetWidth - e.clientX;
      this.root.posy = this.root.offsetHeight - e.clientY;
      this.mne_editor.buttons.doc.move_client = this.root;
      this.root.move = this.mne_editor.buttons.popup.resize;
    },
    'resize'     :  function(x,y)
    { 
      this.style.width   = x + this.posx + "px";
      this.style.height  = y + this.posy + "px";
    },
    'hidden'  :  function(e)
    { 
      this.root.style.visibility='hidden';
      this.root.posy = this.root.style.top;
      this.root.posx = this.root.style.left;
      this.root.style.top='-100000px';
      return false;
    },
    'show'  :  function(e)
    { 
      if ( this.root.style.visibility == 'visible' ) return;
      this.root.style.visibility = 'visible';
      this.root.style.zIndex = '10000';
      if ( typeof this.root.posx == 'undefined' )
      {
        this.root.style.top = MneMisc.prototype.posGetTop(this.buttons.frame) + 20 + "px";
        this.root.style.left = MneMisc.prototype.posGetLeft(this.buttons.frame) + ( MneMisc.prototype.posGetWidth(this.buttons.frame) - MneMisc.prototype.posGetWidth(this.buttons.fileSelect.container) )/ 2 +"px";
      }
      else
      {
        this.root.style.top = this.posy;
        this.root.style.left = this.posx;
      }
    }
};

MneEditorButtons.prototype = new MneMisc(window);
