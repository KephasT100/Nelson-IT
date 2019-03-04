// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/table/edit
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();

  weblet.findIO();
  weblet.obj.enablebuttons = {};
  weblet.showValue = function(weblet,param)
  {
    var i = null;

    if ( weblet != this )
    {
      var tablenameweblet = this.parent.subweblets[this.initpar.tablenameweblet];
      if ( typeof tablenameweblet.act_values.schema == 'undefined' ||
           typeof tablenameweblet.act_values.table  == 'undefined' )
      {
        alert(this.txtGetText('#mne_lang#Bitte erst Tabellen auswählen'));
        return false;
      }

      this.initpar.schema = tablenameweblet.act_values.schema;
      this.initpar.table  = tablenameweblet.act_values.table;
      this.initpar.title  = this.initpar.schema + '.' + this.initpar.table;

      this.titleString.add = this.txtGetText("#mne_lang#Spalte hinzufügen" + ": " + this.initpar.schema + "." + this.initpar.table);
      this.titleString.mod = this.txtGetText("#mne_lang#Spalte bearbeiten" + ": " + this.initpar.schema + "." + this.initpar.table);

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
      this.showids = new Array();
      delete this.initpar.scols;
      
      for ( i in this.ids )
      {
        if ( tablenameweblet.act_values.haveusertimecolumn && ( i == 'createdate' || i == 'createuser' || i == "modifydate" || i == 'modifyuser' ))
          continue;
        
        var r;
        r = this.obj.tables.content.add(this.names[this.ids[i]], '####' + 'text' + '####' + i + 'Input####');
        this.obj.inputs[i] = this.obj.tables.content.body.rows[r].cells[1].datafield;
        this.obj.inputs[i].style.width = "40em";
        switch(this.typs[this.ids[i]])
        {
        case "1000":
        case "1001": 
          this.obj.inputs[i].inputtyp = 'date';
          this.obj.inputs[i].mne_timevalue = 0;
          this.obj.inputs[i].onkeyup = MneMisc.prototype.inOndate;
          break;
        case "1002":
        case "1003": 
          this.obj.inputs[i].inputtyp = 'time';
          this.obj.inputs[i].mne_timevalue = 0;
          this.obj.inputs[i].onkeyup = MneMisc.prototype.inOntime;
          break;
        }
        this.create_checkpopup(this.obj.inputs[i], this.regexps[this.ids[i]]);
      }
      this.clearModify();

      p =
      {
          schema   : 'mne_application',
          query    : 'table_pkey',
          cols     : 'column',
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
        for ( i =0; i<this.values.length; i++ )
          this.showids[i] = this.values[i][0];
        MneAjaxWeblet.prototype.showValue.call(this,weblet,{ignore_notdefined : true, ignore_notfound : true } );
        if ( this.values.length == 0 ) this.add();
        this.obj.buttons.ok.disabled = false;
        this.obj.buttons.cancel.disabled = false;
        this.obj.buttons.add.disabled = false;
        this.obj.buttons.del.disabled = false;
      }
      else
      {
        this.obj.title.innerHTML = this.txtGetText('#mne_lang#editieren nicht möglich') + ": " + this.initpar.schema + "." + this.initpar.table;
        this.obj.buttons.ok.disabled = true;
        this.obj.buttons.cancel.disabled = true;
        this.obj.buttons.add.disabled = true;
        this.obj.buttons.del.disabled = true;
      }
      
      {
        var popup = this.popup;
        var timeout = function() { popup.resize.call(popup, true, false); };
        window.setTimeout(timeout, 0);
      }
      return true;
    }

    return MneAjaxWeblet.prototype.showValue.call(this,weblet,param);
  };

  weblet.getParam = function(p)
  {
    return MneAjaxWeblet.prototype.getParam.call(this,p);
  };

  weblet.add = function()
  {
    this.okaction = 'add';
    this.obj.title.innerHTML = this.titleString.add;
  };
  
  weblet.ok = function()
  {
    return MneAjaxWeblet.prototype.ok.call(this);
  };
  
  weblet.del = function()
  {
    return MneAjaxWeblet.prototype.del.call(this);
  };
  
}