// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/menu/tree
// ================================================================================
{
  var i;
  
  weblet.loadbase('/weblet/allg/tree/show', weblet);
  
  weblet.functions.setValue = weblet.setValue = function(parameter)
  {
    MneAjaxWeblet.prototype.setValue.call(this,parameter);
    if ( this.act_values.action == 'submenu' ) this.obj.menu.submenu(this.act_values.menuid);
  }
  
  weblet.obj.showValue = weblet.showValue;
  weblet.showValue = function(weblet, param)
  {
    if ( weblet != null ) this.obj.menuname = weblet.act_values.menuname;
    
    return this.obj.showValue.call(this, weblet, param);
  }
  
  weblet.setDepends = function(reason)
  {
    this.act_values.menuname = this.obj.menuname;
    MneAjaxWeblet.prototype.setDepends.call(this, reason);
    
  }
}
