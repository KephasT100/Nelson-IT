// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
function MneIframeEditorAnker(editor, param)
{

  editor.default_class.a = "";

  editor.addAnker = function ()
  {
 	this.win.focus();
	this.undo_add();
	
	var sel = this.getSelection();
	var pre, text;
	var start,end, span;
 	  
    start = sel.startContainer;
	while ( start != this.editarea && ( start.nodeType == 3 || start.tagName != 'A' )) start = start.parentNode;
	if ( start != this.editarea )
	{
	  this.error('#mne_lang#Kann Anker nicht in einem anderen Anker erstellen');
	  return;
	}
	
	if ( sel.startContainer.nodeType == 3 || this.isText(sel.startContainer) )
	{
	  if ( sel.startContainer.nodeType == 3 ) pre = sel.startContainer.data.substring(0,sel.startOffset); else pre = "";
	  if ( pre != "" )
	  {
	    start = sel.startContainer.parentNode.cloneNode(false);
	    start.appendChild(this.doc.createTextNode(sel.startContainer.data.substring(sel.startOffset)));
	    this.insertAfter(sel.startContainer.parentNode, start);
		sel.startContainer.data = pre;
		if ( sel.startContainer == sel.endContainer )
		{
		  sel.endOffset = sel.endOffset - sel.startOffset;
		  sel.endContainer = start.firstChild;
		}
	  }
	  else if ( sel.startContainer.nodeType == 3 )
	  {
	    start = sel.startContainer.parentNode;
	  }
	  else
	  {
	    start = sel.startContainer;
	  }
	  
	  if ( sel.endContainer.nodeType == 3 ) text = sel.endContainer.data.substring(sel.endOffset); else text = '';
	  if ( text != "" )
	  {
	    end = sel.endContainer.parentNode.cloneNode(false);
	    end.appendChild(this.doc.createTextNode(text));
	    this.insertAfter(sel.endContainer.parentNode, end);
		sel.endContainer.data = sel.endContainer.data.substring(0, sel.endOffset);
	  }
	  else if ( sel.endContainer.nodeType == 3 )
	  {
	    end = sel.endContainer.parentNode.nextSibling;
	  }
	  else
	  {
	    end = sel.endContainer.nextSibling;
	  }

	  span = this.doc.createElement("a");
	  span.className = this.mne_editor.default_class.a;
	  span.href = "#";
	  this.insertAfter(sel.startContainer.parentNode, span);

	  while ( start != null && start != end && start != span )
	  {
	      var e = start;
		  start = start.nextSibling;
		  span.appendChild(e);
	  }
	  if ( span.firstChild == null ) span.innerHTML = "<span class='" + this.default_class.span + "'>" + this.getText('#mne_lang#Verweis') + "</span>";
	}
	else
    {
	  span = this.doc.createElement("a");
	  span.className = this.mne_editor.default_class.a;
	  span.href = "#";
	  span.innerHTML = "<span class='" + this.default_class.span + "'>" + this.getText('#mne_lang#Verweis') + "</span>"
	  this.insertAfter(sel.startContainer, span);
	}

	  this.clearNode();
	  this.anker_moveCursor(span);
  }
  editor.anker_moveCursor = function(a)
  {
  	  var sel = new Object();
	  
	  sel.startContainer = a.firstChild;
	  sel.endContainer = a.lastChild;
	  sel.startOffset = 0;
	  if ( sel.startContainer.tagName == "SPAN" ) sel.startContainer = sel.startContainer.firstChild;
	  if ( sel.endContainer.tagName == "SPAN" ) { sel.endContainer = sel.endContainer.firstChild; sel.endOffset = sel.startContainer.length; } else sel.endOffset = sel.endContainer.childNodes.length;

	  this.moveCursorSelect(sel);
  }
    
  var set_content_listener = function(node)
  {
      var i;
	  var func = this;
	  if ( typeof node == 'undefined' ) node = this.mne_editor.editarea;
	  
	  for ( i = 0; i<node.childNodes.length; i++ )
	  {
	      var n = node.childNodes[i];
		  if ( typeof n.tagName != 'undefined' && n.tagName == "A" )
		  {
		    if ( n.getAttribute('href') == null || n.getAttribute('href') == "" ) this.mne_editor.mkClass(n, "MneHrefEmpty", true );
		  }
		  else
		    set_content_listener(n);
	  }
  }

  var get_content_listener = function(node)
  {
      var i;
	  var func = this;
	  if ( typeof node == 'undefined' ) node = this.mne_editor.editarea;
	  
	  for ( i = 0; i<node.childNodes.length; i++ )
	  {
	      var n = node.childNodes[i];
		  if ( typeof n.tagName != 'undefined' && n.tagName == "A" )
		    this.mne_editor.mkClass(n, "MneHrefEmpty", false );
		  else
		    get_content_listener(n);
	  }
  }

  editor.addSetContentListener(set_content_listener);
  editor.addGetContentListener(get_content_listener);

  // ================================================
  // Buttons
  // =================================================  
  editor.buttons.newSeperator(param.line);
  editor.buttons.ankerButton   = editor.buttons.newButton(param.line, "anker.gif",     function() { this.buttons.mne_editor.addAnker(); }, "#mne_lang#Verweis einfügen");

  // ================================================
  // styles
  // =================================================  
  var func;
  func  = new Array();
  func['hreftitle']        = { "innerHTML" : editor.buttons.getText("#mne_lang#Quelle") + ": " };
  func['targettitle']        = { "innerHTML" : editor.buttons.getText("#mne_lang#Ziel") + ": " };
  func['nametitle']        = { "innerHTML" : editor.buttons.getText("#mne_lang#Name") + ": " };

  func['href']          = { "onkeydown" : editor.buttons.inKeydown,
                            "setValue"  : function()
								          {
										    if ( this.value == '' ) 
	                                        {
	                                          this.obj.removeAttribute("href");
		                                      this.mne_editor.mkClass(this.obj, "MneHrefEmpty", true );
		                                      this.mne_editor.mkClass(this.obj, "empty", true );
	                                        }
	                                        else
	                                        {
	                                          this.obj.href = this.value;
		                                      this.mne_editor.mkClass(this.obj, "MneHrefEmpty", false );
		                                      this.mne_editor.mkClass(this.obj, "empty", false );
	                                        }
											this.mne_editor.anker_moveCursor(this.obj);
											this.mne_editor.buttons.showAttr(this.obj);
										  },
				             "onkeyup"  : function() {} };

  func['target']        = { "onkeydown" : editor.buttons.inKeydown,
                            "setValue" : function(){ this.obj.target = this.value;  this.mne_editor.anker_moveCursor(this.obj); this.mne_editor.buttons.showAttr(this.obj); },
				            "onkeyup"  : function() {} };
  func['name']          = { "onkeydown" : editor.buttons.inKeydown,
                            "setValue" : function(){ this.obj.name = this.value;  this.mne_editor.anker_moveCursor(this.obj);  this.mne_editor.buttons.showAttr(this.obj); },
				            "onkeyup"  : function() {} };

  if ( editor.have_plugin("fileselect") )
    func['hrefbutton'] = { "onclick"  : editor.buttons.fileSelect.onclick,
                             "select"   : function(str) { this.obj.value = str; this.obj.obj.href = str; this.mne_editor.anker_moveCursor(this.obj);  this.mne_editor.buttons.showAttr(this.obj); },
						     "dirname"  : "/",
						     "filetype" : "html,php",
							 "value"    : editor.buttons.getText("#mne_lang#Auswahl") };
  else
    func['hrefbutton'] = { "remove" : true };
  				   
  this.attr = editor.buttons.addAttrShow('a', '#mne_lang#Anker', editor.getWeblet(param.basedir + '/' + param.name.toLowerCase() + '/attr.html'), func)
  this.attr.setAttr = function( obj )
  {
	if ( this.hrefbutton != null ) if ( this.buttons.ajax.listdir == null ) this.hrefbutton.disabled="disabled"; else this.hrefbutton.obj = this.href;

	this.buttons.attrSelect.value = obj.tagName;
	this.href.obj = obj;
	this.href.value = obj.getAttribute('href');
	this.mne_editor.mkClass(this.href, "MneInputModifyNo", true, "MneInputModify");
	this.target.obj = obj;
	this.target.value = obj.getAttribute('target');
	this.mne_editor.mkClass(this.target, "MneInputModifyNo", true, "MneInputModify");
	this.name.obj = obj;
	this.name.value = obj.name;
	this.mne_editor.mkClass(this.name, "MneInputModifyNo", true, "MneInputModify");
	this.buttons.mne_editor.act_element = obj;
	this.buttons.mne_editor.mkClass( this.buttons.mne_editor.act_element, "active", true);
  }

}