// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/table/pkey
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();

  weblet.findIO();

  weblet.btnrequest.add    = "/db/admin/table/pkey/add.xml" 
  weblet.btnrequest.mod    = "/db/admin/table/pkey/mod.xml" 
  weblet.btnrequest.del    = "/db/admin/table/pkey/del.xml" 

  weblet.delbuttons('add');
  
  weblet.showValue = function(weblet,param)
  {
    var i;

    if ( weblet == this )
    {
      this.act_values.schema = this.initpar.schema;
      this.act_values.table = this.initpar.table;
    }

    if ( typeof weblet.act_values.schema == 'undefined' ||
        typeof weblet.act_values.table  == 'undefined' )
    {
      alert(this.txtGetText('#mne_lang#Bitte erst Tabellen auswählen'));
      return false;
    }

    this.initpar.schema =  weblet.act_values.schema;
    this.initpar.table  =  weblet.act_values.table;
    this.initpar.title  = this.initpar.schema + '.' + this.initpar.table;

    this.titleString.add = this.txtGetText("#mne_lang#Primary Key hinzufügen" + ": " + this.initpar.schema + "." + this.initpar.table);
    this.titleString.mod = this.txtGetText("#mne_lang#Primary Key bearbeiten" + ": " + this.initpar.schema + "." + this.initpar.table);

    var p =
    {
        schema   : this.initpar.schema,
        table    : this.initpar.table,
        no_vals  : "true",
        sqlend   : 1
    };

    MneAjaxData.prototype.read.call(this, "/db/utils/table/data.xml",  p );

    this.obj.tables.content.clearBody();
    this.obj.tables.content.plain = false;
    this.obj.inputs = {};
    this.obj.unique = false;
    this.obj.column = {};
    for ( i in this.ids )
    {
      var r;
      r = this.obj.tables.content.add(i, '####' + 'text' + '####' + i + '####');
      this.obj.inputs[i] = this.obj.tables.content.body.rows[r].cells[1].datafield;
      this.obj.inputs[i].size = 2;
      this.obj.inputs[i].checktype = this.inChecktype.num1oempty;
      this.obj.column[i] = r;
    }

    var p =
    {
        schema   : 'mne_application',
        query    : 'table_pkey',
        cols     : 'name,position,column',
        wcol     : 'schema,table',
        wop      : '=,=',
        wval     : this.initpar.schema + ',' + this.initpar.table,
        scol     : 'position',
        sqlend   : 1
    };

    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  p );

    if ( this.values.length > 0 )
    {
      var i;
      this.act_values.name = this.values[0][0];
      this.okaction = 'mod';
      this.obj.title.innerHTML = this.titleString.mod;

      for ( i =0; i<this.values.length; i++ )
        this.obj.inputs[this.values[i][2]].value = this.values[i][1];
    }
    else
      this.add();
    
    this.act_values.schema = this.initpar.schema;
    this.act_values.table = this.initpar.table;
    
    this.clearModify();

    return true;
  }

  weblet.getParam = function(p)
  {
    var cols = new Array();
    var i;
    var c;
    
    for ( i in this.obj.inputs )
      if ( this.obj.inputs[i].value != '' ) { cols[this.getParamValue(this.obj.inputs[i])] = i; }
    
    c= "";
    for ( i = 0; i<cols.length; i++ )
      if ( typeof cols[i] != 'undefined' ) c = c + cols[i] + ",";
    p.colsInput = c.substring(0, c.length - 1)
    return p;
  }

  weblet.add = function()
  {
    var i;
    this.okaction = 'add';
    this.obj.title.innerHTML = this.titleString.add;
    for ( i in this.obj.inputs) this.obj.inputs[i].value = '';
  }
  
  weblet.ok = function()
  {
    var p = { sqlend : 1 };

    if ( typeof this.initpar.schema != 'undefined' && this.initpar.schema != null ) p.schema = this.initpar.schema;
    if ( typeof this.initpar.table  != 'undefined' && this.initpar.table != null  ) p.table = this.initpar.table; 
    
    p = this.getParam(p);
    if ( this.okaction == 'mod' )
      p["nameInput.old"] = this.act_values.name;
    
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( typeof this.btnrequest[this.okaction] == 'undefined' )
      throw { message : this.txtSprintf(this.txtGetText('#mne_lang#keine Buttonaktion für <$1> definiert'),this.okaction) }
    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest[this.okaction],  p ) == 'ok' )
    {
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }
  
  weblet.del = function()
  {
    var p = { sqlend : 1 };

    if ( typeof this.initpar.schema != 'undefined' && this.initpar.schema != null ) p.schema = this.initpar.schema;
    if ( typeof this.initpar.table  != 'undefined' && this.initpar.table != null  ) p.table = this.initpar.table; 
    
    p["nameInput.old"] = this.act_values.name;
    
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( typeof this.btnrequest['del'] == 'undefined' )
      throw { message : this.txtSprintf(this.txtGetText('#mne_lang#keine Buttonaktion für <$1> definiert'),'del') }
    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest['del'],  p ) == 'ok' )
    {
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }
  
  weblet.cancel = function()
  {
    this.showValue(this.depend);
    return false; 
  }
}
