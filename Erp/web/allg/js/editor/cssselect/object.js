// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Das Verändern, Kopieren, Benutzen des Codes ist nur mit ausdrücklicher
//            Genehmigung gestattet. 
//            
// ================================================================================
function MneIframeEditorCssselect(editor, param)
{
  editor.buttons.cssSelect = new Object;
  editor.buttons.cssSelect.container = editor.buttons.doc.createElement('div');
  editor.buttons.cssSelect.container.className = "background MneEditorPopup";
  editor.buttons.cssSelect.container.id = "root";
  editor.buttons.cssSelect.mne_editor = editor;
  editor.buttons.cssSelect.buttons = editor.buttons;
  editor.buttons.cssSelect.init = function()
  {
    var func = new Array();
    func['root']           = { 'show'    : this.buttons.popup.show };
    func['closebutton']    = { 'onclick' : this.buttons.popup.hidden, 'src'  : this.buttons.iconbase + "/close.gif" };
    func['resize']         = { 'onmousedown' : this.buttons.popup.startresize };
    func['titlebar']       = { 'onmousedown' : editor.buttons.popup.startmove };
    func['titletext']      = { 'onmousedown' : editor.buttons.popup.startmove, 'innerHTML' : editor.buttons.getText('#mne_lang#Klassen bearbeiten') };									  
    func['firstcoltitle']  = { 'innerHTML' : editor.buttons.getText('#mne_lang#Auswahl') };
    func['secondcoltitle'] = { 'innerHTML' : editor.buttons.getText('#mne_lang#Objekt') };
    func['firstcol']       = { 'innerHTML' : editor.buttons.getText('#mne_lang#nicht initialisiert') };
    func['secondcol']      = { 'innerHTML' : editor.buttons.getText('#mne_lang#nicht initialisiert') };
  
    this.container.innerHTML = editor.getWeblet(param.basedir + '/' + param.name.toLowerCase() + '/popup.html')
    this.buttons.addAttrShowSetFunctions(editor.buttons.cssSelect.container, editor.buttons.cssSelect.container, func );
    this.buttons.doc.body.appendChild(editor.buttons.cssSelect.container);
    this.init = null;
  }
  
  editor.buttons.cssSelect.onclick = function ()
  {
	if ( this.buttons.cssSelect.init != null ) this.buttons.cssSelect.init();
	
	var show_stylesheet = function(sheet, styles, tag, typ)
	{
      var i,j,rules;
	  
	  tag = tag.toUpperCase();
      if ( typeof sheet.cssRules != 'undefined' ) rules = sheet.cssRules; else rules = sheet.rules;
      if ( typeof sheet.imports != 'undefined' )
	    for ( i=0; i<sheet.imports.length; i++ )
          show_stylesheet(sheet.imports[i], styles, tag, typ);
	  for ( i=0; i<rules.length; i++ )
      {
	    if ( typeof CSSRule != 'undefined' && rules[i].type == CSSRule.IMPORT_RULE )
	      show_stylesheet(rules[i].styleSheet, styles, tag, typ);
	    else
	    {
	      var selector = rules[i].selectorText.replace(/ /g, '').split(',' )
		  for ( j = 0; j<selector.length; j++ )
		  {
		    var result = selector[j].split(typ);
	        if ( result.length == 2 && ( tag == '' || result[0] == '' || result[0].toUpperCase() == tag ) && result[1].indexOf("Mne") != 0 && result[1].indexOf(" ") < 0 )
		      styles[result[1]] = result[1];
	      }
		}
      }
	  return str;
    }
	
	var a,aa, i, str, styles, rules;
	var s = this.buttons.cssSelect.container;
    
	s.obj = this;
	s.show();
	
	str = "";
	styles = new Array();
	for ( i = 0; i<document.styleSheets.length; i++ )
	  show_stylesheet(document.styleSheets[i], styles, this.obj.tagName, '.');

    a = new Array();
	for ( i in styles ) a[a.length] = i;
	a.sort();

    str = "";
	aa = new Array();
	styles = this.obj.className.split(" ");
	styles.sort();
	for ( i=0; i<styles.length; i++ )
	  if ( styles[i] != 'mne_editor_cleanit' )
	  {
        str += '<div ondblclick="b = parentNode.mne_editor.mkClass(parentNode.obj, \'' + styles[i] + '\',false); parentNode.mne_editor.buttons.showAttr(parentNode.obj)" >' + styles[i] + '</div>';
	    aa[styles[i]] = true;
	  }
	s.secondcol.mne_editor = this.buttons.mne_editor;
	s.secondcol.obj = this.obj;
	s.secondcol.innerHTML = str;

	str = "";
	for ( i=0; i<a.length; i++ )
	  if ( aa[a[i]] != true )
	    str += '<div ondblclick="b = parentNode.mne_editor.mkClass(parentNode.obj, \'' + a[i] + '\',true); parentNode.mne_editor.buttons.showAttr(parentNode.obj)" >' + a[i] + '</div>';
	  
	s.firstcol.mne_editor = this.buttons.mne_editor;
	s.firstcol.obj = this.obj;
	s.firstcol.innerHTML = str;
	
	
  }  
}