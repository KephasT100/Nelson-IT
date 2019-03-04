// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/table/fix
// ================================================================================
{
  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");
  
  var i;
  var str = "";

  var ivalues = 
  {
      styleName : 'style.css',
      stylePath : '/weblet/allg/table/allg',

      showlabel : ( ( typeof weblet.initpar.detailweblet != 'undefined' )? { de : 'ändern', en : 'modify' } : { de : 'hinzufügen/ändern', en : 'add/modify' } ),
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();

  var attr = {};
  weblet.findIO(attr);
  
  MneAjaxWeblet.prototype.loadbase.call(weblet, "/weblet/allg/table/allg", weblet);

  weblet.showValue = function(weblet,param)
  {
    if ( weblet == null && this.initpar.shownull != true ) return;
    
    if ( typeof param != 'undefined' && param != null )
    {
      if ( param.setdependid = 'select' && param.setdependweblet == this )
        return true;
    }

    if ( weblet != this ) this.act_values = {};
    return this.showValueBase(weblet,param);
  };
  
  weblet.refresh = function(weblet)
  {
      this.showValueBase(this, { ignore_notdefined : true});
      return false;
  };

}