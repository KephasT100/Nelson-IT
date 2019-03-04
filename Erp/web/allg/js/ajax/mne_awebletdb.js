//================================================================================

//Copyright: M.Nelson - technische Informatik
//Die Software darf unter den Bedingungen 
//der APGL ( Affero Gnu Public Licence ) genutzt werden

//================================================================================
'use strict';
window.MneAjaxWebletDb = function(window)
{
}

{
  var ajax = new MneAjax(window);
  ajax.loadClass("MneAjaxWeblet", "ajax/mne_aweblet.js")
}

MneAjaxWeblet.prototype.resetdb = MneAjaxWeblet.prototype.reset;
MneAjaxWeblet.prototype.reset = function()
{
  this.resetdb();
  this.btnrequest  = { add : "/db/utils/table/insert.xml" , mod : "/db/utils/table/modify.xml", del : '/db/utils/table/delete.xml', "export" : '/db/utils/query/data.csv' };
}

MneAjaxWeblet.prototype.getSettings = function( schema, query)
{
  var i = null;
  var l;

  this.win.mne_config = {};
  window.mne_config.request = {};

  l = location.search.split("&")
  for ( i in l )
  {
    var p = l[i].replace("?","").split('=');
    window.mne_config.request[p[0]] = p[1];
  }

  this.win.mne_config.group = new Array();
  
  if ( typeof schema == 'string' && query == '' ) return;
  var param =
  {
      "schema" : ( typeof schema == 'undefined' ) ? "mne_application" : schema,
      "query"  : ( typeof query  == 'undefined' ) ? "userpref" : query,
      "usernameInput.old" : "session_user",
      "sqlend" : 1
  };
  
  MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param, false);
  if ( this.values.length > 0 )
  {
    for ( i in this.ids )
      this.win.mne_config[i] = this.values[0][this.ids[i]];
  }
  this.theme = ( this.win.mne_config.stylename != "" ) ? this.win.mne_config.stylename : 'default';
  if ( typeof this.win.mne_config.request.startweblet != 'undefined' ) this.win.mne_config.startweblet = this.win.mne_config.request.startweblet;
  
  param =
  {
      "schema" : "mne_application",
      "query"  : "usergroup",
      "cols"   : "group,ismember",
      "rolnameInput.old" : "session_user",
      "sqlend" : 1
  };
  
  MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param);
  if ( this.values.length > 0 )
  {
    for ( i =0; i < this.values.length; i++ )
      this.win.mne_config.group[this.values[i][0]] = ( this.values[i][1] == "1" || this.win.mne_config.loginname == 'admindb' );
  }

  
  var t,d;
  MneAjaxData.prototype.read.call(this, "/utils/locale.xml",  {});
  if ( this.values.length > 0 )
  {
    d = this.values[0][0]; if ( d == '.' ) d = "\\" + d;
    t = this.values[0][1]; if ( t == '.' ) t = "\\" + t;
    
    this.win.mne_config.locale  = 
    {
        thousands_sep : this.values[0][1],
        decimal_point : this.values[0][0]
    };
    
    MneMisc.prototype.inChecktype.float       = { reg : new RegExp("[+-]?[0-9" + t + "]+" + d + "?[0-9]*"), help : MneMisc.prototype.txtSprintf(MneMisc.prototype.txtGetText("#mne_lang#Bitte eine Zahl mit einem $1 eingeben"), this.values[0][0]) };
    MneMisc.prototype.inChecktype.floatoempty = { reg : new RegExp("[+-]?[0-9" + t + "]*" + d + "?[0-9]*|^$"), help : MneMisc.prototype.txtSprintf(MneMisc.prototype.txtGetText("#mne_lang#Bitte eine Zahl mit einem $1 eingeben oder leer lassen"), this.values[0][0]) };
  }
  
  if ( this.win.mne_config.stylename )
    this.setTheme(this.win.mne_config.stylename)
};

MneAjaxWeblet.prototype.getTemplate = function()
{
  try
  {
    var param =
    {
        "schema" : "mne_application",
        "query"  : "weblet",
        "cols"   : "template,label,htmlcomposeid",
        "wcol"   : "name",
        "wop"    : "=",
        "wval"   : this.obj.webletname,
        "sqlend" : 1
    };
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param );
  }
  catch(e)
  {
    this.exception("MneAjaxWeblet::getTemplate:", e);
  }
};

MneAjaxWeblet.prototype.getWeblets = function()
{
  var param =
  {
      "schema" : "mne_application",
      "query"  : "weblet_tabs",
      "cols"   : "htmlcomposetabid,id,position,path,initpar,depend,label",
      "wcol"   : "htmlcomposeid,groupexists",
      "wop"   : "=,=",
      "scols"  : "loadpos",
      "wval"   : this.htmlcomposeid + ',1',
      "sqlend"   : 1
  };
  MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param );
};

MneAjaxWeblet.prototype.getMenuparam = function()
{
  return {
    schema    : "mne_application",
    query     : "weblet_menu",
    parentid  : this.htmlcomposeid,
    classname : "register",
    wcol      : 'groupexists',
    wop       : '=',
    wval      : '1'
  };
};

MneAjaxWeblet.prototype.getSlider = function()
{
  var i = null;
  var param =
  {
      "schema" : "mne_application",
      "table"  : "htmlcomposetabslider",
      "cols"   : "slidername,sliderpos",
      "wcol"   : "htmlcomposeid",
      "wop"    : "=",
      "wval"   : this.htmlcomposeid,
      "sqlend" : 1
  };
  MneAjaxData.prototype.read.call(this, "/db/utils/table/data.xml",  param );

  for ( i=0; i<this.values.length; i++)
  {
    if ( typeof this.slider[this.values[i][0]] != 'undefined')
      this.slider[this.values[i][0]].setPosition(this.values[i][1]);
  }
};

MneAjaxWeblet.prototype.create_selectlist = function(ele)
{
  var i;
  var vals = ele.selectlist.split(',');
  var ajax = new MneAjaxData(this.win);
  var p =
  {
      schema : 'mne_application',
      query  : 'selectlist',
      cols   : 'text,value',
      wcol   : 'name',
      wop    : '=',
      scols  : 'num',
      sqlend : 1
  };

  while(ele.firstChild != null ) ele.removeChild(ele.firstChild);
  for ( i = 0; i<vals.length; i++ )
  {
    p.wval = vals[i];
    ajax.read("/db/utils/query/data.xml",  p);
    if ( ajax.values.length != 0 ) break;
  }

  for ( i = 0; i<ajax.values.length; i++ )
  {
    ele.appendChild(this.doc.createElement('option'));
    ele.lastChild.appendChild(this.doc.createTextNode(ajax.values[i][0]));
    ele.lastChild.value = ajax.values[i][1];
  }
  
  if ( i > 0 )
    ele.value = ele.firstChild.value;

};

MneAjaxWeblet.prototype.create_inputlist_input = function(ele, id, data, styles )
{
  if (ele.type != 'hidden' )
  {
    this.eleMkClass(ele.wrapper, ( data[0].indexOf('?') != -1 ) ? 'selectlists' : 'selectlisti', true);

    ele.wrapper.weblet = this;
    ele.wrapper.inputlistele = ele;
    ele.wrapper.selval = { weblet : null, id : id, obj : data[0], schema : data[1], query : data[2], table : data[3], wcol : data[4], wop : data[5], wval : data[6], cols : data[7], scols : data[8], showcols : data[9], showdynpar : data[10], showdynparweblet : data[13], webletid : data[11], selval : data[12] };
    ele.wrapper.onclick = function(evt) { if ( evt.target.tagName == 'INPUT' ) return; try { this.weblet.show_inputlist.call(this.weblet, this.selval, this.inputlistele); } catch(e) { this.weblet.exception("MneAjaxWeblet::selectlist", e); } };
    this.inputlist_data[id]['button'] = ele.wrapper;
  }
  else
  {
    ele.selval = { weblet : null, id : ele.id, obj : data[0], schema : data[1], query : data[2], table : data[3], wcol : data[4], wop : data[5], wval : data[6], cols : data[7], scols : data[8], showcols : data[9], showdynpar : data[10], showdynparweblet : data[13], webletid : data[11], selval : data[12] };
    ele.ondblclick = function(evt) { if ( evt.target.tagName == 'INPUT' ) return; try { this.weblet.show_inputlist.call(this.weblet, this.selval); } catch(e) { this.weblet.exception("MneAjaxWeblet::selectlist", e); } };
    this.eleMkClass(ele, 'selectlist', true);
  }
  
  return ele;
};

MneAjaxWeblet.prototype.create_inputlist_select = function(ele, id, data, styles, values )
{
  var a = new MneAjaxData(this.win);
  var i,j;
  
  var p =
  {
      schema : data[1],
      query : data[2],
      table :data[3],
      wcol :data[4],
      wop :data[5],
      wval :data[6],
      cols :data[7].split(',').concat(data[9].split(',')).join(','),
      scols :data[8],
      distinct : 1,
      sqlend : 1
  };
  
  if ( data[9] == '' )
      p.cols = data[7];

  if ( data[10] != '' )
  {
    var w = this;
    if ( typeof data[13] == 'string' )
      w = this.obj.showdynparweblet = this.parent.subweblets[data[13]];

    if ( typeof w == 'undefined') this.error("Weblet: <" + data[13] + "> ist noch nicht geladen");

    var dynpar = {};
    eval(" dynpar = {" + data[10] + "}");
    i = null;
    for ( i in dynpar )
    {
      if ( typeof w.act_values[dynpar[i]] == 'undefined' ) 
          this.error(w.oid + ": " + dynpar[i] + " ist nicht definiert" );
      p[i] = w.act_values[dynpar[i]];
    }
  }
  
  if ( typeof values != 'undefined' )
  {
    a.values = values;
  }
  else
  {

    if ( data[2] != '' )
      a.read("/db/utils/query/data.xml",  p);
    else
      a.read("/db/utils/table/data.xml",  p);

  }
  
  while ( ele.firstChild != null ) ele.removeChild(ele.firstChild);
  for ( j = 0; j<a.values.length; j++ )
  {
    var val = ( a.values[j].length > 1 ) ? a.values[j][1] : a.values[j][0];
    var id  = ( a.values[j].length > 1 ) ? 1 : 0;
    var str = this.txtFormat.call(this, val, a.typs[id], a.formats[id]);

    ele.appendChild(this.doc.createElement('option'));
    ele.lastChild.appendChild(this.doc.createTextNode(str));
    ele.lastChild.value = a.values[j][0];
    
    a.values[j][1] = str;
  }
  ele.selectlist = '';
  ele.values = a.values;
  
  if ( typeof styles != 'undefined')
  {
    this.eleMkClass(ele, 'selectlistsi' + styles, true);
  }
  
  return ele;
  
};

MneAjaxWeblet.prototype.create_inputlist_output = function(ele, id, data, styles )
{
  this.eleMkClass(ele, (data[0].indexOf('?') != -1 ) ? 'selectlists' : 'selectlisti', true);

  ele.wrapper.weblet = this;
  ele.wrapper.inputlistele = ele;
  ele.wrapper.selval = { weblet : null, id : id, obj : data[0], schema : data[1], query : data[2], table : data[3], wcol : data[4], wop : data[5], wval : data[6], cols : data[7], scols : data[8], showcols : data[9], showdynpar : data[10], showdynparweblet : data[13], webletid : data[11], selval : data[12] };
  ele.wrapper.onclick = function() { try { this.weblet.show_inputlist.call(this.weblet, this.selval, this.inputlistele); } catch(e) { this.weblet.exception("MneAjaxWeblet::selectlist", e); } };
  this.inputlist_data[id]['button'] = ele.wrapper;
  return;

};

MneAjaxWeblet.prototype.create_inputlist = function(id)
{
  var i;
  var oid = id;
  if ( typeof id == 'undefined' ) oid = this.oid;
  
  var ajax = new MneAjaxData(this.win);
  var p =
  {
      schema : 'mne_application',
      table  : 'htmlcomposetabselect',
      cols   : 'element,schema,query,tab,wcol,wop,wval,cols,scols,showcols,showdynpar,weblet,selval',
      wcol   : 'htmlcomposeid,id',
      wop    : '=,=',
      wval   : this.parent.htmlcomposeid + ',' + oid,
      sqlend : 1
  };

  ajax.read("/db/utils/table/data.xml",  p);

  if ( typeof id == 'undefined' )
    this.inputlist_data = {};
  
  for ( i = 0; i<ajax.values.length; i++ )
  {
    var ele = ajax.values[i][0].split(',')[0];
    
    var dpar = ajax.values[i][10].split(';');
    if ( dpar.length == 2)
    {
      ajax.values[i][10] = dpar[0];
      ajax.values[i][13] = dpar[1];
    }

    this.inputlist_data[ele] = { values : ajax.values[i] };
    
    if ( typeof this.obj.inputs[ele] != 'undefined')
    {
      if ( this.obj.inputs[ele].tagName == 'INPUT')
      {
        this.create_inputlist_input(this.obj.inputs[ele], ele,  ajax.values[i]);
      }
      else if ( this.obj.inputs[ele].tagName == 'SELECT')
      {
        this.create_inputlist_select(this.obj.inputs[ele], ele, ajax.values[i]);
      }
    }
    else if ( typeof this.obj.outputs[ele] != 'undefined' )
    {
      this.create_inputlist_output(this.obj.outputs[ele], ele,  ajax.values[i]);
    }
    else if ( typeof this.obj.tables[ele] != 'undefined')
    {
        this.obj.tables[ele].selval = { weblet : null, id : ele, obj : ajax.values[i][0], schema : ajax.values[i][1], query : ajax.values[i][2], table : ajax.values[i][3], wcol : ajax.values[i][4], wop : ajax.values[i][5], wval : ajax.values[i][6], cols : ajax.values[i][7], scols : ajax.values[i][8], showcols : ajax.values[i][9], showdynpar : ajax.values[i][10], showdynparweblet : ajax.values[i][13], webletid : ajax.values[i][11], selval : ajax.values[i][12] };
        this.obj.tables[ele].ondblclick = function() { try { this.weblet.show_inputlist.call(this.weblet, this.selval); } catch(e) { this.weblet.exception("MneAjaxWeblet::selectlist", e); } };
        this.eleMkClass(this.obj.tables[ele], 'selectlist', true);
      }
    else if ( this.initpar.inputlist_ignore_notdefined != true )
      this.error(this.txtSprintf(this.txtGetText('#mne_lang#Element <$1> ist unbekannt'),ele));
  }
  for ( i in this.obj.inputs)
    if ( typeof this.obj.inputs[i].selectlist != 'undefined' && this.obj.inputs[i].selectlist != '' ) this.create_selectlist(this.obj.inputs[i]);

};

MneAjaxWeblet.prototype.showLabel = function()
{
  var str = "";
  var i = null;
  try
  {
    for ( i in this.obj.labels )
      str += i + ",";
    for ( i in this.obj.inputs )
    {
      if ( typeof this.obj.labels[i] == 'undefined' )
        str += i + ",";
    }
    for ( i in this.obj.outputs )
    {
      if ( typeof this.obj.labels[i] == 'undefined' && typeof this.obj.inputs[i] == 'undefined' )
        str += i + ",";
    }
    
    str = str.substring(0,str.length - 1);

    var p =
    {
        cols     : str,
        no_vals  : "true",
        sqlend   : 1
    };

    if ( typeof this.initpar.query    != 'undefined') p.query   = this.initpar.query;
    if ( typeof this.initpar.schema   != 'undefined') p.schema  = this.initpar.schema;
    if ( typeof this.initpar.table    != 'undefined') p.table   = this.initpar.table;
    if ( typeof this.initpar.squery   != 'undefined') p.query   = this.initpar.squery;
    if ( typeof this.initpar.sschema  != 'undefined') p.schema  = this.initpar.sschema;
    if ( typeof this.initpar.stable   != 'undefined') p.table   = this.initpar.stable;

    if (   typeof p.schema == 'undefined' || typeof p.table == 'undefined' && typeof p.query == 'undefined')
    {
      this.error("#mne_lang#keine Abfrage und keine Table für <" + this.id + ":" + this.path + "> definiert");
      return;
    }

    if ( typeof p.query == 'undefined' )
      MneAjaxData.prototype.read.call(this, "/db/utils/table/data.xml",  p );
    else
      MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  p );

    for ( i in this.obj.labels )
    {
      this.showSingleLabel(this.obj.labels[i], this.names[this.ids[i]], this.names[this.typs[i]]);
    }
    for ( i in this.obj.inputs )
    {
      if ( typeof this.regexps[this.ids[i]] != 'undefined' )
        this.create_checkpopup(this.obj.inputs[i], this.regexps[this.ids[i]]);
      this.obj.inputs[i].inputformat = this.formats[this.ids[i]];
    }
    for ( i in this.obj.outputs )
    {
      this.obj.outputs[i].outputformat = this.formats[this.ids[i]];
    }
  }
  catch(e)
  {
    this.exception("MneAjaxWeblet::showLabel:", e);
  }
};

MneAjaxWeblet.prototype.readData = function(weblet, param)
{
  var i;
  var p = this.readDataParam.call(this, weblet, param);
  
  if ( typeof this.initpar.action != 'undefined' )
    MneAjaxData.prototype.read.call(this, this.initpar.action,  p, false );
  else if ( typeof p.query != 'undefined' )
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  p, false );
  else if ( typeof p.table != 'undefined')
    MneAjaxData.prototype.read.call(this, "/db/utils/table/data.xml",  p, false );
  else
    this.error (this.oid + ": " + "#mne_lang#Keine Aktion bzw. Abfrage oder Table zum Lesen definiert");
  
  if ( this.values.length == 1 && p["no_setvalues"] != true )
    for ( i in this.ids )
      this.act_values[i] = this.values[0][this.ids[i]];

  return true;
};



MneAjaxWeblet.prototype.ok = function(setdepend, start, sqlend, showvalue )
{
  var p = { sqlend : ( sqlend != false ) ? '1' : '' };

  if ( typeof this.initpar.schema != 'undefined' && this.initpar.schema != null ) p.schema = this.initpar.schema;
  if ( typeof this.initpar.table  != 'undefined' && this.initpar.table != null  ) p.table = this.initpar.table; 
  if ( typeof this.initpar.sschema != 'undefined' && this.initpar.sschema != null ) p.schema = this.initpar.sschema;
  if ( typeof this.initpar.stable  != 'undefined' && this.initpar.stable != null  ) p.table = this.initpar.stable; 
  if ( typeof this.initpar.oschema != 'undefined' && this.initpar.oschema != null ) p.schema = this.initpar.oschema;
  if ( typeof this.initpar.otable  != 'undefined' && this.initpar.otable != null  ) p.table = this.initpar.otable; 
  if ( typeof this.initpar.noprint_par  != 'undefined' && this.initpar.noprint_par != null  ) p.no_printpar = this.initpar.noprint_par; 

  p = this.getParam(p);
  if ( this.okaction == 'mod' )
    p = this.getIdparam(p);

  if ( typeof this.btnrequest[this.okaction] == 'undefined' )
    throw { message : this.txtSprintf(this.txtGetText('#mne_lang#keine Buttonaktion für <$1> definiert'),this.okaction) };

    if ( start != false && typeof p.nosql == 'undefined' )
      MneAjaxData.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );

    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest[this.okaction],  p ) == 'ok' )
    {
      if ( showvalue != false ) this.showValue(this);
      if ( setdepend != false ) this.setDepends("ok");

      if ( typeof this.initpar.okpost != 'undefined' )
        if ( MneAjaxWeblet.prototype.write.call(this, this.initpar.okpost , p ) != 'ok' )
          return true;

      return false;
    }

    return true;
};

MneAjaxWeblet.prototype.del = function(setdepend)
{
  var p = { sqlend : 1 };

  if ( typeof this.initpar.schema != 'undefined' && this.initpar.schema != null ) p.schema = this.initpar.schema;
  if ( typeof this.initpar.table  != 'undefined' && this.initpar.table != null  ) p.table = this.initpar.table; 
  if ( typeof this.initpar.sschema != 'undefined' && this.initpar.sschema != null ) p.schema = this.initpar.sschema;
  if ( typeof this.initpar.stable  != 'undefined' && this.initpar.stable != null  ) p.table = this.initpar.stable; 
  if ( typeof this.initpar.dschema != 'undefined' && this.initpar.dschema != null ) p.schema = this.initpar.dschema;
  if ( typeof this.initpar.dtable  != 'undefined' && this.initpar.dtable != null  ) p.table = this.initpar.dtable; 

  p = this.getIdparam(p);
  if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
    return false;

  if ( typeof this.initpar.delpre != 'undefined' )
  {
    if ( MneAjaxWeblet.prototype.write.call(this, this.initpar.delpre , p ) != 'ok' )
      return true;
  }

  if ( typeof p.nosql == 'undefined' )
    MneAjaxData.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );

  if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest.del, p) == 'ok') 
  {
    this.clearModify(true);
    this.add(setdepend);

    if ( typeof this.initpar.delpost != 'undefined' )
    {
      if ( MneAjaxWeblet.prototype.write.call(this, this.initpar.delpost , p ) == 'ok' )
        return false;
    }
    return false;
  }

  return true;
};

MneAjaxWeblet.prototype.func = function(param, actval, setdepend, dependreason, postid )
{
  if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', param) == 'ok')
  {
    if ( typeof actval == 'string' && actval != "" )
    {
      this.act_values[actval] = this.act_values.result;
      if ( typeof postid != 'undefined' && typeof this.initpar[ postid + 'post']  != 'undefined' && this.initpar[ postid + 'post']  != null )
        if ( MneAjaxWeblet.prototype.write.call(this, this.initpar[ postid + 'post'] , param ) != 'ok' )
          return true;

      if ( actval != 'noshowvalue')
        this.showValue(this);
    }
    else
    {
      this.add(setdepend);
      if ( typeof postid != 'undefined' && typeof this.initpar[ postid + 'post']  != 'undefined'  && this.initpar[ postid + 'post']  != null )
        if ( MneAjaxWeblet.prototype.write.call(this, this.initpar[ postid + 'post'] , param ) != 'ok' )
          return true;
    }

    if ( setdepend != false )
      this.setDepends(( typeof dependreason != 'undefined' && dependreason != null ) ? dependreason : "func");
    return false;
  }
  return true;
};
