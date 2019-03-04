// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
window.MneEditor = function(win, frame, bframe )
{
  this.win = win;

  this.frame =  ( typeof  frame == "string" ) ? document.querySelector( '#' +  frame ) :  frame;
  this.bframe = ( typeof bframe == "string" ) ? document.querySelector( '#' + bframe ) :  bframe;
  
  this.parameter = {};

  this.plugins = new Array();
  this.plugins[this.plugins.length] = { name: "Basic", line: 0 };
  this.plugins[this.plugins.length] = { name: "Undo",  line: 1 };

  this.frame.className = 'MneEditorFrame';
  
  this.clear = function() {};

  this.show = function(loadReady)
  {
	if ( typeof this.win.editornum == 'undefined' ) this.win.editornum = 0;
	if ( typeof this.win.mne_editor_parameter == 'undefined' ) this.win.mne_editor_parameter = new Array();
	
	this.eframe = "mne_editor" + this.win.editornum++;
	
	if ( typeof this.iframe != 'undefined' ) this.iframe.parentNode.removeChild(this.iframe);
	  
	this.bframe.style.width = this.frame.offsetWidth + "px";
	
	
	this.win.mne_editor_parameter[this.eframe] = new Object;
	this.win.mne_editor_parameter[this.eframe].button = this.bframe;
	this.win.mne_editor_parameter[this.eframe].ignore_exception = true;
	this.win.mne_editor_parameter[this.eframe].editor = this;
	this.win.mne_editor_parameter[this.eframe].loadReady = loadReady;
	
	this.win.eframe = null;
	this.iframe = this.win.document.createElement("iframe");
	this.iframe.height = ( this.frame.offsetHeight - 2 ) + "px";
	this.iframe.width  = ( this.frame.offsetWidth - 2 ) + "px";
	this.iframe.setAttribute("border", "0");
	this.iframe.setAttribute("frameBorder", "0");
	this.iframe.setAttribute("marginWidth", "0");
	this.iframe.setAttribute("marginHeight", "0");
	this.iframe.setAttribute("leftMargin", "0");
	this.iframe.setAttribute("topMargin", "0");
	this.iframe.setAttribute("topMargin", "0");
	this.iframe.src = "allg/main/editor/main.html?name=" + this.eframe;
	this.frame.appendChild(this.iframe);

  if ( typeof this.iframe.contentWindow != 'undefined' && this.iframe.contentWindow != null ) this.iframe.contentWindow.name = this.eframe;
	};
	
	this.resize = function()
	{
	    if ( typeof this.iframe == 'undefined' || this.iframe == null  || this.frame == null ) return;
	    
	    this.iframe.height = ( this.frame.offsetHeight - 2 ) + "px";
	    this.iframe.width  = ( this.frame.offsetWidth - 2 ) + "px";
	    
	};
};
