// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
function MneIframeEditorFileselect(editor, param)
{
  editor.buttons.fileSelect = new Object;
  editor.buttons.fileSelect.container = editor.buttons.doc.createElement('div');
  editor.buttons.fileSelect.container.className = "MneEditorPopup";
  editor.buttons.fileSelect.container.id = "root";
  editor.buttons.fileSelect.mne_editor = editor;
  editor.buttons.fileSelect.buttons = editor.buttons;
  editor.buttons.fileSelect.init = function()
  {
  
    var func = new Array();
    func['root']        = { 'show'    : this.buttons.popup.show };
    func['closebutton'] = { 'onclick'     : this.buttons.popup.hidden, 'src' : editor.buttons.iconbase + "/close.gif" };
    func['resize']      = { 'onmousedown' : this.buttons.popup.startresize };
    func['titlebar']    = { 'onmousedown' : editor.buttons.popup.startmove };
    func['titletext']   = { 'onmousedown' : editor.buttons.popup.startmove, 'innerHTML' : editor.buttons.getText('#mne_lang#Datei auswählen') };									  
    func['content']     = { 'innerHTML'   : editor.buttons.getText('#mne_lang#nicht initialisiert') };
    this.container.innerHTML = editor.getWeblet(param.basedir + '/' + param.name.toLowerCase() + '/popup.html');
    this.buttons.addAttrShowSetFunctions(this.container, this.container, func );
    editor.buttons.doc.body.appendChild(this.container);
    this.init = null;
  }
  
  editor.buttons.fileSelect.onclick = function ()
  {
	var v = new Array();
		
	if ( this.buttons.fileSelect.init != null ) this.buttons.fileSelect.init();
    this.buttons.fileSelect.obj = this;
    this.buttons.fileSelect.container.show();
	
	if ( this.dirname == '' ) this.dirname = '/';
	this.buttons.fileSelect.container.firstChild.lastChild.data = this.dirname;
	if ( window.XMLHttpRequest ) this.buttons.fileSelect.req  = new XMLHttpRequest; else this.buttons.fileSelect.req  = new ActiveXObject("Microsoft.XMLHTTP");
	    
	this.buttons.fileSelect.req.open("GET", this.buttons.ajax.listdir+ "?dir=" + this.dirname + "&ftyp=" + this.filetype, true);
	this.buttons.fileSelect.req.onreadystatechange = this.buttons.fileSelect.onreadystate;
	this.buttons.fileSelect.req.send(null);
  }
  
  editor.buttons.fileSelect.onreadystate = function()
  {
    if ( window.mne_editor.buttons.fileSelect.req.readyState == 4 )
    {
	  var i,objs,str,container, req;
	  container = window.mne_editor.buttons.fileSelect.container.lastChild;
	  container.mne_editor = window.mne_editor;
	  str = ""; 
	  try
	  {
	    req = window.mne_editor.buttons.fileSelect.req;
		objs = req.responseXML.getElementsByTagName("result")[0];
	    for ( i=0; objs != null && i<objs.childNodes.length; i++ )
		{
		  if ( objs.childNodes[i].tagName == "dir" )
			if ( objs.childNodes[i].firstChild.data == '.' )
			  str = str + '<div class="MneEditor MneEditorPopupDir" ondblclick="b = parentNode.mne_editor.buttons.fileSelect; b.obj.onclick()">' + objs.childNodes[i].firstChild.data + "</div>";
			else if ( objs.childNodes[i].firstChild.data == '..' )
			  str = str + '<div class="MneEditor MneEditorPopupDir" ondblclick="b = parentNode.mne_editor.buttons.fileSelect; b.obj.dirname = b.obj.dirname.substring(0,b.obj.dirname.lastIndexOf(\'/\')); b.obj.onclick()">' + objs.childNodes[i].firstChild.data + "</div>";
			else
		      str = str + '<div class="MneEditor MneEditorPopupDir" ondblclick="b = parentNode.mne_editor.buttons.fileSelect; if ( b.obj.dirname[b.obj.dirname.length - 1] != \'/\' ) b.obj.dirname+=\'/\';  b.obj.dirname+=\'' + objs.childNodes[i].firstChild.data + '\'; b.obj.onclick()">' + objs.childNodes[i].firstChild.data + "</div>";
        }
	    for ( i=0; objs != null && i<objs.childNodes.length; i++ )
		{
		  if ( objs.childNodes[i].tagName == "datei" )
	      {
			str = str + '<div class="MneEditor MneEditorPopupFile"'
			str = str + '     ondblclick=" var b = parentNode.mne_editor.buttons.fileSelect; var dirname = b.obj.dirname; if ( dirname == \'/\' ) dirname = \'\'; b.obj.select(dirname + \'/\' + \'' + objs.childNodes[i].firstChild.data + '\'); b.container.style.visibility = \'hidden\';b.container.style.top=\'-100000px\'">'+ objs.childNodes[i].firstChild.data + "</div>";
		  }
        }
	  }
	  catch(err)
	  {
	    str = req.responseText;
	  }
	  window.mne_editor.buttons.fileSelect.container.content.innerHTML = str;
	}
  }

}