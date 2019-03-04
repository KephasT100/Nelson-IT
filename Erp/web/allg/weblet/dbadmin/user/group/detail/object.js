// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/user/group/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema      : 'mne_application',
    query       : 'usergroup',
    cols        : 'group',
    wcol        : 'rolname,ismember',
    wop         : '=,=',
    scols       : 'group',
    
    addschema   : 'mne_catalog',
    delschema   : 'mne_catalog',
    
    addfunction : 'usergroupadd',
    delfunction : 'usergroupdel',

    tabnohead : true
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");

  weblet.loadview();

  var attr = 
  {
      hinput : false
  };

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.obj.tables.group.table.className = '';
  weblet.obj.tables.group.borderclass = 'padding';
  weblet.obj.tables.group.table.style.marginLeft = "auto";
  weblet.obj.tables.group.table.style.marginRight = "auto";
  weblet.obj.tables.group.dblclickCb['body'] = function(tab) { tab.weblet.del(); };
  
  weblet.obj.tables.allgroup.table.className = '';
  weblet.obj.tables.allgroup.borderclass = 'padding';
  weblet.obj.tables.allgroup.table.style.marginLeft = "auto";
  weblet.obj.tables.allgroup.table.style.marginRight = "auto";
  weblet.obj.tables.allgroup.dblclickCb['body'] = function(tab) { tab.weblet.add(); };
  
  weblet.showValue = function(weblet)
  {
    var username;
    
    if ( weblet == null ) return;
    if ( typeof weblet.act_values.username != 'undefined' ) username = weblet.act_values.username;
    else if ( typeof weblet.act_values.loginname != 'undefined' ) username = weblet.act_values.loginname;
    
    this.obj.maintable = "allgroup";
    this.initpar.wval = username + ",0";
    
    MneAjaxWeblet.prototype.showTable.call(this,weblet);
    if ( this.values.length == 0 && typeof weblet.act_values.personid != 'undefined' && weblet.act_values.personid != '' && weblet.act_values.personid != '################' )
      this.warning('#mne_lang#Benutzer kann sich nicht einloggen');

    this.obj.maintable = "group";
    this.initpar.wval = username + ",1";
    MneAjaxWeblet.prototype.showTable.call(this,weblet);
    
    this.act_values.username = username;
  };
  
  weblet.add = function()
  {
    var p =
    {
        schema : this.initpar.addschema,
        name   : this.initpar.addfunction,
        par0   : this.act_values.username,
        typ0   : "text",
        par1   : this.obj.tables.allgroup.act_selection,
        typ1   : "text",
        sqlend : 1   
    };
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.showValue(this);
      this.setDepends('add');
      return false;
    }

    return true;
  };
  
  weblet.del = function()
  {
    var p =
    {
        schema : this.initpar.delschema,
        name   : this.initpar.delfunction,
        par0   : this.act_values.username,
        typ0   : "text",
        par1   : this.obj.tables.group.act_selection,
        typ1   : "text",
        sqlend : 1   
    };
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.showValue(this);
      this.setDepends('del');
      return false;
    }

    return true;
  };
  
}
