// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/part/storage/location/masterdata
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'partstoragelocationmasterdata',
    table     : 'partstoragelocationmasterdata',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("partstoragelocationmasterdataid");
  weblet.defvalues = { partid : null, effort : 1.0 };
  
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Lagerortstammdaten hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lagerortstammdaten bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.partid == 'undefined' || weblet.act_values.partid == '################'  )
    {
        alert('#mne_lang#Bitte Teil auswählen');
        return false;
    }
    
    if ( typeof weblet.act_values.partstoragelocationmasterdataid == 'undefined')
    {
      this.add();

      this.showInput(this.obj.inputs.partid, weblet.act_values.partid, this.typs[this.ids['partid']], false);
      this.showOutput(this.obj.outputs.partname, weblet.act_values.partname, this.typs[this.ids['partname']], false);
      
      return true;
    }

    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  } 
}
