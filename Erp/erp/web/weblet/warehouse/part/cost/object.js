// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/part/cost
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'partcost',
    table     : 'partcost',
    
    okfunction  : 'partcost_ok',
    delfunction : 'partcost_del'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      partidInput  : { notclear : true, inputcheckobject : 'partname' },
      partnameOutput   : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("partcostid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Kosten hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Kosten bearbeiten");
       
  var param =
  {
      "schema" : "mne_crm",
      "query"  : "companyown",
      "cols"   : "currencyid,currency",
      "sqlend" : 1
  };
  
  MneAjaxData.prototype.read.call(weblet, "/db/utils/query/data.xml",  param)
  if ( weblet.values.length > 0 )
    weblet.defvalues = { currencyid : weblet.values[0][0], currency : weblet.values[0][1]}
  else
    weblet.defvalues = { currencyid : '', currency : 'unbekannt'}

  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.partcostid == 'undefined' || weblet.act_values.partcostid == null || weblet.act_values.partcostid == '' )
    {
      if ( weblet != null && typeof weblet.act_values.partid != 'undefined' )
      {
        this.showInput("partid", weblet.act_values.partid );
        this.showOutputDefined("partname", weblet.act_values.partname );
      }
      this.add();
      return true;
    }
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
  weblet.add = function(setdepend)
  {
    var param =
    {
        "schema" : this.initpar.schema,
        "query"  : this.initpar.query,
        "cols"   : "partcostid",
        "wcol"   : "partid",
        "wval"   : this.obj.inputs.partid.value,
        "sqlend" : 1
    };
    
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param)
    if ( this.values.length > 0 )
    {
      this.showValue({act_values : { partcostid : this.values[0][0] }} );
      return false;
    }

    return MneAjaxWeblet.prototype.add.call(this, setdepend);
  }
    weblet.ok = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.schema,
        name   : this.initpar.okfunction,
        typ2   : "double",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.partcostid);
    p = this.addParam(p, "par1", this.obj.inputs.partid);
    p = this.addParam(p, "par2", this.obj.inputs.unitcost);
    p = this.addParam(p, "par3", this.obj.inputs.unit);

    return MneAjaxWeblet.prototype.func.call(this, p, 'partcostid', setdepend);
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

    p = this.addParam(p, "par0", this.obj.inputs.partcostid);

    return MneAjaxWeblet.prototype.func.call(this, p, null, setdepend);
  }

}
