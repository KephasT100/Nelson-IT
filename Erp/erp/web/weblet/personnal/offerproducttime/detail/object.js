// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/offerproducttime/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_personnal',
    query     : 'offerproducttime',
    table     : 'offerproducttime',
    
    okfunction  : 'offerproducttime_ok',
    delfunction : 'offerproducttime_del',

    recalcschema   : 'mne_crm',
    recalcfunction : 'offerproduct_cost',
    
    producttimeoptschema : 'mne_personnal',
    producttimeoptquery : 'producttimeopt',
    
    ewidth  : '570', /* ist etwa a4 */
    eheight : '200'

  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  weblet.eleMkClass(weblet.origframe, "haveeditor" );

  var attr = 
  {
      hinput : false,

      setdurationInput :    { inputtyp : "time" , onblur : function() { this.weblet.showInput(this.weblet.obj.inputs.setdurationsum, this.mne_timevalue * this.weblet.act_values.count, 'interval') }, onreturn : function() { this.onblur() } },
      setdurationsumInput : { inputtyp : "time" , onblur : function() { this.weblet.showInput(this.weblet.obj.inputs.setduration, this.mne_timevalue / this.weblet.act_values.count, 'interval') }, onreturn : function() { this.onblur() } },
      
      offerproductidInput : { notclear : true, checktype : 'keyvalue', inputcheckobject : "productname" },
      productnameOutput   : { notclear : true },
      editor              : { 'style.width' : this.initpar.ewidth + "px", 'style.height' : this.initpar.eheight + "px" }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("offerproducttimeid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Bearbeitungsschritt hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Bearbeitungsschritt bearbeiten");
       
  weblet.defvalues = { skillid : 'special' };
  
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
    var i;
    
    if ( typeof this.obj.fire == 'object' && ( weblet == null || weblet.act_values.offerproducttimeid != this.act_values.offerproducttimeid) ) delete this.obj.fire;
    
    if ( weblet == null || typeof weblet.act_values.offerproducttimeid == 'undefined' || weblet.act_values.offerproducttimeid == null || weblet.act_values.offerproducttimeid == '' )
    {
      this.setContent("");
      this.add();
      
      if ( weblet != null )
      {
        this.act_values.offerid = weblet.act_values.offerid;

        if ( typeof weblet.act_values.offerproductid != 'undefined' )
        {
          this.showInput("offerproductid", weblet.act_values.offerproductid);
          this.showOutput("productname", weblet.act_values.productname, this.typs[this.ids['productname']]);

          this.showInputDefined (this.obj.inputs.step, weblet.act_values.step, this.typs[this.ids['step']], true);
          this.showInputDefined (this.obj.inputs.setduration, weblet.act_values.setduration, this.typs[this.ids['setduration']], true);
          this.showInputDefined (this.obj.inputs.skillid, weblet.act_values.skillid, this.typs[this.ids['skillid']], true);
          this.showInputDefined (this.obj.inputs.description, weblet.act_values.description, this.typs[this.ids['description']], true);
          this.showOutputDefined(this.obj.outputs.count, weblet.act_values.count, this.typs[this.ids['count']]);
          this.act_values.count = weblet.act_values.count;          
        }
        else
        {
          this.showInput("offerproductid", '', null, true);
          this.showOutput("productname", '', this.typs[this.ids['productname']], true);

          this.showInput (this.obj.inputs.step, '', this.typs[this.ids['step']], false);
          this.showInput (this.obj.inputs.setduration, 0, this.typs[this.ids['setduration']], true);
          this.showInput (this.obj.inputs.skillid, '', this.typs[this.ids['skillid']], true);
          this.showInput (this.obj.inputs.description, '', this.typs[this.ids['description']], true);
          this.showOutput(this.obj.outputs.count, 0, this.typs[this.ids['count']]);
          this.act_values.count = 0;
        }
      }
      return true;
    }

    MneAjaxWeblet.prototype.showValue.call(this,weblet);
    this.setContent(this.obj.inputs.longdesc.value);
  } 
  
  weblet.checkmodified = function()
  {
    var result = MneAjaxWeblet.prototype.checkmodified.call(this);
    if ( this.obj.editor != null ) result = result || this.obj.editor.ismodifed;
    return result;
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

    p = this.addParam(p, "par0", this.obj.inputs.offerproducttimeid);
    p = this.addParam(p, "par1", this.obj.inputs.offerproductid);
    p = this.addParam(p, "par2", this.obj.inputs.skillid);
    p = this.addParam(p, "par3", this.obj.inputs.setduration);
    p = this.addParam(p, "par4", this.obj.inputs.step);
    p = this.addParam(p, "par5", this.obj.inputs.description);
    p = this.addParam(p, "par6", this.obj.inputs.longdesc);

    var result = MneAjaxWeblet.prototype.func.call(this, p, 'offerproducttimeid', setdepend);

    if ( result == false && this.inputlist != null && this.inputlist.element == 'step' && typeof this.obj.fire != 'undefined' && this.obj.fire.ele == this.inputlist_data['step']['button'] )
      MneDocEvents.prototype.fireEvent.call( this, this.inputlist_data['step']['button'], 'click');
    
    return result;
  }
  
  weblet.del = function(setdepend)
  {
    
    if ( typeof this.obj.fire != undefined ) delete this.obj.fire;

    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values[this.titleString.delid])) != true )
      return false;

    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        typ0 : "text",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.offerproducttimeid);

    return MneAjaxWeblet.prototype.func.call(this, p, null, setdepend );
  }

  weblet.onbtnok = function(button)
  {
    if ( this.inputlist != null && this.inputlist.element == 'step' )
    {
      if ( typeof this.obj.fire != 'undefined' && this.obj.fire.ele == this.inputlist_data['step']['button'] )
      {
        button.weblet.initpar.notclose = true;
        if ( typeof this.onbtnobj != 'undefined' && this.onbtnobj != null ) this.onbtnobj.initpar.notclose = true;
        this.add();
      }
      else
      {
        button.weblet.initpar.notclose = false;
        if ( typeof this.onbtnobj != 'undefined' && this.onbtnobj != null ) this.onbtnobj.initpar.notclose = false;
      }
    }
    else if ( typeof this.onbtnobj != 'undefined' && this.onbtnobj != null ) this.onbtnobj.initpar.notclose = false;

    return MneAjaxWeblet.prototype.onbtnok.call(this,button);
  }

  weblet.onbtnclick = function(id, button)
  {

    if ( typeof this.inputlist == 'undefined' || this.inputlist == null || id != 'ok' )
    {
      if ( typeof this.obj.fire != undefined ) delete this.obj.fire;
      return;
    }

    if ( this.inputlist.element == 'productname' && this.obj.inputs.productoptid.value != ''  )
    {
     var ajax = new MneAjaxData(this.win);
     var param =
      {
          "schema" : weblet.initpar.producttimeoptschema,
          "query"  : weblet.initpar.producttimeoptquery,
          "cols"   : "producttimeid",
          "productidInput.old" : this.obj.inputs.productoptid.value,
          "sqlend" : 1
      };

      ajax.read("/db/utils/query/data.xml",  param);
      
      if ( ajax.values.length > 0 && typeof this.inputlist_data['step'] == 'object' )
      {
        MneDocEvents.prototype.fireEvent.call( this, this.inputlist_data['step']['button'], 'click');
        return;
      }
    }
    else if ( this.inputlist.element == 'step' )
    {
        return;
    }
    
    if ( typeof this.obj.fire != 'undefined' ) delete this.obj.fire;
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
