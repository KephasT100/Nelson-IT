// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
function MneIframeEditorImage(editor, param)
{

  editor.texts[editor.texts.length] = "IMG";
  editor.default_class.img = "";

  editor.addImage = function ()
  {
 	this.win.focus();
	this.undo_add();
	
	var sel = this.getSelection();
	var pre, text;
	var span;
 	  
	if ( sel.startContainer.nodeType == 3 )
	{
	  pre = sel.startContainer.data.substring(0,sel.startOffset);
	  text = sel.startContainer.data.substring(sel.startOffset);
	  if ( text != "" )
	  {
	    span = sel.startContainer.parentNode.cloneNode(false);
	    span.appendChild(this.doc.createTextNode(text));
	    this.insertAfter(sel.startContainer.parentNode, span);
		sel.startContainer.data = pre;
	  }
	  span = this.doc.createElement("img");
	  span.style.verticalAlign = "text-top";
	  this.insertAfter(sel.startContainer.parentNode, span);
	}
	else
    {
	  span = this.doc.createElement("img");
	  span.style.verticalAlign = "text-top";
	  this.insertAfter(sel.startContainer, span);
	}
	
	this.setActelement(span);
	sel.startContainer = sel.endContainer = span;
	sel.startOffset = sel.endOffset = 0;
	this.moveCursorSelect(sel);
  }
    
  editor.addClearNodeListener('IMG' , function(node)
  {
    return false;
  });
  
  // ================================================
  // Buttons
  // =================================================  
  editor.buttons.newSeperator(param.line);
  editor.buttons.pictureButton = editor.buttons.newButton(param.line, "picture.gif",   function() { this.buttons.mne_editor.addImage(); }, "#mne_lang#Bild einfügen");

  // ================================================
  // styles
  // =================================================  
  var func;
  func  = new Array();
  func['src']          = { "onkeydown" : editor.buttons.inKeydown,
                           "setValue"  : function(e) { this.obj.src = this.value; },
				           "onkeyup"   : function() {} };

  if ( editor.have_plugin("fileselect") )
    func['selectbutton'] = { "onclick"  : editor.buttons.fileSelect.onclick,
                             "select"   : function(str) { this.obj.value = str; this.obj.obj.src = str; },
						     "dirname"  : "/",
						     "filetype" : "png,gif,jpg,jepg",
							 "value"    : editor.buttons.getText("#mne_lang#Auswahl") };
  else
    func['selectbutton'] = { "remove" : true };
					   
  this.attr = editor.buttons.addAttrShow('img', '#mne_lang#Bild', editor.getWeblet(param.basedir + '/' + param.name.toLowerCase() + '/attr.html'), func)
  this.attr.setAttr = function( obj )
  {
	if ( this.selectbutton != null ) if ( this.buttons.ajax.listdir == null ) this.selectbutton.disabled="disabled"; else this.selectbutton.obj = this.src;

	this.buttons.attrSelect.value = obj.tagName;
	this.src.obj = obj;
	this.src.value = obj.getAttribute('src');
	this.buttons.mne_editor.act_element = obj;
	this.buttons.mne_editor.mkClass( this.buttons.mne_editor.act_element, "active", true);
  }
}