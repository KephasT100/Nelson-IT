// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: fixture/fixturetype/cost
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_fixture',
    query     : 'fixturetypecost',
    table     : 'fixturetypecost',
    
    okfunction  : 'fixturetypecost_ok',
    delfunction : 'fixturetypecost_del'
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();

  var attr = 
  {
      hinput : false,
      fixturetypeidInput  : { notclear : true, inputcheckobject : 'fixturetype' },
      fixturetypeOutput   : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("fixturetypecostid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Inventarart Kosten hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Inventarart Kosten bearbeiten");
       
  var param =
  {
      "schema" : "mne_crm",
      "query"  : "companyown",
      "cols"   : "currencyid,currency",
      "sqlend" : 1
  };
  
  MneAjaxData.prototype.read.call(weblet, "/db/utils/query/data.xml",  param)

  if ( weblet.values.length > 0 )
    weblet.defvalues = { currencyid : weblet.values[0][0], currency : weblet.values[0][1] }
  else
    weblet.defvalues = { currencyid : '', currency : "unbekannt" }

  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.fixturetypecostid == 'undefined' || weblet.act_values.fixturetypecostid == null || weblet.act_values.fixturetypecostid == '' )
    {
      if ( weblet != null && typeof weblet.act_values.fixturetypeid != 'undefined' )
      {
        this.showInput("fixturetypeid", weblet.act_values.fixturetypeid );
        this.showOutputDefined("fixturetype", weblet.act_values.fixturetype );
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
        "cols"   : "fixturetypecostid",
        "wcol"   : "fixturetypeid",
        "wval"   : this.obj.inputs.fixturetypeid.value,
        "sqlend" : 1
    };
    
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param)
    if ( this.values.length > 0 )
    {
      this.showValue({act_values : { fixturetypecostid : this.values[0][0] }} );
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

    p = this.addParam(p, "par0", this.obj.inputs.fixturetypecostid);
    p = this.addParam(p, "par1", this.obj.inputs.fixturetypeid);
    p = this.addParam(p, "par2", this.obj.inputs.unitcost);
    p = this.addParam(p, "par3", this.obj.inputs.unit);

    return MneAjaxWeblet.prototype.func.call(this, p, 'fixturetypecostid', setdepend);
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

    p = this.addParam(p, "par0", this.obj.inputs.fixturetypecostid);

    return MneAjaxWeblet.prototype.func.call(this, p, null, setdepend);
  }

}
