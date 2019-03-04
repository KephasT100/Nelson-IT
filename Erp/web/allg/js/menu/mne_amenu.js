// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    datei: js/menu/mne_amenu.js
//================================================================================

window.MneAjaxMenu = function(win, frame, param)
{

  this.loadCss("menu.css");

  MneAjaxData.call(this, win);
  

  if ( typeof frame == 'string' ) this.frame = this.doc.getElementById(frame); else this.frame = frame;

  if ( typeof param.name      != 'undefined' && param.name      != null ) this.name = param.name; else this.name = 'main';
  if ( typeof param.classname != 'undefined' && param.classname != null ) this.classname = param.classname; else this.classname = 'menu';

  if ( typeof param.parentid  != 'undefined' && param.parentid  != null ) this.parentid  = param.parentid;  else this.parentid = '';
  if ( typeof param.weblet    != 'undefined' && param.weblet    != null ) this.weblet    = param.weblet;    else this.weblet;
  if ( typeof param.lastquery != 'undefined' && param.lastquery != null ) this.lastquery = param.lastquery; else this.lastquery = "";
  if ( typeof param.debug     != 'undefined' && param.debug     != null ) this.pdebug    = 1;
  if ( typeof param.pdebug    != 'undefined' && param.pdebug    != null ) this.pdebug    = 1;

  if ( typeof param.cols != 'undefined' && param.cols != null && typeof param.showcols != 'undefined' && param.showcols != null )
  {
    this.cols = param.cols.split(',');
    this.showcols = param.showcols.split(',');

    if ( typeof param.action     != 'undefined' && param.action     != null ) this.readaction = param.action;     else this.readaction   = null;
    if ( typeof param.table      != 'undefined' && param.table      != null ) this.table      = param.table;      else this.table    = null;
    if ( typeof param.schema     != 'undefined' && param.schema     != null ) this.schema     = param.schema;     else this.schema   = 'mne_application';
    if ( typeof param.query      != 'undefined' && param.query      != null ) this.query      = param.query ;     else this.query    = null;

    if ( typeof param.wcol      != 'undefined' && param.wcol      != null ) this.wcol      = param.wcol;      else this.wcol   = "";
    if ( typeof param.wop       != 'undefined' && param.wop       != null ) this.wop       = param.wop;       else this.wop    = "";
    if ( typeof param.wval      != 'undefined' && param.wval      != null ) this.wval      = param.wval;      else this.wval   = "";

    if ( typeof param.scols     != 'undefined' && param.scols     != null ) this.scols      = param.scols;     else this.scols   = "";
    this.read = MneAjaxMenu.prototype.read_fix;
  }
  else if ( typeof param.readaction != 'undefined' && param.readaction != null )
  {
    this.readaction = param.readaction;
    this.readparam = param.readparam;
    this.read = MneAjaxMenu.prototype.read_action;

    if ( typeof param.noleaf      != 'undefined' && param.noleaf         != null ) this.noleaf         = param.noleaf;
    if ( typeof param.showleaf    != 'undefined' && param.showleaf       != null ) this.showleaf       = param.showleaf;
    if ( typeof param.showsubmenu != 'undefined' && param.showsubmenu    != null ) this.showsubmenu    = param.showsubmenu;
    if ( typeof param.name        != 'undefined' && param.name           != null ) this.name = param.name; else this.name = '';

    if ( typeof this.weblet != 'undefined' &&  this.weblet.scrollframe != null )
      this.weblet.scrollframe.action  = { "menu" : this, "menuid" : '', name : '', action : "root", "frame" : this.frame, timeout : null, "classname" : this.classname };

  }
  else
  {
    if ( typeof param.action     != 'undefined' && param.action     != null ) this.readaction = param.action; else this.readaction   = null;
    if ( typeof param.table     != 'undefined' && param.table     != null ) this.table     = param.table;     else this.table    = null;
    if ( typeof param.schema    != 'undefined' && param.schema    != null ) this.schema    = param.schema;    else this.schema   = 'mne_application';
    if ( typeof param.query     != 'undefined' && param.query     != null ) this.query     = param.query ;    else this.query    = 'menu';

    if ( param.name == 'all' )
    {
      if ( typeof param.wcol      != 'undefined' && param.wcol      != null ) this.wcol      = "parentid," + param.wcol;      else this.wcol   = "parentid";
      if ( typeof param.wop       != 'undefined' && param.wop       != null ) this.wop       = "=,"        + param.wop;       else this.wop    = "=";
      if ( typeof param.wval      != 'undefined' && param.wval      != null ) this.wval      = param.wval;                    else this.wval   = "";
    }
    else
    {
      if ( typeof param.wcol      != 'undefined' && param.wcol      != null ) this.wcol      = "menuname,parentid," + param.wcol;      else this.wcol   = "menuname,parentid";
      if ( typeof param.wop       != 'undefined' && param.wop       != null ) this.wop       = "=,=,"               + param.wop;       else this.wop    = "=,=";
      if ( typeof param.wval      != 'undefined' && param.wval      != null ) this.wval      = param.wval;                             else this.wval   = "";
    }
    if ( typeof param.noleaf      != 'undefined' && param.noleaf         != null ) this.noleaf         = param.noleaf;
    if ( typeof param.showsubmenu != 'undefined' && param.showsubmenu    != null ) this.showsubmenu    = param.showsubmenu;

    this.read = MneAjaxMenu.prototype.read_recursive;
    this.oid = this.id = "menu";
  }

  this.frame.innerHTML = '';
  this.frame.className = this.frame.className + " " + this.classname + "main";

  this.actions = {};
  this.last_action = null;
  this.act_action = null;

  this.mkElement = function(menuid, iname, classname, action )
  {
    var name = iname;
    if ( name == '' ) name = "&nbsp;";
    var div = this.doc.createElement("div");
    var e;

    var ra = action.rootaction;
    var path = action.name;
    var parentpath = "";
    
    while ( typeof ra != 'undefined' )
    {
      parentpath = ra.name + "➔" + parentpath;
      path = ra.name + "➔" + path;
      ra = ra.rootaction;
    }

    action.path = path;
    action.parentpath = parentpath.substr(0, parentpath.length - 1);

    div.id = this.name + 'frame' + menuid;
    div.className = classname;
    div.action = action;

    if ( typeof action.status != 'undefined' && action.status != '' )
      div.className = div.className + " " + div.className + action.status;

    if ( this.navigator.mobile || this.navigator.tablet )
    {
      div.onclick = function() {};
      div.addEventListener ('touchstart', window.MneAjaxMenu.prototype.touchstart, false);
      div.addEventListener ('touchend', window.MneAjaxMenu.prototype.touchend, false);
    }

    e = this.doc.createElement("div");
    e.className = this.classname + "link";
    div.appendChild(e);

    e.innerHTML = name;
    e.action = action;
    if ( typeof action.status != 'undefined'  && action.status != '' )
      e.className = e.className + " " + e.className + action.status;
    
    action.root = div;
    action.frame = this.doc.createElement('div');
    action.frame.className = this.classname + 'main';
    action.root.appendChild(action.frame);

    return div;
  };

  this.submenu = function(menuid, refresh)
  {
    var action = this.actions[menuid];
    var parent = action.root;
    var frame;
    var a;
    var i;
    
    try
    {
      if ( refresh == true  )
      {
        this.eleMkClass(action.root, "menuopen", false);
        if ( typeof action.status != 'undefined')
          this.eleMkClass(action.root, "menuopen" + action.status, false);
      }

      if ( action.root.className.indexOf('menuopen') == -1 )
      {   
        action.frame.innerHTML = "";
        this.read(menuid, action.frame, this.classname);
        action.frame.child_count = this.child_count;
      }

      this.eleMkClass(action.root, 'menuopen',  ( action.root.className.indexOf('menuopen') == -1 ));
    }
    catch(e)
    {
      this.exception("MneAjaxMenu::submenu:",e);
    }

  };

  this.click_real = function(action, evt)
  {
    var menu = this;
    action.timeout = null;
    if ( typeof this.weblet != 'undefined' )
      this.weblet.showwait();
    window.setTimeout(function() {
      try
      {
        if ( typeof action != 'undefined' && action.menu == menu ) menu.action.call(menu, action);
        if ( typeof menu.weblet != 'undefined' && typeof menu.weblet.click == 'function' )
          menu.weblet.click(evt);
      }
      catch ( e )
      {
        menu.exception("MneAjaxMenu::click_real:",e);
        menu.weblet.hidewait();
      }
      menu.weblet.hidewait();
    }, 0);
  };

  this.dblclick = function(evt)
  {
    if ( this.classname == 'register' )
    {
      if ( typeof evt.target.action != 'undefined' && evt.target.action.menu == this  )
      {
        evt.target.action.menu.weblet.reload = true;
        evt.target.action.menu.last_action = null;
      }
      this.click_real(evt.target.action);
    }
    else if ( this.classname.substr(0,4) == 'tree' && evt.target.action.action != 'root' )
    {
      this.click_real(evt.target.action);
      if ( typeof this.weblet.dblclick == 'function' )
        this.weblet.dblclick(evt);
    }

    return true;
  };

  this.click = function(evt)
  {
    try
    {
      if ( typeof evt.target.action != 'undefined' && evt.target.action.action != 'submenu' )
        this.close(evt.target.action);
      else if ( typeof evt.target.action == 'undefined' || evt.target.action.menu != this || evt.target.action.rootaction != this.last_action )
        this.close(null);
      if ( typeof evt.target.action != 'undefined' && evt.target.action.menu == this  )
      { 
        if ( evt.button == 0 )
        {
          if ( evt.ctrlKey != true )
          {

            if ( evt.target.action.timeout == null )
            {
              var self = this;
              var e = evt;
              var timeout = function() { self.click_real.call(self, evt.target.action, e); };
              evt.target.action.timeout = window.setTimeout(timeout, 200);
            }
            else
            {
              window.clearTimeout(evt.target.action.timeout);
              evt.target.action.timeout = null;
              this.dblclick(evt);
            }
          }
          else if ( typeof this.weblet.click_right == 'function'  )
            this.weblet.click_right(evt);
        }
        if ( evt.button != 0 && typeof this.weblet.click_right == 'function' )
          this.weblet.click_right(evt);
      }
    }
    catch ( e )
    {
      this.exception("MneAjaxMenu::click:",e);
    }

    return true;
  };

  this.mousedown = function(evt)
  {
    if ( typeof evt.target.action != 'undefined' && evt.target.action.menu == this  )
    { 
      if ( evt.button != 0 && typeof this.weblet.click_right == 'function' )
        this.weblet.click_right(evt);
    }
  }

  this.reload = function()
  {
    this.actions = new Array();
    this.last_action = null;
    this.act_action = null;
    this.frame.innerHTML = '';

    this.read(this.parentid, this.frame, this.classname);
  };

  this.win.mneDocevents.addInterest("click", this);

  if ( param.noread != true )
    this.read(this.parentid, this.frame, this.classname);

};

MneAjaxMenu.prototype = new MneAjaxData(window);
MneAjaxMenu.prototype.release = function()
{
  this.win.mneDocevents.remove(this);
}

MneAjaxMenu.prototype.action = function(a)
{
  var action = a.action;
  var closeit = ( typeof this.frame.mne_slider != 'undefined' );

  this.act_action = a;
  this.weblet.obj.act_menuid = a.menuid;
  
  try
  {
    var str;

    str = action.split("(")[0].replace(/ *$/, "");
    action = action.replace(/\\'/g, "\\\\'");

    switch(str)
    {
    case "root":
      break;

    case "submenu"  : 
      closeit = false;
      a.menu.submenu(a.menuid);
      if ( this.noleaf == true || this.showsubmenu == true )
      {
        var param =
        {
                menuparentid : typeof a.rootaction == 'undefined' ? null : a.rootaction.menuid,
                menuid       : a.menuid,
                name         : a.name,
                path         : a.path,
                parentpath   : a.parentpath,
                submenu      : true
        };
        this.weblet.setValue(param);
      }
      break;

    case "show"     : eval("this.weblet." + action); break;
    case "load"     : eval("this.weblet." + action); break;
    case "setValue" : eval("this.weblet." + action); break;
    default         : eval(action);
    }

    if ( typeof this.weblet.resize == 'function')
      this.weblet.resize();
    
    if ( closeit )
      this.frame.mne_slider.hide();
  }
  catch(e)
  {
    if ( typeof e.stack == 'undefined' ) e.stack = "no stack";
    this.exception("MneAjaxMenu::action:" + action, e);
  }

  this.act_action = null;
  this.last_action = a;
};

MneAjaxMenu.prototype.refresh = function(menuid)
{
  if ( menuid == '' ) { this.reload(); return; }

  if ( typeof this.actions[menuid] == 'undefined' ) return;

  if ( this.actions[menuid].action.split("(")[0].replace(/ *$/, "") == 'submenu' && this.actions[menuid].frame != null )
    this.actions[menuid].menu.submenu(menuid, true);
};

MneAjaxMenu.prototype.close = function(a)
{
  var i = null;

  if ( this.classname.substr(0,4) == 'tree' ) return;

  for ( i in this.actions )
  {
    var action = this.actions[i];
    if ( typeof a != 'undefined' && a != null && a.menu == this )
      this.eleMkClass(action.root, this.classname + "active", action == a );
  }
};

MneAjaxMenu.prototype.read_setval = function(p)
{
  var param = p;
  if ( typeof param == 'string' )
    eval("param = { " + param + "}");
  
  return param;
};

MneAjaxMenu.prototype.check_width = function(f)
{
  var frame = ( typeof f != 'undefined' ) ? f : this.frame;
  var w = 0;
  
  if ( this.classname == 'register' )
  {
    for ( ele = frame.firstChild; ele != null; ele = ele.nextSibling )
      if ( w < ele.scrollWidth ) w = ele.scrollWidth;
    for ( ele = frame.firstChild; ele != null; ele = ele.nextSibling )
      ele.style.minWidth = ( w + 4 ) + "px";
  }
}

MneAjaxMenu.prototype.read_recursive = function(parentid, frame, classname)
{
  var val;
  if ( this.name == 'all' )
    val = parentid.replace(/\,/, "\\,");
  else
    val = this.name + "," + parentid.replace(/\,/, "\\,");

  if ( this.wval != "" ) val = val + "," + this.wval;

  var param =
  {
      "schema" : this.schema,
      "query"  : this.query,
      "cols"   : "menuid,item,action,typ,pos",
      "scols"  : "pos",
      "wcol"   : this.wcol,
      "wop"    : this.wop,
      "wval"   : val,
      "distinct" : 1,
      "lastquery" : this.lastquery,
      "sqlend" : 1
  };

  if ( this.noleaf == true ) param.cols += ",typnoleaf";

  MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml", param);

  var ele;
  var menuid = this.ids['menuid'];
  var name = this.ids['item'];
  var action = this.ids['action'];
  var typ = this.ids['typ'];
  var typnoleaf = this.ids['typnoleaf'];
  var i;
  this.child_count = 0;
  for ( i = 0; i<this.values.length; i++ )
  {
    var v = this.values[i][action];
    var str = v.split("(")[0].replace(/ *$/, "");
    var setvals = {};
    if ( str == 'setValue' )
    {
      v = v.replace(/setValue/, 'this.read_setval');
      v = v.replace(/\\'/g, "\\\\'");
      setvals = eval(v);
    }

    if ( this.noleaf != true || this.values[i][typ] != 'leaf' )
    {
      this.actions[this.values[i][menuid]] =
      {
          menu         : this,
          menuid       : this.values[i][menuid],
          name         : this.values[i][name],
          action       : this.values[i][action],
          setvals      : setvals,
          frame        : null,
          rootaction   : this.actions[parentid],
          timeout      : null,
          classname    : classname,
          leaf         : this.values[i][typ]
      };
      ele = this.mkElement( this.values[i][menuid], this.txtFormat.call(this, this.values[i][name], this.typs[name]), classname + this.values[i][typ], this.actions[this.values[i][menuid]]);
      frame.appendChild(ele);
      this.child_count++;
    }
  }
  this.check_width(frame) ;
};

MneAjaxMenu.prototype.read_fix = function(parentid, frame, classname)
{
  var wcol = this.wcol;
  var wop = this.wop;
  var wval = this.wval;
  var deep = 0;
  var komma = '';
  var menuid = '';
  var typ = '';
  var action = '';
  var setvals = new Array();

  if ( parentid != '' )
  {
    wcol = this.actions[parentid].wcol;
    wop  = this.actions[parentid].wop;
    wval = this.actions[parentid].wval;
    deep = this.actions[parentid].deep;
    menuid = this.actions[parentid].menuid;
  }

  if ( wcol != '' )
    komma = ',';

  var colarray = this.cols[deep].split(':');
  var cols = colarray[0];
  if ( colarray.length > 1 ) cols = cols + "," + colarray[1];
  var scols = ( colarray.length > 1 ) ? colarray[1] : colarray[0];

  if ( this.scols != '' )
  {
    var s = this.scols.split(',');
    var i;

    for ( i =0; i< s.length; i++ )
    {
      if ( s[i].substring(0,1) == '!' )
      {
        cols += ',' + s[i].substr(1);
      }
      else
      {
        cols += ',' + s[i];
      }

      scols = this.scols + "," + scols;
    }
  }

  if ( deep == this.cols.length - 1 )
  {
    typ = 'leaf';
    cols = cols + ',' + this.showcols.join(',');
  }

  var param =
  {
      "query" : this.query,
      "schema" : this.schema,
      "table"  : this.table,
      "cols" : cols,
      "scols" : scols,
      "wcol" : wcol,
      "wop"  : wop,
      "wval" : wval,
      "lastquery" : this.lastquery,
      "distinct" : 1,
      "sqlend" : 1
  };

  if ( typeof this.readaction != 'undefined' && this.readaction != null )
    MneAjaxData.prototype.read.call(this, this.readaction, param);
  else if ( typeof this.query != 'undefined' && this.query != null )
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml", param);
  else    
    MneAjaxData.prototype.read.call(this, "/db/utils/table/data.xml", param);

  var ele;


  for ( i = 0; i<this.values.length; i++ )
  {
    setvals = {};
    if ( typ == 'leaf' )
    {
      var j;
      action = "setValue('";
      for ( j=0; j<this.showcols.length; j++ )
      {
        action += this.showcols[j] + ': "' + this.values[i][this.ids[this.showcols[j]]] + '",';
        setvals[this.showcols[j]] = this.values[i][this.ids[this.showcols[j]]];
      }
      action  = action.substring(0,action.length - 1);
      action += "')";
    }
    else
    {
      action = "submenu";
    }

    this.actions[menuid + '@@@@' + this.values[i][this.ids[colarray[0]]]] =
    { 
        menu       : this,
        menuid     : menuid + '@@@@' + this.values[i][this.ids[colarray[0]]],
        action     : action,
        setvals    : setvals,
        frame      : null,
        rootaction : this.actions[parentid],
        deep       : deep + 1,
        wcol       : wcol + komma + colarray[0],
        wval       : wval + komma + this.values[i][this.ids[colarray[0]]].replace(/\,/, "\\,"),
        wop        : wop  + komma + "=",
        leaf       : typ
    };
    ele = this.mkElement( menuid + this.values[i][this.ids[colarray[0]]], this.txtFormat.call(this, this.values[i][this.ids[colarray[0]]], this.typs[this.ids[colarray[0]]]), classname + typ, this.actions[menuid + '@@@@' + this.values[i][this.ids[colarray[0]]]]);
    frame.appendChild(ele);
  }
};

MneAjaxMenu.prototype.read_action =  function(parentid, frame, classname)
{
  var i = null;
  var param = {};

  for ( i in this.readparam )
  {
    param[i] = eval(this.readparam[i]);
  }

  if ( this.noleaf == true )
    param['noleaf'] = "1";

  MneAjaxData.prototype.read.call(this, this.readaction, param);

  var ele;
  var menuid = this.ids['menuid'];
  var name = this.ids['item'];
  var action = this.ids['action'];
  var typ = this.ids['typ'];
  var status = this.ids['status'];

  var i;
  this.child_count = 0;
  for ( i = 0; i<this.values.length; i++ )
  {
    var menuidvalue = this.values[i][menuid];
    if ( this.name != '' )
      menuidvalue = menuidvalue.substr(this.name.length + 1);

    this.actions[menuidvalue] = { "menu" : this, "menuid" : menuidvalue, name : this.values[i][name], action : this.values[i][action], "frame" : null, "rootaction" : this.actions[parentid], timeout : null, "classname" : classname, leaf : this.values[i][typ]  };
    if ( status != 'undefined' )
      this.actions[menuidvalue].status = this.values[i][status];

    ele = this.mkElement( menuidvalue, this.txtFormat.call(this, this.values[i][name], this.typs[name]), classname + this.values[i][typ], this.actions[menuidvalue]);
    frame.appendChild(ele);
    this.child_count++;
  }
};


MneAjaxMenu.prototype.touchstart = function(e)
{
  this.touch = 0;
  var s = this;
  window.setTimeout(function() { s.touch = 1; }, 1000);

};

MneAjaxMenu.prototype.touchend = function(evt)
{
  this.action.menu.close.call(this.action.menu, this.action);

  if ( this.touch == 1 )
  {
    if ( this.action.menu.classname == 'register')
    {
      this.action.menu.weblet.reload = true;
      this.action.menu.last_action = null;
      this.action.menu.click_real.call(this.action.menu, this.action);
    }
    else
    {
      this.action.menu.mousedown({ target : evt.target, button : 1 });
      return;
    }
  }
  
};
