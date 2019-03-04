// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
// ================================================================================
function MneIframeEditorUndo(editor, param)
{
  editor.undoit = new Array();
  editor.undonum = -1;

  editor.undo_add = function(sel)
  {
     var u = new Object;
	 var s;
	 var obj, objnum;
	 var html;
	 var i;
	 
	 try 
	 {
	   this.undo_need = false;
	   if ( typeof sel == 'undefined' ) s = this.getSelection(); else s = sel;

	   this.clearNode(s);
	   html = this.editarea.innerHTML.replace(/> </g, ">&nbsp;<");
	   u.html = html;

	   if (  this.undonum >= 0 && this.undoit[this.undonum].html == html ) return false;

	   if ( this.undonum >= 0 ) this.buttons.setModify(true);

	   if ( this.undonum != this.undoit.length-1 )
	     for ( i=this.undoit.length-2; i >= this.undonum; i-- ) this.undoit[this.undoit.length] = this.undoit[i];
	   this.undonum = this.undoit.length - 1;

	   if ( s != null )
	   {
	     try
	     {
	       obj = s.startContainer;
	       objnum = new Array();

	       while ( obj != this.editarea )
	       {
	         var i;
	         for ( i=0; i<obj.parentNode.childNodes.length; i++ ) if ( obj == obj.parentNode.childNodes[i] ) break;
	         objnum[objnum.length] = i;
	         obj = obj.parentNode;
	       }

	       u.start = objnum;
	       u.startOffset = s.startOffset;

	       obj = s.endContainer;
	       objnum = new Array();

	       while ( obj != this.editarea )
	       {
	         var i;
	         for ( i=0; i<obj.parentNode.childNodes.length; i++ ) if ( obj == obj.parentNode.childNodes[i] ) break;
	         objnum[objnum.length] = i;
	         obj = obj.parentNode;
	       }

	       u.end = objnum;
	       u.endOffset = s.endOffset;
	     }
	     catch(e)
	     {
	       u.start = u.end = null;
	     }
	   }
	   else
	   {

	     u.start = u.end = null;
	   }

	   this.undonum++;
	   this.undoit[this.undonum] = u;
	   return true;
    }
	catch(e)
	{
	  this.error(e.message + "\n" + e.stack);
	}
  };
  
  editor.undo_setCursor = function(ele)
  {
    var i;
	var obj;
	var sel = new Object;
	
	if ( ele.start == null ) return;
	
	try { 
	  obj = this.editarea;
	  for ( i=ele.start.length -1; i>=0; i-- )
	    { obj = obj.childNodes[ele.start[i]];}
   
      sel.startContainer = obj;
	  sel.startOffset = ele.startOffset;

	  obj = this.editarea;
	  for ( i=ele.end.length -1; i>=0; i-- )
	    { obj = obj.childNodes[ele.end[i]]; }
   
      sel.endContainer = obj;
	  sel.endOffset = ele.endOffset;
	  this.moveCursorSelect(sel);
	} catch(e) { this.error("#mne_lang#kann Cursor nach undo nicht setzen" + "\n" + e.message + " " + e.stack); }
	 		   
  };
  
  editor.undo_undo = function()
  {
     if ( this.undoit.length == 0 ) return;
	 
	 this.win.focus();
	 this.undo_add();
	 if ( this.undonum > 0 )
	 {
	   this.undonum--;
	   this.editarea.innerHTML = this.undoit[this.undonum].html;
	   if ( this.undoit[this.undonum].start != null )
	     this.undo_setCursor(this.undoit[this.undonum]);
	 }
	 if ( this.undonum == 0 ) this.buttons.setModify(false);
  };

  editor.undo_redo = function()
  {
    this.win.focus();
    if ( this.undonum + 1 < this.undoit.length )
	{
	  this.undonum++;
	  this.editarea.innerHTML = this.undoit[this.undonum].html;
	  this.undo_setCursor(this.undoit[this.undonum]);
	  this.buttons.setModify(true);
	}
  };
  
  editor.buttons.newSeperator(param.line);
  editor.buttons.newButton(param.line, "undo.gif",  function() {  this.buttons.mne_editor.undo_undo(); },    "#mne_lang#Änderung rückgängig machen");
  editor.buttons.newButton(param.line, "redo.gif",  function() {  this.buttons.mne_editor.undo_redo(); },    "#mne_lang#Änderung wieder herstellen");

}
