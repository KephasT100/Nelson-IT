// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/purchase/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'purchase',
    
    okfunction   : 'purchase_ok',
    delfunction  : 'purchase_del',
    sendfunction : 'purchase_send',
    deliveredfunction : 'purchase_delivered',
    
    report       : 'mne_warehouse_purchase',
    reportsingle : 'mne_warehouse_purchase_single',
    
    orderpartschema : 'mne_warehouse',
    orderpartquery : 'orderproductpart'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();

  weblet.obj.mkbuttons.push( { id: "printsingle", value : weblet.txtGetText("#mne_lang#Einzeldruck#"), space : "before" });
  weblet.obj.mkbuttons.push( { id: "send", value : weblet.txtGetText("#mne_lang#Versenden#") });
  weblet.obj.mkbuttons.push( { id: "sendsingle", value : weblet.txtGetText("#mne_lang#Einzeln versenden#") });

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      vendorordernumberInput : { readOnly : true, onkeyup : function() {} },
      partidInput            : { inputcheckobject : 'partname'},
      partvendoridInput      : { inputcheckobject : 'vendorname' },
      expectedInput          : { inputtyp : 'date' },
      owneridInput           : { inputcheckobject : 'ownername'}
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.obj.enablebuttons = { "send" : weblet.obj.buttons.send,  "sendsingle" : weblet.obj.buttons.sendsingle, "print" : weblet.obj.buttons.print, "printsingle" : weblet.obj.buttons.printsingle };

  weblet.obj.inputs.count.onmodify_save = weblet.obj.inputs.count.onmodify;
  weblet.obj.inputs.count.onmodify = function(modify)
  {
    if ( typeof this.onmodify_save == 'function' ) this.onmodify_save(modify);
    if ( this.weblet.obj.outputs.packagesize.innerHTML != "")
      this.weblet.showOutput(this.weblet.obj.outputs.rescount, parseInt(this.weblet.obj.outputs.packagesize.innerHTML) * this.weblet.obj.inputs.count.value);
  }

  weblet.showids = new Array("purchaseid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Teil zu einer Bestellung hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Teil einer Bestellung bearbeiten");
  
  weblet.defvalues = { ownerid : weblet.win.mne_config.personid, ownername : weblet.win.mne_config.fullname };
  
  weblet.onhidden = function()
  {
 
    if ( typeof this.act_values.purchaseid != 'undefined' && this.act_values.purchaseid != '' && this.act_values.purchaseid != '################' )
    {
      if ( this.initpar.autosend != true || this.act_values.orderdate != '' || this.confirm(this.txtSprintf('#mne_lang#Soll die Bestellung jetzt versendet werden ?')) != true )
        return;

      this.sendsingle();
    }    
    MneAjaxWeblet.prototype.onhidden.call(this);

  }
  weblet.showValue = function(weblet)
  {
    var result;
    var values;
    
    if ( weblet == null )
    {
      this.add();
      return false;
    }
    
    values = weblet.act_values;
    
    if ( typeof weblet.act_values.purchaseid == 'undefined' || weblet.act_values.purchaseid == '' || weblet.act_values.purchaseid == '################' )
    {
      this.add();
      if ( typeof weblet.act_values.partid != 'undefined' &&  weblet.act_values.partid != '' && weblet.act_values.partid != '################')
      {
        this.act_values.partid = values.partid;
        this.showInput(this.obj.inputs.partid, values.partid, this.typs[this.ids['partid']], true);
        this.showOutput(this.obj.outputs.partname, values.partname, this.typs[this.ids['partname']], false);
        this.showOutput(this.obj.outputs.rescount, values.count, this.typs[this.ids['rescount']], true);
      }
      
      return true;
    }

    result = MneAjaxWeblet.prototype.showValue.call(this,weblet);
    
    this.disable();

    this.obj.buttons['print'].disabled = false;
    this.obj.buttons['printsingle'].disabled = false;

    if ( this.act_values.orderdate == '' )
    {
      this.obj.buttons['send'].disabled = false;
      this.obj.buttons['sendsingle'].disabled = false;      
    }
    
    if ( this.act_values.ownerid == '' )
    {
      this.showInputDefined("ownerid", window.mne_config.personid);
      this.showOutputDefined("ownername", window.mne_config.fullname);
    }
    
    return result;
  }    

  weblet.add = function(setdepend)
  {
    var modify = this.checkmodified(); 
    var result = MneAjaxWeblet.prototype.add.call(this,setdepend);
    if ( ! modify )
    {
      this.act_values.partid = this.obj.inputs.partid.value = '';
      this.disable();
    }
    return result;
  }
  
  weblet.cancel = function()
  {
    var result = MneAjaxWeblet.prototype.cancel.call(this);
    if ( this.act_values.ownerid == '' )
    {
      this.showInputDefined("ownerid", window.mne_config.personid);
      this.showOutputDefined("ownername", window.mne_config.fullname);
    }
    return result;
  }

  weblet.ok = function(setdepend)
  {
    var result;
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

    p = this.addParam(p, "par0", this.obj.inputs.purchaseid);
    p = this.addParam(p, "par1", this.obj.inputs.partid);
    p = this.addParam(p, "par2", this.obj.inputs.partvendorid);
    p = this.addParam(p, "par3", this.obj.inputs.count);
    p = this.addParam(p, "par4", this.obj.inputs.expected);
    p = this.addParam(p, "par5", this.obj.inputs.ownerid);
    p = this.addParam(p, "par6", this.obj.inputs.crmorderid);

    result = MneAjaxWeblet.prototype.func.call(this, p, 'purchaseid', setdepend);
    
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
        typ0 : "text",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.purchaseid);

    return MneAjaxWeblet.prototype.func.call(this, p, null, setdepend, "del");
  }

  weblet.sendsingle = function(setdepend)
  {
    var result;
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.sendfunction,
        typ0 : "text",
        typ1 : "bool",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.purchaseid);
    p = this.addParam(p, "par1", "true");

    result = MneAjaxWeblet.prototype.func.call(this, p, "purchaseid", setdepend, "send");
    this.print();
    
    return result;
  }

  weblet.send = function(setdepend)
  {
    var result;
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.sendfunction,
        typ0 : "text",
        typ1 : "bool",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.purchaseid);
    p = this.addParam(p, "par1", "false");

    result = MneAjaxWeblet.prototype.func.call(this, p, "purchaseid", setdepend, "send");
    this.print();
    
    return result;
  }

  weblet.printsingle = function()
  {
    var report = this.initpar.reportsingle;
    var p =
    {
        wval : this.act_values.purchaseid,
        wop  : "=",
        wcol : 'purchaseid',
        sort : '',
        sqlend : 1
    };
    
    if ( this.act_values.ordernumber == '' )
      p.macro0 = 'watermark,' + this.txtGetText('#mne_lang#Entwurf');
    else
      report = this.initpar.report;
    
    MneAjaxWeblet.prototype.print.call(this,p, report );
    return false;  
  }

  weblet.print = function()
  {
    var p =
    {
        wval : this.act_values.purchaseid,
        wop  : "=",
        wcol : 'purchaseid',
        sort : '',
        sqlend : 1
    };
    
    if ( this.act_values.ordernumber == '' )
      p.macro0 = 'watermark,' + this.txtGetText('#mne_lang#Entwurf');

    MneAjaxWeblet.prototype.print.call(this,p);
    return false;  
  }

  weblet.delivered = function(setdepend)
  {
    var result;
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.deliveredfunction,
        typ0 : "text",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.purchaseid);

    result = MneAjaxWeblet.prototype.func.call(this, p, "purchaseid", setdepend, "delivered");
    return result;
  }
  
  weblet.onbtnok = function(button)
  {
    var ele;
    if ( this.inputlist != null ) ele = this.inputlist.element;
    else ele = null;

    MneAjaxWeblet.prototype.onbtnok.call(this, button);

    if ( ele == 'partname' )
    {
      this.showInput(this.obj.inputs.partvendorid, '', null, true);
      this.showInput(this.obj.inputs.vendorordernumber, '');
      this.showOutput(this.obj.outputs.vendorname, '');
      this.showOutput(this.obj.outputs.packagesize, '');
      this.showOutput(this.obj.outputs.rescount, '');

      if ( this.obj.inputs.crmorderid.value != '' )
      {
        var ajax = new MneAjaxData(this.win);
        var p = 
        {
            schema : this.initpar.orderpartschema,
            query  : this.initpar.orderpartquery,

            cols : "orderid",

            wcol : "orderid,partid",
            wval : "=,=",
            wval : this.obj.inputs.crmorderid.value + "," + this.obj.inputs.partid.value,

            sqlend : 1
        }

        ajax.read( "/db/utils/query/data.xml",  p);
        if ( ajax.values.length == 0 )
        {
          this.showInput("crmorderid", "");
          this.showOutput("crmordernumber","");
          this.showOutput("crmorder","");
          this.warning("#mne_lang#Der Auftrag benötig dieses Teil nicht");
        }
      }
    }
    else if ( ele == 'vendorname' )
    {
      if ( this.obj.outputs.rescount.innerHTML != "" )
        {
        this.showInput(this.obj.inputs.count, parseInt(this.obj.outputs.rescount.innerHTML) / parseInt(this.obj.outputs.packagesize.innerHTML))
        if (  parseInt(this.obj.outputs.packagesize.innerHTML) * this.obj.inputs.count.value != parseInt(this.obj.outputs.rescount.innerHTML))
          this.obj.inputs.count.value = parseInt(this.obj.inputs.count.value) +1;
        }

      if ( this.obj.outputs.packagesize.innerHTML != "" )
      {
        this.showOutput(this.obj.outputs.rescount, parseInt(this.obj.outputs.packagesize.innerHTML) * this.obj.inputs.count.value)
      }
      
        
    }
  }
}
