// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/address/city/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema     : 'mne_crm',
    query      : 'city',
    table      : 'city'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  
  weblet.loadview();

  var attr = 
  {
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("cityid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Ortschaft hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Ortschaft bearbeiten");
  
  weblet.showValue = function(weblet, param)
  {
    if ( weblet == null || typeof weblet.act_values.cityid == 'undefined' || weblet.act_values.cityid == '################' || weblet.act_values.cityid == '')
    {
      this.add();
      return;
    }
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
}