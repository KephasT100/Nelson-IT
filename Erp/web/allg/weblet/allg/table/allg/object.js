// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/table/allg
// ================================================================================
{
  var i;

  weblet.obj.tables.content.table.style.marginRight = "auto";
  weblet.obj.tables.content.clickCb["head"] = function(tab) { tab.weblet.clickHead.call(tab.weblet, tab); };
  weblet.obj.tables.content.clickCb["body"] = function(tab) { tab.weblet.clickBody.call(tab.weblet, tab); };
  weblet.obj.tables.content.dblclickCb["body"] = function(tab) { tab.weblet.dblclickBody.call(tab.weblet, tab); };
  weblet.obj.tables.content.ignoreUnselect = true;
  weblet.obj.tables.content.multiselect = ( weblet.initpar.multiselect != false );
 
  weblet.obj.tables.content.table.checkinside = true;

  if ( typeof weblet.initpar.tablehidecols != 'undefined' )
  {
    var cols = weblet.initpar.tablehidecols.split(',');
    for ( var i = 0; i<cols.length; i++ )
      weblet.obj.tables.content.setInvisible(parseInt(cols[i]));
  }
  
  weblet.obj.showdynparvalues = {};
  
  weblet.obj.mkbuttons =
  [
    { id : 'select', value : unescape("%uf0c9"), size : 'notset', classname : 'mobile', show : ! weblet.eleIsNotdefined(weblet.initpar.selectpopup)   },
    { id : 'refresh', value : weblet.txtGetText('#mne_lang#Aktualisieren') },
    { id : 'ok',  value : weblet.txtGetText('#mne_lang#OK'), space : 'before', show : ( typeof weblet.initpar.okfunction != 'undefined' || typeof weblet.initpar.oktable != 'undefined' || weblet.initpar.nodelok == true ) },
    { id : 'showdetail', value : ( typeof weblet.initpar.showlabel[weblet.win.mne_config.language] != 'undefined' ) ? weblet.initpar.showlabel[weblet.win.mne_config.language] : weblet.initpar.showlabel['de'], show : typeof weblet.initpar.popup != 'undefined' || typeof weblet.initpar.detailweblet != 'undefined'  },
    { id : 'mdel', value : weblet.txtGetText('#mne_lang#Löschen'), space : 'before', show : ( typeof weblet.initpar.popup != 'undefined' || typeof weblet.initpar.delparam != 'undefined' || typeof weblet.initpar.delfunction != 'undefined' || typeof weblet.initpar.deltable != 'undefined' ) },
    { id : 'print',   value :  weblet.txtGetText('#mne_lang#Drucken'), space : "before" } ,
    { id : 'exports', value :  weblet.txtGetText('#mne_lang#Exportieren'), space : (( typeof weblet.initpar.report != 'undefined' ) ? '' : 'before' ) }
  ]
  
  weblet.obj.enablebuttons = ['showdetail'];
  weblet.obj.enablebuttonsvalue = [ 'ok', 'mdel' ];

  weblet.loadbuttons = function ()
  {
    MneAjaxWeblet.prototype.loadbuttons.call(this);

    if ( this.initpar.showquerycol == true || this.win.mne_config.loginname == 'admindb' )
    {

      this.obj.buttonframe.appendChild(this.doc.createElement('div'));
      this.obj.buttonframe.lastChild.className = 'webletbutton';
      this.obj.buttonframe.lastChild.innerHTML = ('<div class="ele-wrapper"><span>#mne_lang#Abfrage Zeigen#: </span></div><input id="queryInput" type="checkbox">');

      this.obj.inputs.query = this.obj.buttonframe.querySelector('#queryInput');
      this.eleMkInputsSingle(this.obj.inputs.query);
      
    }
    
    this.enable(false);
    this.enablevalue(false);
  }

  weblet.keydown = function(evt, inside)
  {
    return this.keydownBase(evt, inside);
  };

  weblet.moveCursor = function(c,r)
  {

    if ( this.obj.tables.content.body.rows.length <= r && this.obj.tables.content.body.rows[r].cells.length <= c )
      return;

    var cell = this.obj.tables.content.body.rows[r].cells[c];
    if ( typeof cell.datafield != 'undefined' && typeof cell.datafield.valuefield != 'undefined' ) 
    {
      cell.datafield.valuefield.focus();
      return;
    }

    if ( MneMisc.prototype.navigator == "MSIE" )
    {
      cell.focus();
    }
    else
    {
      var range = this.doc.createRange();
      range.setStart(cell,0);
      try
      {
        this.win.getSelection().removeAllRanges();
        this.win.getSelection().addRange(range);
      }
      catch(e)
      {
      }
      cell.focus();
    }
  };

  weblet.checkInside  = function (evt, frame)
  {
    var f = frame;
    if ( typeof f == 'undefined' ) f = this.obj.tables.content.table;
    //if ( evt.target.tagName == "INPUT" || evt.target.tagName == "TEXTAREA" ) return false;
    return window.mneDocevents.checkInside.call(this, evt, f);
  };


  weblet.obj.lastkey = null;
  weblet.keydownBase = function(evt, inside)
  {

    if ( inside == true || this.checkInside(evt) )
    {
      
      var r = this.obj.tables.content.act_rownum;
      var c = this.obj.tables.content.act_colnum;

      if ( r < 0 || c < 0 ) return MneAjaxWeblet.prototype.keydown.call(this, evt, true);

      switch(evt.keyCode)
      {
      case 38 :
        if ( r > 0  )
        {
          if ( evt.shiftKey == true )
          {
            evt.shiftKey = false;
            evt.ctrlKey = true;
          }
          this.obj.tables.content.act_event = evt;
          if ( evt.ctrlKey == true && this.obj.lastkey != null && this.obj.lastkey != evt.keyCode )
            this.obj.tables.content.findCell(this.obj.tables.content.body.rows[r].cells[c]);
          else 
            this.obj.tables.content.findCell(this.obj.tables.content.body.rows[--r].cells[c]);
          this.obj.tables.content.act_event = null;
          if ( this.obj.tables.content. act_rownum == - 1)
            this.obj.tables.content.findCell(this.obj.tables.content.body.rows[r].cells[c]);
          if ( typeof this.parent.popups[this.initpar.popup] != 'undefined' && this.parent.popups[this.initpar.popup].isclose == false )
            this.showdetail();
          this.obj.lastkey = evt.keyCode;
        }    
        break;
      case 40 :
        if ( evt.shiftKey == true )
        {
          evt.shiftKey = false;
          evt.ctrlKey = true;
        }
        if ( r < ( this.obj.tables.content.body.rows.length - 1 ) )
        {
          this.obj.tables.content.act_event = evt;
          if ( evt.ctrlKey == true && this.obj.lastkey != null && this.obj.lastkey != evt.keyCode )
            this.obj.tables.content.findCell(this.obj.tables.content.body.rows[r].cells[c]);
          else 
            this.obj.tables.content.findCell(this.obj.tables.content.body.rows[++r].cells[c]);
          this.obj.tables.content.act_event = null;
          if ( this.obj.tables.content. act_rownum == - 1)
            this.obj.tables.content.findCell(this.obj.tables.content.body.rows[r].cells[c]);
          if ( typeof this.parent.popups[this.initpar.popup] != 'undefined' && this.parent.popups[this.initpar.popup].isclose == false )
            this.showdetail();
          this.obj.lastkey = evt.keyCode;
        }
        break;
      case  9 :
        if ( typeof this.obj.sendkeyele != 'undefined' && typeof this.obj.sendkeyele.onkeydown == 'function')
          this.obj.sendkeyele.onkeydown(evt);
        return false;
      case 113:
          try {if ( typeof this.initpar.okfunction != 'undefined' || typeof this.initpar.oktable != 'undefined' ) this.ok(); } catch (e) { this.exception("MneAjaxTable::F2 - " + this.table.weblet.id, e); }
          return false;
      case 13 :
          this.showdetail();
          return;
      default:
        if ( typeof this.obj.sendkeyele != 'undefined' && typeof this.obj.sendkeyele.onkeydown == 'function')
          this.obj.sendkeyele.onkeydown(evt);
        else
          return MneAjaxWeblet.prototype.keydown.call(this, evt, true);
      }
      this.moveCursor(c,r);
      return false;
    }
    return MneAjaxWeblet.prototype.keydown.call(this, evt);
  };
  
  weblet.focus = function(row,col)
  {
    var i;
    var r = row;
    var rows = this.obj.tables.content.body.rows;

    if ( typeof r == 'undefined' ) r = rows.length - 1; 
    if ( typeof col != 'undefined' )
    {
      rows[r].cells[col].datafield.focus()
      return;
    }

    for ( i = 0; i< rows[r].cells.length; i++ )
    {
      if ( typeof rows[r].cells[i].datafield != 'undefined' )
      {
        rows[r].cells[i].datafield.focus();
        break;
      }
    }
  }

  weblet.showValueBase = function(weblet,param)
  {
    var i = null;
    var have_readed;
    var p;
   
    if ( typeof param == 'undefined' || param == null ) p = {}; else p = param;
    
    if ( p.setdependweblet == this && p.setdependid == 'select' ) return;
    
    if ( typeof p.no_vals == 'undefined' )  p.no_vals  = ( this.initpar.no_vals == true);
    if ( typeof p.notclose == 'undefined' ) p.notclose = ( this.initpar.notclose == true);
    
    p.no_perror = true;
    p.intl = 1;
    
    for ( i in this.inputlist_data )
      if ( typeof this.inputlist_data[i].result == 'object' ) delete this.inputlist_data[i].result;

    if ( weblet != this && weblet != null )
    {
      var w;
      
      if ( typeof this.initpar.showdynparweblet == 'undefined') this.obj.showdynparweblet = weblet;
      if ( typeof this.initpar.showdynparweblet == 'object' ) this.obj.showdynparweblet = this.initpar.showdynparweblet;
      if ( typeof this.initpar.showdynparweblet == 'string' ) this.obj.showdynparweblet = this.parent.subweblets[this.initpar.showdynparweblet];
      
      w = this.obj.showdynparweblet;
      for ( i in this.showdynpar)
      {

        this.obj.showdynparvalues = {};
        if (typeof w.act_values[this.showdynpar[i]] != 'undefined')
          this.obj.showdynparvalues[i.substr(0, i.indexOf("Input.old"))] = w.act_values[this.showdynpar[i]];
        else if ( this.showdynpar[i][0] == '#')
          this.obj.showdynparvalues[i.substr(0, i.indexOf("Input.old"))] = this.showdynpar[i].substr(1);
      }
      
      for ( i in w.act_values ) this.obj.showdynparvalues[i] = w.act_values[i];
    }
    else
    {
      this.obj.scrollTop = this.scrollframe.scrollTop;
      this.obj.scrollLeft = this.scrollframe.scrollLeft;
    }

   if ( ( this.initpar.showquerycol == true || this.win.mne_config.loginname == 'admindb' ) && this.obj.inputs.query.checked == true )
      p.lastquery = 1;

    have_readed = MneAjaxWeblet.prototype.showTable.call(this, weblet, p);
    this.enable(have_readed &&  ( !this.initpar.checkid || this.eleHavevalue(this.obj.showdynparvalues[this.initpar.checkid])) );
    
    this.obj.old_rownum = -1;
    if ( weblet != null )
      for ( i in weblet.act_values ) if ( typeof weblet.act_values[i] != 'undefined' && typeof this.ids[i] == 'undefined') this.act_values[i] = weblet.act_values[i];

    if ( this.initpar.holddynparvalues != true && this.values.length > 0 )
      for ( i in this.ids ) if ( typeof this.obj.showdynparvalues[i] != 'undefined' && i != 'table' && i != 'schema') delete this.obj.showdynparvalues[i];

    if ( typeof this.initpar.cleardynparvalues != 'undefined')
    {
      var v = this.initpar.cleardynparvalues.split(',');
      for ( i = 0; i<v.length; i++) 
      {
        if ( typeof this.obj.showdynparvalues[v[i]] != 'undefined' && i != 'table' && i != 'schema') delete this.obj.showdynparvalues[v[i]];
      }
    }

    for (i in this.obj.showdynparvalues)
      this.act_values[i] = this.obj.showdynparvalues[i];

    this.obj.act_schema = this.act_values.schema;
    this.obj.act_table  = this.act_values.table;
    
    this.enablevalue(false);

    if ( typeof this.initpar.popup != 'undefined' )
    {
      if ( p.notclose != true )
      {
        if ( typeof this.parent.popups[this.initpar.popup] != 'undefined' )
          this.parent.popups[this.initpar.popup].hidden();
      }
      else if ( typeof this.parent.popups[this.initpar.popup] != 'undefined' && this.parent.popups[this.initpar.popup].isclose == false )
      {
        var w = this.parent.popups[this.initpar.popup].weblet;
        if ( typeof this.initpar.cols != 'undefined' && w.showids.length == 1 )
        {
          var cols = this.initpar.cols.split(',');
          var i,j;

          for ( i = 0; i < cols.length; i++)
          {
            if ( cols[i] == w.showids[0] )
            {
              for ( j = 0; j < this.values.length; j++)
              {
                if ( this.values[j][i] == w.act_values[cols[i]] )
                {
                  this.obj.tables.content.findCell(this.obj.tables.content.body.rows[j].cells[0]);
                  break;
                }
              }
            }
          }
        }
        this.showdetail();
      }
      else if ( typeof this.initpar.showid != 'undefined' && typeof this.initpar.cols != 'undefined' )
      {
        var cols = this.initpar.cols.split(',');
        var i,j;

        if ( typeof this.obj.showidcol == 'undefined' )
        {
          for ( i = 0; i < cols.length; i++)
          {
            if ( cols[i] == this.initpar.showid )
            {
              this.obj.showidcol = i;
            }
          }
        }

        if ( typeof this.obj.showidvalue != 'undefined' && this.obj.showidvalue != null )
        {
          for ( j = 0; j < this.values.length; j++)
          {
            if ( this.values[j][this.obj.showidcol] == this.obj.showidvalue )
            {
              this.obj.tables.content.findCell(this.obj.tables.content.body.rows[j].cells[0]);
              break;
            }
          }
        }
      }
    }
    
    if ( typeof this.initpar.selectpopup != 'undefined' )
      if ( typeof this.parent.popups[this.initpar.selectpopup] != 'undefined' )
        this.parent.popups[this.initpar.selectpopup].hidden();

    
    this.clearModify();
    if ( weblet == this )
    {
      var w = this;
      window.setTimeout( function() { w.scrollframe.scrollTop = w.obj.scrollTop; w.scrollframe.scrollLeft = w.obj.scrollLeft; }, 0);
    }

  };

  weblet.select = function()
  {
    if ( typeof this.initpar.selectpopup != 'undefined' )
      if ( typeof this.parent.popups[this.initpar.selectpopup] != 'undefined' )
        this.parent.popups[this.initpar.selectpopup].show();
  }

  weblet.add = function()
  {
  }

  weblet.rhidden = function(weblet)
  {
    if ( typeof this.initpar.popup != 'undefined' )
      if ( typeof this.parent.popups[this.initpar.popup] != 'undefined' )
        this.parent.popups[this.initpar.popup].hidden();
  };

  weblet.clickHead = function(tab)
  {
    var i = null;
    var colnum = tab.act_colnum;
    var col = tab.getColnum(colnum);

    this.enablevalue(false);

    if ( this.initpar.dyndata == true )
    {
      tab.findCell(null);
      return false;
    }

    for (i in this.ids) if (col == this.ids[i]) break;


    this.initpar.scols = i;
    this.refresh();
    tab.findCell(tab.sections['head'].rows[0].cells[colnum], false, true );
  };

  weblet.check_modify = function(tab)
  {
    var i = null;
    var modify = false;

    if ( this.obj.old_rownum != -1 && this.obj.old_rownum != tab.act_rownum )
    {
      for ( i=0;   i < tab.sections['body'].rows[this.obj.old_rownum].cells.length; ++i )
      {
        var d = tab.sections['body'].rows[this.obj.old_rownum].cells[i].datafield;
        if (typeof d != 'undefined' && d != null && d.className.indexOf('modifyok') != -1 )
        { 
          modify = true;
          break;
        }
      }
    }
    return modify;   
  };

  weblet.clickBody = function(tab)
  {
    var i = null;

    this.obj.lastkey = null;
    if ( this.check_modify(tab) && this.confirm("#mne_lang#Die Spalte wurde geändert - sollen die Werte geschrieben werden ?") == true )
    {
      var act_rownum = tab.act_rownum;
      var t = tab;
      try { this.ok(null, this.obj.old_rownum); } catch(e) { this.obj.old_rownum = -1; throw e; }
      window.setTimeout(function() { t.findCell(t.body.rows[act_rownum].cells[0]); }, 10);
      return;
    }
    
     this.obj.old_rownum = tab.act_rownum;
    
    if ( tab.act_rownum != -1 )
    {
      for ( i in this.ids)
        this.act_values[i] = tab.body.origdata[tab.act_rownum][this.ids[i]];

      if ( this.obj.showidcol != 'undefined' )
        this.obj.showidvalue = tab.body.origdata[tab.act_rownum][this.obj.showidcol];

      if ( tab.act_rownums.length > 1 )
      {
        this.enablevalue(false);
        if ( typeof this.obj.buttons.mdel != 'undefined' )
          this.obj.buttons.mdel.disabled = false;
      }
      else
      {
        this.enablevalue(true);
      }
    } 
    else
    {
      this.enablevalue(false);

      for ( i in this.ids)
        delete this.act_values[i];
    
      this.obj.showidvalue = null;
    }

    this.setDepends("select");
  };
  
  weblet.dblclickBody = function(tab)
  {
    this.clickBody(tab);
    if ( typeof tab.act_cell.datafield == 'undefined' )
      this.showdetail();
  };
    
  weblet.showdetail = function(p)
  {
    var popupname = p;
    if ( typeof popupname == 'undefined' )  popupname = this.initpar.popup;
    if ( this.obj.oldpopup != popupname && typeof this.parent.popups[this.obj.oldpopup] != 'undefined' )
    {
      this.parent.popups[this.obj.oldpopup].hidden();
    }

    this.obj.oldpopup = popupname;
    if ( typeof popupname != 'undefined')
    {
      var popup = this.parent.popups[popupname];
      var param = { popup : true };
      if ( typeof this.obj.act_schema != 'undefined' ) param.schema = this.obj.act_schema;
      if ( typeof this.obj.act_table != 'undefined' ) param.table = this.obj.act_table;
      if ( typeof popup != 'undefined' )
      {
        popup.refreshobj = this;
        popup.hidden = function(e)
        {
          MneAjaxPopup.prototype.hidden.call(this);
          if ( typeof e != 'undefined' && typeof e.target != 'undefined' && e.target.id == 'closebutton' && this.refreshobj.initpar.refresh_allways == true )
            this.refreshobj.refresh.call(this.refreshobj);
        };
        popup.show(false,false);
        if ( popup.weblet.showValue(this, param ) == false )
          popup.hidden();
        popup.weblet.onbtnobj = this;
        popup.weblet.setDepends('popup');

        {
          var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize == true, popup.weblet.initpar.popup_repos == true); };
          window.setTimeout(timeout, 10);
        }
      }
      else if ( typeof this.parent.subweblets[popupname] != 'undefined' )
      {
        this.parent.subweblets[popupname].showValue(this, param );
        this.parent.subweblets[popupname].setDepends('popup');
      }

    }
    else if ( typeof this.initpar.detailweblet != 'undefined' )
    {
      if ( typeof window.main_weblet != 'undefined' && window.main_weblet != null )
      {
        var self = window.main_weblet;

        var detailweblet = this.initpar.detailweblet;
        var detailwebletselect = this.initpar.detailwebletselect;
        var detailid = this.initpar.detailid;
        var detailidvalue = this.act_values[this.initpar.detailidvalue];

        var timeout = function() { try { self.show.call(self,detailweblet); self.subweblets[detailwebletselect].setValue(detailid + " : '" + detailidvalue + "'"); } catch(e) {} };
        window.setTimeout(timeout, 20);
      }
    }

    return false;
  };
  
  weblet.mdel = function(setdepend)
  {
    var tab = this.obj.tables.content;
    
    if ( tab.act_rownums.length == 1 )
      return this.del(setdepend);

    try 
    {
      var n;

      if ( this.confirm('#mne_lang#Wirklich löschen ?') == true )
      {
        this.obj.noconfirmmessage = true;
        for ( n=0; n<tab.act_rownums.length; n++)
        {
          var i = null;
          for ( i in this.ids)
            this.act_values[i] = tab.body.origdata[tab.act_rownums[n]][this.ids[i]];

          if ( this.obj.showidcol != 'undefined' )
            this.obj.showidvalue = tab.body.origdata[tab.act_rownums[n]][this.obj.showidcol];

          this.del(false);
        }
        this.obj.noconfirmmessage = false;
        this.obj.confirm = true;
      }
    }
    catch(e)
    {
      this.obj.noconfirmmessage = false;
      throw e;
    }
    
    this.refresh();

    if ( setdepend != false ) 
      this.setDepends('del');

    if ( typeof this.initpar.delsetdepend == 'string' )
      this.parent.subweblets[this.initpar.delsetdepend].setDepends('del');
    
    return false;
  };
  
  weblet.del = function(setdepend)
  {
    if ( typeof this.initpar.delparam != 'undefined')
    {
      this.initpar.dschema = this.initpar.delparam.schema;
      this.initpar.dtable  = this.initpar.delparam.table;
      var getIdparamsave = this.getIdparam;
      this.getIdparam = function(p)
      {
        var i;
        var ids = this.initpar.delparam.delid.split(',');
        for ( i =0; i < ids.length; i++ )
        {
          if ( typeof this.act_values[ids[i]] == 'undefined')
            throw { message : this.txtSprintf(this.txtGetText("#mne_lang#Wert für <$1> ist nicht definiert"), ids[i]) };
          p[ids[i] + "Input.old"] = this.act_values[ids[i]];
        }
        return p;
      };
      if ( MneAjaxWeblet.prototype.del.call(this,false) != false )
      {
        this.getIdparam = getIdparamsave;
        return true;
      }
      this.getIdparam = getIdparamsave;
    }
    else if ( typeof this.initpar.delfunction != 'undefined' && this.initpar.delfunction != null )
    {
      var p =
      {
          schema : ( typeof this.initpar.delschema != 'undefined' ) ? this.initpar.delschema : this.initpar.schema,
          name : this.initpar.delfunction,
          
          sqlend : 1   
      };
      
      var delcols = this.initpar.delcols.split(',');
      var deltyps = this.initpar.deltyps.split(',');
      var tab = this.obj.tables.content;
      var row;
      var i = null;
      
      if ( typeof rownum != 'undefined' )
        row = tab.body.rows[rownum];
      else
        row = tab.act_row;
      
      for ( i=0; i<delcols.length; i++ )
      {
        var d = row.cells[tab.col2tab(delcols[i])];
        if ( tab.invisible[delcols[i]] == true || typeof d == 'undefined' || typeof d.datafield == 'undefined' )
        {
          if ( typeof this.rids[delcols[i]] != 'undefined' )
            p["par" + i] = this.act_values[this.rids[delcols[i]]];
          else if ( typeof this.act_values[delcols[i]] != 'undefined' )
            p["par" + i] = this.act_values[delcols[i]];
          else
            throw this.txtSprintf("kein Wert für Spalte <$1>", delcols[i]); 
        }
        else if ( d.datafield.vtype == 'time' || d.datafield.vtype == 'date' )
        {
            if ( d.datafield.value == '' && (( typeof deltyps[i] == 'undefined' ) ?  'text' : deltyps[i] ) == 'text')
              p["par" + i ] = '';
            else
              p["par" + i] = d.datafield.mne_timevalue;
        }
        else
        {
            p["par" + i] = d.datafield.value;
        }
        p["typ" + i] = ( typeof deltyps[i] == 'undefined' ) ?  'text' : deltyps[i];
      }

      if ( this.confirm('#mne_lang#Wirklich löschen ?') == true )
      {
        if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) != 'ok' )
          return true;
      }
    }
    else if ( typeof this.initpar.popup != 'undefined')
    {
      var popup = this.parent.popups[this.initpar.popup];
      if ( typeof popup == 'undefined' )
      {
        popup =
        {
          weblet : this.parent.subweblets[this.initpar.popup],
          show   : function() { return; }
        };
      }
      popup.show(popup.weblet.initpar.popup_resize != false, popup.weblet.initpar.popup_repos == true, false );
      popup.weblet.clearModify(true);
      popup.weblet.showValue(this);
      if ( typeof popup.weblet.del == 'function' )
      {
        popup.weblet.obj.confirm = true;
        popup.weblet.obj.noconfirmmessage = this.obj.noconfirmmessage;
        try 
        {
          if ( popup.weblet.del(false) != false )
            return true;
        }
        catch(e)
        {
          popup.weblet.obj.noconfirmmessage = false;
        }
        this.obj.confirm = popup.weblet.obj.confirm;
      }
      else
      {
        this.error("popup have no delete function");
      }
    }


    if ( this.obj.tables.content.act_rownums.length == 1 )
    {
      if ( this.initpar.delrefresh == true )
      {
        this.refresh();
      }
      else
      {
        if ( this.obj.confirm )
        {
          var i = null;
          this.obj.tables.content.delRow(this.obj.tables.content.act_rownum);
          this.obj.old_rownum = -1;

          for ( i in this.ids)
            delete this.act_values[i];

          for (i in this.obj.showdynparvalues)
            this.act_values[i] = this.obj.showdynparvalues[i];

          this.obj.showidvalue = null;
        }
      }

      if ( setdepend != false ) 
        this.setDepends('del');

      if ( typeof this.initpar.delsetdepend == 'string' )
        this.parent.subweblets[this.initpar.delsetdepend].setDepends('del');
    }

    return false;
  };

  weblet.ok = function(setdepend, rownum, showvalue)
  {
    var i;
    try { kkk = x } catch(e) {}
    if ( typeof this.initpar.okfunction != 'undefined')
    {
      var p =
      {
          schema : ( typeof this.initpar.okschema != 'undefined' ) ? this.initpar.okschema : this.initpar.schema,
              name : this.initpar.okfunction,

              sqlend : 1   
      };

      var okcols = this.initpar.okcols.split(',');
      var oktyps = this.initpar.oktyps.split(',');
      var tab = this.obj.tables.content;
      var row;
      
      if ( typeof rownum != 'undefined' )
        row = tab.body.rows[rownum];
      else
        row = tab.act_row;
      
      if ( typeof row == 'undefined' || row == null )
      {
        this.status("#mne_lang#keine Zeile ausgewählt");
        return false;
      }
      
      for ( i=0; i<okcols.length; i++ )
      {
        var d = row.cells[tab.col2tab(okcols[i])];
        if ( tab.invisible[okcols[i]] == true || typeof d == 'undefined' || typeof d.datafield == 'undefined' )
        {
          if ( typeof this.rids[okcols[i]] != 'undefined' )
            p["par" + i] = this.act_values[this.rids[okcols[i]]];
          else if ( typeof this.act_values[okcols[i]] != 'undefined' )
            p["par" + i] = this.act_values[okcols[i]];
          else if ( typeof this.obj.inputs[okcols[i]] != 'undefined' )
            p["par" + i] = this.getParamValue(this.obj.inputs[okcols[i]]);
          else
            throw this.txtSprintf("kein Wert für Spalte <$1>", okcols[i]); 
        }
        else if ( d.datafield.vtype == 'time' || d.datafield.vtype == 'date' )
        {
            if ( d.datafield.value == '' && (( typeof oktyps[i] == 'undefined' ) ?  'text' : oktyps[i] ) == 'text')
              p["par" + i ] = '';
            else
              p["par" + i] = d.datafield.mne_timevalue;
        }
        else
        {
            p["par" + i] = d.datafield.value;
        }
        p["typ" + i] = ( typeof oktyps[i] == 'undefined' ) ?  'text' : oktyps[i];
      }
      
      if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) != 'ok')
        return true;

      if ( typeof this.initpar.okpost != 'undefined' )
        if ( MneAjaxWeblet.prototype.write.call(this, this.initpar.okpost ,  p ) != 'ok' )
          return true;

    }
    else if ( typeof this.initpar.oktable != 'undefined')
    {
      var p = 
      {
          schema : ( typeof this.initpar.okschema != 'undefined' ) ? this.initpar.okschema : this.initpar.schema,
          table  : this.initpar.oktable,

          sqlend : 1   
      };

      var okcols = this.initpar.okcols.split(',');
      var okids = this.initpar.okids.split(',');
      var tab = this.obj.tables.content;
      var row = null;
      
      if ( typeof rownum != 'undefined' )
        row = tab.body.rows[rownum];
      else
        row = tab.act_row;
      
      for ( i =0; i < okcols.length; i++ )
      {
        if ( okcols[i] != '' )
        {
          var d = row.cells[tab.col2tab(i)];

          if ( tab.invisible[i] == true || typeof d == 'undefined' || typeof d.datafield == 'undefined' )
            p[okcols[i] + "Input"] = this.act_values[this.rids[i]];
          else if ( d.datafield.vtype == 'time' || d.datafield.vtype == 'date' )
            p[okcols[i] + "Input"] = d.datafield.mne_timevalue;
          else
            p[okcols[i] + "Input"] = d.datafield.value;

        }
      }

      for ( i =0; i < okids.length; i++ )
      {
        if ( okids[i] != '' )
        {
          var d = row.cells[tab.col2tab(i)];
          if ( tab.invisible[i] == true || typeof d == 'undefined' || typeof d.datafield == 'undefined' )
            p[okids[i] + "Input.old"] = this.act_values[this.rids[i]];
          else if ( d.datafield.vtype == 'time' || d.datafield.vtype == 'date' )
            p[okids[i] + "Input.old"] = d.datafield.mne_timevalue;
          else
            p[okids[i] + "Input.old"] = d.datafield.value;

        }
      }

      if ( MneAjaxWeblet.prototype.write.call(this, '/db/utils/table/modify.xml', p) != 'ok' )
        return true;
      
      if ( typeof this.initpar.okpost != 'undefined' )
      {
        if ( MneAjaxWeblet.prototype.write.call(this, this.initpar.okpost ,  {} ) != 'ok' )
          return true;
      }

    }
    else
    {
      this.error("keine okfunction bzw. oktable definiert");
      return true;
    }

    if ( row == tab.act_row )
    {
      var r = tab.act_rownum;
      var c = tab.act_colnum;
      var self = this;
      window.setTimeout(function()
      {
        var tab = self.obj.tables.content;
        tab.findCell(tab.body.rows[r].cells[c]);
        if ( typeof tab.act_cell.datafield != 'undefined' )
          self.inSetCursor.call(self, tab.act_cell.datafield);
        self.enablevalue(true);

      }, 0); 
    }
    
    if ( showvalue != false )
      this.showValue(this, { no_vals : false });
    if ( setdepend != false )
      this.setDepends('ok');

    return false;
  };

  weblet.onbtnclick = function(id, button)
  {
    var have_readed;
    if ( ( id == 'del' || id == 'ok' || this.initpar.refresh_allways == true ) && this.inputlist == null )
    {
      var p = {};
      this.act_values.schema = this.obj.act_schema;
      this.act_values.table = this.obj.act_table;
      p.no_perror = true;
      p.no_vals = false;
      p.intl = 1;
      have_readed = MneAjaxWeblet.prototype.showTable.call(this, this, p);

      for (i in this.obj.showdynparvalues)
        this.act_values[i] = this.obj.showdynparvalues[i];

      this.enablevalue(false);

      this.setDepends('onbtnclick');
    }
    else if ( id == 'rte' )
    {
      if ( this.initpar.autosave == true ) this.ok(null, this.obj.old_rownum);
    }
  };
  
  weblet.getFilter = function(p)
  {
    return p;
  };
  
  weblet.print = function(p_param, report)
  {
    var p = p_param;
    if ( typeof p == 'undefined' ) p = {};

    p = this.readDataParam(p);
    
    if ( typeof this.initpar.reportschema != 'undefined' ) p.schema = this.initpar.reportschema;
    if ( typeof this.initpar.reportquery  != 'undefined' ) p.query  = this.initpar.reportquery;
    if ( typeof this.initpar.reporttable != 'undefined'  ) p.table = this.initpar.reporttable;
    if ( typeof this.initpar.reportcols != 'undefined'  ) p.cols = this.initpar.reportcols;
    if ( typeof this.initpar.reportscols != 'undefined'  ) p.scols = this.initpar.reportscols;

    return MneAjaxWeblet.prototype.print.call(this, p, report);
  };
  
}
