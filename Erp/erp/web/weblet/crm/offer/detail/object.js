// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/offer/detail
// ================================================================================
{
  weblet.loadClass("MneEditor", "editor/mne_editor.js");
  weblet.loadCss('all.css', '/styles/editor');
  weblet.loadCss('crm.css');

  var ivalues = 
  {
      schema : 'mne_crm',
      query : 'offer_detail',
      ewidth : '570', /* ist etwa a4 */
      eheight : '350',
      report : 'mne_offerdetail',

      okfunction : 'offer_ok',
      copyfunction : 'offer_copy',
      addfunction : 'offer_add',
      delfunction : 'offer_del',
      fixfunction : 'offer_fix',
      calcfunction : 'offerproduct_calculate',
      stdfunction : 'offerproduct_standard',
      orderfunction : 'offer_order',

      orderweblet   : 'crm_order',
      orderselect   : 'detail',

      companyweblet   : 'crm_company',
      companyselect   : 'all',
      
      personweblet   : 'crm_person',
      personselect   : 'all',

      view2 : false
        
 };


  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview(null, this.path + ( ( weblet.initpar.view2 ) ? '/view2.html' : '/view1.html') );
  weblet.eleMkClass(weblet.origframe, "haveeditor" );
 
 var attr = 
  {
      hinput : false,
      editor       : { 'style.width' : this.initpar.ewidth + "px", 'style.height' : this.initpar.eheight + "px" },
      detailButton : { checked : weblet.initpar.view2 }
  }

  weblet.findIO(attr);
  weblet.showLabel();
  
  weblet.obj.mkbuttons.push( { id : "version", value : weblet.txtGetText("#mne_lang#neue Version#"), space : 'before' });
  weblet.obj.mkbuttons.push( { id : "copy", value : weblet.txtGetText("#mne_lang#Angebot kopieren#",) });
  weblet.obj.mkbuttons.push( { id : "oadd", value : weblet.txtGetText("#mne_lang#Angebot hinzufügen#") });
  weblet.obj.mkbuttons.push( { id : "calculate", value : weblet.txtGetText("#mne_lang#Kosten berechnen#") , space : 'before' });
  weblet.obj.mkbuttons.push( { id : "standard", value : weblet.txtGetText("#mne_lang#Produktstandard übernehmen#") });
  weblet.obj.mkbuttons.push( { id : "order", value : weblet.txtGetText("#mne_lang#Auftrag#"), space : 'before' });

  weblet.showids = new Array("offerid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Angebot hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Angebot bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Angebot <$1> wirklich löschen");
  weblet.titleString.delid = 'description';
  weblet.titleString.order = weblet.txtGetText("#mne_lang#Angebot <$1> wirklich zu einem Auftrag machen");
  weblet.titleString.orderid = 'description';
  

  weblet.obj.editor = null;
  if ( weblet.initpar.view2 )
  {
    weblet.obj.editor_win = new MneEditor(weblet.win, weblet.frame.querySelector("#editor"), weblet.frame.querySelector("#editorbuttons"));

    weblet.obj.editor_win.parameter.mne_ajax = true;
    weblet.obj.editor_win.parameter.nohtml   = true;

    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Xml",        line: 1, output : weblet.obj.inputs.text };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Save",       line: 1, pos : 0 };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Clipboard",  line: 1, pos : 0 };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Itemize",    line: 1 };
    weblet.obj.editor_win.plugins[weblet.obj.editor_win.plugins.length] = { name: "Table",      line: 1 };
    weblet.obj.editor_win.show(function(editor){weblet.editor_loadready(editor); });
  }
  
  weblet.defvalues =
  {
      ownerid : weblet.win.mne_config.personid,
    ownername : weblet.win.mne_config.fullname,
     language : weblet.win.mne_config.language
  }

  weblet.loadbuttons = function ()
  {
    MneAjaxWeblet.prototype.loadbuttons.call(this);
    this.obj.buttons.version.needrefresh = true;
  }
 
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
      MneAjax.prototype.load.call(this, "/xmltext/html.html", { xmltext : text, size : weblet.initpar.ewidth } )
      this.obj.editor.setContent(this.req.responseText);
    }
    else
      this.obj.pendingtext = text;
  }

  weblet.showValue = function(weblet, param)
  {
    
    MneAjaxWeblet.prototype.showValue.call(this,weblet,param);
    if (weblet != null) this.setContent(this.obj.inputs.text.value);

    this.obj.buttons.version.disabled   = this.act_values.probability == 100 || this.act_values.probability == 0;
    this.obj.buttons.oadd.disabled      = this.act_values.probability == 100 || this.act_values.probability == 0;
    this.obj.buttons.copy.disabled      = this.act_values.probability == 100 || this.act_values.probability == 0;
    this.obj.buttons.order.disabled     = this.act_values.probability == 100 || this.act_values.probability == 0;;
    this.obj.buttons.calculate.disabled = this.act_values.probability == 100 || this.act_values.probability == 0;
    this.obj.buttons.standard.disabled  = this.act_values.probability == 100 || this.act_values.probability == 0;
  }
  
  weblet.checkmodified = function()
  {
    var result = MneAjaxWeblet.prototype.checkmodified.call(this);
    if ( this.obj.editor != null ) result = result || this.obj.editor.ismodifed;
    return result;
  }
 
  weblet.add = function()
  {
    var modifyed = this.checkmodified();
    var result = MneAjaxWeblet.prototype.add.call(this);

    if ( ! modifyed )
    {
      this.setContent('');
      this.obj.buttons.oadd.disabled = true;
      this.obj.buttons.copy.disabled = true;
      this.obj.buttons.version.disabled = true;
      this.obj.buttons.order.disabled = true;
      this.obj.buttons.calculate.disabled = true;
      this.obj.buttons.standard.disabled = true;
    }

    return result;
  }
  
  weblet.ok = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name   : this.initpar.okfunction,
        sqlend : 1   
    };

    if ( weblet.initpar.view2 )
      this.obj.editor.save();
    
    p = this.addParam(p, "par0",  this.obj.inputs.offerid );
    p = this.addParam(p, "par1",  this.obj.inputs.ownerid );
    p = this.addParam(p, "par2",  this.obj.inputs.contactid );
    p = this.addParam(p, "par3",  this.obj.inputs.refid );
    p = this.addParam(p, "par4",  this.obj.inputs.offernumber );
    p = this.addParam(p, "par5",  this.obj.inputs.version );
    p = this.addParam(p, "par6",  this.obj.inputs.description );
    p = this.addParam(p, "par7",  this.obj.inputs.text );
    p = this.addParam(p, "par8",  this.obj.inputs.language );
    p = this.addParam(p, "par9", this.obj.inputs.withvat );
    p = this.addParam(p, "par10", this.obj.inputs.lumpsum );


    p = this.addParam(p, "typ5",  "long" );
    p = this.addParam(p, "typ9",  "long" );
    p = this.addParam(p, "typ10", "long" );
    
    return MneAjaxWeblet.prototype.func.call(this, p, "offerid", true);
  }
  
  
  weblet.cancel = function()
  {
    if ( typeof this.act_values.offerid == 'undefined' || this.act_values.offerid == null || this.act_values.offerid == '################' )
      return this.add();

    MneAjaxWeblet.prototype.cancel.call(this);
    this.setContent(this.obj.inputs.text.value);    
    return false;
    
  }
  
  weblet.del = function(setdepend)
  {
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values[this.titleString.delid])) != true )
      return false;

    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        par0 : this.act_values.offerid,
        typ0 : "text",
        sqlend : 1   
    }
 
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.add();
      return false;
    }
    
    return true;
  }
  
  weblet.print = function()
  {
    if ( weblet.initpar.view2 )
      this.obj.editor.save();
    
    var p =
    {
        wval : this.act_values.offerid,
        wop  : "=",
        wcol : 'offerid',
        sort : '',
        language : this.obj.inputs.language.value,
        macro0 : 'havelettercontent,0',
        sqlend : 1
    };
    
    if ( this.initpar.view2 )
    {
      p.xml0 = "lettercontent," + this.obj.inputs.text.value;
      p.macro0 = 'havelettercontent,1';
      
      if ( this.act_values.text != this.obj.inputs.text.value )
        p.macro1 = 'watermark,' + this.txtGetText('#mne_lang#Entwurf');
    }
    
    MneAjaxWeblet.prototype.print.call(this,p);
    return false;
  }
  
  weblet.version = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.copyfunction,
        par0 : this.act_values.offerid,
        typ0 : "text",
        sqlend : 1   
    }
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.act_values.offerid = this.act_values.result;
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }
  
  weblet.copy = function()
  {
    var act_values = this.act_values;
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.copyfunction,
        par0 : this.act_values.offerid,
        typ0 : "text",
        rollback : true
    }

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.act_values.offerid = this.act_values.result;
      this.showValue(this, { sqlend : ''} );
      this.showInput("description", "#mne_lang#Kopie von " + act_values.description, null, true);
      this.showInput("version", 1, null, true);
      this.showInput("offernumber", "#mne_lang#Kopie von " + act_values.offernumber, null, true);
      if ( this.ok() == true ) 
      {
        this.add();
        return true;
      };
      return false;
    }
    return true;
  }

  weblet.oadd = function()
  {
    this.parent.popups[this.id + 'addselect'].show();
    this.parent.popups[this.id + 'addselect'].weblet.onbtnobj = this;
    return false;
  }
  
  weblet.refname = function () 
  {
    if ( this.act_values.refid != '' )
    {
      var w = this.parent;
      if ( this.act_values.refiscompany == '1' ) 
      {
        var val = { companyid : this.act_values.refid };
        w.show(this.initpar.companyweblet);
        w.subweblets[this.initpar.companyselect].setValue(val);
      }
      else
      {
        var val = { personid : this.act_values.refid };
        w.show(this.initpar.personweblet);
        w.subweblets[this.initpar.personselect].setValue(val);
      }
      return false;
    }
    return false;
  }

 weblet.onbtnok = function(button)
  {
    if ( button.weblet == this.parent.subweblets[this.id + 'addselect'])
    {
      var p =
      {
          schema : this.initpar.schema,
          name : this.initpar.addfunction,
          par0 : this.act_values.offerid,
          typ0 : "text",
          par1 : button.weblet.act_values.offerid,
          typ1 : "text",
          sqlend : 1   
      }
      if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
      {
        this.showValue(this);
        this.setDepends("showValue");
        return false;
      }
      return true;
    }
    else
      MneAjaxWeblet.prototype.onbtnok.call(this,button);
  }
    
  weblet.calculate = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.calcfunction,
        par0 : this.act_values.offerid,
        typ0 : "text",
        par1 : "null",
        typ1 : "long",
        sqlend : 1   
    }

    if ( this.confirm("#mne_lang#Wirklich alle manuell veränderten Kosten der Produkte überschreiben?" ) != true )
      return false;

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }
  weblet.standard = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.stdfunction,
        par0 : this.act_values.offerid,
        typ0 : "text",
        sqlend : 1   
    }
    
    if ( this.confirm("#mne_lang#Wirklich alle indiduellen Einstellungen der Produkte überschreiben?" ) != true )
      return false;
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }

  weblet.order = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.orderfunction,
        par0 : this.act_values.offerid,
        typ0 : "text",
        sqlend : 1   
    }
 
    if ( this.confirm(this.txtSprintf(this.titleString.order, this.act_values[this.titleString.orderid])) != true )
      return false;

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      var w = this.parent;
      var s;
      
      var result = this.act_values.result;
      w.show(weblet.initpar.orderweblet);
      s = w.subweblets[weblet.initpar.orderselect].showValue( { act_values : { orderid :  result }} );
    }
    return true;

  }
  
  weblet.fullscreen = function(button, frame)
  {
    if ( weblet.initpar.view2 )
      this.obj.resizetext = this.obj.editor.getContent();
    return MneAjaxWeblet.prototype.fullscreen.call(this, button, frame);
  }

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
