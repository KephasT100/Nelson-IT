// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/cert/key/table
// ================================================================================
{
  var i;
  var str = "";
  var e,t,r;
  
  var ivalues = 
  {
      stylePath: '/styles',
      styleName : 'repository.css'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  MneAjaxWeblet.prototype.loadbase.call(weblet, "/weblet/allg/filesystem/folder/show", weblet);

  weblet.download = function()
  {
    this.error("#mne_lang#Zugriff nicht möglich");
  }
}
