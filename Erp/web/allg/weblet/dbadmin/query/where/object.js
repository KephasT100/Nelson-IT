// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/query/where
// ================================================================================
{
  weblet.loadview();
   
  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");

  weblet.initpar.schema = 'mne_application';
  weblet.initpar.table = 'querywheres'
  weblet.initpar.cols = 'notoperator,leftbrace,lefttab,leftvalue,operator,righttab,rightvalue,rightbrace,booloperator'
  weblet.initpar.scols = 'wherecol'
    
  weblet.obj.mkbuttons = 
  [
    { id : 'up', value : unescape("%uf077"), font : 'SymbolFont1'   },
    { id : 'down', value : unescape("%uf078") , font : 'SymbolFont1' },
    { id : 'add', value : weblet.txtGetText("#mne_lang#Neu") },
    { id : 'del', value : weblet.txtGetText("#mne_lang#Löschen") },
  ];

	  
  var attr =
  {
  };
 
  weblet.findIO(attr);

  weblet.obj.tables.where.selectRows = true
  weblet.obj.tables.where.plain = false;
  weblet.obj.tables.where.ignoreUnselect = true;

  weblet.showids = new Array("queryid");
  weblet.obj.cols = "'####selection####wnot#####NOT####',"
                             + "'####text####wleftbrace####',"
                             + "'####text####wlefttab####',"
                             + "'####text####wleftval####',"
                             + "'####selection####wop####=#!=#<#>#<=#>=#isnull#like####',"
                             + "'####text####wrighttab####',"
                             + "'####text####wrightval####',"
                             + "'####text####wrightbrace####',"
                             + "'####selection####wboolop#####AND#OR####'";
  
  weblet.mkRow = function(values)
  {
      var k;
      var str = "";
      var attr =
      {
              wnot : { value               : ( values[0][0] != 'f' ) ? "NOT" : "" },
        wleftbrace : { value               : ( values[1][0] != 'f' ) ? "(" : "",
                       onclick             : function() { if ( this.value == "" ) this.value = "("; else this.value = ""; MneMisc.prototype.inOnmodify.call(this);},
                       "style.borderStyle" : "outset",
                       "style.width"       : "1em",
                       "style.textAlign"   : "center" },

        wlefttab  :  { value               : values[2] ,
                       "style.width"       : "3em" },

        wleftval :  { value               :  ( values[3] == 'session_user' || values[3] == 'current_user' || values[3] == 'current_database()'  ) ? '\'' + values[3] + '\'' : values[3],
                       "style.width"       : "10em" },

        wop :         { value               : values[4]},

        wrighttab :  { value               : values[5],
                       "style.width"       : "3em" },

        wrightval :  { value               : ( values[6] == 'session_user' || values[6] == 'current_user' || values[6] == 'current_database()' ) ? '\'' + values[6] + '\'' : values[6],
                       "style.width"       : "10em" },

        wrightbrace : { value               : ( values[7][0] != 'f' ) ? ")" : "",
                       onclick             : function() { if ( this.value == "" ) this.value = ")"; else this.value = ""; MneMisc.prototype.inOnmodify.call(this);},
                       "style.borderStyle" : "outset",
                       "style.width"       : "1em",
                       "style.textAlign"   : "center" },
                       
        wboolop    : { value               : values[8] }
      }
      
      eval("this.obj.tables.where.add(" + this.obj.cols + ")");
      this.eleSetAttributes(this.obj.tables.where.body.rows[this.obj.tables.where.body.rows.length - 1], this.obj.tables.where.body.rows[this.obj.tables.where.body.rows.length - 1], attr);

  }
  
  weblet.showValue = function(weblet)
  {
    var str = "";
    var i,k;
    
      MneAjaxWeblet.prototype.readData.call(this, weblet);   

    if ( weblet.act_values.queryid != this.act_values.queryid )
      this.obj.param = {};
    
    if ( this.obj.hidden == true ) return;
    this.clearModify();
    for ( i in this.obj.buttons )
      this.eleMkClass(this.obj.buttons[i], "modify", false);
    
    this.obj.tables.where.clear();
    this.obj.tables.where.addHead("", "", "#mne_lang#TNR", "#mne_lang#Spalte/Wert", "", "#mne_lang#TNR", "#mne_lang#Spalte/Wert", "", "" );
    for ( i = 0; i<this.values.length; i++ )
      this.mkRow(this.values[i]);

  }

  weblet.activated = function()
  {
    this.parent.subweblets['table'].setSelectweblet(this);
  }
  
  weblet.func = function(weblet)
  {
  }
  
  weblet.select = function(weblet)
  {
    this.setModify();
    if ( this.obj.tables.where.act_cell == null )
    {
      alert(this.txtGetText("#mne_lang#Keine Zeile ausgewählt"));
    }
    else if ( this.obj.tables.where.act_cell.datafield.id == "wleftval" || this.obj.tables.where.act_cell.datafield.id == "wlefttab" )
    {
      this.obj.tables.where.body.rows[this.obj.tables.where.act_rownum].cells[2].datafield.value = weblet.act_values.tabnum;
      this.obj.tables.where.body.rows[this.obj.tables.where.act_rownum].cells[3].datafield.value = weblet.obj.selectvalue;
      this.eleMkClass(this.obj.tables.where.body.rows[this.obj.tables.where.act_rownum].cells[2].datafield, "modifyok", true);
      this.eleMkClass(this.obj.tables.where.body.rows[this.obj.tables.where.act_rownum].cells[3].datafield, "modifyok", true);
    }
    else if ( this.obj.tables.where.act_cell.datafield.id == "wrightval" || this.obj.tables.where.act_cell.datafield.id == "wrighttab" )
    {
      this.obj.tables.where.body.rows[this.obj.tables.where.act_rownum].cells[5].datafield.value = weblet.act_values.tabnum;
      this.obj.tables.where.body.rows[this.obj.tables.where.act_rownum].cells[6].datafield.value = weblet.obj.selectvalue;
      this.eleMkClass(this.obj.tables.where.body.rows[this.obj.tables.where.act_rownum].cells[5].datafield, "modifyok", true);
      this.eleMkClass(this.obj.tables.where.body.rows[this.obj.tables.where.act_rownum].cells[6].datafield, "modifyok", true);
    }
    else
    {
      alert(this.txtGetText("#mne_lang#Kein Feld ausgewählt"));
    }
      
  }
  
  weblet.up = function(weblet)
  {
    this.obj.tables.where.up();
  }

  weblet.down = function(weblet)
  {
    this.obj.tables.where.down();
  }
  
  weblet.add = function(weblet)
  {
	this.mkRow(new Array("false","false","","","","","","false","AND"));
	this.setModify(this.obj.tables.where.body.rows[this.obj.tables.where.body.rows.length - 1],'modifyok');
  }
  
  weblet.del = function(weblet)
  {
    r = this.obj.tables.where.delRow(this.obj.tables.where.act_rownum);
  }  
}
