// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/network/netparam
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    hinput    : false,
    
    schema    : 'mne_system',
    table     : 'netparam',
        
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  weblet.obj.mkbuttons = [];

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("netdeviceid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Netzwerk aktuell");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Netzwerk aktuell");
  
  weblet.showValue = function(weblet, param)
  {
    return MneAjaxWeblet.prototype.showValue.call(this,{ act_values : {netdeviceid : '0' } }, { ignore_notfound : 1 } );
  }    

}
