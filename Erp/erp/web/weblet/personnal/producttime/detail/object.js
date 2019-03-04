// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/producttime/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_personnal',
    query     : 'producttime',
    table     : 'producttime',
    
    okfunction : 'producttime_ok',
    delfunction : 'producttime_del',
    
    ewidth  : '570', /* ist etwa a4 */
    eheight : '200'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();
  weblet.eleMkClass(weblet.origframe, "haveeditor" );

  var attr = 
  {
      hinput : false,
      durationInput    : { inputtyp : "time" },
      nameOutput       : { notclear : true },
      productidInput   : { notclear : true },
      skillidInput     : { notclear : true },
      editor           : { 'style.width' : this.initpar.ewidth + "px", 'style.height' : this.initpar.eheight + "px" }
  }
  
  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("producttimeid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Bearbeitungsschritt hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Bearbeitungsschritt bearbeiten");
       
  weblet.obj.editor = null;
  weblet.obj.editor_win = new MneEditor(weblet.win, weblet.frame.querySelector("#editor"), weblet.frame.querySelector("#editorbuttons"));

  weblet.obj.editor_win.parameter.mne_ajax = true;
  weblet.obj.editor_win.parameter.nohtml   = true;

  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Xml",        line: 1, output : weblet.obj.inputs.longdesc };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Save",       line: 1, pos : 0 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Clipboard",  line: 1, pos : 0 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Itemize",    line: 1 };
  weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Table",      line: 1 };
  weblet.obj.editor_win.show(function(editor){weblet.editor_loadready(editor); });

  weblet.editor_loadready = function(editor)
  {
    this.obj.editor = editor;
    if ( typeof this.obj.pendingtext == 'string')
    {
      if ( this.obj.pendingtext == '' ) this.obj.editor.setContent('');
      else
      {
        MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : this.obj.pendingtext, size : weblet.initpar.ewidth } )
        this.obj.editor.setContent(this.req.responseText);
      }
      this.obj.pendingtext = false;
    }
    
    if ( typeof this.obj.resizetext == 'string')
    {
      this.obj.editor.setContent(this.obj.resizetext);
      this.obj.resizetext = false;
    }
  }

  weblet.reset = function()
  {
    if ( this.obj.editor != null )
      this.obj.editor.destructor();
    this.obj.editor = null;
    
    MneAjaxWeblet.prototype.reset.call(this);
  }
  
  weblet.setContent = function(text)
  {
    if ( this.obj.editor != null )
    {
      if ( text != '' )
      {
        MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : text, size : weblet.initpar.ewidth } )
        this.obj.editor.setContent(this.req.responseText);
      }
      else
        {
        this.obj.editor.setContent('');
        }
    }
    else
      this.obj.pendingtext = text;
  }
  
  weblet.showValue = function(weblet)
  {
    if ( weblet == null ) return;
    
    if ( typeof weblet.act_values.producttimeid == 'undefined' || weblet.act_values.producttimeid == null )
    {
      if ( typeof weblet.act_values.productid == 'undefined' || weblet.act_values.productid == null || weblet.act_values.productid == '################' )
      {
        alert("#mne_lang#Kein Produkt ausgewählt");
        return false;
      }
      
      this.add();
      this.setContent("");
      this.obj.inputs.productid.value = weblet.act_values.productid;
      this.showOutput(this.obj.outputs.name, weblet.act_values.name, this.typs[this.ids['name']])
      return true;
    }
    
    MneAjaxWeblet.prototype.showValue.call(this, weblet);
    this.setContent(this.obj.inputs.longdesc.value);
  }

  weblet.ok = function(setdepend)
  {
    this.obj.editor.save();
    
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.okfunction,
        typ0 : "text",
        typ1 : "text",
        typ2 : "text",
        typ3 : "long",
        typ4 : "long",
        typ5 : "text",
        typ6 : "text",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.producttimeid);
    p = this.addParam(p, "par1", this.obj.inputs.productid);
    p = this.addParam(p, "par2", this.obj.inputs.skillid);
    p = this.addParam(p, "par3", this.obj.inputs.duration);
    p = this.addParam(p, "par4", this.obj.inputs.step);
    p = this.addParam(p, "par5", this.obj.inputs.description);
    p = this.addParam(p, "par6", this.obj.inputs.longdesc);

    return MneAjaxWeblet.prototype.func.call(this, p, 'producttimeid', setdepend);
  }

  weblet.checkmodified = function()
  {
    var result = MneAjaxWeblet.prototype.checkmodified.call(this);
    if ( this.obj.editor != null ) result = result || this.obj.editor.ismodifed;
    return result;
  }
  
  weblet.add = function()
  {
    var modify = this.checkmodified();
    var result = MneAjaxWeblet.prototype.add.call(this);
    if ( ! modify ) this.setContent('');
    return result;
  }

  weblet.cancel = function()
  {
    var result = MneAjaxWeblet.prototype.cancel.call(this);
    this.setContent(this.act_values.longdesc);
    return result;
  }

  weblet.del = function(setdepend)
  {
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values[this.titleString.delid])) != true )
      return false;

    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.producttimeid);

    return MneAjaxWeblet.prototype.func.call(this, p, null, setdepend);
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
      var h = this.origframe.offsetHeight - this.posGetTop(e, this.origframe) - this.posGetHeight(this.frame.querySelector('#modifyinfo')) - 28;
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
