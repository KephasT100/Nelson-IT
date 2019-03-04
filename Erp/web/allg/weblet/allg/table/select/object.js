// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/table/select
// ================================================================================
{
  var i;
  
  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");
  
  var ivalues = 
  {
      styleName : 'style.css',
      stylePath : '/weblet/allg/table/allg',

      showlabel    : { de : 'hinzufügen/ändern', en : 'add/modify' },
      selcol       : '',
      selval       : '',
      notclose     : false,
      refresh      : true,
      nodelok      : true,
      nodisableok  : true,
      multiselect  : false
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();

  var attr =
  {
      wvalInput :        { onreturn : function() { this.weblet.refresh(); }, onkeyup : function(e) { try { this.weblet.onkeyup(this, e); } catch(e) { this.weblet.exception("Tabelle Wert", e); } } },
      wcolInput :        { onchange : function() { try {  this.weblet.wcolchange(); } catch(e) { this.weblet.exception("Spaltenauswahl", e); } } },
      wopInput  :        { onchange : function() { try {  this.weblet.wopchange(); } catch(e) { this.weblet.exception("Operatorauswahl", e); } } }
  };

  weblet.findIO(attr);

  MneAjaxWeblet.prototype.loadbase.call(weblet, "/weblet/allg/table/allg", weblet);
  
  weblet.obj.mkbuttons =
  [
    { id : 'refresh',    value : weblet.txtGetText('#mne_lang#Aktualisieren') },
    { id : 'ok',         value : weblet.txtGetText('#mne_lang#OK'), space : 'before' },
    { id : 'cancel',     value : weblet.txtGetText('#mne_lang#Abbrechen') },
    { id : 'showdetail', value : ( typeof weblet.initpar.showlabel[weblet.win.mne_config.language] != 'undefined' ) ? weblet.initpar.showlabel[weblet.win.mne_config.language] : weblet.initpar.showlabel['de'], space : 'before' },
    { id : 'mdel',       value : weblet.txtGetText('#mne_lang#Löschen')}
  ]

  weblet.obj.enablebuttons = [ 'showdetail', 'mdel'];
  weblet.obj.enablebuttonsvalue = [ 'showdetail' ];

  var selval =
  {
    weblet : null,
    id : 'wval',
    obj : 'wval',
    schema : weblet.initpar.schema,
    query : weblet.initpar.query,
    table : weblet.initpar.table,
    wcol : weblet.initpar.wcol,
    wop : weblet.initpar.wop,
    wval : weblet.initpar.wval,
    cols : '',
    scols : '',
    showcols : '',
    webletid : '',
    selval : ''
  };
  
  var selfunc = function(evt)
  {
    if ( evt.target.tagName == 'INPUT' ) return;
    
    this.selval.schema = this.weblet.initpar.schema;
    this.selval.query  = this.weblet.initpar.query;
    this.selval.table  = this.weblet.initpar.table;

    this.selval.cols = this.weblet.obj.inputs.wcol.value;
    this.selval.scols = this.weblet.obj.inputs.wcol.value;
    this.selval.showcols = this.weblet.obj.inputs.wcol.value;

    if ( this.selval.cols == '' )
    {
      alert('#mne_lang#Keine Spalte ausgewählt');
      return;
    }
    
    try
    {
      this.weblet.show_inputlist.call(this.weblet, this.selval);
    }
    catch (e)
    {
      this.weblet.exception("MneAjaxWeblet::selectlist", e);
    }
  };

  weblet.eleMkClass(weblet.obj.inputs.wval.wrapper, 'selectlisti', true );
  weblet.obj.inputs.wval.wrapper.onclick = selfunc;
  weblet.obj.inputs.wval.wrapper.selval = selval;
  

    
    weblet.keydown = function(evt, inside)
    {

      if ( inside == true || this.checkInside(evt, this.origframe)  )
      {
        if ( MneMisc.prototype.os == "mac" && evt.metaKey == true && evt.keyCode == 82 ||
             MneMisc.prototype.os != "mac" && evt.keyCode == 116 )
        {
          this.refresh();
          this.moveCursor(0,0);
          return false;
        }
      }
      
      if ( inside == true || this.checkInside(evt) )
      {
        switch(evt.keyCode)
        {
        case 114 :
          {
            var self = this;
            window.setTimeout(function() { self.obj.inputs.wval.focus(); }, 0);
            this.doceventstop = true;
            return false;
          }
         case 13 :
           MneDocEvents.prototype.fireEvent.call(this, this.obj.buttons.ok, 'click');
           return false;
        default:
          return this.keydownBase(evt, true);
        }
      }
      return true;
    };

    weblet.onkeyup = function(obj, evt)
    {
      if ( obj.id == 'wvalInput' )
      {
        if ( typeof evt == 'undefined' ) evt = { keyCode : 0 };
        if ( evt.keyCode == 9 || evt.keyCode == 13 || evt.keyCode == 16 || evt.keyCode == 17 || evt.keyCode == 18 || evt.keyCode == 27 || ( evt.keyCode >= 33 && evt.keyCode <= 40)  || ( evt.keyCode >= 112 && evt.keyCode <= 123 ) ) return;
        
        var self = this;
         var timeout = function() { try { self.obj.timeout_wval.call(self); } catch(e) {} };
         if ( this.obj.timeoutid_wval != 'undefined' )
           window.clearTimeout(this.obj.timeoutid_wval);
         if ( this.obj.inputs.wop != 'false' && this.obj.inputs.wop != 'true')
           this.obj.timeoutid_wval = window.setTimeout(timeout, 500 );
      }
    };

    weblet.wopchange = function()
    {
      {
        var self = this;
        var timeout = function() { try { self.refresh.call(self); } catch(e) {self.exception('wopchange', e); } };
        if ( this.obj.timeoutid_wop != 'undefined' && this.obj.timeoutid_wop != null )
          window.clearTimeout(this.obj.timeoutid_wop);
        this.obj.timeoutid_wop = window.setTimeout(timeout, 500 );
      }
    };
    

    weblet.wcolchange = function(fromshowvalue)
  {
    var wops = new Array("=", "<>", "<", ">", "<=", ">=", "isnull",  "is not null" );
    var wopsval = new Array("=", "<>", "<", ">", "<=", ">=", "#mne_lang#leer",  "#mne_lang#nicht leer" );

    if ( this.obj.inwcolchange == true ) return;
    this.obj.inwcolchange = true;
    
    try
    {
      var t = this.typs[this.ids[this.obj.inputs.wcol.value]];
      if ( this.obj.inputs.wop.oldtyp != t )
      {
        switch(t)
        {
        case '1' :
          wops = new Array('true', 'false');
          wopsval = new Array('#mne_lang#wahr', '#mne_lang#falsch');
          break;
        case '2' :
          wops[wops.length] = 'like';
          wopsval[wopsval.length] = '#mne_lang#änhlich';
          break;
        }

        while(this.obj.inputs.wop.firstChild != null )
          this.obj.inputs.wop.removeChild(this.obj.inputs.wop.firstChild);

        for ( var i = 0; i < wops.length; ++i)
        {
          this.obj.inputs.wop.appendChild(weblet.doc.createElement("option"));
          this.obj.inputs.wop.lastChild.appendChild(weblet.doc.createTextNode(wopsval[i]));
          this.obj.inputs.wop.lastChild.value = wops[i];
        }

        switch(t)
        {
        case '1' :
          this.obj.inputs.wop.value =  'true';
          break;
        case '2' :
          this.obj.inputs.wop.value =  'like';
          break;
        default:
          this.obj.inputs.wop.value =  'is not null';
        }
      }
      
      this.obj.inputs.wop.oldtyp = t;
      if ( fromshowvalue != true )
      {
        if ( this.initpar.no_vals != true )
          this.refresh();
        else
          this.obj.tables.content.clearBody();
      }
    }
    catch(e)
    {
      this.inwcolchange = false;
      throw e;
    }
    this.obj.inwcolchange = false;
  };
  
  weblet.clickHead = function(tab)
  {
    var i;
    var p = {};
    if (this.obj.inputs.wcol.value != '')
    {
      p.wcol = this.obj.inputs.wcol.value;
      p.wop = this.obj.inputs.wop.value;
      if (p.wop != 'isnull')
        p.wval = this.obj.inputs.wval.value;
      else
        p.wval = '';
    }

    i = null;
    for (i in this.ids)
      if (tab.act_colnum == this.ids[i])
        break;

    this.initpar.scols = i;
    MneAjaxWeblet.prototype.showTable.call(this, this, p);
  };
  
  weblet.getFilter = function(pp)
  {
    var p = pp;
    var wval = this.obj.inputs.wval.value;
    var wop = this.obj.inputs.wop.value;
    
    if ( wop == 'true') { wval = 'true'; wop = '='; }
    if ( wop == 'false') { wval = 'false'; wop = '='; }

    if ( this.obj.inputs.wop.value == 'like' && wval.indexOf('%') < 0 )
    {
      wval = '%' + wval;
      if (  wval != '%' ) wval = wval + '%';
    } 

    if ( typeof p == 'undefined' || p == null ) p = {};
    if (this.obj.inputs.wcol.value != '')
    {
      if ( typeof this.initpar.wcol != 'undefined' && this.initpar.wcol != '' )
      {
        p.wcol = this.initpar.wcol + ",";
        p.wop  = this.initpar.wop  + ",";
        p.wval = this.initpar.wval + ",";
      }
      else if ( typeof this.initpar.wcol != 'undefined' && this.initpar.wcol != '' )
      {
        p.wcol = this.initpar.wcol + ",";
        p.wop  = this.initpar.wop  + ",";
        p.wval = this.initpar.wval + ",";
      }
      else
      {
        p.wcol = "";
        p.wop  = "";
        p.wval = "";
      }
      
      if ( wval == '' )
      {
        var t = this.typs[this.ids[this.obj.inputs.wcol.value]];
        if ( t != 2 ) wval = '0';
      }

        p.wcol += this.obj.inputs.wcol.value;
        p.wop  += wop;
        p.wval += wval;
    }
   
    return p;
  };

  weblet.showValue = function(weblet, p_param)
  {
    var param = p_param;
    
    delete this.obj.fire;
    
    if ( weblet != this ) this.act_values = {};
    if ( typeof param == 'undefined' || param == null ) param = {};
    
    param.no_vals = ( param.setselcol == true ||  this.initpar.selval != '' );
    this.showValueBase(weblet,this.getFilter(param));

    var i;
    var selfound;
    var sel = this.obj.inputs.wcol;
    var selcol = sel.value;
    
    if ( sel.lastChild == null || param.setselcol == true ) selcol = this.initpar.selcol;
    if ( ( sel.lastChild == null || param.setselcol == true ) && typeof this.initpar.selop != 'undefined' ) this.obj.inputs.wop.value = this.initpar.selop;
    selfound = ( typeof selcol != 'undefined' && selcol != null && selcol != '');
    
    while ( sel.lastChild != null ) sel.removeChild(sel.lastChild);
    
    sel.appendChild(this.doc.createElement("option"));
    sel.lastChild.appendChild(this.doc.createTextNode(this.txtGetText('#mne_lang#Gesammte Tabelle')));
    sel.lastChild.value = "";

    for ( i=0; i<this.names.length; i++ )
    {
      if ( this.obj.tables.content.invisible[i] == false )
      {
        sel.appendChild(this.doc.createElement("option"));
        sel.lastChild.appendChild(this.doc.createTextNode(this.names[i]));
        sel.lastChild.value = this.rids[i];
        if ( this.rids[i] == selcol ) selfound = true;
      }
    }
    
    if ( selfound ) 
    {
        sel.value = selcol;
        this.wcolchange(true);
        if ( param.setselcol == true && typeof this.initpar.selop != 'undefined' ) this.obj.inputs.wop.value = this.initpar.selop;
    }
    else
    {
        sel.value = '';
    }
    
    if ( weblet != this )
    {
      var self = this;
      window.setTimeout(function() {var t = self.obj.tables.content; if ( t.body.rows.length > 0 && t.body.rows[0].cells.length > 0  ) { MneDocEvents.prototype.fireEvent(t.body.rows[0].cells[0], 'click'); t.weblet.moveCursor(0,0);} else {  self.obj.inputs.wval.focus(); } }, 10);
    }

    if ( param.setselcol == true || this.initpar.selval != '' )
    {
      param.no_vals = false;
      this.showInputDefined("wval", this.initpar.selval);
      this.initpar.selval = '';
      this.showValueBase(weblet,this.getFilter(param));
    }
  };
  
  weblet.refresh = function()
  {
    var p = this.getFilter();
    p.no_vals = false;
    this.showValue(this, p);
    return false;
  };
  
  weblet.dblclickBody = function(tab)
  {
    this.clickBody(tab);
    return this.obj.buttons.ok.onclick.call(this.obj.buttons.ok);
  };

  weblet.ok = function()
  {
    return false;
  };
  
  weblet.cancel = function()
  {
    this.onbtnobj = {};
    if ( typeof this.popup != 'undefined' )
      this.popup.hidden();
  };

  weblet.showdetailbase = weblet.showdetail;
  
  weblet.showdetail = function()
  {
    try 
    {
      this.obj.tables.content.findCell(null);
      //for ( i in this.ids)
      //  delete this.act_values[i];
      
      if ( typeof this.obj.showidvalue != 'undefined' ) 
        delete this.obj.showidvalue;

      this.showdetailbase();
    }
    catch(e)
    {
      this.exception("showdetail " + this.id + ": ", e);
      return;
    }
    
    this.popup.hidden();
    
  };
  
  weblet.onbtnclickbase = weblet.onbtnclick;
  weblet.onbtnclick = function(id, button)
  {
    var popup = this.parent.popups[this.initpar.popup];
    var i,j;
    
    if ( id != 'ok' && id != 'cancel' && id != 'hidden' ) return;
    
    if ( typeof popup != 'undefined' )
    {
      var weblet = ( typeof button != 'undefined' ) ? button.weblet : popup.weblet;
      if ( weblet.errorfound != true )
      {
        if ( ( id == 'ok' || id == 'cancel' ) && this.initpar.notclose != true ) 
          popup.hidden();
        this.refresh();
        
        if ( id == 'ok' && this.onbtnobj.inputlist != null  && typeof this.onbtnobj.initpar.autoselect != 'undefined' && typeof this.onbtnobj.initpar.autoselect[this.onbtnobj.inputlist.element] != 'undefined'  )
        {
          var val = weblet.act_values[this.onbtnobj.initpar.autoselect[this.onbtnobj.inputlist.element]];
          if ( typeof val != 'undefined' && val != null && val != '' && val != '################' )
          {
            this.onbtnobj.showValue(weblet);
            this.onbtnobj.setDepends('ok');
            return;
          }
        }
        
        if ( id == 'ok' && ( typeof weblet.showids != 'undefined' && weblet.showids.length != 0 || this.initpar.showid != 'undefined' && this.initpar.showid != null ))
        {
          var showids = weblet.showids;
          if ( this.initpar.showid != 'undefined' && this.initpar.showid != null )
            showids = new Array(this.initpar.showid);
          
          for ( j =0; j < showids.length; j++ )
          {
            var pos = this.ids[showids[j]];
            if ( pos != 'undefined')
            {
              for ( i = 0; i<this.values.length; i++ )
                if ( this.values[i][pos] == weblet.act_values[showids[j]] ) break;

              if ( i != this.values.length )
              {
                this.obj.tables.content.findCell(this.obj.tables.content.table.rows[i+1].cells[0]);
                this.obj.buttons.ok.onclick.call(this.obj.buttons.ok);
              }
              else
              {
                this.popup.show();
                return;
              }
            }
            else
            {
              this.popup.show();
              return;
            }
          }
        }
        else
        {
          this.popup.show();
        }
      }
    }
  };
  
  
  weblet.obj.timeout_wval = function()
  {
    if ( this.initpar.no_vals != true || this.obj.inputs.wval.value != '' )
      this.refresh();
  };
  
}