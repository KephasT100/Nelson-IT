// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/table/access
// ================================================================================
{
  var i;
  var b;
  
  var ivalues = 
  {
      hinput     :  false,
      tableplain : false,
      schema     : 'mne_application',
      query      : 'table_access',
      cols       : 'user,privilege',
      scols      : 'user,privilege'

  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");
  weblet.loadview();
  
  var attr =
  {
  };
  
  weblet.showdynpar = { "schemaInput.old" : "schema", "tableInput.old" : "table" };
  
  weblet.findIO(attr);
  weblet.showLabel();
  weblet.delbuttons(['ok', 'del', 'cancel']);
  
  weblet.accesstype = new Array('select', 'insert','update', 'delete', 'references', 'trigger');
  weblet.obj.tables.content.addHead('User/Group', weblet.accesstype[0], weblet.accesstype[1],weblet.accesstype[2], weblet.accesstype[3], weblet.accesstype[4], weblet.accesstype[5]);
  weblet.obj.tables.content.ignoreUnselect = true;
  weblet.obj.tables.content.plain = false;
  
  weblet.showValue = function(weblet,param)
  {
    var i;
    var tab;
    var user;
    var r;
    
    if ( weblet == null ) return;
    if ( weblet != this ) this.act_values = {};
    
    this.act_values.schema = weblet.act_values.schema;
    this.act_values.table  = weblet.act_values.table;
    
    MneAjaxWeblet.prototype.readData.call(this, weblet, param);
    
    tab = this.obj.tables.content;
    tab.ids = this.ids;

    tab.clearBody();
    
    user = '';
    for ( i = 0; i<this.values.length; i++ )
    {
      if ( this.values[i][0] != user )
      {
        var j;
        user = this.values[i][0];
        r = tab.add(user, '####checkbox####', '####checkbox####', '####checkbox####', '####checkbox####', '####checkbox####', '####checkbox####')
        for ( j=0; j<6; j++ )
        {
          var l = tab.body.rows[r].cells[j+1].querySelector('label');
          l.user = user;
          l.weblet = this;
          l.accesstype = this.accesstype[j];
          l.onclick = function(){try { this.checkbox.checked = !this.checkbox.checked; if ( this.checkbox.checked == true ) this.weblet.add_access(this.user, this.accesstype); else this.weblet.del_access(this.user, this.accesstype ) } catch(e) { this.weblet.exception('access: ', e) } };
        }
      }
      switch(this.values[i][1])
      {
      case "SELECT"     : tab.body.rows[r].cells[1].datafield.checkbox.checked = true; break;
      case "INSERT"     : tab.body.rows[r].cells[2].datafield.checkbox.checked = true; break;
      case "UPDATE"     : tab.body.rows[r].cells[3].datafield.checkbox.checked = true; break;
      case "DELETE"     : tab.body.rows[r].cells[4].datafield.checkbox.checked = true; break;
      case "REFERENCES" : tab.body.rows[r].cells[5].datafield.checkbox.checked = true; break;
      case "TRIGGER"    : tab.body.rows[r].cells[6].datafield.checkbox.checked = true; break;
      }
    }
  }
  
  weblet.add = function()
  {
    this.parent.popups[this.id + "add"].show();
    this.parent.popups[this.id + "add"].weblet.showValue(this);
    this.parent.popups[this.id + "add"].weblet.onbtnobj = this;
    return false;
  }
  
  weblet.onbtnok = function(button)
  {
    var user,r,j;
    
    user = button.weblet.act_values.name;
    r = this.obj.tables.content.add(user, '####checkbox####', '####checkbox####', '####checkbox####', '####checkbox####', '####checkbox####', '####checkbox####')
    for ( j=0; j<6; j++ )
    {
      var l = this.obj.tables.content.body.rows[r].cells[j+1].querySelector('label');
      l.user = user;
      l.weblet = this;
      l.accesstype = this.accesstype[j];
      l.onclick = function(){try { this.checkbox.checked = !this.checkbox.checked; if ( this.checkbox.checked == true ) this.weblet.add_access(this.user, this.accesstype); else this.weblet.del_access(this.user, this.accesstype ) } catch(e) { this.weblet.exception('access: ', e) } };
    }
  }
  
  weblet.add_access = function(user, access_type)
  {
    var p;
    
    p = this.addParam( {sqlend : 1}, 'schema', 'mne_catalog');
    p = this.addParam( p,  'name', 'table_access_add');

    p = this.addParam( p,  'par0', this.act_values.schema );
    p = this.addParam( p,  'par1', this.act_values.table);
    p = this.addParam( p,  'par2', user);
    p = this.addParam( p,  'par3', access_type);

    p = this.addParam( p, 'type0', '#text');
    p = this.addParam( p, 'type1', '#text');
    p = this.addParam( p, 'type2', '#text');
    p = this.addParam( p, 'type3', '#text');
    
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/func/execute.xml", p) != 'ok')
        this.showValue(this);
      return false;
  }
  weblet.del_access = function(user, access_type)
  {
    var p;
    p = this.addParam( {sqlend : 1}, 'schema', 'mne_catalog');
    p = this.addParam( p,  'name', 'table_access_drop');

    p = this.addParam( p,  'par0', this.act_values.schema );
    p = this.addParam( p,  'par1', this.act_values.table);
    p = this.addParam( p,  'par2', user);
    p = this.addParam( p,  'par3', access_type);

    p = this.addParam( p, 'type0', '#text');
    p = this.addParam( p, 'type1', '#text');
    p = this.addParam( p, 'type2', '#text');
    p = this.addParam( p, 'type3', '#text');
    
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/func/execute.xml", p) != 'ok')
        this.showValue(this);
      return false;
  }
}
