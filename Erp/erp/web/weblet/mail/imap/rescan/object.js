// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: mail/imap/rescan
// ================================================================================
{
  var i;
  var str = "";
  var e,t,r;
  
  var ivalues = 
  {
      showlabel : { de : 'neu Einlesen', en : 'read new' },
      popup : 'dummy',
      no_vals : 1,
      delbutton : 'del'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  MneAjaxWeblet.prototype.loadbase.call(weblet, "weblet/allg/table/fix", weblet);

  weblet.obj.mkbuttons.push({ id : 'full', value : weblet.txtGetText("#mne_lang#Komplett einlesen#" ), space : 'before' });
 
  var attr =
  {
  }
  
  weblet.showdetail = function()
  {
    this.showValue(this, { fullscan : 0, no_vals : 0 });
    return false;
  }
 
  weblet.full = function()
  {
    this.showValue(this, { fullscan : 1, no_vals : 0 });
    return false;
  }
}
