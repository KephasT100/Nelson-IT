// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/zpush/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_system',
    table     : 'zpush',
    
    okpost     : '/sysexec/apache2/zpush/config'
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  weblet.delbuttons('add,del')

  var attr = 
  {
      hinput : false
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("zpushid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Active Sync Konfiguration hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Active Sync Konfiguration bearbeiten");
  
  weblet.defvalues = { zpushid : '0' };
  
  weblet.showValue = function(weblet)
  {
    MneAjaxWeblet.prototype.showValue.call(this, {act_values : { zpushid : "0" } }, { ignore_notfound : "1" } );
    if ( this.values.length == 0 )
      this.add();
 }    
  
}
