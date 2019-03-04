// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/part/vendor/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'partvendor',
    table     : 'partvendor',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      partidInput : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("partvendorid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Lieferanten hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lieferanten bearbeiten");
       
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
    weblet.defvalues = { currencyid : '', currency : '#mne_lang#Währung bitte wählen'}

  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.partvendorid == 'undefined' ||  weblet.act_values.partvendorid == '' ||  weblet.act_values.partvendorid == '################' )
    {
      if ( typeof weblet.act_values.partid == 'undefined' || weblet.act_values.partid == '' || weblet.act_values.partid == '################' )
      {
        alert("#mne_lang#Bitte Teil auswählen");
        return false;
      }
      this.obj.inputs.partid.value = this.act_values.partid = weblet.act_values.partid;
      this.add();
      return;
    }
    
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
  weblet.ok = function()
  {
    if ( this.obj.inputs.partid.value == '' || this.obj.inputs.partid.value == '################' )
    {
      alert("#mne_lang#Bitte Teil auswählen");
      return false;
    }

    if ( this.obj.inputs.preferred.checked == true )
    {
      var p = {};
      p = this.addParam(p, "schema", this.initpar.schema);
      p = this.addParam(p, "table",  this.initpar.table);
      
      p = this.addParam(p, "partidInput.old", this.act_values.partid);
      p = this.addParam(p, "preferredInput", 'false');

      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/modify.xml",  p );
    }
    return MneAjaxWeblet.prototype.ok.call(this, true, false, true);
  }
  
}
