// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/part/storage/masterdata
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'partstoragemasterdata',
    table     : 'partstoragemasterdata',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();
  weblet.delbuttons('add,cancel')

  var attr = 
  {
      hinput : false
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("partid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Lagerstammdaten hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lagerstammdaten bearbeiten");
  weblet.defvalues = { partstoragemasterdataid : '################' };
 
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.partid == 'undefined' || weblet.act_values.partid == '################'  )
    {
        this.add();
        this.obj.inputs.partid.value = '';
        alert('#mne_lang#Bitte Teil auswählen');
        return false;
    }

    MneAjaxWeblet.prototype.showValue.call(this,weblet);
    if ( this.values.length == 0 )
    {
      this.add();
      this.obj.inputs.partid.value = weblet.act_values.partid;
    }
  } 
  
  weblet.ok = function()
  {
    if ( this.obj.inputs.partid.value == '' ) return;
    
    return MneAjaxWeblet.prototype.ok.call(this);
  }
}
