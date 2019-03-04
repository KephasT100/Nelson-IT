// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
function MneIframeEditorItemize(editor, param)
{

  editor.default_class.ul = "";
  editor.default_class.ol = "";
  editor.default_class.li = "";

  editor.parts[editor.parts.length] = "UL";
  editor.parts[editor.parts.length] = "OL";

  editor.addItemizeElement = function(parent, prev, sel)
  {
    var part,span,pos;
	
	this.win.focus();

	if ( typeof sel == 'undefined' || sel == null )
	  sel = this.getSelection();
	
	this.undo_add(sel);
	 
	part = this.doc.createElement('li');
	if ( typeof prev == 'undefined' ) parent.appendChild(part); else this.insertAfter(prev, part);
	  
	parent = part;
	part = this.doc.createElement('div');
	part.className = this.default_class.div;
	parent.appendChild(part);

    pos = 'b';
	if ( sel.endOffset != 0 )
	{
	  span = sel.endContainer.parentNode.cloneNode(false);
	  if ( sel.endOffset == sel.endContainer.data.length )
	  {
	    span.innerHTML = "&nbsp;";
	    this.addCleanit(span);
		pos = 'e';
	  }
	  else
	  {
	    span.innerHTML = sel.endContainer.data.substring(sel.endOffset);
		sel.endContainer.data = sel.endContainer.data.substring(0, sel.endOffset);
	  }
	}
	else
	{
	  span = sel.endContainer.parentNode;
	}
	part.appendChild(span);
    
	this.moveCursor(span.firstChild, pos);
  }
  
  editor.addItemizeParent = function(typ, from_button)
  {
    var del, sel, span, part, parent;

	this.win.focus();
	this.undo_add();

	sel = this.getSelection();
	del = this.delSelection(sel);

	parent = sel.startContainer;
    while ( ! this.isPart(parent) ) parent = parent.parentNode;

	part = this.mne_editor.doc.createElement('div');
	part.className = parent.className;

	if ( sel.endOffset != sel.endContainer.data.length )
	{
	  part.appendChild(this.mne_editor.doc.createElement('span'));
	  part.firstChild.className = this.mne_editor.default_class.span;
	  part.firstChild.innerHTML  = sel.endContainer.data.substring(sel.endOffset);
	  sel.endContainer.data = sel.endContainer.data.substring(0, sel.endOffset);
	}
	
	span = sel.endContainer.parentNode;
	while(span.nextSibling != null )
	  part.appendChild(span.nextSibling);	  
    if ( part.firstChild != null ) 
	  this.mne_editor.insertAfter(parent, part);
 
    part = this.doc.createElement(typ);
	eval("part.className = this.mne_editor.default_class. " + typ );
	this.insertAfter(parent, part);

    if ( del.length == 0 )
	{
	  part.innerHTML = "<li><div><span class='" + this.default_class.span + "'>&nbsp;</span></div></li>";
	  this.addCleanit(part.firstChild.firstChild.firstChild);
	  this.moveCursor(part.firstChild.firstChild.firstChild.firstChild, 'e');
	}
	else
	{
	  var i;
	  for ( i=0; i<del.length; i++ )
	  {
	    part.appendChild(this.doc.createElement('li'));
	    part.lastChild.appendChild(del[i]);
	  }
	  part = del[0];
	  while(part.lastChild != null ) part = part.lastChild;
	  this.moveCursor(part, 'b');
	}
  }
  
  editor.addItemizeI = function(from_button) { this.addItemizeParent("ul", from_button); }
  editor.addItemizeE = function(from_button) { this.addItemizeParent("ol", from_button); }

  editor.addPartCountListener(2, 'LI', function ( node, span, sel ) 
  {
	var n;
	var s = span.parentNode;
	var e = this.mne_editor.doc.createElement('li');
	this.mne_editor.insertAfter(node, e);
	while( s != null )
	{
      n = s.nextSibling;
	  e.appendChild(s);
	  s = n;
	}
	this.mne_editor.moveCursorSelect(sel);	  
	return false;
  });
  editor.addPartCountListener(3, 'LI', function ( node, span, sel )
  {
    var part = this.mne_editor.doc.createElement("div");
	part.className = this.mne_editor.default_class.div;
	
	part.innerHTML = "<span class='" + this.mne_editor.default_class.span + "'>&nbsp;</span>";
	this.mne_editor.insertAfter(node.parentNode, part);

	this.mne_editor.addCleanit(part.firstChild);
	this.mne_editor.moveCursor(part.firstChild.firstChild, 'e');
	return true;	
  });
  
  editor.addDelCharListener('LI', function ( node, sel )
  {
    if ( node.previousSibling != null  )
	{
	  var prev = node.previousSibling;
	  while ( node.firstChild != null ) prev.appendChild(node.firstChild);
	  node.parentNode.removeChild(node);
	  return true;
	}
	else 
	{
	  var prev = node.parentNode;
	  while(node.firstChild != null ) this.mne_editor.insertBefore(prev, node.firstChild);
	  node.parentNode.removeChild(node);
	  return true;
	}	
  });
    
  // ================================================
  // Buttons
  // =================================================  
  editor.buttons.newSeperator(param.line);
  editor.buttons.itemizeIButton = editor.buttons.newButton(param.line, "item.gif",  function() { this.buttons.mne_editor.addItemizeI(true); }, "#mne_lang#Aufzählung einfügen");
  editor.buttons.itemizeEButton = editor.buttons.newButton(param.line, "enum.gif",  function() { this.buttons.mne_editor.addItemizeE(true); }, "#mne_lang#numerierte Aufzählung einfügen");

  // ================================================
  // styles
  // =================================================  

}