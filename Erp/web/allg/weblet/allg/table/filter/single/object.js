// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/table/filter/single
// ================================================================================
{
'use strict';
  var i;
  
  var attr =
  {
    wvalInput  : { onreturn : function() {  this.weblet.refresh(); }, mne_timevalue : "" },
    wcolInput  : { onchange : function() { try { this.weblet.wcolchange(); } catch(e) { this.weblet.exception("Spaltenauswahl", e); } } },
  };

  weblet.findIO(attr, weblet.frame, weblet.obj.whereframe, true);

  var selval =
  {
      weblet : null,
      id : 'wval',
      obj : 'wval',
      wcol : '',
      wop : '',
      wval : '',
      webletid : '',
      showdynpar : weblet.initpar.showdynpar,
      showdynparweblet : weblet.initpar.showdynparweblet,
      selval : ''
  };
  
  var selfunc = function(evt)
  {
    if (evt.target.tagName == 'INPUT') return;
    
    try
    {

      this.selval.schema = ( this.weblet.initpar.schema ) ? this.weblet.initpar.schema : this.weblet.act_values.schema;
      this.selval.query  = ( this.weblet.initpar.query )  ? this.weblet.initpar.query  : this.weblet.act_values.query;
      this.selval.table  = ( this.weblet.initpar.table)   ? this.weblet.initpar.table  : this.weblet.act_values.table;

      this.selval.cols = this.weblet.obj.inputs.wcol.value;
      this.selval.scols = this.weblet.obj.inputs.wcol.value;
      this.selval.showcols = this.weblet.obj.inputs.wcol.value;

      if ( this.selval.cols == '' )
      {
        alert('#mne_lang#Keine Spalte ausgewählt');
        return;
      }
      this.weblet.show_inputlist.call(this.weblet, this.selval);
    }
    catch (e)
    {
      this.weblet.exception("MneAjaxWeblet::selectlist", e);
    }
  };
  
  weblet.eleMkClass(weblet.obj.inputs.wval.wrapper, 'selectlisti', true);
  weblet.obj.inputs.wval.wrapper.onclick = selfunc;
  weblet.obj.inputs.wval.wrapper.selval = selval;

  weblet.wcolchange = function(op)
  {
    var opfound = false;
    var wops = new Array("=", "<>", "<", ">", "<=", ">=", "isnull",  "is not null" );
    var wopsval = new Array("=", "<>", "<", ">", "<=", ">=", "#mne_lang#leer",  "#mne_lang#nicht leer" );
    
    var t = this.typs[this.ids[this.obj.inputs.wcol.value]];
    
    this.obj.inputs.wval.inputtyp = this.inGetTyp(t);
    this.obj.inputs.wval.onkeyup = null;
    this.inClear(this.obj.inputs.wval);
    
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
      if ( op == wops[i] ) opfound = true;
    }

    switch(t)
    {
    case '1' :
      this.obj.inputs.wop.value = ( ! opfound ) ? 'true' : op;
      break;
    case '2' :
      this.obj.inputs.wop.value = ( ! opfound ) ? 'like' : op;
      break;
    default:
      this.obj.inputs.wop.value = ( ! opfound ) ? '=' : op;
    }
    
  };

  weblet.getFilter = function(pp)
  {
    var p = pp;
    if ( typeof p == 'undefined' || p == null ) p = {};

    var wval = this.getParamValue(this.obj.inputs.wval);
    var wop = this.obj.inputs.wop.value;
    
    if ( wop == 'true') { wval = 'true'; wop = '='; }
    if ( wop == 'false') { wval = 'false'; wop = '='; }
    if ( wop == 'like' && wval.indexOf('%') < 0 )
    {
      wval = '%' + wval;
      if (  wval != '%' ) wval = wval + '%';
    } 
    
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

  weblet.showValue = function(weblet, param)
  {

    if (weblet == null && this.initpar.shownull != true ) return;
    if (weblet != this) this.act_values = {};

    this.showValueBase(weblet, this.getFilter(param));
    
    var i;
    var sel = this.obj.inputs.wcol;
    var selcol = sel.value;
    var selop = this.obj.inputs.wop.value;
    
    if ( sel.lastChild == null )
    {
      selcol = this.initpar.selcol;
      selop = this.initpar.selop;
    }
    var selfound = (selcol == '');

    while (sel.lastChild != null)
      sel.removeChild(sel.lastChild);

    sel.appendChild(this.doc.createElement("option"));
    sel.lastChild.appendChild(this.doc.createTextNode(this.txtGetText('#mne_lang#Gesamte Tabelle')));
    sel.lastChild.value = "";

    i = null;
    for (i in this.ids)
    {
      if ( this.obj.tables.content.invisible[this.ids[i]] == false )
      {
        sel.appendChild(this.doc.createElement("option"));
        sel.lastChild.appendChild(this.doc.createTextNode(this.names[this.ids[i]]));
        sel.lastChild.value = i;
        if ( i == selcol ) selfound = true;
      }
    }

    if ( selfound ) 
    {
        sel.value = selcol;
        this.obj.inputs.wval.focus();
    }
    else
    {
        sel.value = '';
        this.obj.inputs.wval.value = "";
    }
    
    this.wcolchange(selop);
  };

  weblet.clickHead = function(tab)
  {
    var i;
    i = null;
    var col = tab.getColnum(tab.act_colnum);

    for (i in this.ids)
      if (col == this.ids[i])
        break;

    this.initpar.scols = i;
    MneAjaxWeblet.prototype.showTable.call(this, this, this.getFilter());
  };

  weblet.refresh = function(weblet)
  {
    if ( this.obj.timeoutid_wval != 'undefined' && this.obj.timeoutid_wval != null )
      window.clearTimeout(this.obj.timeoutid_wval);

    var p = this.getFilter();
    p.no_vals = false;
    p.no_setvalues = true;
    this.showValueBase(this, p);
    return false;
  };
}