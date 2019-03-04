// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
function MneIframeEditorClipboard(editor, param)
{
  
  editor.mkHtml = function(oe, ne)
  {
    var e,ee,node,i,n;
    var act_node;
    var is_alphanum = /\w+/;
         
    act_node = ne;
    for ( e = oe.firstChild; e != null; e = ee)
    {
      ee = e.nextSibling;
     
      if ( e.tagName == "SPAN" && e.childNodes.length > 1 && e.firstChild.nodeType  != 3 )
      {
        var str = this.getTextContent(e);
        if ( is_alphanum.test(str) )
        {
          node = this.doc.createElement("span");
          node.appendChild(this.doc.createTextNode(str));
          e = node;
        }
        else
          continue;
      }
      
      if ( e.nodeType == 3 )
      {
        var str = this.getTextContent(e);
        if ( is_alphanum.test(str) )
        {
          node = this.doc.createElement("SPAN");
          node.className = this.default_class.span;
          node.appendChild(this.doc.createTextNode(str));
          e = node;
        }
        else
        {
          continue;
        }
      }
 
      switch( e.tagName )
      {
        case "BR":
          {
            node = this.doc.createElement("DIV");
            node.className = this.default_class.div;

            while ( act_node != ne && act_node.tagName != "DIV" ) act_node = act_node.parentNode;
            if ( act_node == ne  &&  ne.parentNode == null ) { act_node.appendChild(node); act_node = node; }
            if ( act_node.firstChild != null ) { this.insertAfter(act_node, node); act_node = node; }
          }
          break;
        case "DIV":
        case "P":
          while ( act_node != ne && act_node.tagName != "DIV" ) act_node = act_node.parentNode;
          if ( act_node == ne  &&  ne.parentNode == null ) { act_node.appendChild(this.doc.createElement("div")); act_node = act_node.lastChild; }
          if ( act_node.firstChild != null ) { node = this.doc.createElement("div"); this.insertAfter(act_node, node); act_node = node; }
          if ( e.className.substr(0,4) == 'mne_' )
            act_node.className = e.className;
          else
            act_node.className = this.default_class.div;
          this.mkHtml(e, act_node);

          node = this.doc.createElement("div");
          this.insertAfter(act_node, node);
          act_node = node;
          if ( e.className.substr(0,4) == 'mne_' )
            act_node.className = e.className;
          else
            act_node.className = this.default_class.div;
          break;

        case "SPAN":
        case "B":
        case "I":
        {
        var str = this.getTextContent(e);
        if ( is_alphanum.test(str) )
          {
            node = this.doc.createElement("span");
            node.className = this.default_class.span;
            node.appendChild(this.doc.createTextNode(str));

            if ( e.className.substr(0,4) == 'mne_' )
              node.className = e.className;
            else
              node.className = this.default_class.span;
            
            if ( e.tagName == "B" ) this.mkClass(node, this.buttons.classnames.bold, true);
            if ( e.tagName == "I" ) this.mkClass(node, this.buttons.classnames.italic, true);
            
            while ( act_node != ne && act_node.tagName != "DIV" ) act_node = act_node.parentNode;
            if ( act_node == ne && ne.firstChild != null && act_node.tagName != "DIV") { act_node.appendChild(this.doc.createElement("div")); act_node = act_node.lastChild; }
            act_node.appendChild(node);
            act_node.className = this.default_class.div;
          }
          break;
        }
         case "LI":
          if ( act_node.tagName != "UL" && act_node.tagName != "OL" )
          {
            node = this.doc.createElement("ul");
            while(act_node != ne && ! this.isPart(act_node) ) act_node = act_node.parentNode;
            if ( act_node != ne || ne.parentNode != null ) this.insertAfter(act_node, node);
            else ne.appendChild(node);
            act_node = node;
          }
          node = this.doc.createElement("li");
          act_node.appendChild(node);
          node.appendChild(this.doc.createElement("div"));
          node = node.lastChild;
          node.className = this.default_class.div;
          this.mkHtml(e, node);
          break;
        case "UL":
        case "OL":
          node = this.doc.createElement(e.tagName);
          node.className = e.className;
          
          while(act_node != ne && ! this.isPart(act_node) ) act_node = act_node.parentNode;
          if ( act_node == ne && ne.parentNode == null ) ne.appendChild(node);
          else this.insertAfter(act_node, node);
          act_node = node;
          this.mkHtml(e, node);
          break;
        case "TABLE":
          node = this.doc.createElement('table');
          node.className = this.default_class.table;
          while(act_node != ne && ! this.isPart(act_node) ) act_node = act_node.parentNode;
          if ( act_node != ne ) this.insertAfter(act_node, node);
          else ne.appendChild(node);
          act_node = node;
          node.appendChild(this.doc.createElement("tbody"));
          for ( n = e.firstChild; n != null; n = i )
          {
            i = n.nextChild;
            if ( n.nodeType != 1 && n.nodeName != "TBODY" && n.nodeName != "THEAD" && n.nodeName != "TR" )
            {
              if ( n.nodeType == 1 ) this.error(this.sprintf("#mne_lang#Knoten <$1> ist kein Tabellenelement - wird ignoriert", n.nodeName ));
              else if ( is_alphanum.test(n.textContent) ) this.error(this.sprintf("#mne_lang#Knoten <$1> ist kein Tabellenelement - wird ignoriert", n.textContent ));
              e.removeChild(n);
            }
          } 
          this.mkHtml(e, node.lastChild);
   
          {
            var i, l;
            var tbody = act_node.lastChild;

            this.clearEmpty(tbody);
            l = 0;
            for ( i = 0; i<tbody.childNodes.length; i++)
              if ( tbody.childNodes[i].cells.length > l ) l = tbody.childNodes[i].cells.length;

            for ( i = 0; i<tbody.childNodes.length; i++)
            {
              while( tbody.childNodes[i].cells.length != l )
              {
                tbody.childNodes[i].appendChild(this.doc.createElement("td"));
                tbody.childNodes[i].lastChild.className = this.default_class.td;
                tbody.childNodes[i].lastChild.innerHTML = '<div class="' + this.default_class.div + '"><span class="' + this.default_class.span + '">&nbsp;</span></div>';
              }
            }
          }
          
          break;                
        case "TBODY":
        case "THEAD":
          if ( act_node.tagName != "TBODY" ) { this.error(this.sprintf("#mne_lang#$1 auserhalb einer Tabelle gefunden - wird ignoriert", e.tagName)); e.parentNode.removeChild(e); }
          for ( n = e.firstChild; n != null; n = i )
          {
            i = n.nextChild;
            if ( n.nodeType != 1 && n.nodeName != "TR" )
            {
              if ( n.nodeType == 1 ) this.error(this.sprintf("#mne_lang#Knoten <$1> ist kein Tabellenelement - wird ignoriert", n.nodeName ));
              else if ( is_alphanum.test(n.textContent) ) this.error(this.sprintf("#mne_lang#Knoten <$1> ist kein Tabellenelement - wird ignoriert", n.textContent ));
              e.removeChild(n);
            }
          } 
          this.mkHtml(e, act_node);
          
          break;
        case "TR":
          if ( act_node.tagName != "TBODY" ) { this.error(this.sprintf("#mne_lang#$1 auserhalb einer Tabelle gefunden - wird ignoriert", e.tagName)); e.parentNode.removeChild(e); }
          for ( n = e.firstChild; n != null; n = i )
          {
            i = n.nextChild;
            if ( n.nodeType != 1 && n.nodeName != "TD" )
            {
              if ( n.nodeType == 1 ) this.error(this.sprintf("#mne_lang#Knoten <$1> ist keine Tabellenzeile - wird ignoriert", n.nodeName ));
              else if ( is_alphanum.test(n.textContent) ) this.error(this.sprintf("#mne_lang#Knoten <$1> ist keine Tabellenzeile - wird ignoriert", n.textContent ));
              e.removeChild(n);
            }
          } 
          node = this.doc.createElement("tr");
          act_node.appendChild(node);
          this.mkHtml(e, node);  
          break;
        case "TD":
        case "TH":
          if ( act_node.tagName != "TR" ) { this.error(this.sprintf("#mne_lang#$1 auserhalb einer Tabelle gefunden - wird ignoriert", e.tagName)); e.parentNode.removeChild(e); }
          node = this.doc.createElement("td");
          node.className = this.default_class.td;
          act_node.appendChild(node);
          node.appendChild(this.doc.createElement("div"));
          node = node.lastChild;
          node.className = this.default_class.div;
          this.mkHtml(e, node);
          break;
        default:
          while ( act_node != ne && act_node.tagName != "DIV" ) act_node = act_node.parentNode;
          if ( act_node == ne && ne.tagName == 'TR' )
          {
            act_node = this.doc.createElement("td");
            act_node.className = this.default_class.td;
            ne.appendChild(act_node);
            act_node.appendChild(this.doc.createElement("div"));
            act_node = act_node.lastChild;
            act_node.className = this.default_class.div;
          }
          if ( act_node == ne && ne.tagName == 'TBODY' )
          {
            act_node = this.doc.createElement("TR");
            ne.appendChild(act_node);
            act_node.appendChild(this.doc.createElement("td"));
            act_node = act_node.lastChild;
            act_node.className = this.default_class.td;
            act_node.appendChild(this.doc.createElement("div"));
            act_node = act_node.lastChild;
            act_node.className = this.default_class.div;
          }
          if ( act_node == ne  && ne.parentNode == null ) { act_node.appendChild(this.doc.createElement("div")); act_node = act_node.lastChild; act_node.className = this.default_class.div; }
          // if ( act_node.firstChild != null ) { node = this.doc.createElement("div"); this.insertAfter(act_node, node); act_node = node; act_node.className = this.default_class.div; }
          node = this.doc.createElement("span");
          node.className = this.default_class.span;
          node.appendChild(this.doc.createTextNode(this.getTextContent(e)));
          act_node.appendChild(node);
          break;
          }
        }
    return true;
  };
  
  editor.clipboardCopy = function()
  {
      this.win.focus();
	  try { this.doc.execCommand("Copy", false, null ); } catch(e) { this.error(e.message); this.ctrl = false;}
  };

  editor.clipboardCut = function()
  {
      this.win.focus();
	  this.undo_add();
	  try { this.doc.execCommand("Copy", false, null ); } catch(e) { this.error(e.message); this.ctrl = false; return; }
	  this.delSelection();
  };
  
  editor.clipboardPaste = function(opaste)
  {
	var e;
	var opaste,npaste,ospan,nspan;
	var sel;
	var end;
	
    this.win.focus();
	this.undo_add();
	
	this.delSelection();
	sel = this.getSelection();
    
	ospan = sel.startContainer;
	if ( ospan.nodeType == 3 ) ospan = ospan.parentNode;

    end  = sel.endContainer.data.substring(sel.endOffset);
    sel.endContainer.data = sel.endContainer.data.substring(0, sel.endOffset);
    if ( end != '' )
    {
      nspan = sel.endContainer.parentNode.cloneNode(false);
      nspan.appendChild(this.doc.createTextNode(end));
      this.insertAfter(sel.endContainer.parentNode, nspan);
    }

    if ( typeof opaste == 'undefined' ) opaste = this.getPasteHTML();
	npaste = this.doc.createElement("div");
    
	this.mkHtml(opaste,npaste);
	this.clearEmpty(npaste);

    try
	{	
	  for ( e = npaste.firstChild; e != null; e = npaste.firstChild )
	  {
        if ( this.isPart(e) )
	    {
		  while( ospan != this.editarea && ! this.isPart(ospan) ) ospan = ospan.parentNode;
		  if ( nspan != null )
		  {
		    var n;
		    var node = this.doc.createElement("div");
		    while ( nspan != null ) { n = nspan.nextSibling; if ( nspan.innerHTML != "&nbsp;" ) node.appendChild(nspan); nspan = n; }
		    if ( ospan == this.editarea ) ospan.appendChild(node); else this.insertAfter(ospan,node);
		  }
		  if ( ospan == this.editarea ) ospan.appendChild(e); else this.insertAfter(ospan,e);
	    }
	    else
	    {
	      if ( ospan == this.editarea || ( this.isPart(ospan) && ospan.nextSibling == null ))
		  {
		    ospan.appendChild(this.doc.createElement("div"));
		    ospan = ospan.lastChild;
		    ospan.appendChild(e);
		  }
		  else if ( this.isPart(ospan) )
		  {
		    ospan = ospan.nextSibling;
		    if ( ospan.firstChild == null ) ospan.appendChild(e);
		    else if ( ospan.firstChild.innerHTML == "&nbsp;" ) this.insertAfter(ospan.firstChild, e);
		    else ospan.insertBefore(e, ospan.firstChild);
		  }
		  else
          {
            this.insertAfter(ospan,e);
          }
	    }
		ospan = e;
	  }
	}
	catch(e)
	{
	  this.error("#mne_lang#Kann Text nicht einfügen");
	  this.undo();
	} 
	
	if ( opaste.parentNode != null ) opaste.parentNode.removeChild(opaste);

	while(ospan.lastChild != null ) ospan = ospan.lastChild;
	sel = new Object;
	sel.startContainer = sel.endContainer = ospan;
	if ( ospan.nodeType == 3 ) sel.startOffset = sel.endOffset = ospan.length; else sel.startOffset = sel.endOffset = 0;
	this.clearNode(sel);
	this.moveCursorSelect(sel);
  };

  if ( 0 && (editor.win.MneAjax.prototype.navigator != 'SAFARI' || editor.win.MneAjax.prototype.os != 'mac') )
  {    
    editor.buttons.newSeperator(param.line);
    editor.buttons.newButton(param.line, "copy.gif",  function()  {  this.buttons.mne_editor.clipboardCopy();  }, "#mne_lang#Auswahl in das Clipboard übertragen");
    editor.buttons.newButton(param.line, "cut.gif",   function()  {  this.buttons.mne_editor.clipboardCut();   }, "#mne_lang#Auswahl in das Clipboard übertragen und löschen");
    editor.buttons.newButton(param.line, "paste.gif",  function() {  this.buttons.mne_editor.clipboardPaste(); }, "#mne_lang#Inhalt des Clipboards in die Auswahl einsetzen");
  }
}