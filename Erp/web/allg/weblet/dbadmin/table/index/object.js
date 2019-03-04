// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/table/index
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();

  weblet.findIO( {
        okButton : { value : weblet.txtGetText('#mne_lang#Ok') , "style.width" : "10em" },
       newButton : { value : weblet.txtGetText('#mne_lang#Hinzufügen') },
    cancelButton : { value : weblet.txtGetText('#mne_lang#Abbrechen') }
  }
  );

  weblet.btnrequest.add    = "table_index_add" 
  weblet.btnrequest.mod    = "table_index_mod" 
  weblet.btnrequest.del    = "table_index_del" 

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

    this.initpar.schema = weblet.act_values.schema;
    this.initpar.table  = weblet.act_values.table;
    this.initpar.title  = this.initpar.schema + '.' + this.initpar.table;

    this.titleString.add = this.txtGetText("#mne_lang#Index hinzufügen" + ": " + this.initpar.schema + "." + this.initpar.table);
    this.titleString.mod = this.txtGetText("#mne_lang#Index bearbeiten" + ": " + this.initpar.schema + "." + this.initpar.table);

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
    this.obj.tables.content.borderclass = "padding";
    this.eleMkClass(this.obj.tables.content.table, "border", false);
    
    this.obj.unique = false;
    this.obj.column = {};
    for ( i in this.ids )
    {
      var r;
      r = this.obj.tables.content.add(i, '####' + 'text' + '####' + i + '####');
      this.obj.column[i] = this.obj.tables.content.body.rows[r].cells[1].datafield;
      this.obj.column[i].size = 2;
      this.obj.column[i].checktype = this.inChecktype.num1oempty;
      this.obj.column[i].getModify = this.obj.inputs.index.getModify;
    }


    if ( typeof weblet.act_values.index != 'undefined' )
    {
      var wcol = 'schema,table,index';
      var wop  = '=,=,=';
      var wval = this.initpar.schema + ',' + this.initpar.table + ',' + weblet.act_values.index;
      var p =
      {
          schema   : 'mne_application',
          query    : 'table_index_column',
          cols     : 'index,isunique,column,position,text_de,text_en,custom',
          wcol     : wcol,
          wop      : wop,
          wval     : wval,
          scol     : 'position',
          sqlend   : 1
      };
    
      MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  p );

      if ( this.values.length > 0 )
      {
        var i;
        this.act_values.index = this.obj.inputs.index.value = this.values[0][0];
        this.act_values.isunique = this.obj.inputs.isunique.checked = this.values[0][1] == "#mne_lang#wahr";
        this.act_values.text_de  = this.obj.inputs.text_de.value = this.values[0][4];
        this.act_values.text_en  = this.obj.inputs.text_en.value = this.values[0][5];
        this.act_values.custom = this.obj.inputs.custom.checked = this.values[0][6] == "#mne_lang#wahr";

        this.obj.labels.index.innerHTML = this.names[0];
        this.obj.labels.isunique.innerHTML = this.names[1];
        this.obj.labels.table.innerHTML = this.names[2];
        this.obj.labels.text_de.innerHTML = this.names[4];
        this.obj.labels.text_en.innerHTML = this.names[5];
        this.obj.labels.custom.innerHTML = this.names[6];

        this.okaction = 'mod';
        this.obj.title.innerHTML = this.titleString.mod;

        for ( i =0; i<this.values.length; i++ )
          this.obj.column[this.values[i][2]].value = this.values[i][3];
      }
    }
    else
    {
      var p =
      {
          schema   : 'mne_application',
          query    : 'table_index_column',
          cols     : 'index,isunique,column,position,text_de,text_en,custom',
          no_vals  : 1,
          sqlend   : 1
      };

      MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  p );

      this.obj.labels.index.innerHTML = this.names[0];
      this.obj.labels.isunique.innerHTML = this.names[1];
      this.obj.labels.table.innerHTML = this.names[2];
      this.obj.labels.text_de.innerHTML = this.names[4];
      this.obj.labels.text_en.innerHTML = this.names[5];
      this.obj.labels.custom.innerHTML = this.names[6];

      this.add();
    }
    

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
    var str;
    
    for ( i in this.obj.column )
      if ( this.obj.column[i].value != '' )
      {
        cols[this.obj.column[i].value] = i;
      }

    str = 'ARRAY[';
    for ( i = 1; i < cols.length; i++ )
      if ( typeof cols[i] != 'undefined' )
      {
        str = str + "'" + cols[i] + "',";
      }
    str = str.substr(0,str.length - 1);
    
    str += ']';
        
    p = this.addParam( p, 'schema', 'mne_catalog');
    p = this.addParam( p,  'name', 'table_index_add');

    p = this.addParam( p,  'par0', this.act_values.schema );
    p = this.addParam( p,  'par1', this.act_values.table);
    p = this.addParam( p,  'par2', this.obj.inputs.index);
    p = this.addParam( p,  'par3', this.obj.inputs.isunique.checked ? 'true' : 'false');
    p = this.addParam( p,  'par4', str);
    p = this.addParam( p,  'par5', this.obj.inputs.text_de);
    p = this.addParam( p,  'par6', this.obj.inputs.text_en);
    p = this.addParam( p,  'par7', this.obj.inputs.custom.checked ? 'true' : 'false');

    p = this.addParam( p, 'typ3', 'bool');
    p = this.addParam( p, 'typ4', 'array');
    p = this.addParam( p, 'typ7', 'bool');
    
    return p;
  }

  weblet.del_index = function(p)
  {
    p = this.addParam( p, 'schema', 'mne_catalog');
    p = this.addParam( p,  'name', 'table_index_drop');

    p = this.addParam( p,  'par0', this.act_values.schema);
    p = this.addParam( p,  'par1', this.act_values.index);
     
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( typeof this.btnrequest['del'] == 'undefined' )
      throw { message : this.txtSprintf(this.txtGetText('#mne_lang#keine Buttonaktion für <$1> definiert'),'del') }
    return MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/func/execute.xml",  p );
  }
  
  weblet.checkmodified = function()
  {
    return false;
  }

  weblet.add = function()
  {
    var i;
    this.okaction = 'add';
    this.obj.title.innerHTML = this.titleString.add;
    for ( i in this.obj.inputs) this.obj.inputs[i].value = '';
    for ( i in this.obj.column) this.obj.column[i].value = '';
  }
  
  weblet.ok = function()
  {
    var p
    var colmod = false;
    
    for ( i in this.obj.column )
        colmod = colmod || this.obj.column[i].getModify() == 'modifyok';
    
    colmod = colmod || this.obj.inputs.index.getModify() == 'modifyok';
    colmod = colmod || this.obj.inputs.isunique.getModify() == 'modifyok';
      
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );

    if ( colmod && this.okaction == 'mod')
    {
      if ( this.del_index({}) != 'ok' )
      {
        MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {} );
        throw { message : this.txtGetText('#mne_lang#Fehler beim Löschen des Index') };
      }
    }
    p = { sqlend : 1 };
    p = this.getParam(p);
    if ( colmod == false ) 
    {
      p.par0 = '';
      p.par1 = '';
    }
    if ( typeof this.btnrequest[this.okaction] == 'undefined' )
      throw { message : this.txtSprintf(this.txtGetText('#mne_lang#keine Buttonaktion für <$1> definiert'),this.okaction) }
    if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/func/execute.xml",  p ) == 'ok' )
    {
      MneAjaxWeblet.prototype.write.call(this, "/db/admin/table/conrefresh.xml", { sqlend : 1 } );
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }
  
  weblet.del = function()
  {
    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( this.del_index( {sqlend: 1} ) == 'ok' )
    {
      MneAjaxWeblet.prototype.write.call(this, "/db/admin/table/conrefresh.xml", { sqlend : 1 } );
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
