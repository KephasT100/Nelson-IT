// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/query/column
// ================================================================================
{
  weblet.loadview();

  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");
  weblet.initpar.cols = 'tnr,schema,table,row,columnid,language,group,musthaving,typ,format,deutsch,englisch';
  weblet.initpar.scols = 'colnum';

  weblet.obj.mkbuttons = 
    [
      { id : 'up', value : unescape("%uf077"), font : 'SymbolFont1'   },
      { id : 'down', value : unescape("%uf078"), font : 'SymbolFont1' },
      { id : 'del', value : weblet.txtGetText("#mne_lang#Löschen") },
    ];

  weblet.showids = new Array("queryid");

  var attr =
  {
      delButton :      { value : weblet.txtGetText("#mne_lang#Löschen#") }
  };
  weblet.findIO(attr);

  weblet.obj.tables.column.selectRows = true;
  weblet.obj.tables.column.plain = false;
  weblet.obj.tables.column.ignoreUnselect = true;

  weblet.obj.cols = new Array( "####text\####jtabnum####", 
      "####hidden\####schema\####", 
      "####hidden\####tab\####", 
      "####text\####col\####", 
      "####text\####colid\####", 
      "####bool\####lang\####", 
      "####bool\####groupby\####", 
      "####bool\####musthaving\####", 
      "####hidden\####typ\####", 
      "####text\####format\####", 
      "####text\####colname_de\####", 
  "####text\####colname_en\####");

  weblet.mkRow = function(values)
  {
    var k;
    var str = "";
    if ( values[0] != -1 ) this.obj.cols[8] = "####hidden\####typ\########"; else this.obj.cols[8] = "####selection\####typ\####0%          #1%bool#2%char#3%short#4%long#5%float#6%double#1000%datetime#1001%date#1002%time#1003%interval#1004%day#1005%quarter#1006%cdatetime#1007%cdate#1008%ctime#1100%column####";
    for ( k=0; k<values.length; k++ )
      str = str + "'" + this.obj.cols[k] + this.txtMascarade(values[k]) + "',";
    str = str.substring(0, str.length - 1);
    eval("this.obj.tables.column.add(" + str + ")");

    if ( values[0] == -1 ) 
      this.obj.tables.column.body.rows[this.obj.tables.column.body.rows.length - 1].cells[8].datafield.value = values[8];

    this.obj.tables.column.body.rows[this.obj.tables.column.body.rows.length - 1].cells[0].datafield.size = 5;
    this.obj.tables.column.body.rows[this.obj.tables.column.body.rows.length - 1].cells[9].datafield.size = 8;

    this.obj.tables.column.body.rows[this.obj.tables.column.body.rows.length - 1].cells[3].datafield.weblet = this;
    this.obj.tables.column.body.rows[this.obj.tables.column.body.rows.length - 1].cells[3].datafield.ondblclick = function() { this.weblet.edit(this); };

  };

  weblet.showValue = function(weblet)
  {
    var str = "";
    var i = null;

    if ( weblet == null ) return;
    if ( weblet.act_values.queryid != this.act_values.queryid ) this.obj.param = {};
    if ( this.obj.hidden == true ) return;

    MneAjaxWeblet.prototype.readData.call(this, weblet);   

    this.clearModify();
    for ( i in this.obj.buttons )
      this.eleMkClass(this.obj.buttons[i], "modify", false);

    this.obj.tables.column.clear();

    str = "";
    for ( i in this.ids )
      str = str + "'" + this.txtMascarade(this.names[this.ids[i]]) + "',";
    str = str.substring(0, str.length - 1);
    eval("this.obj.tables.column.addHead(" + str + ")");

    for ( i = 0; i<this.values.length; i++ )
      this.mkRow(this.values[i]);
  };

  weblet.activated = function()
  {
    this.parent.subweblets['table'].setSelectweblet(this);
  };

  if ( weblet.navigator == "MSIE" )
  {
    weblet.rhidden = function()
    {
      this.obj.param = this.getParam({});
      this.obj.hidden = true;
    };

    weblet.rshow = function()
    {
      this.obj.hidden = false;
    };

    weblet.getParam = function(pp)
    {
      if ( this.obj.hidden == true )
      {
        var i = null;
        var p = pp;
        
        for ( i in this.obj.param )
          p = this.addParam(p, i, this.obj.param[i]);
        return p;
      }

      return MneAjaxWeblet.prototype.getTableparam.call(this,pp);
    };

    weblet.getIdParam = function(p)
    {
      this.error(this.id + ": getIdparam ist nicht definiert");
      return p;
    };
  }

  weblet.func = function(weblet)
  {
    var values = new Array("-1","","", "", "", "", "", "", "", "", "", "");
    this.mkRow(values);
    this.setModify(this.obj.tables.column.body.rows[this.obj.tables.column.body.rows.length - 1],'modifyok');
  };

  weblet.select = function(weblet)
  {
    var values = new Array(String(weblet.act_values.tabnum),String(weblet.act_values.schema),String(weblet.act_values.table), weblet.obj.selectvalue, weblet.obj.selectvalue, "", "", "", "", "", "", "");
    this.mkRow(values);
    this.setModify(this.obj.tables.column.body.rows[this.obj.tables.column.body.rows.length - 1],'modifyok');
  };

  weblet.up = function(weblet)
  {
    this.obj.tables.column.up();
  };

  weblet.down = function(weblet)
  {
    this.obj.tables.column.down();
  };

  weblet.del = function(weblet)
  {
    this.obj.tables.column.delRow(this.obj.tables.column.act_rownum);
  };

  weblet.edit = function(obj)
  {
    this.act_values.text = obj.value;
    this.obj.act_edit = obj;

    if ( typeof this.initpar.popup != 'undefined')
    {
      var popup = this.parent.popups[this.initpar.popup];
      popup.show(false,false);
      if ( popup.weblet.showValue(this) == false )
      {
        popup.hidden();
        this.obj.act_edit = null;
      }
      else
        popup.weblet.onbtnobj = this;

      {
        var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize != false, popup.weblet.initpar.popup_repos == true); };
        window.setTimeout(timeout, 10);
      }
    }
    return false;
  };

  weblet.onbtnclick = function(id, button)
  {
    if ( id == 'ok' )
    {
      if ( this.obj.act_edit !=  null )
      {
        if ( this.obj.act_edit.value != button.weblet.act_values.text )
        {
          this.obj.act_edit.value = button.weblet.act_values.text;
          this.obj.act_edit.onkeyup();
        }
      }
      this.obj.act_edit = null;
    }
  };


  weblet.ok = function() {};
  weblet.add = function() {};

}