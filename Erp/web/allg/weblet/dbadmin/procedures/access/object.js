// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/procedures/access
// ================================================================================
{
  weblet.loadbase("/weblet/allg/table/fix", weblet);
  weblet.onbtnok = function(button)
  {
    var p;
    
    p = this.addParam( {sqlend : 1}, 'schema', 'mne_catalog');
    p = this.addParam( p,  'name', 'pgplsql_proc_access_add');

    p = this.addParam( p,  'par0', this.act_values.schema + "." + this.act_values.fullname );
    p = this.addParam( p,  'par1', button.weblet.act_values.name);

    p = this.addParam( p, 'type0', '#text');
    p = this.addParam( p, 'type1', '#text');
    
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/func/execute.xml", p) == 'ok')
        this.showValue(this);
      return false;
  }
  
  weblet.del = function()
  {
    var p;
        
    p = this.addParam( {sqlend : 1}, 'schema', 'mne_catalog');
    p = this.addParam( p,  'name', 'pgplsql_proc_access_drop');

    p = this.addParam( p,  'par0', this.act_values.schema + "." + this.act_values.fullname );
    p = this.addParam( p,  'par1', this.act_values.user);

    p = this.addParam( p, 'type0', '#text');
    p = this.addParam( p, 'type1', '#text');
    
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/func/execute.xml", p) == 'ok')
        this.showValue(this);
      return false;
  }
  
  weblet.onbtnclick = function()
  {
  }
}
