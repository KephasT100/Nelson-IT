// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/product/price
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
      schema    : 'mne_crm',
      query     : 'productprice',
      table     : 'productprice',
      
      okfunction : 'productprice_ok',
      delfunction : 'productprice_del',
      
      showdynparweblet : 'detail',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();
  weblet.delbuttons('add');

  var attr = 
  {
      hinput : false,
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("productid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Preis hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Preis bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Preis wirklich löschen");

  weblet.obj.defaultcurrencyid = "";
  weblet.obj.defaultcurrency   = "#mne_lang#Währung bitte wählen";
  var param =
  {
      "schema" : "mne_crm",
      "query"  : "companyown",
      "cols"   : "currencyid,currency",
      "sqlend" : 1
  };
  
  MneAjaxData.prototype.read.call(weblet, "/db/utils/query/data.xml",  param)
  if ( weblet.values.length > 0 )
  {
    weblet.obj.defaultcurrencyid = weblet.values[0][0];
    weblet.obj.defaultcurrency   = weblet.values[0][1];
  }

  weblet.showValue = function(weblet)
  {
    this.enable();
    if ( weblet == null || weblet.act_values.productid == '################')
    {
      this.add();
      this.disable();
    }
    else
    {
      MneAjaxWeblet.prototype.showValue.call(this,this.parent.subweblets[this.initpar.showdynparweblet]);
      if ( this.act_values.unitprice == '' )
      {
        if ( this.obj.title != null ) this.obj.title.innerHTML = this.titleString.add;
        this.okaction = "add";

        this.showInput (this.obj.inputs.currencyid, this.obj.defaultcurrencyid, this.typs[this.ids['partcurrencyid']], false );
        this.showOutput(this.obj.outputs.currency,  this.obj.defaultcurrency,   this.typs[this.ids['partcurrency']])
      }
    }
  }
  
  weblet.add = function()
  {
    this.defvalues = { currencyid : this.obj.defaultcurrencyid };
    return MneAjaxWeblet.prototype.add.call(this);

  }

  weblet.cancel = function()
  {
    var r = MneAjaxWeblet.prototype.cancel.call(this);
    if ( this.act_values.currencyid == '' )
    {
      this.showInput (this.obj.inputs.currencyid, this.obj.defaultcurrencyid, this.typs[this.ids['partcurrencyid']], false );
      this.showOutput(this.obj.outputs.currency,  this.obj.defaultcurrency,   this.typs[this.ids['partcurrency']])
    }
    return r;
  }
  
  
  weblet.ok = function(setdepend)
  {
    var result;
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.okfunction,
        typ1 : "double",
        typ2 : "double",
        typ4 : "double",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.productid);
    p = this.addParam(p, "par1", this.obj.inputs.unitcost);
    p = this.addParam(p, "par2", this.obj.inputs.unitprice);
    p = this.addParam(p, "par3", this.obj.inputs.unit);
    p = this.addParam(p, "par4", this.obj.inputs.vat);
    p = this.addParam(p, "par5", this.obj.inputs.currencyid);

    result = MneAjaxWeblet.prototype.func.call(this, p, "productid", setdepend, "ok");
    return result;

  }
  
  weblet.calculate = function()
  {
    var param =
    {
        "schema" : "mne_crm",
        "query"  : "productcost",
        "cols"   : "productcost",
        "productidInput.old" : this.act_values.productid,
        "sqlend" : 1
    };
    
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param)
    if ( this.values.length > 0 )
      this.showInput(this.obj.inputs.unitcost, this.values[0][0], null, true);
    
    return false;
  }

}
