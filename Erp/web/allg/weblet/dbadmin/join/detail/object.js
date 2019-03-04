// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/join/detail
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");

  var ivalues = 
  {
      schema : 'mne_application',
      query  : 'join_all',
      table  : 'joindef',
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();

  var attr = 
  {
      fschemaInput     : { checktype : weblet.inChecktype.notempty },
      tschemaInput     : { checktype : weblet.inChecktype.notempty },
      ftabInput        : { checktype : weblet.inChecktype.notempty },
      ttabInput        : { checktype : weblet.inChecktype.notempty }
  }
  
  weblet.findIO(attr);
  weblet.showLabel();
  weblet.clearModify();
  
  weblet.getParam = MneAjaxWeblet.prototype.getParam;
  weblet.showids = new Array("joindefid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#neuer Join");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Join bearbeiten");
  weblet.onbtnobj = weblet.parent.subweblets['joins'];
  
  weblet.obj.opparent = weblet.obj.tables.content.frame.parentNode;
  
  weblet.obj.tables.content.addHead(weblet.txtGetText('#mne_lang#erste Tabelle'), weblet.txtGetText('#mne_lang#Operator'),weblet.txtGetText('#mne_lang#zweite Tabelle'));
  weblet.eleMkClass(weblet.obj.tables.content.table, "left", true);
      
  weblet.defvalues = { typ : "1"};
  
  weblet.showValue = function(weblet, param)
  {
    if ( weblet == null ) return;
    
    if ( weblet.id == 'firsttab')
    {
     this.add();

      if (typeof weblet.act_values.schema != 'undefined')
      {
        this.act_values.fschema =  weblet.act_values.schema;
        this.showInput(this.obj.inputs.fschema, weblet.act_values.schema);
      }
      if (typeof weblet.act_values.table != 'undefined')
      {
        this.act_values.ftab = weblet.act_values.table;
        this.showInput(this.obj.inputs.ftab, weblet.act_values.table);
      }

      if (typeof weblet.act_values.schema != 'undefined' && typeof weblet.act_values.table != 'undefined') 
          this.obj.tables.content.head.rows[0].cells[0].firstChild.data = this.act_values.fschema + "." + this.act_values.ftab;
     this.obj.tables.content.clearBody();
    }
    else if ( weblet.id == 'secondtab')
    {
      if (typeof weblet.act_values.schema != 'undefined')
      {
        this.act_values.tschema = weblet.act_values.schema;
        this.showInput(this.obj.inputs.tschema, weblet.act_values.schema);
      }
      if (typeof weblet.act_values.table != 'undefined')
      {
        this.act_values.ttab = weblet.act_values.table;
        this.showInput(this.obj.inputs.ttab, weblet.act_values.table);
      }
      if (typeof weblet.act_values.schema != 'undefined' && typeof weblet.act_values.table != 'undefined')
        this.obj.tables.content.head.rows[0].cells[2].firstChild.data = this.act_values.tschema + "." + this.act_values.ttab;

      this.obj.tables.content.clearBody();
    }
  }
  
  weblet.select = function(weblet, value)
  {
    var i;
    
    if ( this.obj.inputs.fschema.value == '' ||
         this.obj.inputs.tschema.value == '' ||
         this.obj.inputs.ftab.value == '' ||
         this.obj.inputs.ttab.value == '')
    {
      alert(this.txtGetText('#mne_lang#Bitte erst die erste und die zweite Tabelle aussuchen'));
      return;
    }
    
    if ( this.obj.tables.content.frame.parentNode != this.obj.opparent )
    {
      this.obj.opparent.innerHTML = '<input type="hidden" id="opInput" style="width: 100%" value="' + this.obj.inputs.op.value + '"/>';
      this.obj.inputs.op = this.obj.opparent.firstChild;
      this.eleMkInputsSingle(this.obj.inputs.op)
      this.obj.opparent.appendChild(this.obj.tables.content.frame);
    }
    
    if ( weblet.id == 'firsttab')
    {
      if ( weblet.act_values.schema != this.obj.inputs.fschema.value || weblet.act_values.table != this.obj.inputs.ftab.value )
      {
        this.add();
        
        this.act_values.fschema =  weblet.act_values.schema;
        this.act_values.ftab = weblet.act_values.table;
        this.showInput(this.obj.inputs.fschema, weblet.act_values.schema);
        this.showInput(this.obj.inputs.ftab, weblet.act_values.table);

        this.obj.tables.content.head.rows[0].cells[0].firstChild.data = this.act_values.fschema + "." + this.act_values.ftab;
        this.obj.tables.content.clearBody();
      }
      if ( typeof value != 'undefined')
      {
        if ( this.obj.tables.content.act_rownum < 0 )
        {
          this.obj.tables.content.plain = false;
          this.obj.tables.content.add('####text####val1####' + value,'####selection####wop####=#!=#<#>#<=#>=#isnull#like####','####text####val2####' + value);
          this.eleMkClass(this.obj.tables.content.body.rows[this.obj.tables.content.getLength() - 1].cells[0].firstChild, "modifyok", true, "modify");
          this.eleMkClass(this.obj.tables.content.body.rows[this.obj.tables.content.getLength() - 1].cells[1].firstChild, "modifyok", true, "modify");
          this.eleMkClass(this.obj.tables.content.body.rows[this.obj.tables.content.getLength() - 1].cells[2].firstChild, "modifyok", true, "modify");
        }
        else
        {
          this.obj.tables.content.act_row.cells[0].datafield.value = value;
          this.obj.tables.content.reset();
        }
      }
    }
    else if ( weblet.id == 'secondtab')
    {
      if ( weblet.act_values.schema != this.obj.inputs.tschema.value || weblet.act_values.table != this.obj.inputs.ttab.value )
      {
        this.act_values.tschema =  weblet.act_values.schema;
        this.act_values.ttab = weblet.act_values.table;
        this.showInput(this.obj.inputs.tschema, weblet.act_values.schema);
        this.showInput(this.obj.inputs.ttab, weblet.act_values.table);
        this.obj.tables.content.head.rows[0].cells[2].firstChild.data = this.act_values.tschema + "." + this.act_values.ttab;
        this.obj.tables.content.clearBody();
      }
      if ( typeof value != 'undefined')
      {
        if ( this.obj.tables.content.act_rownum < 0 )
        {
          this.obj.tables.content.plain = false;
          this.obj.tables.content.add('####text####val1####' + value,'####selection####wop####=#!=#<#>#<=#>=#isnull#like####','####text####val2####' + value);
          this.eleMkClass(this.obj.tables.content.body.rows[this.obj.tables.content.getLength() - 1].cells[0].firstChild, "modifyok", true, "modify");
          this.eleMkClass(this.obj.tables.content.body.rows[this.obj.tables.content.getLength() - 1].cells[1].firstChild, "modifyok", true, "modify");
          this.eleMkClass(this.obj.tables.content.body.rows[this.obj.tables.content.getLength() - 1].cells[2].firstChild, "modifyok", true, "modify");
        }
        else
        {
          this.obj.tables.content.act_row.cells[2].datafield.value = value;
          this.obj.tables.content.reset();
        }
      }
    }
    return false;
  }
  
  weblet.func = function()
  {
    if ( this.obj.inputs.fschema.value == '' ||
        this.obj.inputs.tschema.value == '' ||
        this.obj.inputs.ftab.value == '' ||
        this.obj.inputs.ttab.value == '')
   {
     alert(this.txtGetText('#mne_lang#Bitte erst die erste und die zweite Tabelle aussuchen'));
     return;
   }
   
    if ( this.obj.tables.content.frame.parentNode == this.obj.opparent )
    {
      this.obj.tables.content.unselect();
      this.obj.opparent.removeChild(this.obj.tables.content.frame);
      this.obj.opparent.innerHTML = '<span class="label">#mne_lang#Funktion#</span><input type="text" id="opInput" style="width: 100%" value="' + this.obj.inputs.op.value + '"/>';
      this.obj.inputs.op = this.obj.opparent.querySelector('#opInput');
      this.eleMkInputsSingle(this.obj.inputs.op);
    }
    return false;
  }
  
  weblet.checkmodified = function()
  {
    return false;
  }
  
  weblet.ok = function()
  {

    var fcols,tcols,op;
    var i;
    var result;

    if ( this.obj.tables.content.frame.parentNode == this.obj.opparent )
    {
      fcols = tcols = op = "";
      for ( i=0; i< this.obj.tables.content.getLength(); i++)
      {
        fcols = fcols + this.obj.tables.content.body.rows[i].cells[0].datafield.value + ",";
        op    = op    + this.obj.tables.content.body.rows[i].cells[1].datafield.value + ",";
        tcols = tcols + this.obj.tables.content.body.rows[i].cells[2].datafield.value + ",";
      }

      fcols = fcols.substring(0,fcols.length -1 );
      tcols = tcols.substring(0,tcols.length -1 );
      op    =    op.substring(0,op.length -1 );

      this.obj.inputs.fcols.value = fcols;
      this.obj.inputs.tcols.value = tcols;
      this.obj.inputs.op.value = op;
    }
    else
    {
      this.obj.inputs.fcols.value = '';
      this.obj.inputs.tcols.value = '';
    }
    
    var p =
    {
      "schema"            : this.initpar.schema,
      "table"             : this.initpar.table,
      "sqlend"            : 1
    };

    p = this.getParam(p);

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/insert.xml",  p );
    
    if ( result == 'ok' )
    {
      this.parent.weblets['joins'].showValue(this.parent.weblets['joins'].depend);
      this.add();
      return false;
    }
    return true;
  }
}
