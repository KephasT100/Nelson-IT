// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/address/detail
// ================================================================================
{
  var i;
  var str = "";
    
  var ivalues = 
  {
      schema : 'mne_crm',
      query : 'address',
      table : 'address',
      
      refidname : 'refid',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      refidInput : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("addressid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Addresse hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Addresse bearbeiten");
  
  weblet.defvalues = { addresstypid : '000000000001'};
  weblet.showValue = function( weblet )
  {
   if ( weblet == null )
      return false;
    
    if ( typeof weblet.act_values.addressid == 'undefined' || weblet.act_values.addressid == '' || weblet.act_values.addressid == '################' )
    {
      this.showInputDefined("refid", weblet.act_values[this.initpar.refidname]);
      this.add();
      return true;
    }

    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
}
