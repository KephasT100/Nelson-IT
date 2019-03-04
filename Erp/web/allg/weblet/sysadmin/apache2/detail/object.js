// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/apache2/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_system',
    table     : 'apache',
    
    valuepre  : '/sysexec/apache2/detail/rdconfig',
    okpost    : '/sysexec/apache2/detail/enable'

  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();
  weblet.delbuttons('add,del');

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      apacheidInput : { value : '0' } 
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("apacheid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Apache Konfiguration hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Apache Konfiguration bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Apache Konfiguration wirklich löschen ?");
  weblet.titleString.delid = 'apacheid';     
  
  weblet.showValue = function(weblet)
  {
    return MneAjaxWeblet.prototype.showValue.call(this, { act_values : { apacheid : 0} } );
  }    
}
