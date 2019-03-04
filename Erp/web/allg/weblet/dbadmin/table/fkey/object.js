// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/table/fkey
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();

  var attr =
  {
      schemaInput : { disabled : true },
      tableInput  : { disabled : true }
  }
  
  weblet.findIO(attr);
  weblet.showLabel();
  
  weblet.obj.column = weblet.obj.inputs.column;
  weblet.obj.rcolumn = weblet.obj.inputs.rcolumn;
  
  delete weblet.obj.inputs.column;
  delete weblet.obj.inputs.rcolumn;
  
  weblet.inClear(weblet.obj.column);
  weblet.inClear(weblet.obj.rcolumn);

  weblet.showids = new Array('schema','table','name');
  weblet.defvalues = { schema : null, table : null, name : '' };
  
  weblet.titleString.add = weblet.txtGetText("#mne_lang#neuer Foreign Key");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Foreign Key bearbeiten");

  weblet.btnrequest.add    = "/db/admin/table/fkey/add.xml" 
  weblet.btnrequest.mod    = "/db/admin/table/fkey/mod.xml" 
  weblet.btnrequest.del    = "/db/admin/table/fkey/del.xml" 
  
  weblet.obj.tables.tablecols.dblclickCb["body"] = function(tab) { tab.weblet.addcol.call(tab.weblet, tab); }
  weblet.obj.tables.rtablecols.dblclickCb["body"] = function(tab) { tab.weblet.addrcol.call(tab.weblet, tab); }
  
  weblet.create_checkpopup(weblet.obj.inputs.name, { reg : '' });
  
  weblet.addcol = function(tab)
  {
    if ( this.obj.column.value != '' ) this.obj.column.value += ',';
    this.obj.column.value += tab.act_text;
  }
  
  weblet.addrcol = function(tab)
  {
    if ( this.obj.rcolumn.value != '' ) this.obj.rcolumn.value += ',';
    this.obj.rcolumn.value += tab.act_text;
  }

  weblet.showTablecols = function(tab, schema, table )
  {
    tab.clear();
    
    if ( typeof schema == 'undefined' || typeof table == 'undefined') 
      return;
    
    var p =
    {
        schema : 'mne_application',
        query  : 'table_cols',
        
        cols   : 'column',
        scols  : 'column',
        
        wcol   : 'schema,table',
        wop    : '=,=,=',
        wval   : schema + ',' + table,
    
        sqlend : 1
    }
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  p );
    
    tab.addHead(schema + "." + table)
    for ( i=0; i<this.values.length; i++)
      tab.add(this.values[i][0]);
  }
  
  weblet.showValue = function(weblet,param)
  {
    var i;

    
    if ( weblet == null ) return;
        
    if ( weblet.id != 'left' )
    {
      if ( typeof weblet.act_values.schema == 'undefined' ||
          typeof weblet.act_values.table  == 'undefined' )
      {
        this.error(this.txtGetText('#mne_lang#Bitte erst Tabellen auswählen'));
        return false;
      }

      this.act_values.schema = weblet.act_values.schema;
      this.act_values.table  = weblet.act_values.table;
      this.showTablecols(this.obj.tables.tablecols, this.act_values.schema, this.act_values.table)

      if ( typeof weblet.act_values.name == 'undefined' || weblet.act_values.name == '')
        this.add();
      else
      {
        this.act_values.name = weblet.act_values.name;
        MneAjaxWeblet.prototype.showValue.call(this,weblet,{ distinct : true });
        
        var c,rc;
        var p =
        {
            schema : 'mne_application',
            query  : 'table_fkeys',
            
            cols   : 'column,rcolumn,text_de,text_en,custom',
            scols  : 'position',
            
            wcol   : 'schema,table,name',
            wop    : '=,=,=',
            wval   : this.act_values.schema + ',' + this.act_values.table + ',' + this.act_values.name ,
        
            sqlend : 1
        }
        MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  p );
        
        c = rc = '';
        for ( i=0; i<this.values.length; i++)
        {
          c = c + this.values[i][0] + ',';
          rc = rc + this.values[i][1] + ',';
        }
        this.obj.column.value = c.substr(0, c.length -1);
        this.obj.rcolumn.value = rc.substr(0, rc.length -1);
        
        this.inClear(this.obj.column);
        this.inClear(this.obj.rcolumn);
        
      }
    }
    else
    {
      this.add();
      
      this.act_values.rschema = this.obj.inputs.rschema.value = weblet.act_values.schema;
      this.act_values.rtable = this.obj.inputs.rtable.value = weblet.act_values.table;
      
      this.inOnmodify.call(this.obj.inputs.rschema);
      this.inOnmodify.call(this.obj.inputs.rtable);
    }
    
    this.showTablecols(this.obj.tables.rtablecols, this.act_values.rschema, this.act_values.rtable)

    return true;
    
  }

  weblet.checkmodified = function()
  {
    return false;
  }

  weblet.add = function()
  {
    MneAjaxWeblet.prototype.add.call(this);
    this.obj.column.value = "";
    this.obj.rcolumn.value = "";
    
    this.inClear(this.obj.column);
    this.inClear(this.obj.rcolumn);
    
    this.obj.tables.rtablecols.clear();
    this.showTablecols(this.obj.tables.tablecols, this.act_values.schema, this.act_values.table)
  }
  
  weblet.getParam = function(p)
  {
     p = MneAjaxWeblet.prototype.getParam.call(this,p);
     p['colsInput'] = this.obj.column.value;
     p['rcolsInput'] = this.obj.rcolumn.value;
     
     return p;
  }
  
  weblet.del = function()
  {
    var result;
    this.titleString.del = this.txtSprintf(this.txtGetText("#mne_lang#Foreign Key <$1> wirklich löschen"), this.act_values.name);
    return MneAjaxWeblet.prototype.del.call(this, false);
  }
}