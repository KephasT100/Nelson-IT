// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/rte/standalone
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    ewidth  : '570', /* ist etwa a4 */
    eheight : '400',
    
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadClass("MneEditor", "editor/mne_editor.js");
  weblet.loadCss('all.css', '/styles/editor');

  weblet.loadview();
  weblet.obj.mkbuttons = [];

  var attr = 
  {
      hinput : false,
      editor       : { 'style.width' : this.initpar.ewidth + "px", 'style.height' : this.initpar.eheight + "px" },
 }
  
  weblet.findIO(attr);

  weblet.obj.editor = null;
  weblet.obj.pendingobj = null;
  weblet.obj.resizetext = false;
  
  weblet.obj.editor_win = new MneEditor(weblet.win, weblet.frame.querySelector("#editor"), weblet.frame.querySelector("#editorbuttons"));

  weblet.obj.editor_win.parameter.mne_ajax = true;
  weblet.obj.editor_win.parameter.nohtml   = true;

  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Xml",        line: 1, output : null };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Save",       line: 1, pos : 0 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Clipboard",  line: 1, pos : 0 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Itemize",    line: 1 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Table",      line: 1 };
  weblet.obj.editor_win.show(function(editor){weblet.editor_loadready(editor); });

  weblet.editor_loadready = function(editor)
  {
    this.obj.editor = editor;
    this.obj.editor.weblet = this;
    this.obj.editor.save = function(nomodify)
    {
      this.output.value = this.xml_save("", this.editarea);
      if ( nomodify != true )
          this.weblet.eleMkClass(this.htmlfield, "modifyok", true, "modify");
      this.buttons.setModify(false);
      this.htmlfield.innerHTML = this.getContent();
      this.weblet.ok();
    }
    
    if ( this.obj.pendingobj != null )
    {
      this.setContent(this.obj.pendingobj, this.obj.pendinghtml);
      return;
    }

    if ( typeof this.obj.resizetext == 'string')
    {
      this.obj.editor.setContent(this.obj.resizetext);
      this.obj.resizetext = false;
    }
  }

  weblet.resetweblet = weblet.reset;
  weblet.reset = function()
  {
    if ( this.obj.editor != null )
      this.obj.editor.destructor();
    this.obj.editor = null;
    
    this.resetweblet();
  }
  
  weblet.isModifed = function()
  {
    try { return this.obj.editor.ismodifed; } catch(e) { return false }; 
  }
  
  weblet.setContent = function(datafield, htmlfield)
  {
    if ( this.obj.editor != null )
    {
      this.obj.editor.output = datafield;
      this.obj.editor.htmlfield = htmlfield;
      
      if ( datafield.value != '' )
      {
        MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : datafield.value, size : this.initpar.ewidth } )
        this.obj.editor.setContent(this.req.responseText);
        this.obj.editor.findLastChar();
        this.obj.editor.win.focus();
      }
      else
      {
        this.obj.editor.setContent('');
        this.obj.editor.findLastChar();
        this.obj.editor.win.focus();
      }
      this.obj.pendingobj = null;
    }
    else
      this.obj.pendingobj = datafield;
      this.obj.pendinghtml = htmlfield;
  }

  weblet.showValue = function(weblet, param)
  {
    if ( weblet == null ) return;
    this.setContent(param.datafield, param.htmlfield);
  }

  weblet.ok = function(setdepend)
  {
    if ( typeof this.onbtnobj != null )
    {
      this.onbtnobj.onbtnclick('rte', null);
    }

    if ( typeof this.popup != 'undefined' && this.popup != null )
      this.popup.hidden();
  }

  weblet.fullscreen = function(button, frame)
  {
    this.obj.resizetext = this.obj.editor.getContent();
    return MneAjaxWeblet.prototype.fullscreen.call(this, button, frame);
  };

weblet.wresize = function()
  {
    var e = weblet.eleGetById(weblet.frame, "editor");
    
    if ( e != null )
    {
      var h = this.origframe.offsetHeight - this.posGetTop(e, this.origframe) - 28;
      if ( h < this.initpar.eheight ) h = this.initpar.eheight;
      e.style.height = h + "px";
      
      weblet.obj.editor_win.resize();
    }
  };
  
  {
    var self = weblet;
    window.setTimeout(function() { if ( typeof self.popup == 'undefined' && self.popup == null ) self.wresize(); },200);
  }

}