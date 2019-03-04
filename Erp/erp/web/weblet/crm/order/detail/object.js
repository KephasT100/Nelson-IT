// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/order/detail
// ================================================================================
{
  var ivalues = 
  {
      schema : 'mne_crm',
      query  : 'order_detail',
      table  : "order",

      ewidth  : '570', /* ist etwa a4 */
      eheight : '400',

      report : 'mne_orderdetail',

      okschema   : 'mne_crm',
      okfunction : 'order_ok',

      delschema   : 'mne_crm',
      delfunction : 'order_del',
 
      deliverschema   : 'mne_crm',
      deliverfunction : 'order_deliver',

      docschema  : 'mne_crm',
      doctable   : 'file',

      deliverweblet   : 'shipment_deliverynote',
      deliverselect   : 'all',
      
      companyweblet   : 'crm_company',
      companyselect   : 'all',
      
      personweblet   : 'crm_person',
      personselect   : 'all',
      
      view2 : false
      
  }

  weblet.loadClass("MneEditor", "editor/mne_editor.js");
  weblet.loadCss('all.css', '/styles/editor');
  weblet.loadCss('crm.css');

  weblet.initDefaults(ivalues);
  weblet.loadview(null, this.path + ( ( weblet.initpar.view2 ) ? '/view2.html' : '/view1.html') );
  weblet.eleMkClass(weblet.origframe, "haveeditor" );

  var attr = 
  {
      hinput : false,
      editor       : { 'style.width' : this.initpar.ewidth + "px", 'style.height' : this.initpar.eheight + "px" },

      refidInput   : { inputcheckobject : "refname"},
      detailButton : { checked : weblet.initpar.view2 },
      colorInput   : { inputtyp : 'color', inputcheckobject : 'color', checktype : MneMisc.prototype.inChecktype.color }
  }

  weblet.findIO(attr);
  weblet.showLabel();
  
  weblet.obj.mkbuttons.push( { id : "send", value : weblet.txtGetText("#mne_lang#Versenden#"), space : 'before' });
  weblet.obj.mkbuttons.push( { id : "deliver", value : weblet.txtGetText("#mne_lang#Ausliefern#") });

  weblet.showids = new Array("orderid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Auftrag hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Auftrag bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Auftrag <$1> wirklich löschen");
  weblet.titleString.delid = 'description';

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
     language : weblet.win.mne_config.language,
      withvat : 1,
         open : 1
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

  weblet.showValue = function(weblet)
  {
    if ( weblet != null && typeof weblet.act_values.orderid != 'undefined' && weblet.act_values.orderid != null && weblet.act_values.orderid != '################' && weblet.act_values.orderid != '' )
    {
      MneAjaxWeblet.prototype.showValue.call(this,weblet);
      this.obj.buttons.ok.disable = false;
      this.setContent(this.obj.inputs.text.value);
    }
    else
      this.add()
      
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
      this.obj.buttons.ok.disable = true;
      this.setContent('');
    }

    return result;
  }
  

  weblet.ok = function()
  {
    var p =
    {
        schema : this.initpar.okschema,
        name   : this.initpar.okfunction,
        sqlend : 1   
    };

    if ( this.obj.inputs.language.value == '' ) this.obj.inputs.language.value = 'de';
    if ( weblet.initpar.view2 )
      this.obj.editor.save();

    p = this.addParam(p, "par0",  this.obj.inputs.orderid );
    p = this.addParam(p, "par1",  this.obj.inputs.ownerid );
    p = this.addParam(p, "par2",  this.obj.inputs.contactid );
    p = this.addParam(p, "par3",  this.obj.inputs.refid );
    p = this.addParam(p, "par4",  this.obj.inputs.ordernumber );
    p = this.addParam(p, "par5",  this.obj.inputs.description );
    p = this.addParam(p, "par6",  this.obj.inputs.text );
    p = this.addParam(p, "par7",  this.obj.inputs.language );
    p = this.addParam(p, "par8", this.obj.inputs.withvat );
    p = this.addParam(p, "par9", this.obj.inputs.lumpsum );
    p = this.addParam(p, "par10", this.obj.inputs.open );
    p = this.addParam(p, "par11", this.obj.inputs.closed );
    p = this.addParam(p, "par12", this.obj.inputs.color );

    p = this.addParam(p, "typ8",  "long" );
    p = this.addParam(p, "typ9",  "long" );
    p = this.addParam(p, "typ10", "bool" );
    p = this.addParam(p, "typ11", "bool" );

    return MneAjaxWeblet.prototype.func.call(this, p, "orderid", true);
  }
  
  
  weblet.cancel = function()
  {
    if ( typeof this.act_values.orderid == 'undefined' || this.act_values.orderid == null || this.act_values.orderid == '################' )
      return this.add();

    MneAjaxWeblet.prototype.cancel.call(this);
    this.setContent(this.obj.inputs.text.value);
    
    return false;
    
  }
  
  weblet.del = function(setdepend)
  {
    var i;
    
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values[this.titleString.delid])) != true )
      return false;

      var p =
      {
          schema : this.initpar.delschema,
          name : this.initpar.delfunction,
          par0 : this.act_values.orderid,
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
    if ( this.initpar.view2 ) this.obj.editor.save();
    
    var p =
    {
        wval : this.act_values.orderid,
        wop  : "=",
        wcol : 'orderid',
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
  
  weblet.send = function()
  {
    
    if ( this.act_values.text != this.obj.inputs.text.value )
      this.error('#mne_lang#Zum Versenden muss der Auftrag gespeichert sein');

    var p =
    {
        wval : this.act_values.orderid,
        wop  : "=",
        wcol : 'orderid',
        sort : '',
        language : this.obj.inputs.language.value,
        macro0 : 'havelettercontent,0',
        base64 : '1',
        sqlend : 1
    };
    
    var w = new MneAjaxData(this.win);
    var val = w.load('report/' + this.initpar.report + ".pdf",p);
    
    if ( val.substr(0,5) != 'JVBER')
    {
      this.error("#mne_lang#Fehler während des Druckens gefunden#\n" + val);
      return true;
    }

    var d = this.txtToDate.call(this, (new Date()).getTime() / 1000);
    var p = 
    {
        schema : this.initpar.docschema,
        table  : this.initpar.doctable,

        fileidInput      : '################',
        refidInput       : this.obj.inputs.refid.value,
        secondrefidInput : this.act_values.orderid,
        typInput         : 'letter',
        datatypeInput    : 'application/pdf',
        authorInput      : this.win.mne_config.username,
        nameInput        : '#mne_lang#Auftragsbestätigung vom# ' + d,
        descriptionInput : '#mne_lang#Auftragsbestätigung vom# ' + d,
        uidInput         : this.obj.inputs.orderid.value,
        dataInput        : val,
        sqlend           : '1'
    };

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    
    if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/insert.xml",  p ) == 'ok' )
    {
      this.obj.buttons.send.disabled = true;
      this.act_values.send = '#mne_lang#wahr';
      this.setDepends('send');
      return this.print();
    }
    
    return true;
  };

  weblet.deliver = function()
  {
    var p =
    {
        schema : this.initpar.deliverschema,
        name : this.initpar.deliverfunction,
        par0 : this.act_values.orderid,
        typ0 : "text",
        sqlend : 1   
    }
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      var w = this.parent;
      var result = this.act_values.result;
      if ( this.win.mne_config.group.erpshipment == true )
      {
        w.show(weblet.initpar.deliverweblet);
        w.subweblets[weblet.initpar.deliverselect].setValue("deliverynoteid : '" + result + "'");
      }
      return false;
    }

    return true;
  }
  
  weblet.detail = function()
  {
    this.reload = true;
    
    this.initpar.view2 = ! this.initpar.view2;
    this.initpar.noshowatload = true;
    
    var act_values = { orderid : this.act_values.orderid };
    
    this.load(this.id);
    this.showValue({ act_values : act_values });
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
