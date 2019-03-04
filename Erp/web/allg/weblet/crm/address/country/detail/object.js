// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/address/country/detail
// ================================================================================
{
  var i;
  var str = "";
  var weblet = weblet;
  
  weblet.loadview();

  var ivalues = 
  {
      schema    : 'mne_crm',
      query     : 'country',
      table     : 'country'
  }

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  
  var attr = 
  {
      title_de : { "innerHTML" : weblet.txtGetText("#mne_lang#deutsch") },
      title_en : { "innerHTML" : weblet.txtGetText("#mne_lang#englisch")}
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("countryid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Land hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Land bearbeiten");
  
  weblet.showValue = function(weblet)
  {
    if ( typeof weblet == 'undefined' || weblet == null || typeof weblet.act_values.countryid == 'undefined' || weblet.act_values.countryid == '################' || weblet.act_values.countryid == '')
    {
      this.add();
      return;
    }
    
    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }    

      
}