// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
function MneIframeEditorTable(editor, param)
{

  editor.default_class.table = "mne_padding mne_border";
  editor.default_class.tr = "";
  editor.default_class.td = "mne_padding mne_border mne_valignt";

  editor.parts[editor.parts.length] = "TABLE";

  
  editor.addColumn = function(tr, num, nomove )
  {
    var parent, part, span;
		
	part = this.doc.createElement("td");
	part.className = this.default_class.td;
 
	parent = part;
	part = this.doc.createElement('div');
	part.className = this.default_class.div;
    part.innerHTML = "<span class='" + this.default_class.span + "'>&nbsp;</span>";
	this.addCleanit(part.firstChild);
	parent.appendChild(part);
	span = part.firstChild;
	
    if ( typeof tr.cells.length == 'undefined' || num >= tr.cells.length ) tr.appendChild(parent); else tr.insertBefore(parent, tr.cells[num]);

	if ( nomove != true )
	  this.moveCursor(span.firstChild);	
  };

  editor.delColumn = function()
  {
    var i, span, td, tr, table,pos;
	
    this.win.focus();
	this.undo_add();
	span = this.getActnode();
	if ( span.nodeType == 3 ) span = span.parentNode;
	td = span;
	while ( td.tagName != "TD" && td != this.editarea ) td = td.parentNode;

	tr = td;    while ( tr.tagName != "TR"       && tr != this.editarea    ) tr    = tr.parentNode;
	table = tr; while ( table.tagName != "TABLE" && table != this.editarea ) table = table.parentNode;
	if ( table == this.editarea )
	{
	  this.error("#mne_lang#Keine Spalte zum löschen gefunden");
	  return;
	}

	for ( pos = 0; pos <tr.cells.length; pos++) if ( td == tr.cells[pos] ) break;
	
	for ( i = 0; i<table.firstChild.rows.length; i++ )
	  table.firstChild.rows[i].deleteCell(pos);

	if ( pos != 0  ) pos --;
	if ( tr.cells.length > 0 )
	{
	  span = tr.cells[pos].firstChild;
	  while ( span.nodeType != 3 ) span = span.firstChild;
	  this.moveCursor(span, 'e');
	}
	else
	{
	  span = table;
	  while ( span != this.editarea &&  span.previousSibling == null ) span = span.parentNode;
	  
	  if ( span == this.editarea )
	  {
		var sel = new Object;
		while( span.firstChild != null ) span = span.firstChild; 
	    sel.startContainer = sel.endContainer = span;
		sel.startOffset = sel.endOffset = span.length;
		this.clearNode(sel);
		this.moveCursorSelect(sel );
      }
	  else
	  {
	    span = span.previousSibling;
	    while ( span.lastChild != null  ) span = span.lastChild;
	    this.moveCursor(span, span.length );
      }
	}	
  };

  editor.nextColumn = function(before)
  {
    var i, span, td, tr, table,pos;
	
    this.win.focus();
	this.undo_add();
	span = this.getActnode();
	if ( span.nodeType == 3 ) span = span.parentNode;
	td = span;
	while ( td.tagName != "TD" && td != this.editarea ) td = td.parentNode;

	if ( typeof before == 'undefined' && td.nextSibling != null && td != this.editarea )
	{ 
	  span = td.nextSibling.firstChild;
	  while ( span.tagName != "SPAN" ) span = span.firstChild;
	  if ( span.innerHTML == "&nbsp;" ) this.moveCursor(span.firstChild, 'e');
	  else this.moveCursor(span.firstChild, 'b');
	  return;
	}
	
	tr = td;    while ( tr.tagName != "TR"       && tr != this.editarea    ) tr    = tr.parentNode;
	table = tr; while ( table.tagName != "TABLE" && table != this.editarea ) table = table.parentNode;
	if ( table == this.editarea )
	{
	  this.error("#mne_lang#Kann Spalte nur in eine Zeile einfügen");
	  return;
	}

	for ( pos = 0; pos <tr.cells.length; pos++) if ( td == tr.cells[pos] ) break;
	if ( before != true && pos != tr.cells.length ) pos++;
	
	for ( i = 0; i<table.firstChild.rows.length; i++ )
	  this.addColumn(table.firstChild.rows[i], pos, true );

	span = tr.cells[pos].firstChild;
	while ( span.nodeType != 3 ) span = span.firstChild;
	this.moveCursor(span, 'e');
	return;
  };
  
  editor.nextRow = function(before)
  {
    var span, tr, table,pos;
	
    this.win.focus();
	this.undo_add();
	span = this.getActnode();
	if ( span.nodeType == 3 ) span = span.parentNode;

	tr = span;  while ( tr.tagName != "TR"       && tr != this.editarea    ) tr    = tr.parentNode;
	table = tr; while ( table.tagName != "TABLE" && table != this.editarea ) table = table.parentNode;
	if ( table == this.editarea )
	{
	  this.error("#mne_lang#Kann Zeile nur in eine Tabelle einfügen");
	  return;
	}

	for ( pos = 0; pos <table.firstChild.rows.length; pos++) if ( tr == table.firstChild.rows[pos] ) break;
	if ( before != true && pos != table.firstChild.length ) pos++;
	
	this.addRow(table, pos, true );

	span = table.firstChild.rows[pos].firstChild;
	while ( span.nodeType != 3 ) span = span.firstChild;
	this.moveCursor(span, 'e');
	return;
  };
  

  editor.delRow = function()
  {
    var parent;
	var tr;
	var node;
	var sel = new Object;
	
    this.win.focus();
    this.undo_add();

	tr = this.getActnode();
	while ( tr.tagName != 'TR' && tr != this.editarea ) tr = tr.parentNode;
	if ( tr == this.editarea )
	{
	   this.error("#mne_lang#Kann nur aus einer Tabelle Zeilen löschen");
	   return;
	}
    node = tr;
    if ( node.previousSibling == null )
	  while ( node.previousSibling == null && node != this.editarea ) node = node.parentNode;
	if ( node != this.editarea )
	  node = node.previousSibling;

	parent = tr.parentNode;
	parent.removeChild(tr);
	
	if ( node == this.editarea )
	  while ( node.firstChild != null ) node = node.firstChild;
	else
	 while ( node.lastChild != null ) node = node.lastChild;

	sel.startContainer = sel.endContainer = node;
	sel.startOffset = sel.endOffset = node.length;
	this.clearNode(sel);
	this.moveCursorSelect(sel);
  };
  
  editor.addRow = function(p, r)
  {
    var span,tr;
	var cnum;
	var i;
	var parent = p;
	var rnum = r;
	
	if ( typeof parent == 'undefined' || parent == null )
	{
	  parent = this.act_span;
	  while ( parent.tagName != 'TABLE' && parent != this.editarea ) parent = parent.parentNode;
	  if ( parent == this.editarea )
	  {
	     this.error("#mne_lang#Kann nur in eine Tabelle eine Zeile einfügen");
		 return;
	  }
	}

	if ( typeof rnum  == 'undefined' || rnum == null )
	{
	  if ( typeof parent.firstChild == 'object' && parent.firstChild != null )
	  {
	    rnum = parent.firstChild.rows.length;
		cnum = parent.firstChild.rows[0].cells.length;
	  }
	  else
	  {
	    rnum = 0;
		cnum = 1;
	  }
	}
	else if ( rnum > 0 )
	  cnum = parent.firstChild.rows[0].cells.length;
	else
	{
	  cnum = 1;
	  for ( i=0; i<parent.firstChild.rows.length; i++ ) if ( parent.firstChild.rows[i].cells.length > cnum ) cnum = parent.firstChild.rows[i].cells.length;
	}
	
	tr = this.mne_editor.doc.createElement('tr');

	for ( i=0; i<cnum; i++ )
	  this.addColumn(tr,i, true);
	
	if ( rnum == 0 && parent.firstChild.firstChild == null )
	  parent.firstChild.appendChild(tr);
	else if ( rnum == 0 )
	  this.mne_editor.insertBefore(parent.firstChild.firstChild, tr );
	else
	  this.mne_editor.insertAfter(parent.firstChild.childNodes[rnum-1], tr);
	  
	span = tr.firstChild;
	while ( span.nodeType != 3 ) span = span.firstChild;
	this.moveCursor(span, 'e');
  };
  
  editor.addTable = function(from_button)
  {
    var sel, del, parent, part, p, i;
	
    this.win.focus();
	this.undo_add();

	sel = this.getSelection();
	parent = sel.endContainer;
    while ( ! this.isPart(parent) ) parent = parent.parentNode;

	del = this.delSelection(sel);

	if ( del.length == 0 )
	{
	  p = this.doc.createElement('div');
	  p.className = this.default_class.div;
	  p.innerHTML = "<span class='" + this.default_class.span + "'>&nbsp;</span>";
	  this.addCleanit(p.firstChild);
	  del[0] = p;
	}
	
	part = this.doc.createElement('table');
	part.className = this.default_class.table;
	this.insertAfter(parent, part);

	parent = this.doc.createElement('tbody');
	part.appendChild(parent);

    for ( i=0; i<del.length; i++ )
	{
		p = this.doc.createElement('tr');
	    parent.appendChild(p);

	    p = this.doc.createElement('td');
	    p.className = this.default_class.td;
	    parent.lastChild.appendChild(p);

        p.appendChild(del[i]);    
	}
	p = del[0];
	while ( p.lastChild != null ) p = p.lastChild;
	this.moveCursor(p, 'b');

  };
  
  editor.delTable = function()
  {
    var tab, parent, node;
	var sel = new Object;
	
    this.win.focus();
	this.undo_add();
	
	tab = this.getActnode().parentNode;
	while ( tab.tagName != "TABLE" && tab != this.editarea ) tab = tab.parentNode;
	if ( tab == this.editarea )
	{
	  this.error("#mne_lang#Keine Tabelle zum Löschen selektiert");
	  return;
	}
	
    node = tab;
    if ( node.previousSibling == null )
	  while ( node.previousSibling == null && node != this.editarea ) node = node.parentNode;
	if ( node != this.editarea )
	  node = node.previousSibling;

	parent = tab.parentNode;
	parent.removeChild(tab);
	
	if ( node == this.editarea )
	  while ( node.firstChild != null ) node = node.firstChild;
	else
	 while ( node.lastChild != null ) node = node.lastChild;

	sel.startContainer = sel.endContainer = node;
	sel.startOffset = sel.endOffset = node.length;
	this.clearNode(sel);
	this.moveCursorSelect(sel);
  };
  
  editor.addPartCountListener(2, 'TABLE', function ( node, s ) { var span = s; while ( span.tagName != 'TR' ) span = span.parentNode; this.mne_editor.addRow(node, span.sectionRowIndex + 1 ); });
  editor.addPartCountListener(3, 'TR', function ( node, span )
  {
    var part = this.mne_editor.doc.createElement("div");
	part.className = this.mne_editor.default_class.div;
	
	part.innerHTML = "<span class='" + this.mne_editor.default_class.span + "'>&nbsp;</span>";
	this.mne_editor.insertAfter(node.parentNode.parentNode, part);

	this.mne_editor.addCleanit(part.firstChild, true);
	this.mne_editor.moveCursor(part.firstChild.firstChild, 'e');
    
	node.parentNode.removeChild(node);
	return true;	
  });
  
  editor.addClearNodeListener('TD', function(node)
  {
    if ( node.firstChild == null )
	{
	  node.appendChild(this.mne_editor.doc.createElement('div'));
	  node.lastChild.className = this.mne_editor.default_class.div;
	  node.lastChild.innerHTML = "<span class='" + this.mne_editor.default_class.span + "'>&nbsp;</span>";
	  this.mne_editor.addCleanit(node.lastChild.lastChild, true);
	}
	return false;
  });
  
  editor.addKeypressListener(9, function(keycode) { this.mne_editor.nextColumn(); return true; } );
    
// ================================================
// Buttons
// =================================================  
  editor.buttons.newSeperator(1);
  editor.buttons.tableButton           = editor.buttons.newButton(param.line, "table.gif",                   function() {  this.buttons.mne_editor.addTable(true); },    "#mne_lang#Tabelle hinzufügen");
  editor.buttons.tableDeleteButton     = editor.buttons.newButton(param.line, "table_delete.gif",            function() {  this.buttons.mne_editor.delTable(true); },    "#mne_lang#Tabelle löschen");
  editor.buttons.colInsertBeforeButton = editor.buttons.newButton(param.line, "table_insert_col_before.gif", function() {  this.buttons.mne_editor.nextColumn(true); },  "#mne_lang#Spalte vor die aktuelle Spalte hinzufügen");
  editor.buttons.colInsertBehindButton = editor.buttons.newButton(param.line, "table_insert_col_behind.gif", function() {  this.buttons.mne_editor.nextColumn(false); }, "#mne_lang#Spalte hinter die aktuelle Spalte hinzufügen");
  editor.buttons.colDeleteButton       = editor.buttons.newButton(param.line, "table_delete_col.gif",        function() {  this.buttons.mne_editor.delColumn(); },       "#mne_lang#aktuelle Spalte löschen");
  editor.buttons.rowInsertBeforeButton = editor.buttons.newButton(param.line, "table_insert_row_before.gif", function() {  this.buttons.mne_editor.nextRow(true); },     "#mne_lang#Zeile vor die aktuelle Zeile hinzufügen");
  editor.buttons.rowInsertBehindButton = editor.buttons.newButton(param.line, "table_insert_row_behind.gif", function() {  this.buttons.mne_editor.nextRow(false); },    "#mne_lang#Zeile hinter die aktuelle Zeile hinzufügen");
  editor.buttons.rowDeleteButton       = editor.buttons.newButton(param.line, "table_delete_row.gif",        function() {  this.buttons.mne_editor.delRow(); },          "#mne_lang#aktuelle Zeile löschen");

  // ================================================
  // styles
  // =================================================  
  var func;
  func  = new Array();
  func['border']  = { "onclick" : function() { var on,off; on = off = this.buttons.classnames.border;  if ( this.checked != true ) on += "no"; this.mne_editor.setAttr('TABLE', on, 1, off, true, true ); } };
  func['padding'] = { "onclick" : function() { var on,off; on = off = this.buttons.classnames.padding; if ( this.checked != true ) on += "no"; this.mne_editor.setAttr('TABLE', on, 1, off, true, true ); } };
  if ( ! ( editor.parameter.nohtml == true ) )
  {
    editor.buttons.addAttrShow('table', '#mne_lang#Tabelle', editor.getWeblet(param.basedir + '/' + param.name.toLowerCase() + '/attrtable.html'), func).setAttr = function( obj )
    {
      this.buttons.attrSelect.value = obj.tagName;
      this.border.checked  = ( obj.className.indexOf(this.buttons.classnames.border + 'no')  < 0 );
      this.padding.checked = ( obj.className.indexOf(this.buttons.classnames.padding) >= 0 );
    };
  }
  if ( editor.parameter.nohtml == true )
  {
    editor.buttons.addAttrShow('table', '#mne_lang#Tabelle', editor.getWeblet(param.basedir + '/' + param.name.toLowerCase() + '/attrtable_nohtml.html'), func).setAttr = function( obj )
    {
      this.buttons.attrSelect.value = obj.tagName;
      this.border.checked  = ( obj.className.indexOf(this.buttons.classnames.border + 'no')  < 0 );
    };
  }
  func = new Array();
  func['padding']  = { "onclick"   : function() { var on,off; on = off = this.buttons.classnames.padding; if ( this.checked != true ) on += "no"; this.mne_editor.setAttr('TABLE', on, 1, off, null, true ); } };
  func['relwidth'] = { "onkeydown" : function(e)
	                                 {
	                                   var key;
									   if ( typeof e == "undefined" ) key = window.parent.event.keyCode; else key = e.which;
	                                   if ( key == 13 )
	                                   {
	                                     this.mne_editor.setAttr("TD", "relwidth", parseInt(this.value), null, null, true );
	  	                                 this.className = "MneInputModifyNo";
                                       }
	                                   if ( key != 8 && (key < 48 || key > 57) ) return false;
	                                   return true;
	                                 },
                         "onkeyup" : function(e)
	                                 {
	                                   var key;
	                                   if ( typeof e == "undefined" ) key = window.parent.event.keyCode; else key = e.which;
	                                   if ( key != 13 )
	                                   {
	                                     var val;
		                                 if ( ( val = parseInt(this.value).toString()) == "NaN" ) this.value = 0;
		                                 else if ( val > 100 ) this.value = 100;
		                                 else this.value = val;
		                                 this.className = "MneInputModifyOk";
	                                   }
	                                   return true;
	                                 }};
  func['valign'] = { 'onchange' : function() { this.buttons.mne_editor.setAttr("TD", this.buttons.classnames.valign + this.options[this.selectedIndex].value, 1, this.buttons.classnames.valign, null, true ); }};
  
  if ( ! ( editor.parameter.nohtml == true ) )
  {
    editor.buttons.addAttrShow('td', '#mne_lang#Zelle', editor.getWeblet(param.basedir + '/' + param.name.toLowerCase() + '/attrtd.html'), func).setAttr = function( obj )
    {
      var i;
      this.buttons.attrSelect.value = obj.tagName;
      this.padding.checked = ( obj.className.indexOf(this.buttons.classnames.padding) >= 0 );
      if ( ( i = obj.className.indexOf(this.buttons.classnames.valign )) >= 0 ) this.valign.value = obj.className.substr(i + this.buttons.classnames.valign.length);
      if ( typeof obj.style.width != 'undefined' && parseInt(obj.style.width).toString() != "NaN" ) this.relwidth.value  = parseInt(parseFloat(obj.style.width) / MneMisc.prototype.posGetWidth(this.buttons.mne_editor.editarea) * 100 ); else this.relwidth.value = "";
      this.relwidth.className = "MneInputModifyNo";
    }	;
  }
  else
  {
    editor.buttons.addAttrShow('td', '#mne_lang#Zelle', editor.getWeblet(param.basedir + '/' + param.name.toLowerCase() + '/attrtd_nohtml.html'), func).setAttr = function( obj )
    {
      this.buttons.attrSelect.value = obj.tagName;
      if ( typeof obj.style.width != 'undefined' && parseInt(obj.style.width).toString() != "NaN" ) this.relwidth.value  = parseInt(parseFloat(obj.style.width) / MneMisc.prototype.posGetWidth(this.buttons.mne_editor.editarea) * 100 ); else this.relwidth.value = "";
      this.relwidth.className = "MneInputModifyNo";
    }; 
  }

  editor.setAttrTABLE = function(node, attr, value, clear, all )
  {
	this.mkClass(node, attr, value == 1, clear );
    if ( all )
	{
	  var i,j;
	  for ( i= 0; i < node.firstChild.rows.length; ++i )
	    for ( j=0; j < node.firstChild.rows[i].cells.length; ++j )
		  this.mkClass(node.firstChild.rows[i].cells[j], attr, value == 1, clear );
	}
  };
  
  editor.setAttrTD = function(node, attr, value, clear )
  {
    if ( attr == "relwidth" )
    {
      var w = (parseInt(value) * MneMisc.prototype.posGetWidth(this.editarea) / 100 ) + "px";
      var i,j, tab;
      for ( i = 0; i<node.parentNode.cells.length; i++)
        if ( node == node.parentNode.cells[i]) break;
      if ( i == node.parentNode.cells.length ) return;

      tab = node.parentNode.parentNode;
      for ( j =0; j < tab.rows.length; j++)
        tab.rows[j].cells[i].style.width = w;
    }
    else
    {
      this.mkClass(node, attr, value == 1, clear );
    }  
  };
}