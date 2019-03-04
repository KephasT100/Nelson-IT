// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: shipment/invoice/conditions
// ================================================================================
{
  weblet.loadClass("MneMisc", "basic/mne_amsic.js");
  weblet.loadClass("MneEditor", "editor/mne_editor.js");
  weblet.loadCss('all.css', '/styles/editor');
  
  weblet.loadview();

  var ivalues = 
  {
    schema     : 'mne_shipment',
    table      : 'invoicecond',
    ewidth     : '570', /* etwa A4 */
    eheight    : '200'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  var attr = 
  {
      hinput : false,
      editor       : { 'style.width' : this.initpar.ewidth + "px", 'style.height' : this.initpar.eheight + "px" }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.obj.enablebuttons = ["del"];
  
  weblet.showids = new Array("invoicecondid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Rechnungskonditionen hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Rechnungskonditionen bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Rechnungskonditionen <$1> wirklich löschen");
  weblet.titleString.delid = 'description';

  weblet.obj.editor = new MneEditor(weblet.win, weblet.frame.querySelector("#editor"), weblet.frame.querySelector("#editorbuttons"));
  
  weblet.obj.editor.parameter.mne_ajax = true;
  weblet.obj.editor.parameter.nohtml   = true;
  
  weblet.obj.editor.plugins[weblet.obj.editor.plugins.length] = { name: "Xml",        line: 1, output : weblet.obj.inputs.text };
  weblet.obj.editor.plugins[weblet.obj.editor.plugins.length] = { name: "Save",       line: 1, pos : 0 };
  weblet.obj.editor.plugins[weblet.obj.editor.plugins.length] = { name: "Clipboard",  line: 1, pos : 0 };
  weblet.obj.editor.plugins[weblet.obj.editor.plugins.length] = { name: "Table",      line: 1 };
  weblet.obj.editor.show(function(editor){weblet.editor_loadready(editor); });
    
  weblet.editor_loadready = function(editor)
  {
    window[this.obj.editor.eframe] = editor;
    if ( typeof this.obj.pendingtext == 'string')
    {
      if ( this.obj.pendingtext == '' ) editor.setContent('');
      else
      {
        MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : this.obj.pendingtext, size : weblet.initpar.ewidth } )
        window[this.obj.editor.eframe].setContent(this.req.responseText);
      }
      this.obj.pendingtext = false;
    }
  }

  weblet.reset = function()
  {
    if ( window[this.obj.editor.eframe] != null )
      window[this.obj.editor.eframe].destructor();
    
    window[this.obj.editor.eframe] = null;
    MneAjaxWeblet.prototype.reset.call(this);
  }
  
  weblet.setContent = function(text)
  {
    if ( typeof window[this.obj.editor.eframe] != 'undefined' && window[this.obj.editor.eframe] != null && typeof window[this.obj.editor.eframe].setContent == 'function')
    {
      MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : text, size : weblet.initpar.ewidth } )
      window[this.obj.editor.eframe].setContent(this.req.responseText);
    }
    else
      this.obj.pendingtext = text;
  }

  weblet.showValue = function(weblet)
  {
    this.enable();
    if ( weblet == null || typeof weblet.act_values.invoicecondid == 'undefined')
    {
      MneAjaxWeblet.prototype.add.call(this);
      if ( weblet != null && typeof weblet.act_values.invoicedescription != 'undefined')
      {
        this.showInput( this.obj.inputs.category, "#mne_lang#Individuell", null, true);
        this.showInput( this.obj.inputs.description, weblet.act_values.invoicedescription, null, true);
      }
      return;
    }
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
    if ( this.obj.inputs.invoicecondid.value.indexOf("std") != -1 ) this.disable();
    
    if ( weblet != null )
      this.setContent(this.obj.inputs.text.value);
  }
  
  weblet.checkmodified = function()
  {
    var result = MneAjaxWeblet.prototype.checkmodified.call(this);
    if ( window[this.obj.editor.eframe] != null ) result = result || window[this.obj.editor.eframe].ismodifed;
    return result;
  }

  weblet.add = function()
  {
    var modified = this.checkmodified();
    var retval = MneAjaxWeblet.prototype.add.call(this);
    if ( ! modified )
    {
      this.enable();
      this.setContent('');
    }
    return retval;
  }

  weblet.ok = function()
  {
    window[this.obj.editor.eframe].save();
    return MneAjaxWeblet.prototype.ok.call(this);
  }
  
  
  weblet.cancel = function()
  {
    if ( typeof this.act_values.invoicecondid == 'undefined' || this.act_values.invoicecondid == null || this.act_values.invoicecondid == '################' )
      return this.add();

    MneAjaxWeblet.prototype.cancel.call(this);
    this.setContent(this.obj.inputs.text.value);
    
    return false;
    
  }
  
  weblet.del = function()
  {
    if ( this.obj.inputs.invoicecondid.value.indexOf("std") != -1 )
    {
      this.error("#mne_lang#Standarttexte können nicht gelöscht werden");
      return true;
    }
    
    return MneAjaxWeblet.prototype.del.call(this);
  } 
  
  weblet.wresize = function()
  {
    var e = weblet.eleGetById(weblet.frame, "editor");
    
    if ( e != null )
    {
      var h = this.origframe.offsetHeight - this.posGetTop(e, this.origframe) - this.posGetHeight(this.frame.querySelector('#modifyinfo')) - 28;
      if ( h < this.initpar.eheight ) h = this.initpar.eheight;
      e.style.height = h + "px";
      
      weblet.obj.editor.resize();
    }
  };
  
  {
    var self = weblet;
    window.setTimeout(function() { if ( typeof self.popup == 'undefined' && self.popup == null ) self.wresize(); },200);
  }

}
