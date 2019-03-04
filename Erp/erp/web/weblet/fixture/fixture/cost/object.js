// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: fixture/fixture/cost
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_fixture',
    query     : 'fixturecost',
    table    : 'fixturecost'
    
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      fixtureidInput        : { notclear : true, inputcheckobject : 'fixturenumber' },
      fixturenumberOutput   : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("fixturecostid");
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
    weblet.defvalues = { currencyid : weblet.values[0][0], currency : weblet.values[0][1] }
  else
    weblet.defvalues = { currencyid : '', currency : "unbekannt" }
    
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.fixturecostid == 'undefined' || weblet.act_values.fixturecostid == null || weblet.act_values.fixturecostid == '' )
    {
      if ( weblet != null && typeof weblet.act_values.fixtureid != 'undefined' )
      {
        this.showInput("fixtureid", weblet.act_values.fixtureid );
        this.showOutputDefined("fixturenumber", weblet.act_values.fixturenumber );
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
        "cols"   : "fixturecostid",
        "wcol"   : "fixtureid",
        "wval"   : this.obj.inputs.fixtureid.value,
        "sqlend" : 1
    };
    
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param)
    if ( this.values.length > 0 )
    {
      this.showValue({act_values : { fixturecostid : this.values[0][0] }} );
      return false;
    }

    return MneAjaxWeblet.prototype.add.call(this, setdepend);
  }
  
}
