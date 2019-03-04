// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
// ================================================================================

//================================================================================
//MneAjaxWeblet          
//================================================================================
'use strict';
window.MneAjaxWeblet = function(win, frame)
{
  var self = this;
  MneAjaxData.call(this, win);

  if ( typeof frame == 'string' ) self.frame = self.doc.getElementById(frame); else self.frame = frame;
  if ( typeof frame == 'undefined') self.frame = this.doc.createElement("div");

  self.origframe = self.frame;
  self.origframe.weblet = this;
  
  this.popups = {};
  this.initvalues = { initpar : '' };
  self.reset();

  this.register_weblet = null;

  this.initpar = {};
  
  this.objectid = MneAjaxWeblet.prototype.objectid++;
};


//================================================================================
//MneAjaxWeblet.prototype          
//================================================================================
MneAjaxWeblet.prototype = new MneAjaxData(window);
MneAjaxWeblet.prototype.pcount = 0;
MneAjaxWeblet.prototype.objectid = 0;

MneAjaxWeblet.prototype.confirm = function(str)
{
  if ( this.obj.noconfirmmessage != true && window.confirm(str) != true )
  {
    this.obj.confirm = false;
    return false;
  }

  this.obj.confirm = true;
  return true;
};

MneAjaxWeblet.prototype.reset = function()
{
  var i = null;
  this.frame.innerHTML = "";

  for ( i in this.weblets ) 
  {
    if ( this.weblets[i] != this )
    {
      this.weblets[i].reset();
      this.win.mneDocevents.remove(this.weblets[i]);
    }
  }
  
  for ( i in this.menus)
  {
    this.menus[i].release();
  }

  this.win.mneDocevents.remove(this);
  
  if ( typeof this.win.mne_editor_parameter != 'undefined' ) 
  {
    for ( i in this.win.mne_editor_parameter )
    {  if ( typeof this.win.mne_editor_parameter[i].editor.mne_editor != 'undefined' )
        this.win.mne_editor_parameter[i].editor.mne_editor.buttons.clear();
    }
  }
  
  for ( i in this.functions )
    try { delete this[i]; } catch( e ) {};
  
  for ( i in this.popups )
    this.popups[i].remove();

  if ( typeof this.obj != 'undefined' && typeof this.obj.inputs != 'undefined' )
  {
    for ( i in this.obj.inputs )
    {
      if ( typeof this.obj.inputs[i].helpframe != 'undefined' && this.obj.inputs[i].helpframe != null && this.obj.inputs[i].helpframe.parentNode != null )
        this.obj.inputs[i].helpframe.parentNode.removeChild(this.obj.inputs[i].helpframe);
    }
  }
  
  if ( this.obj && this.obj.style ) this.doc.head.removeChild(this.obj.style )  
  if ( this.obj && this.obj.observer ) this.obj.observer.disconnect();
 
  for ( i in this.slider )
    this.slider[i].destructor();
  
  this.weblets = {};
  this.subweblets = {};
  this.menus = {};
  this.popups = {};
  this.slider = {};

  this.root = {};
  this.root.menus = {};
  this.root.container = {};
  this.root.popups = {};

  this.obj = {};
  this.act_values = {};
  this.old_values = {};
  
  this.showids = new Array();
  this.defvalues = {};

  this.showdynpar = {};
  
  this.functions = {};

  this.inputlist = null;
  this.oldvalue = {};
  
  this.titleString =
  { 
      'add'   : this.txtGetText('#mne_lang#Neu'),
      'added' : this.txtGetText('#mne_lang#Neuen Datensatz hinzugefügt'),
      'mod'   : this.txtGetText('#mne_lang#Bearbeiten'),
      'del'   : this.txtGetText('#mne_lang#Wirklich Löschen'),
      'delid' : ''
  };

  this.obj.inputs  = {};
  this.obj.ninputs = {};
  this.obj.outputs = {};
  this.obj.labels  = {};
  this.obj.buttons = {};
  this.obj.sliders = {};
  this.obj.tables  = {};
  this.obj.frames  = {};
  this.obj.fields  = new Array();


  this.obj.mkbuttons = 
  [
    { id : 'ok',     value : this.txtGetText('Ok')},
    { id : 'cancel', value : this.txtGetText('#mne_lang#Abbrechen')},
    { id : 'add',    value : this.txtGetText('#mne_lang#Hinzufügen')},
    { id : 'del',    value : this.txtGetText('#mne_lang#Löschen'), space : 'after' },
    { id : 'print',  value : this.txtGetText('#mne_lang#Drucken')},
  ];
  
};

MneAjaxWeblet.prototype.onhidden = function()
{
    this.clearModify(true);
}

MneAjaxWeblet.prototype.addCss = function( rule )
{
  if ( this.eleIsNotdefined(this.obj.style ) )
  {
    this.obj.style = document.createElement("style");
    this.obj.style.type="text/css";
    this.obj.style.id = 'weblet' + this.objectid;
    document.head.appendChild(this.obj.style);
    this.obj.sheet = this.obj.style.sheet;
  }
  this.obj.sheet.insertRule( rule , this.obj.sheet.cssRules.length);
}

MneAjaxWeblet.prototype.keydown = function(evt, inside)
{
  if ( inside == true || window.mneDocevents.checkInside(evt, this.origframe) )
  {
    if ( MneMisc.prototype.os == "mac" && evt.metaKey == true && evt.keyCode == 82 ||
         MneMisc.prototype.os != "mac" && evt.keyCode == 116 )
    {
      if ( typeof this.refresh == 'function' )
      {
        this.refresh();
        this.doceventstop = true;
        return false;
      }
      return false;
    }

    if ( evt.keyCode == 113 )
    {
      if ( typeof this.obj.buttons != 'undefined' && typeof this.obj.buttons.ok != 'undefined' )
      {
        window.mneDocevents.fireEvent(this.obj.buttons.ok, 'click');  
        this.doceventstop = true;
      }
      return false;
    }
    
    if ( evt.keyCode == 114 )
    {
      if ( typeof this.obj.searchobj != 'undefined' )
      {
        window.mneDocevents.fireEvent(this.obj.searchobj, 'click');  
        this.doceventstop = true;
      }
      return false;
    }
  }
  return true;

};

MneAjaxWeblet.prototype.initDefaults = function(ivalues, svalues)
{
  var i = null;
  for ( i in ivalues)
    if ( typeof this.initpar[i] == 'undefined') this.initpar[i] = ivalues[i];
};

MneAjaxWeblet.prototype.initShow = function()
{
  this.sends = new Array();
  this.receives = {};
};

MneAjaxWeblet.prototype.getTemplate = function()
{
  this.values = [ [ this.obj.templatename, '' , null ]]
};

MneAjaxWeblet.prototype.getSlider = function()
{
};

MneAjaxWeblet.prototype.mkTemplate = function()
{
  var i;
  this.reset();

  if ( this.values.length == 0 )
  {
    this.frame.innerHTML = "#mne_lang#Kein Template gefunden#: &lt;" + this.obj.webletname + "&gt;";
    throw { message : "#mne_lang#Kein Template gefunden#: <" + this.obj.webletname + ">", stack : "" };
  }
  if ( this.settitle == true && this.values[0][1] != '' )
    this.doc.title = this.values[0][1] + " - Nelson technische Informatik";

  this.htmlcomposeid = this.values[0][2];
  
  MneAjax.prototype.load.call(this, this.values[0][0] + "/object.js");
  if ( this.req.getResponseHeader('Content-Type').indexOf("javascript") < 0 )
    this.frame.innerHTML = this.req.responseText;
  else
  {
	  eval("this.init_template = function(weblet) " + this.req.responseText);
	  this.init_template(this);
  }
  this.content = new Array();
  for ( i =0; i<this.frame.childNodes.length; i++ )
    this.content[this.content.length] = this.frame.childNodes[i];

  this.getSlider();
};

MneAjaxWeblet.prototype.getRootweblets = function()
{
};


MneAjaxWeblet.prototype.mkRootweblets = function()
{
  var i = null;
  for ( i in this.root.container )
  {
    this.weblets[i] = new MneAjaxWeblet(this.win, this.root.container[i]);
    this.weblets[i].parent = this;
    this.weblets[i].initShow();

    if ( typeof this.root.menus[i] == 'undefined' )
      this.root.container[i].innerHTML = "keine Weblet für &lt;" + this.name + ":" + i + "&gt; gefunden";
  }
};

MneAjaxWeblet.prototype.getMenuparam = function()
{
  return {
    action    : "/menu/get",
    parentid  : this.htmlcomposeid,
    classname : "register",
    wcol      : 'groupexists',
    wop       : '=',
    wval      : '1'
  };
};

MneAjaxWeblet.prototype.mkMenus = function()
{
  var i = null;
  var b = null;
  
  this.loadClass("MneAjaxMenu", "menu/mne_amenu.js");
  var param = this.getMenuparam();

  for ( i in this.root.menus )
  {
    param.name = i;
    param.weblet = this.weblets[i];
    this.weblets[i].parent = this;
    this.menus[i] = new MneAjaxMenu(this.win, this.root.menus[i], param );
    this.root.menus[i].weblet = this.weblets[i];
    
    this.weblets[i].register = {};
    this.weblets[i].act_register = null;
    this.weblets[i].menu = this.menus[i];
    this.weblets[i].showValue = function(weblet, param )
    {
      var i = null;
      var w = ( typeof param.setdependweblet != 'undefined' ) ? param.setdependweblet : weblet;
      
      for ( i in this.register )
      {
        if ( this.register[i].notloaded == false && ( this.register[i].initpar.showallways == true || this.register[i].menubutton.className.indexOf('active') >= 0 ))
        {
          if ( this.register[i] != w || typeof param.setdependid == 'undefined'  )
          {
            this.register[i].oldvalue = {};
            this.register[i].obj.ignore_setdepend = true;
            try { this.register[i].showValue(weblet, param); } catch(e) { this.register[i].obj.ignore_setdepend = false; throw e; }
            this.register[i].obj.ignore_setdepend = false;
          }
        }
        else if ( this.register[i].initpar.notdepend != true )
        {
          this.register[i].oldvalue[weblet.id] = weblet.id;
          this.register[i].invalidValue(weblet);
        }
      }
    };
          
    this.weblets[i].wresize = function()
    {
     
      this.menu.check_width();
      
      for ( i in this.register )
      {
        if ( this.register[i].notloaded == false )
          this.register[i].wresize();
      }
    };
    
    this.weblets[i].fullscreen = function(button, frame, nosize )
    {
      for ( i in this.register )
      {
        if ( this.register[i].notloaded == false &&  this.register[i].menubutton.className.indexOf('active') >= 0 && typeof this.register[i].fullscreen == 'function')
          this.register[i].fullscreen(button, frame, true );
      }
      return MneAjaxWeblet.prototype.fullscreen.call(this, button, frame);
    };
 
  }
};

MneAjaxWeblet.prototype.getWeblets = function()
{
  this.values = [];
};

MneAjaxWeblet.prototype.mkWeblets = function()
{
  var i,j,k;
  var weblet;
  var loadpos = new Array();
  var loadobj = {};
  
  var htmlcomposetabid = '0000000000000000'
  var id = 'rte';
  var pos = 'popup';
  var path = '/weblet/allg/rte/standalone';
  var initpar ='';
  var depend = '';
  var label = '';

  for ( i = -1; i < this.values.length; i++ )
  {
    if ( i != -1 )
    {
      htmlcomposetabid = this.values[i][0];
      id = this.values[i][1];
      pos = this.values[i][2];
      path = this.values[i][3];
      initpar = this.values[i][4];
      depend = this.values[i][5];
      label = this.values[i][6];
    }

    if ( id == 'parent' ) throw { message : "parent ist als webletid nicht erlaubt" };
    if ( pos == 'insert') continue;
    
    if ( depend != '') depend = depend.split(','); else depend = new Array();
    if ( typeof loadobj[id] == 'undefined' )
    {
      loadobj[id] = 1;
      loadpos[loadpos.length] = id;
    }

    if ( typeof this.root.menus[pos] != 'undefined' )
    {
      this.subweblets[id] = weblet = this.weblets[pos + id] = new MneAjaxWeblet(this.win, this.weblets[pos].frame);
      weblet.id = pos + id;
      weblet.htmlcomposetabid = htmlcomposetabid;
      weblet.oid = id;
      weblet.path = path;
      weblet.parent = this;
      weblet.notloaded = true;
      weblet.sends = depend;
      weblet.receives = {};
      weblet.label = label;
      weblet.showdynpar = {};
      weblet.initvalues = { initpar : initpar };
      try { eval("weblet.initpar = {" + weblet.initvalues.initpar + "}"); } catch(e) { this.exception(weblet.id + " - initpar:", e); }
      weblet.menubutton = this.weblets[pos].menu.actions[id].root;
      weblet.register_weblet = this.weblets[pos];
      weblet.loaddirect = weblet.initpar.loaddirect;
      this.weblets[pos].register[id] = weblet;
      this.weblets[pos].id = pos;
    }
    else if ( typeof this.weblets[pos] != 'undefined' )
    {
      this.subweblets[id] = weblet = this.weblets[pos];
      weblet.id = pos;
      weblet.htmlcomposetabid = htmlcomposetabid;
      weblet.oid = id;
      weblet.path = path;
      weblet.parent = this;
      weblet.notloaded = true;
      weblet.sends = depend;
      weblet.receives = {};
      weblet.loaddirect = true;
      weblet.label = label;
      weblet.showdynpar = {};
      weblet.initvalues = { initpar : initpar };
      try { eval("weblet.initpar = {" + weblet.initvalues.initpar + "}"); } catch(e) { this.exception(weblet.id + " - initpar:", e); }
    }
    else
    {
      this.root.popups[id] = window.document.createElement("div");
      this.root.popups[id].id = "popup" + id;
      this.subweblets[id] = weblet = this.weblets[pos + id] = new MneAjaxWeblet(this.win, this.root.popups[id]);
      weblet.id = pos + id;
      weblet.htmlcomposetabid = htmlcomposetabid;
      weblet.oid = id;
      weblet.path = path;
      weblet.parent = this;
      weblet.notloaded = true;
      weblet.sends = depend;
      weblet.receives = {};
      weblet.label = label;
      weblet.showdynpar = {};
      weblet.initvalues = { initpar : initpar };
      try { eval("weblet.initpar = {" + weblet.initvalues.initpar + "}"); } catch(e) { this.exception(weblet.id + " - initpar:", e); }
      if ( weblet.initpar.nopopup != true )
      {
        this.popups[id] = new MneAjaxPopup(window, label, this.root.popups[id]);
        this.popups[id].weblet = weblet;
        this.popups[id].frame.id = id;
        weblet.popup = this.popups[id];
      }
      else
      {
        this.popups[id] = { show : function() { this.weblet.load(); }, hidden : function() {}, remove : function() {}, weblet : weblet };
      }
    }
  }

  for ( i=0; i<loadpos.length; i++ )
  {
    var w = this.subweblets[loadpos[i]];
    for ( j=0; j< w.sends.length; j++ )
    {
      var s = w.sends[j].split(':');

      if ( typeof this.subweblets[s[0]] != 'undefined')
        this.subweblets[s[0]].receives[w.id] = ( s.length > 1 ) ? s[1] : w.id;
        else if ( typeof this.weblets[s[0]] != 'undefined')
        {
          var r = this.weblets[s[0]].register;
          if ( typeof r != 'undefined' && r != null )
          {
            k = null;
            for ( k in r )
              r[k].receives[w.id] = ( s.length > 1 ) ? s[1] : w.id;
          }
          else
            this.weblets[s[0]].receives[w.id] = ( s.length > 1 ) ? s[1] : w.id;
        }
        else if ( this.pdebug )
          this.error("Weblet Show: container <" + w.sends[j] + "> bei setReceives nicht gefunden");
    }
    if ( w.loaddirect == true )
    {
      if ( typeof w.register_weblet != 'undefined' && w.register_weblet != null )
        w.register_weblet.load(loadpos[i]);
      else
        w.load(loadpos[i]);
    }
  }
};

//================================================================================
//MneAjaxWeblet.prototype  Show Funktionen        
//================================================================================

MneAjaxWeblet.prototype.loadbase = function(baseweblet, weblet, oid)
{
  var path;
  
  if ( typeof weblet == 'undefined') weblet = this;
  path = weblet.path;

  weblet.origoid = weblet.oid;
  if ( typeof oid != 'undefined') weblet.oid = oid;
  weblet.path = baseweblet;

  MneAjax.prototype.load.call(weblet, baseweblet + '/object.js');
  if ( weblet.req.getResponseHeader('Content-Type').indexOf("javascript") < 0 )
    this.error(weblet.req.responseText);
  else
    try
  {
      eval("weblet.init_" + weblet.oid + " = function(weblet) " + this.req.responseText);
      weblet["init_" + weblet.oid](weblet);
  }
  catch (e)
  {
    weblet.oid = weblet.origoid;
    weblet.error("load baseweblet <" + baseweblet + ">:");
    throw e;
  }
  
  weblet.path = path;
  weblet.oid = weblet.origoid;
};

MneAjaxWeblet.prototype.loadview = function(f, v)
{
  var  view = this.path + "/view.html";
  if ( typeof this.initpar.view != 'undefined') view = this.initpar.view;
  if ( typeof v != 'undefined') view = v;

  MneAjax.prototype.load.call(this, view );
  if ( typeof f != 'undefined' && f != null )
    f.innerHTML = this.req.responseText;
  else
    this.obj.contentframe.innerHTML = this.req.responseText;
}

MneAjaxWeblet.prototype.delbuttons = function(ids)
{
  var i,j;
  var b = this.obj.mkbuttons;
  var id;
  
  if ( typeof ids == 'string') ids = ids.split(',');

  for ( j = 0; j<ids.length; j++)
  {
    id = ids[j];
    for ( i=0; i<b.length; i++)
    {
      if ( b[i].id == id )
      {
        b.splice(i,1);
        break;
      }
    }
  }
}

MneAjaxWeblet.prototype.setbuttonpar = function(id, par, value)
{
  var i;
  var b = this.obj.mkbuttons;
  for ( i =0; i<b.length; i++)
    if ( b[i].id == id ) b[i][par] = value;
}

MneAjaxWeblet.prototype.loadbuttons = function()
{
  var i;
  var b = this.obj.mkbuttons;
  var eb = [];
  var bsize = 0;
  var classname = 'weblet' + this.objectid + 'buttonsize';
  
  if ( typeof this.initpar.report == 'undefined' || this.initpar.report == null )
    this.delbuttons('print');
  
  if ( typeof this.initpar.delbutton != 'undefined' && this.initpar.delbutton != null )
    this.delbuttons(this.initpar.delbutton);

  for ( i=0; i<b.length; i++)
  {
    if ( b[i].show != false )
    {
      var id = b[i].id;
      var value = b[i].value;
      var ele;
      var behind = this.obj.buttonframe.querySelector('#' + b[i].behind + "Button");
      if ( behind != null ) behind = behind.nextSibling;
      else behind = this.obj.buttonframe.querySelector('#' + b[i].before + "Button");

      eb.push(id);

      if ( b[i].space == 'before' )
      {
        ele = this.doc.createElement('div');
        ele.className = 'webletbutton';
        this.obj.buttonframe.insertBefore(ele, behind);
        behind = ele.nextSibling;
      }

      ele = this.doc.createElement('input');
      ele.type = 'button';
      ele.className = 'webletbutton';
      if ( b[i].font ) ele.style.fontFamily = b[i].font;

      this.obj.buttons[id] = ele;
      ele.id = id + "Button";
      ele.weblet = this;
      ele.value = value;
      ele.clickid = id;
      ele.onclick = MneAjaxWeblet.prototype.btnclick;
      ele.disabled = b[i].disable;
      this.eleMkInputsSingle(ele);
      this.eleMkClass(ele.wrapper, id, true );
      if ( b[i].size != 'notset' ) this.eleMkClass(ele.wrapper, classname, true );
      if ( b[i].classname ) this.eleMkClass(ele.wrapper, b[i].classname, true );
      this.obj.buttonframe.insertBefore(ele, behind);
      behind = ele.nextSibling;
      if ( b[i].size != 'nosize'  && bsize < parseInt(ele.scrollWidth) ) bsize = parseInt(ele.scrollWidth);

      if ( b[i].space == 'behind' )
      {
        ele = this.doc.createElement('div');
        ele.className = 'webletbutton';
        this.obj.buttonframe.insertBefore(ele, behind);
      }
    }
  }
  this.addCss('.' + classname + ' { min-width: ' + (bsize + 4 ) + 'px; }' );
  
  if ( typeof this.obj.enablebuttons == 'undefined' ) this.obj.enablebuttons = eb;
}

MneAjaxWeblet.prototype.reloadit = function()
{
  this.reload = true;
  this.load();
}
MneAjaxWeblet.prototype.load = function(id)
{
  var i;
  var param = {};
  var aw;
  
  if ( typeof this.register == 'object' )
  {
    if ( this.act_register != null && typeof this.act_register.rhidden == 'function' )
      try { this.act_register.rhidden(); } catch(e) { this.exception("register hidden", e); }
    aw = this.act_register = this.register[id];
      
    if ( this.act_register != null && typeof this.act_register.rshow == 'function' )
      try { this.act_register.rshow(); } catch(e) { this.exception("register show", e); }
      
    this.eleMkClass(this.register[id].menubutton, this.menu.classname + "active", true);
  }
  else
  {
    param.ignore_notdefined = true;
    aw = this;
  }

  if ( this.reload == true || aw.reload_always == true || typeof aw.content == 'undefined' )
  {
    this.reload = false;
    aw.reset();

    this.win.mneDocevents.addInterest("keydown", aw);

    if ( aw.initpar.innerframe != 'undefined' &&  aw.initpar.innerframe != null )
      aw.origframe.innerHTML = MneAjax.prototype.load.call(aw, aw.path + '/' + aw.initpar.innerframe );
    else
      aw.origframe.innerHTML = MneAjaxWeblet.html.content;

    aw.obj.titlecontainer  = this.eleGetById(aw.origframe, "weblettitle");
    aw.obj.titleleft       = this.eleGetById(aw.origframe, "weblettitleleft");
    aw.obj.title           = this.eleGetById(aw.origframe, "weblettitlemiddle");
    aw.obj.titleright      = this.eleGetById(aw.origframe, "weblettitleright");

    aw.obj.buttonframe     = this.eleGetById(aw.origframe, "webletbutton");
    aw.obj.contentframe    = this.eleGetById(aw.origframe, "webletcontent");
    
    aw.frame = this.eleGetById(aw.origframe, "webletmain");
    aw.frame.weblet = aw;
    aw.scrollframe = aw.frame;

    aw.obj.title.innerHTML = aw.label;
    
    aw.frame.id = aw.id;
    if ( typeof aw.initpar.debug             != 'undefined' ) aw.pdebug = 1;
    if ( typeof aw.initpar.pdebug            != 'undefined' ) aw.pdebug = 1;

    if ( aw.path.substring(0,1) != '#' )
    {
      MneAjax.prototype.load.call(this, aw.path + "/object.js");
      if ( this.req.getResponseHeader('Content-Type').indexOf("javascript") < 0 )
      {
        aw.frame.appendChild( this.doc.createTextNode(this.req.responseText));
        return;
      }
    }

    if ( aw.path.substring(0,1) != '#' )
    {
      try
      {
        var i;
        var func = {};
        for ( i in aw )
          if ( typeof aw[i] == 'function' ) func[i] = aw[i];

        if ( aw.obj.contentframe )
        {
          aw.obj.observer = new MutationObserver(function(mutations, server)
          {
            // mutations.forEach(function(mutation) {
            //console.log(mutation);
            //});    

            var i,j,w;
            var width = 0;
            var num = 0;

            server.weblet.eleMkClass(server.weblet.obj.titlecontainer, 'scroll', ( server.weblet.frame.scrollHeight > server.weblet.frame.offsetHeight));
           
            var areas = server.weblet.obj.contentframe.querySelectorAll('.inputarea');
            for ( i = 0; i<areas.length; i++)
              width = ( width < areas[i].scrollWidth ) ? areas[i].scrollWidth : width;
            
            if ( num > 1 ) areas = server.weblet.obj.contentframe.querySelectorAll('.inputarea');
            for ( i = 0; i<areas.length; i++)
            {
              var count = areas[i].querySelectorAll('.inputgroup').length;
              var w = parseFloat(width) / parseFloat(count);
              if ( server.weblet.win.getComputedStyle(areas[i]).getPropertyValue('display') != 'none' )
              {
                var cols = areas[i].querySelectorAll('.inputgroup');
                cols.forEach ( function(col) {
                  if ( w > col.scrollWidth )
                  col.style.width = w + "px";
                });
              }
            }
          });
          aw.obj.observer.weblet = aw;
          if ( this.navigator.mobile != true ) aw.obj.observer.observe(aw.obj.contentframe, { attributes: false, childList: true, characterData: true, subtree : true });
        }

        aw.notloaded = false;
        eval("aw.init_" + aw.oid + " = function(weblet) " + this.req.responseText);
        aw["init_" + aw.oid](aw);

        aw.content = new Array();
        for ( i =0; i<aw.origframe.childNodes.length; i++ )
          aw.content[aw.content.length] = aw.origframe.childNodes[i];

        aw.loadbuttons();
        if ( aw.obj.titlecontainer ) aw.eleMkClass(aw.obj.titlecontainer, "notitle", ( aw.initpar.showtitle != true ) && this.navigator.mobile != true );


        for ( i in aw )
          if ( typeof aw[i] == 'function' && func[i] != aw[i] )
            aw.functions[i] = aw[i];
        
        if ( typeof aw.initpar.framepos != 'undefined' )
        {
          var ele = this.eleGetById(aw.origframe, "webletmain_container2");
          if ( ele != null )
            this.eleMkClass(ele, aw.initpar.framepos, true);
        }
      }
      catch (e)
      {
        this.exception("MneAjaxWeblet::load: " + aw.path + ":", e);
      }
    }
    else
    {
      aw.frame.innerHTML = aw.path.substring(1);
    }

    if ( typeof aw.initpar.showdynpar        == 'string' ) eval("aw.showdynpar = {" + aw.initpar.showdynpar + "}");
    if ( typeof aw.initpar.showdynpar        == 'object' ) aw.showdynpar = aw.initpar.showdynpar; 
    if ( typeof aw.initpar.showdynparweblet  == 'string' ) aw.obj.showdynparweblet = this.parent.subweblets[aw.initpar.showdynparweblet];
    if ( typeof aw.initpar.showdynparweblet  == 'object' ) aw.obj.showdynparweblet = aw.initpar.showdynparweblet;

    if ( typeof aw.initpar.stylePath         == 'undefined' ) aw.initpar.stylePath = aw.path;
    if ( typeof aw.initpar.styleName         != 'undefined' ) MneAjax.prototype.loadCss.call(this, aw.initpar.styleName, aw.initpar.stylePath );


    if ( typeof aw.initpar.addtitle != 'undefined'   && typeof aw.initpar.addtitle[window.mne_config.language]   != 'undefined' ) aw.titleString.add = aw.initpar.addtitle[window.mne_config.language];
    if ( typeof aw.initpar.modtitle != 'undefined'   && typeof aw.initpar.modtitle[window.mne_config.language]   != 'undefined')  aw.titleString.mod = aw.initpar.modtitle[window.mne_config.language];
    if ( typeof aw.initpar.deltitle != 'undefined'   && typeof aw.initpar.deltitle[window.mne_config.language]   != 'undefined')  aw.titleString.del = aw.initpar.deltitle[window.mne_config.language];
    if ( typeof aw.initpar.addedtitle != 'undefined' && typeof aw.initpar.addedtitle[window.mne_config.language] != 'undefined')  aw.titleString.added = aw.initpar.addedtitle[window.mne_config.language];

    if ( typeof aw.initpar.defvalues != 'undefined' )
      for ( i in aw.initpar.defvalues )
        this.defvalues[i] = aw.initpar.defvalues[i];
      
    try
    { 
      if ( aw.loaddirect == true )
      {
        aw.showValue(null);
        aw.loaddirect = false;
      }
      else if ( aw.initpar.noshowatload != true )
      {
        var i,r;
        var w = aw;
        var s = {};
        i = null;
        
        for ( i in w.receives )
        {
          if ( typeof w.parent.weblets[w.receives[i]] != 'undefined')
            r = w.parent.weblets[w.receives[i]];
          else
            r = w.parent.subweblets[w.receives[i]];
          
          if ( typeof s[r.id] == 'undefined' && r.notloaded == false )
          {
            s[r.id] = r.id;
            w.showValue(r);
          }
        }
        if ( this.eleIsEmpty(w.receives) ) w.showValue(null);
        else w.activated();
      }
      aw.activated();
    } 
    catch(e) 
    { 
      this.exception("MneAjaxWeblet::showValue:" + aw.id + ": "+ aw.path + ":", e); 
    }
    aw.oldvalue = {};
    
    if ( typeof aw.initpar.setslider != 'undefined' && typeof aw.parent.slider[aw.initpar.setslider] != 'undefined' )
    {
      var s = aw.parent.slider[aw.initpar.setslider];
      var w = aw;
      window.setTimeout(function() {
        var pos;
        if (  s.typ == 'V' ) pos = w.frame.scrollWidth + 36; else pos = w.frame.scrollHeight;
        if ( w.initpar.showtitle == true ) pos = pos + w.origframe.firstChild.offsetHeight; 
        s.setPosition(pos);
      }, 100);
    }
  }
  else if ( typeof this.register != 'object' )
  {
    var w = aw;
    var i = 0;
    try
    { 
      var r;
      var s = {};
      if ( w.initpar.noshowatload != true )
      {
        try
        {
          for ( i in w.receives )
          {
            if ( typeof w.parent.weblets[w.receives[i]] != 'undefined')
              r = w.parent.weblets[w.receives[i]];
            else
              r = w.parent.subweblets[w.receives[i]];

            if ( typeof s[r.id] == 'undefined' && r.notloaded == false )
            {
              s[r.id] = r.id;
              w.showValue(r);
            }
          }
        }
        catch(e) 
        { 
          this.exception("MneAjaxWeblet::showValue:" +aw.id + ": "+ aw.path + ' ' + w.receives[i] + ":", e); 
          throw e;
        }
      }
      w.activated();
    } 
    catch(e) 
    { 
      this.exception("MneAjaxWeblet::showValue:" +aw.id + ": "+ aw.path + ":", e); 
    }
    aw.oldvalue = {};
  }
  else
  {
    var i;
    while (this.origframe.firstChild != null)
      this.origframe.removeChild(this.origframe.firstChild);

    for ( i=0; i<aw.content.length; i++)
      this.origframe.appendChild(aw.content[i]);

    if ( ! this.eleIsEmpty(aw.oldvalue) || aw.initpar.reshowvalue == true )
    {
      try
      { 
        var i,r;
        var w = aw;
        var receives;
        var s = {};
        
        i = null;
        if ( this.eleIsEmpty(aw.oldvalue) )
          receives = w.receives;
        else
          receives = aw.oldvalue;
            
        for ( i in receives )
        {
          if ( typeof w.parent.weblets[receives[i]] != 'undefined')
            r = w.parent.weblets[receives[i]];
          else
            r = w.parent.subweblets[receives[i]];

          if ( typeof s[r.id] == 'undefined' && r.notloaded == false )
          {
            s[r.id] = r.id;
            w.showValue(r);
          }
        }
        w.activated();
      } 
      catch(e) 
      { 
        this.exception("MneAjaxWeblet::showValue:" + aw.id + ": "+ aw.path + ":", e); 
      }
      aw.oldvalue = {};
    }
    aw.activated();
  }
};

MneAjaxWeblet.prototype.show = function( webletname )
{

  this.obj.webletname = webletname;
  this.htmlcomposeid = '';
  try
  {
    this.frame = this.origframe;
    this.getTemplate();
    this.mkTemplate();  
    this.getRootweblets();
    this.mkRootweblets();
    this.mkMenus();
    this.getWeblets();
    this.mkWeblets();    
    var e;
    while ( ( e = this.doc.getElementById("webletfullscreen")) != null )
      e.parentNode.removeChild(e)
  }
  catch(e)
  {
    this.exception("MneAjaxWeblet::show: ", e);
  }
};

MneAjaxWeblet.prototype.getSettings = function( schema, query)
{
  this.win.mne_config = {
      countrycarcode : 'CH',
      currency : 'CHF',
      fullname : 'Benutzer',
      group : [],
      language : 'de',
      locale : { decimal : '.', thousands : "'" },
      personid : '0000000000000000',
      region : 'CH',
      startweblet : '',
      stylename : 'default',
      uowncity : 'Stadt',
      uowncompany : 'Eigene Firma',
      uownemail : 'email konfigurieren',
      updatehost : '',
      username : 'user',
      version : ''
  };
};

MneAjaxWeblet.prototype.initmain = function(name, tmpl, menu, startweblet, uschema, uquery )
{
	var weblet;
	window.mne_appname = name;
	
	window.history.replaceState(null, null, window.location.href ) 
	this.getSettings(uschema, uquery);
  this.loadCss("allg.css");
  this.loadCss("weblet.css");
  
  this.loadClass("MneAjaxPopup", "geometrie/mne_apopup.js");

  MneAjaxWeblet.html = {};
  MneAjaxWeblet.html.content = MneAjax.prototype.load.call(this, 'allg/main/weblet/content.html');

  MneAjaxWeblet.html.waitframe = window.document.createElement('div');
  MneAjaxWeblet.html.waitframe.className = 'waitframe';
  MneAjaxWeblet.html.waitframe.innerHTML = MneAjax.prototype.load.call(this, 'allg/main/weblet/waitframe.html');

  this.doc.body.appendChild(MneAjaxWeblet.html.waitframe);

  this.getMenuparam = function() { return { classname : menu}; };

	this.show(tmpl);
	this.weblets[name]["settitle"] = true;
	window.main_weblet = this.weblets[name];
  window.root_weblet = this;
  
	window.resize_timeout = null;
	window.onresize = function()
	{
		if ( window.resize_timeout != null ) window.clearTimeout(window.resize_timeout);

		window.resize_timeout = window.setTimeout( function() { window.resize_timeout = null; window.root_weblet.root.fix1.updatePosition(); }, 500);
	}

	if ( startweblet == true  && typeof window.mne_config.startweblet != 'undefined' && window.mne_config.startweblet != '' )
	{
	  var self = this.weblets[name];
	  var startweblet = window.mne_config.startweblet;
	  var timeout = function() { try { self.show.call(self,startweblet) } catch(e) {}; };
	  window.setTimeout(timeout, 200);
	}

}

//================================================================================
//MneAjaxWeblet.prototype  Show Hilfsunktionen        
//================================================================================
MneAjaxWeblet.prototype.create_checkpopup = function(ele, newtyp, alltime )
{
  if ( typeof ele.checktype == 'undefined' )
    ele.checktype = { reg : '' };

  if ( typeof ele.helpframe == 'undefined' ) ele.helpframe = null;
  
  if ( ele.checktype.reg == newtyp.reg && ele.helpframe != null )
    return;

  if ( ele.checktypefix == true && ele.helpframe != null )
    return;

  if ( ele.checktype.reg == '' || ele.checktype.reg != newtyp.reg )
  {
    if ( ele.helpframe != null )
    {
      if ( ele.helpframe.parentNode != null ) ele.helpframe.parentNode.removeChild(ele.helpframe);
      ele.onmouseover = null;
      ele.onmousout = null;
      ele.helpframe = null;
    }
  }

  ele.checktype = newtyp;
  if ( ele.checktype.reg != '' )
  {
    ele.weblet = this;
    ele.helpframe = this.doc.createElement('div');
    ele.helpframe.innerHTML =  '<div class="hint" >' + ele.checktype.help + '</div>';
    ele.helpframe.style.position  = "absolute";
    ele.helpframe.style.visibility = "visible";
    ele.helpframe.style.zIndex = 100;
    ele.helpframe.frame = this.doc.body;
    ele.helpframe.alltime = alltime 
    ele.onmouseover = function()
    {
      if ( this.helpframe.alltime || this.wrapper.className.indexOf('modifywrong') >= 0 )
      {
        this.helpframe.frame.appendChild(this.helpframe);
        this.helpframe.style.zIndex = 100000000;
        this.helpframe.style.top  = this.weblet.posGetTop (this, this.helpframe.frame) + 15 + "px";
        this.helpframe.style.left = this.weblet.posGetLeft(this, this.helpframe.frame) + 15 + "px";
      }
    };
    ele.onmouseout = function()
    {
      if ( typeof this.helpframe != 'undefined' && this.helpframe != null && typeof this.helpframe.parentNode != 'undefined' && this.helpframe.parentNode != null )
        this.helpframe.parentNode.removeChild(this.helpframe);
    };
  }
};


MneAjaxWeblet.prototype.selectlists = {};
MneAjaxWeblet.prototype.create_selectlist = function(ele)
{
  var i;
  var vals = ele.selectlist.split(',');
  var values;
  
  while(ele.firstChild != null ) ele.removeChild(ele.firstChild);
  for ( i = 0; i<vals.length; i++ )
  {
    p.wval = vals[i];
    values = this.win.MneAjaxWeblet.prototype.selectlists[vals[i]];
    if ( typeof values != 'undefined' ) break;
  }

  for ( i = 0; i<values.length; i++ )
  {
    ele.appendChild(this.doc.createElement('option'));
    ele.lastChild.appendChild(this.doc.createTextNode(values[i][0]));
    ele.lastChild.value = values[i][1];
  }
  
  if ( i > 0 )
    ele.value = ele.firstChild.value;
  
};

MneAjaxWeblet.prototype.create_inputlist = function(id) {};

MneAjaxWeblet.prototype.show_inputlist = function(p, inputlistele)
{
  var weblet;
  var carray;
  var cols;
  var icols;
  var selval;
  var selcol;
  var selop;
  var i;

  if ( this.inputlist != null )
  {
    this.inputlist.popup.hidden();
  }
  
  if ( p.webletid != '' )
  {
    weblet = this.parent.subweblets[p.webletid];
    this.inputlist = { obj : p.obj.split(','), id: p.showcols.split(','), element : p.id, popup : weblet.popup, inputlistele : inputlistele };
    weblet.onbtnobj = this;
    weblet.popup.show(); 
    try { weblet.showValue(this); } catch(e) { weblet.popup.hidden(); throw e;}
    {
      var popup = weblet.popup;
      var timeout = function() { popup.resize.call(popup, true, false); };
      window.setTimeout(timeout, 10);
    }
    return false;
  }

  if ( p.weblet == null )
  {
    this.parent.root.popups[this.oid + 'inputlist' + p.id] = p.frame = window.document.createElement("div");
    p.weblet = new MneAjaxWeblet(this.win, p.frame);
    p.weblet.path = '/weblet/allg/table/select';
    p.weblet.parent = this.parent;
    p.weblet.notloaded = true;
    p.weblet.sends = '';
    p.weblet.receives = {};
    p.weblet.label = this.txtGetText('#mne_lang#suchen');
    p.weblet.id = p.weblet.oid = this.oid + 'inputlist' + p.id;
    if ( typeof p.showdynparweblet == 'string') p.showdynparweblet = this.parent.weblets[p.showdynparweblet];
    this.parent.popups[this.oid + 'inputlist' + p.id] = p.popup = new MneAjaxPopup(window, this.txtGetText('#mne_lang#suchen'), p.frame);
    this.parent.weblets[this.oid + 'inputlist' + p.id] = p.popup.weblet = p.weblet;
    p.weblet.popup = p.popup;
  }

  weblet = p.weblet;
  if ( this.initpar.pseldebug ) weblet.pdebug = 1;

  carray = p.showcols.split(',');
  for ( i = 0; i<carray.length; i++)
  {
    if ( carray[i].substr(0,1) == '#')
    {  
      carray.splice(i,1);
      i--;
    }
  }
  cols = p.cols.split(',').concat(carray);
  icols = new Array();

  carray = p.selval.split(':');
  selcol = ( carray.length > 0 ) ? cols[carray[0]] : '';
  selval = ( carray.length > 1 ) ? carray[1] : '';
  selop  = carray[2];
  
  if ( selval != '' )
  {
    if ( selval[0] == '#' ) selval = selval.substring(1);
    else if ( typeof this.act_values[selval] == 'undefined' ) this.error(this.txtSprintf(this.txtGetText('#mne_lang#MneAjaxWebet:readData:$1 weblet.act_values besitzt keine Daten für <$2>'), "showdynpar:" + this.id, selval));
    else selval = this.act_values[selval];
  }
  
  weblet.initpar = { showdynpar : p.showdynpar, showdynparweblet : p.showdynparweblet, scols : p.scols, selcol : selcol, selval : selval, selop : selop };

  for ( i = p.cols.split(',').length; i < cols.length; i++)
    icols[icols.length] = i;

  weblet.initpar.tablehidecols = icols.join(',');
  if ( typeof this.parent.subweblets[this.id + p.id + 'edit'] != 'undefined') weblet.initpar.popup = this.id + p.id + 'edit';
  else if ( typeof this.parent.subweblets[p.id + 'edit'] != 'undefined') weblet.initpar.popup = p.id + 'edit';
  
  weblet.initpar.schema = p.schema;
  if ( p.query != '' ) weblet.initpar.query  = p.query;
  weblet.initpar.distinct = 1;
  weblet.initpar.table  = p.table;
  weblet.initpar.wcol   = p.wcol;
  weblet.initpar.wop    = p.wop;
  ( typeof p.wval != 'undefined' && p.wval[0] == "$" ) ? eval("weblet.initpar.wval = " + p.wval.substring(1)) : weblet.initpar.wval = p.wval;
  weblet.initpar.cols   = cols.join(',');
  weblet.initpar.scols  = p.scols;

  this.inputlist = { obj : p.obj.split(','), id: p.showcols.split(','), element : p.id, popup : weblet.popup, inputlistele : inputlistele  };

  weblet.popup.show();
  weblet.obj.sendkeyele = inputlistele;
  try { weblet.showValue(this, { setselcol : true }); } catch(e) { weblet.popup.hidden(); throw e; }
  weblet.onbtnobj = this;
  {
    var popup = weblet.popup;
    var timeout = function() { popup.resize.call(popup, true, false); };
    window.setTimeout(timeout, 10);
  }
  return false;
};

MneAjaxWeblet.prototype.onbtnok = function(button)
{
  var i,j;
  var val;
  var value;
  var v = { act_values : {} };
  var act_values = {};
  var mustshow = false;
  
  if ( this.inputlist != null )
  {

    for ( i in button.weblet.act_values)
      act_values[i] = button.weblet.act_values[i];
    
    for ( i=0; i < this.inputlist.obj.length; i++ )
    {
      val = this.inputlist.id[i];
      j = val.indexOf("#mne_langid#");
      if ( j >= 0 ) val = val.substr(0,j) + this.txtGetText('#mne_lang#mne_langid#') + val.substr(j+12);

      value = ( typeof act_values[val] == 'undefined' ) ?  '' :  act_values[val];

      if ( typeof this.obj.inputs[this.inputlist.obj[i]] != 'undefined')
      {
       this.showInput(this.obj.inputs[this.inputlist.obj[i]], value, this.obj.inputs[this.inputlist.obj[i]].inputtyp, true);
       if ( i == 0 ) { var w = this.obj.inputs[this.inputlist.obj[i]] } window.setTimeout(function() { w.focus(); }, 0);
      }
      else if ( typeof this.obj.outputs[this.inputlist.obj[i]] != 'undefined' )
      {
        this.showOutput(this.obj.outputs[this.inputlist.obj[i]], value, this.typs[this.ids[this.inputlist.obj[i]]]);
        this.setModify(this.obj.outputs[this.inputlist.obj[i]]);
      }
      else if ( this.inputlist.obj[i].substr(0,1) == '#' )
      {
        this.act_values[this.inputlist.obj[i].substr(1)] = value;
      }
      else if ( this.inputlist.obj[i].substr(0,1) == '?' )
      {
        v.act_values[this.inputlist.obj[i].substr(1)] = value;
        mustshow = true;
      }
      else if ( i == 0 && typeof this.inputlist.inputlistele != 'undefined')
      {
        if ( this.inputlist.inputlistele.tagName == 'SPAN' )
        {
          this.inputlist.inputlistele.textContent = value;
          this.act_values[this.inputlist.obj[i]] = value;
          this.eleMkClass(this.inputlist.inputlistele.wrapper, "modifyok", true, "modify");
        }
        else
        {
          this.showInput(this.inputlist.inputlistele, value, null, true);
          { var w = this.inputlist.inputlistele;  window.setTimeout(function() { w.focus(); }, 0); }
        }
      }
      else if ( this.initpar.inputlist_ignore_notdefined == true )
      {
        this.act_values[this.inputlist.obj[i]] = value;
      }
      else
        this.error(this.txtSprintf(this.txtGetText('#mne_lang#Element <$1> ist unbekannt'),this.inputlist.obj[i]));
    }
    
    if ( mustshow )
    {
      this.showValue(v);
      this.setDepends('showValue');
    }
    
    if ( button.weblet.initpar.notclose != true && typeof button.weblet.popup != 'undefined') button.weblet.popup.hidden();
    if ( typeof this.popup != 'undefined')
    {
      var self = this;
      window.setTimeout(function() { self.popup.resize.call(self.popup, true, false);});
    }
  }
  
  try
  {
    if (typeof this.onbtnclick == 'function' )
      this.onbtnclick('ok', button);
  }
  catch(e)
  {
    this.exception("Weblet::onbtnok: ", e);
  }

  if ( typeof button.weblet != 'undefined' && button.weblet != null && button.weblet.initpar.notclose == true ) 
    return true;
  
  this.inputlist = null;
  return true;
};

MneAjaxWeblet.prototype.btnclick = function()
{
  this.weblet.showwait();
  {
    var b = this;
    this.weblet.win.setTimeout(function() { MneAjaxWeblet.prototype.btnclickreal.call(b)}, 0);
  }
}

MneAjaxWeblet.prototype.btnclickreal = function()
{ 
  this.weblet.errorfound = false;
  
  if ( typeof this.helpframe != 'undefined' && this.helpframe != null && typeof this.helpframe.parentNode != 'undefined' && this.helpframe.parentNode != null )
    this.helpframe.parentNode.removeChild(this.helpframe);

  try { 
    if ( this.weblet[this.clickid].call(this.weblet) != false ) 
    {
      if ( this.showmodify != false ) this.weblet.setModify(this,'modifyok'); 
    }
    else 
    {
      if ( this.showmodify != false ) this.weblet.setModify(this,'modifyno'); 
    }
  }
  catch(e)
  {
    this.weblet.errorfound = true;
    this.weblet.exception('Button - ' + this.clickid + ': ',e);
  }

  try
  {
    if ( this.weblet.errorfound == false && typeof this.weblet.onbtnobj == 'object' )
    {
      var clickid = this.clickid;
      if ( typeof this.weblet.onbtnobj["onbtn" + this.clickid] == 'function' ) 
        this.weblet.onbtnobj["onbtn" + clickid](this); 
      else if ( typeof this.weblet.onbtnobj.onbtnclick == 'function' )
        this.weblet.onbtnobj.onbtnclick(clickid,this); 
   }
  } 
  catch(e)
  { 
    this.weblet.exception(this.weblet.onbtnobj.id + '.onbtnclick: ',e);
  }
  
  try
  {
    if ( this.weblet.initpar.closepopup == true || ( this.weblet.initpar.closepopupok == true && this.clickid == 'ok'))
    {
      this.weblet.onbtnobj = {};
      if (typeof this.weblet.popup != 'undefined') this.weblet.popup.hidden();
    }
  }
  catch(e)
  { 
    this.weblet.exception(w.id + 'closepopup: ',e);
  }
  
  var i;
  for ( i in this.weblet.receives )
  {
    var w = this.weblet.parent.weblets[this.weblet.receives[i]];
    if ( typeof w == 'undefined' )
      w = this.weblet.parent.subweblets[this.weblet.receives[i]];

    if ( typeof w != 'undefined' && typeof w.onbtninterest == 'function' )
    {
      try
      {
        w.onbtninterest(this.clickid, this);
      }
      catch(e)
      { 
        this.weblet.exception(w.id + '.onbtninterest: ',e);
      }
    }
  }

  this.weblet.hidewait();
};

MneAjaxWeblet.prototype.findIO = function(p_attr, root, p_ele, mkinput)
{
  var i;
  var r = root;
  var attr = p_attr;
  var ele = p_ele;
  
  if ( typeof root == 'undefined' )
  {
    r = this.frame;
    ele = this.frame;

    this.eleMkElements(this.frame);
    
    this.obj.inputs  = {};
    this.obj.ninputs = {};
    this.obj.outputs = {};
    this.obj.labels  = {};
    this.obj.buttons = {};
    this.obj.sliders = {};
    this.obj.tables  = {};
    this.obj.frames  = {};
    this.obj.fields  = new Array();

    if ( typeof attr == 'undefined') attr = {};

    if ( this.initpar.attr != 'undefined' )
      for ( i in this.initpar.attr )
        attr[i] = this.initpar.attr[i];
    
    if ( this.obj.titlecontainer != null )
      this.findIO(attr, this.obj.titlecontainer)
  }
  
  if ( typeof ele == 'undefined' )
    ele = r;
  
  
  if ( typeof ele.id == 'string'  && ele.id != '' )
  {
    this.eleSetAttributes(r, ele, attr, true );
    if ( typeof ele.wrapper == 'undefined' ) ele.wrapper = ele;

    if ( ele.id == "Title" )
    {
      this.obj.title = ele;
      this.obj.title.innerHTML = this.label;
    }

    i = ele.id.indexOf("Input");
    if ( i != -1 && i+5 == ele.id.length )
    {
      if ( ele.nodatabase == true )
        this.obj.ninputs[ele.id.substr(0,i)] = ele;
      else
        this.obj.inputs[ele.id.substr(0,i)] = ele;
      ele.helpframe = null;
      ele.wrapper.weblet = ele.weblet = this;
      if ( typeof ele.onmodify != 'function')
        ele.onmodify = function(modify) { this.weblet.setModify(null, modify); };
        switch(ele.tagName)
        {
          case 'INPUT' :
            if ( ( attr.hinput == true || this.initpar.hinput == true ) && ele.type == 'hidden') { ele.type = "text";}
            if ( ele.type == 'text' || ele.type == 'password')
            {
              if ( ele.type == 'text' ) ele.type = "text";
              ele.mne_fieldnum = this.obj.fields.length;
              this.obj.fields[this.obj.fields.length] = ele;
            }
            if ( ele.type == 'checkbox')
            {
              var d = this.doc.createElement("div");
              d.className = 'checkbox';
              this.eleInsertAfter(d, ele);
              d.appendChild(ele);
              d.appendChild(this.doc.createElement("label"));
              d.lastChild["for"] = ele.id;
              d.lastChild["checkbox"] = ele;
              d.lastChild["inputcheckobject"] = d;
              d.lastChild.onclick = function() {
                this.checkbox.checked = !this.checkbox.checked;
              };
            }
            ( typeof ele.checktype == 'undefined' ) ? ele.checktype = { reg: '' } : ele.checktypefix = true;
            if ( typeof ele.checktype == 'string' ) ele.checktype = this.inChecktype[ele.checktype];
            this.create_checkpopup(ele, ele.checktype);
            break;
          case 'SELECT' :
            if ( ele.childNodes.length == 0 )
            {
              if ( typeof ele.selectlist == 'undefined')
                ele.selectlist = this.path + "/" + ele.id.substr(0,i) + ',' + ele.id.substr(0,i);
            }
            ( typeof ele.checktype == 'undefined' ) ? ele.checktype = { reg: '' } : ele.checktypefix = true;
            if ( typeof ele.checktype == 'string' ) ele.checktype = this.inChecktype[ele.checktype];
            this.create_checkpopup(ele, ele.checktype);

            break;
        }
        if ( ele.inputtyp == 'datetime' || ele.inputtyp == 'date' || ele.inputtyp == 'time' || ele.inputtyp == 'clocktime' || ele.inputtyp == 'interval' ) ele.mne_timevalue = "";
    }
    else 
    {
      i = ele.id.indexOf("Output");
      if ( i != -1 && i+6 == ele.id.length )
      {
        this.obj.outputs[ele.id.substr(0,i)] = ele;
        ele.wrapper.weblet = ele.weblet = this;
        this.eleMkClass(ele, "output", true);
      }
      else 
      {
        i = ele.id.indexOf("Label");
        if ( i != -1 && i+5 == ele.id.length )
        {
          this.obj.labels[ele.id.substr(0,i)] = ele;
          this.eleMkClass(ele, "label", true);
        }          
        else 
        {
          i = ele.id.indexOf("Button");
          if ( i != -1 && i+6 == ele.id.length )
          {
            var id = ele.id.substr(0,i);
            var txt = this.eleGetRawTextContent(ele);

            this.obj.buttons[id] = ele;
            ele.wrapper.weblet = ele.weblet = this;
            ele.clickid = id;
            ele.onclick = MneAjaxWeblet.prototype.btnclick;
            if ( ele.type != 'checkbox' ) 
              if ( typeof txt != 'undefined' && txt != '' ) ele.value = txt;
            ( typeof ele.checktype == 'undefined' ) ? ele.checktype = { reg: '' } : ele.checktypefix = true;
            this.create_checkpopup(ele, ele.checktype, true);

          }
          else
          {
            i = ele.id.indexOf("Table");
            if ( i != -1 && i+5 == ele.id.length )
            {
              this.obj.tables[ele.id.substr(0,i)] = new MneAjaxTable(window, ele, "", this.selectrows != false, this.plain != false);
              this.obj.tables[ele.id.substr(0,i)].weblet = this;
              this.obj.tables[ele.id.substr(0,i)].modify_function = function(modify) { this.table.weblet.setModify(null,modify); };
              if ( typeof this.showValue != 'function' || this.showValue == MneAjaxWeblet.prototype.showValue ) this.showValue = this.showTable;
              if ( typeof this.getParam != 'function'  || this.getParam == MneAjaxWeblet.prototype.getParam ) this.getParam = this.getTableparam;
            }
            else 
            {
              i = ele.id.indexOf("Link");
              if ( i != -1 && i+4 == ele.id.length )
              {
                var id = ele.id.substr(0,i);

                this.obj.buttons[id] = ele;
                ele.weblet = this;
                ele.clickid = id;
                this.eleMkClass(ele, "link", true );
                ele.onclick = MneAjaxWeblet.prototype.btnclickreal;
              }
              else
              {
                i = ele.id.indexOf("Slider");
                if ( i != -1 && i+6 == ele.id.length )
                {
                  this.eleMkClass(ele, "slidervalue", true);
                  var sele = this.obj.sliders[ele.id.substr(0,i)] = new MneAjaxSlider(window, ele, "red", 'V', '50%', "movevalue");             
                  sele.minval = 0;
                  sele.frame1.weblet =
                  {
                      sliderid : ele.id.substr(0,i),
                      slider : this.obj.sliders[ele.id.substr(0,i)],
                      weblet : this,
                      slidermove : function()
                    {
                      this.slider.frame1.innerHTML = this.slider.frame2.innerHTML = "";
                      this.slider[(this.slider.frame1.offsetWidth > this.slider.frame2.offsetWidth) ? 'frame1' : 'frame2'].innerHTML = '<div class="slidervaluevalue">' + this.slider.value + '<div';
                      this.weblet.slidermove(this.sliderid, this.slider.value);
                    },
                      wresize : function() {  this.weblet.slidervalue(this.sliderid, this.slider.value ); },
                      exception  : function(str, e) { this.weblet.exception(str,e); }
                  };
                }          
                else
                {
                  i = ele.id.indexOf("Frame");
                  if ( i != -1 && i+5 == ele.id.length )
                  {
                    this.obj.frames[ele.id.substr(0,i)] = ele
                    this.obj.frames[ele.id.substr(0,i)].weblet = this;
                  }
                }
              }
            }
          }
        } 
      }
    }
  }

  for ( i=0; i<ele.childNodes.length; i++ )
    MneAjaxWeblet.prototype.findIO.call (this, attr, r, ele.childNodes[i]);

  if ( typeof root == 'undefined' || mkinput == true )
  {
    var i,str;
    i = null;
    var inputs = {}
    
    for ( i in this.obj.inputs )
    {
      str = this.obj.inputs[i].inputcheckobject;
      if ( typeof str == 'string' )
      {
        if ( typeof this.obj.labels[str] != 'undefined' )
        {
          this.obj.inputs[i].inputcheckobject = this.obj.labels[str];
        }
        else
        {
          this.warning(this.oid + ": " + this.txtSprintf("#mne_lang#Labelobjekt <$1> ist nicht definiert", str ));
        }
      }

      this.obj.inputs[i].label = this.obj.labels[i];
      this.obj.inputs[i].getModify = function() 
      {
        var c = this.wrapper.className;
        var i = c.indexOf("modify");
        
        if ( i == -1 ) return "modifyno";
        c = c.substr(i);
        i = c.indexOf(" ");
        if ( i == -1 ) return c;
        return c.substr(0,i);
        
      };
      this.obj.inputs[i].setModify = function(modify) 
      {
        this.weblet.eleMkClass(this.wrapper, modify, true, 'modify');
        if ( typeof this.inputcheckobject != 'undefined' && this.inputcheckobject != null ) this.weblet.eleMkClass(this.inputcheckobject.wrapper, modify, true, 'modify');
      };
    }
    for ( i in this.obj.ninputs )
    {
      str = this.obj.ninputs[i].inputcheckobject;
      if ( typeof str == 'string' )
      {
        if ( typeof this.obj.labels[str] != 'undefined' )
        {
          this.obj.ninputs[i].inputcheckobject = this.obj.labels[str];
        }
        else
        {
          this.warning(this.oid + ": " + this.txtSprintf("#mne_lang#Labelobjekt <$1> ist nicht definiert", str ));
        }
      }

      this.obj.ninputs[i].label = this.obj.labels[i];
      this.obj.ninputs[i].getModify = function() 
      {
        var c = this.className;
        var i = c.indexOf("modify");
        
        if ( i == -1 ) return "modifyno";
        c = c.substr(i);
        i = c.indexOf(" ");
        if ( i == -1 ) return c;
        return c.substr(0,i);
        
      };
    }

    this.create_inputlist();
    if ( typeof this.origoid != 'undefined' && this.origoid != null && this.origoid != this.oid )
      this.create_inputlist(this.origoid);

  }
};

MneAjaxWeblet.prototype.wresize = function()
{
  var i;
  for ( i in this.menus )
    this.menus[i].check_width();
};

MneAjaxWeblet.prototype.fullscreen = function(button, frame, nosize )
{
  var f = ( typeof frame != 'undefined'  ) ? frame : this.origframe;
  var b = ( typeof button != 'undefined' ) ? button : this.obj.buttons.fullscreen;
  
  if ( nosize == true ) return;
  if ( typeof f.stylesave == 'undefined' || f.parentNode != f.stylesave.back )
  {
    f.stylesave = { parentNode : f.parentNode, node : f.nextSibling, position : f.style.postion, left : f.style.left, top : f.style.top, height : f.style.height, width : f.style.width, zIndex : f.style.zIndex };
    f.stylesave.back = this.win.document.createElement("div");
    f.stylesave.back.className = "webletfullscreen";
    f.stylesave.back.id = "webletfullscreen";
    f.style.positon = 'absolute';
    f.style.top  = "0px";
    f.style.left = "0px";
    f.style.width = "100%";
    f.style.height = "100%";
    
    this.win.document.body.appendChild(f.stylesave.back);
    f.stylesave.back.appendChild(f);
    
    this.wresize();
    this.eleMkClass(b, "fullscreen_active", true);
  }
  else
  {
    var save = f.stylesave;
    try{ this.win.document.body.removeChild(f.stylesave.back); } catch(e) {};
    
    if ( save.node == null )
      save.parentNode.appendChild(f);
    else
      save.parentNode.insertBefore(f, save.node);
    
    f.style.positon = save.position;
    f.style.top  = save.top;
    f.style.left = save.left;
    f.style.width = save.width;
    f.style.height = save.height;
    
    this.wresize();
    this.eleMkClass(b, "fullscreen_active", false);
  }
  
  return false;
};

MneAjaxWeblet.prototype.readDataParam = function(weblet, param)
{
  var i = null;
  var p = {sqlend : 1 };
  
  if ( typeof param == 'undefined' || param == null ) param = {};
  if ( typeof this.initpar.ignore_notdefined != 'undefined') param.ignore_notdefined = this.initpar.ignore_notdefined;

  if ( typeof param.query    == 'undefined' && typeof this.initpar.query    != 'undefined') p.query    = this.initpar.query;
  if ( typeof param.schema   == 'undefined' && typeof this.initpar.schema   != 'undefined') p.schema   = this.initpar.schema;
  if ( typeof param.table    == 'undefined' && typeof this.initpar.table    != 'undefined') p.table    = this.initpar.table;
  if ( typeof param.distinct == 'undefined' && typeof this.initpar.distinct != 'undefined') p.distinct = this.initpar.distinct;
  if ( typeof param.cols     == 'undefined' && typeof this.initpar.cols     != 'undefined') p.cols     = this.initpar.cols;
  if ( typeof param.scols    == 'undefined' && typeof this.initpar.scols    != 'undefined') p.scols    = this.initpar.scols;
  if ( typeof param.wcol     == 'undefined' && typeof this.initpar.wcol     != 'undefined') p.wcol     = this.initpar.wcol;
  if ( typeof param.wop      == 'undefined' && typeof this.initpar.wop      != 'undefined') p.wop      = this.initpar.wop;
  if ( typeof param.wval     == 'undefined' && typeof this.initpar.wval     != 'undefined') p.wval     = this.initpar.wval;
  if ( typeof param.dyndata  == 'undefined' && typeof this.initpar.dyndata  != 'undefined') p.dyndata  = this.initpar.dyndata;
  if ( typeof param.params   == 'undefined' && typeof this.initpar.params   != 'undefined') p.params   = this.initpar.params;

  for ( i in param )
    p[i] = param[i];

  if ( this.pdebug || this.lastquery || this.initpar.lastquery )
    p['lastquery'] = '1';
      
  if ( typeof this.initpar.squery    != 'undefined') p.query   = this.initpar.squery;
  if ( typeof this.initpar.sschema   != 'undefined') p.schema  = this.initpar.sschema;
  if ( typeof this.initpar.stable    != 'undefined') p.table   = this.initpar.stable;

  if ( this.pdebug )
    param.ignore_notdefined = false;

  if ( ( typeof weblet == 'undefined' || weblet == null ) && this.initpar.shownull != true )
  { p.no_vals = 1; }
  else
  {
    var showdynparweblet = weblet;
    if ( typeof this.obj.showdynparweblet != 'undefined' )
      showdynparweblet = this.obj.showdynparweblet;

    for ( i in this.showdynpar )
    {
      if ( this.showdynpar[i].substr(0,1) != '#' && this.showdynpar[i].substr(0,1) != '%' && this.showdynpar[i].substr(0,1) != '*' && ( typeof showdynparweblet == 'undefined' || typeof showdynparweblet.act_values[this.showdynpar[i]] == 'undefined') )
      {
        p.no_vals = 1;
        if ( param.ignore_notdefined != true  )
        {
          var j = null;
          for ( j in showdynparweblet.act_values ) this.error(j + ": " + showdynparweblet.act_values[j], true);
          this.error(this.txtGetText('#mne_lang#Mögliche Werte von: ' + showdynparweblet.id),true);
          throw { message : this.txtSprintf(this.txtGetText('#mne_lang#MneAjaxWebet:readData:$1 weblet.act_values besitzt keine Daten für <$2>'), "showdynpar:" + this.id, this.showdynpar[i])};
        }
      }
      else if ( this.showdynpar[i].substr(0,1) == '#' )
      {
        p[i] = this.showdynpar[i].substr(1);
      }
      else if ( this.showdynpar[i].substr(0,1) == '%' )
      {
        var n = this.showdynpar[i].substr(1);
        var emptyval = true;
        if ( n.substr(0,1) == '*')
        {
          n = n.substr(1);
          emptyval = false;
        }
        if ( typeof showdynparweblet.obj.inputs[n] != 'undefined' )
        {
          if ( emptyval || showdynparweblet.obj.inputs[n].value != '' )
            p[i] = this.getParamValue(showdynparweblet.obj.inputs[n]);
        }
        else
        {
          throw { message : this.txtSprintf(this.txtGetText('#mne_lang#Keine Eingabefeld für <$1> definiert'), n)};
        }
      }
      else
      {
        var n = this.showdynpar[i];
        var emptyval = true;
        if ( n.substr(0,1) == '*')
        {
          n = n.substr(1);
          emptyval = false;
        }
        if ( emptyval || showdynparweblet.act_values[n] != '' )
          p[i] = showdynparweblet.act_values[n];
      }
    }
    for ( i=0; i<this.showids.length; i++ )
    {
      if ( typeof showdynparweblet.act_values[this.showids[i]] == 'undefined' )
      {
        p.no_vals = 1;
        if ( param.ignore_notdefined != true )
        {
          var j = null;
          for ( j in showdynparweblet.act_values ) this.error(j + ": " + showdynparweblet.act_values[j], true);
          this.error(this.txtGetText('#mne_lang#Mögliche Werte von: ' + showdynparweblet.id), true);
          throw { message : this.txtSprintf(this.txtGetText('#mne_lang#MneAjaxWebet:readData:$1 weblet.act_values besitzt keine Daten für <$2>'), "showid:" + this.id, this.showids[i]) };
        }
      }
      else
      {
        this.act_values[this.showids[i]] = p[this.showids[i] + "Input.old"] = showdynparweblet.act_values[this.showids[i]];
      }
    }
  }

  if (   ( typeof p.schema == 'undefined' || typeof p.table == 'undefined' && typeof p.query == 'undefined' ) && typeof this.initpar.action == 'undefined')
  {
    if (!p.no_perror)
      this.error("#mne_lang#keine Abfrage und keine Table für <" + this.id + ":" + this.path + "> definiert");
  }

  return p;
};

MneAjaxWeblet.prototype.readData = function(weblet, param)
{
  var i;
  var p = this.readDataParam.call(this, weblet, param);
  
  if ( typeof this.initpar.action != 'undefined' )
    MneAjaxData.prototype.read.call(this, this.initpar.action,  p, false );
  else
    this.error (this.oid + ": " + "#mne_lang#Keine Aktion zum Lesen definiert");
  
  if ( this.values.length == 1 && p["no_setvalues"] != true )
    for ( i in this.ids )
      this.act_values[i] = this.values[0][this.ids[i]];

  return true;
};

MneAjaxWeblet.prototype.write = function(action, parameter)
{
  var result = '';
  try { result = MneAjaxData.prototype.write.call(this, action, parameter); } catch(e) { throw e };
  
  return result;
  
}
//================================================================================
//MneAjaxWeblet.prototype  Show Funktionen        
//================================================================================
MneAjaxWeblet.prototype.setModify = function(obj, p_modify)
{
  var modify = p_modify;
  if ( typeof modify == 'undefined' || modify == null )
  {
    if ( typeof obj != 'undefined' && obj != null && this.inCheck(obj) == false )
      modify = 'modifywrong';
    else
      modify = 'modifyok';
  }

  if ( typeof obj != 'undefined' && obj != null )
  {
    this.eleMkClass((typeof obj.wrapper != 'undefined' ) ? obj.wrapper : obj, modify, true, 'modify');
    if ( typeof obj.inputcheckobject != 'undefined' )
      this.eleMkClass((typeof obj.inputcheckobject.wrapper != 'undefined' ) ? obj.inputcheckobject.wrapper : obj.inputcheckobject, modify, true, 'modify');
  }

  if ( this.menubutton != null )
    this.eleMkClass(this.menubutton, modify, true, 'modify');
};

MneAjaxWeblet.prototype.clearModify = function(noinputcheck)
{
  var i;
  for ( i in this.obj.outputs )
    this.eleMkClass(this.obj.outputs[i], "modifyno", true, 'modify');

  if ( noinputcheck != true )
  {
    for ( i in this.obj.inputs )
      MneMisc.prototype.inClear(this.obj.inputs[i]);
    for ( i in this.obj.ninputs )
      MneMisc.prototype.inClear(this.obj.ninputs[i]);
  }
  else
  {
    for ( i in this.obj.inputs )
    {
      this.eleMkClass(this.obj.inputs[i].wrapper, "modifyno", true, 'modify');
      if ( typeof this.obj.inputs[i].inputcheckobject != 'undefined')
        this.eleMkClass(this.obj.inputs[i].inputcheckobject.wrapper, "modifyno", true, 'modify');
    }
    for ( i in this.obj.ninputs )
    {
      this.eleMkClass(this.obj.ninputs[i].wrapper, "modifyno", true, 'modify');
      if ( typeof this.obj.ninputs[i].inputcheckobject != 'undefined')
        this.eleMkClass(this.obj.ninputs[i].inputcheckobject.wrapper, "modifyno", true, 'modify');
    }
  }

  for ( i in this.obj.buttons )
    this.eleMkClass(this.obj.buttons[i], "modify", false);
  
  if ( this.menubutton != null )
    this.eleMkClass(this.menubutton, "modifyno", false, 'modify');

};

MneAjaxWeblet.prototype.activated = function()
{
};

MneAjaxWeblet.prototype.disable = function(hide)
{
  MneAjaxWeblet.prototype.enable.call(this, false, hide );
};

MneAjaxWeblet.prototype.enable = function(enable, hide )
{
  var i;
  var b;

  for ( i =0; i< this.obj.enablebuttons.length; i++  )
  {
    b = this.obj.buttons[this.obj.enablebuttons[i]];
    try
    {
      if (b)
      {
        b.disabled = (enable == false);
        if (b.tagName == 'INPUT' && typeof this.obj.labels[i] != 'undefined') this.eleMkClass(this.obj.labels[i], 'disabled', (enable == false), 'disable');
      }
    }
    catch (e)
    {
      console.log(e.message);
    }
    if (hide == true)
    {
      try
      {
        this.eleMkClass(b, 'disablehide', (enable == false), 'disablehide');
        this.eleMkClass(this.obj.labels[i], 'disabled', (enable == false), 'disablehide');
      }
      catch (e)
      {
      }
    }
  }
};

MneAjaxWeblet.prototype.enablevalue = function(enable)
{
  var i;
  var bt = this.obj.enablebuttonsvalue;
  var b;
  
  if ( typeof bt == 'undefined' || bt == null || bt == false )
    return;
  

    for (i = 0; i < bt.length; i++)
    try
    {
      b = this.obj.buttons[bt[i]];
      if (b)
      {
        b.disabled = (enable == false);
        if (b.tagName == 'INPUT' && typeof this.obj.labels[i] != 'undefined') this.eleMkClass(this.obj.labels[i], 'disabled', (enable == false), 'disable');
      }
    }
    catch (e)
    {
      console.log(e.message);
    }
};

MneAjaxWeblet.prototype.setDepends = function(id, setdependweblet)
{
  var i;
  var sub = null;
  
  try
  {
    if ( typeof id != 'string' ) 
      this.warning("Keine Id bei setDepend angegeben: " + id );

    if ( this.obj.insetdepend == true || this.obj.ignore_setdepend == true ) return;
    this.obj.insetdepend = true;
    
    if ( typeof setdependweblet == 'undefined' ) setdependweblet = this;
    for ( i = 0; i < this.sends.length; i++ )
    {
      var s = this.sends[i].split(":");
      if ( typeof this.parent.subweblets[s[0]] != 'undefined' )
        sub = this.parent.subweblets[s[0]];
      else
        sub = this.parent.weblets[s[0]];

      if ( typeof sub != 'undefined' && sub != this )
      {
        sub.obj.ignore_setdepend = true;
        if ( sub.register_weblet == null )
        {
          sub.oldvalue = {};
          sub.showValue(( s.length > 1 ) ? this.parent.subweblets[s[1]] : this, { setdependid : id, setdependweblet : setdependweblet});
        }
        else if (  sub.notloaded == false && ( sub.initpar.showallways == true || sub.menubutton.className.indexOf('active') >= 0 ) )
        {
            sub.oldvalue = {};
            sub.showValue(( s.length > 1 ) ? this.parent.subweblets[s[1]] : this, { setdependid : id, setdependweblet : setdependweblet});
        }
        else
        {
          sub.oldvalue[this.id] = ( s.length > 1 ) ? s[1] : this.id;
          sub.invalidValue(( s.length > 1 ) ? this.parent.subweblets[s[1]] : this);

        }
        sub.obj.ignore_setdepend = false;
        sub.setDepends(id, setdependweblet);
      }
    }
  }
  catch(e)
  {
    this.obj.insetdepend = false;
    sub.obj.ignore_setdepend = false;
    throw(e);    
  }
  
  this.obj.insetdepend = false;
};

MneAjaxWeblet.prototype.closepopups = function(self)
{
  var i;
  for ( i in this.parent.popups )
    if ( this.parent.popups[i] != this.popup )
      this.parent.popups[i].hidden();
  if ( self == true && typeof this.popup != 'undefined' )
    this.popup.hidden();
}

MneAjaxWeblet.prototype.openpopup = function( name, posframe, p )
{
  var popup = this.parent.popups[name];
  var param = ( typeof p != 'undefined' ) ? p : {};
  var havepos = false;
  var undef;
  
  if ( typeof popup != 'undefined' )
  {
    popup.refreshobj = param.refreshobj;
    
    param.refreshobj = undef;
    param.popup = true;
    
    popup.hidden = function(e)
    {
      MneAjaxPopup.prototype.hidden.call(this);
      if ( typeof e != 'undefined' && typeof e.target != 'undefined' && e.target.id == 'closebutton' && typeof this.refreshobj != 'undefined' )
        this.refreshobj.refresh.call(this.refreshobj);
    };
    popup.show(false,false);
    if ( popup.weblet.showValue(this, param ) == false )
      popup.hidden();

    popup.weblet.onbtnobj = this;
    popup.weblet.setDepends('popup');
    if ( typeof posframe != 'undefined' && posframe != null )
    {
      popup.setPosition(this.posGetLeft(posframe) + 4, this.posGetTop(posframe));
      havepos = true;
    }

    {
      var timeout = function() { popup.resize.call(popup, true, !havepos); };
      window.setTimeout(timeout, 10);
    }
    
    return popup;
  }
  return null;
};

MneAjaxWeblet.prototype.setValue = function(parameter, setdepend )
{

  if ( typeof parameter == 'string' )
  {
    eval("this.act_values = { " + parameter + "}");
    if ( this.register_weblet != null )
      this.register_weblet.act_values = this.act_values;
  }
  else if ( typeof parameter == 'object' && parameter != null)
  {
    this.act_values = parameter;
    if ( this.register_weblet != null )
      this.register_weblet.act_values = this.act_values;
  }
  else
    throw { message : "MneAjaxWeblet::setValue::" + this.id + ": Parameter hat falschen Typ" };

    if ( setdepend != false )
      this.setDepends("setValue"); 
};

MneAjaxWeblet.prototype.showLabel = function() {}
MneAjaxWeblet.prototype.showSingleLabel = function(label, value, typ )
{
  label.innerHTML = value;
  label.value = value;
};

MneAjaxWeblet.prototype.getBinaryValue = function(value)
{
    return value[0] != 'f'; 
};


MneAjaxWeblet.prototype.invalidValue = function(weblet, param)
{
};

MneAjaxWeblet.prototype.showValue = function(weblet, p_param)
  {
  var str = "";
  var i;
  var ignore_notfound = this.initpar.ignore_notfound;
  var param = p_param;
  
  if ( this.notloaded != false ) return;

  if ( this.inputlist != null )
  {
    this.inputlist.popup.hidden();
    this.inputlist = null;
  }

  if ( typeof param == 'undefined' ) param = {};
  if ( typeof param.ignore_notfound != 'undefined' ) ignore_notfound = param.ignore_notfound;

  if ( weblet == null )
  {
    if ( ignore_notfound != true )
      this.add();
    return true;
  }

  for ( i=0; i<this.showids.length; i++ )
  {
    if ( weblet.act_values[this.showids[i]] == '################')
    {
      this.add();
      return true;
    }
  }

  if ( typeof this.initpar['valuepre'] != 'undefined' && this.initpar['valuepre'] != null )
  {
    var p = {}
    var i;
    if ( typeof weblet != 'undefined' && weblet != null )
      for ( i in weblet.act_values )
        p[i+"Input"] = weblet.act_values[i];

    for ( i in param )
      p[i] = param[i];

    if ( MneAjaxWeblet.prototype.write.call(this, this.initpar['valuepre'],  p ) != 'ok' )
    {
      this.error("Fehler in der Voraktion gefunden");
      if ( typeof this.initpar['valuepreerror'] != 'undefined' )
      {
        if ( MneAjaxWeblet.prototype.write.call(this, this.initpar['valuepreerror'],  this.initpar['valuepreerrorparam']) != 'ok' )
        {
          this.error("Fehler in der Voraktion gefunden");
        }
      }
    }
  }

  for ( i in this.obj.inputs )
    str += i + ",";
  for ( i in this.obj.outputs )
    str += i + ",";
  str = str.substring(0,str.length - 1);

  param.cols = str;
  if ( MneAjaxWeblet.prototype.readData.call(this, weblet, param) == false )
  {
    if ( ignore_notfound != true )
      this.add();
    return true;
  }

  this.okaction = 'mod';
  if ( this.obj.title != null ) this.obj.title.innerHTML = this.titleString.mod;

  if ( this.values.length == 0 )
  {
    if ( ignore_notfound != true )
      this.warning(this.txtSprintf(this.txtGetText("#mne_lang#Keine Werte für $1:$2 gefunden"), "MneAjaxWeblet:showValue", this.id));
    this.clearModify(param.noinputcheck == true);
    return  true;
  }

  if ( this.values.length > 1 )
    this.warning(this.txtSprintf(this.txtGetText("#mne_lang#Mehr als einen Wertesatz gefunden für $1:$2 gefunden"), "MneAjaxWeblet:showValue", this.id));

  this.old_values = {};
  
  for ( i in this.obj.inputs )
    this.showInput(this.obj.inputs[i],this.act_values[i],this.typs[this.ids[i]]);

  for ( i in this.obj.outputs )
  {
    while( this.obj.outputs[i].firstChild != null ) this.obj.outputs[i].removeChild(this.obj.outputs[i].firstChild);
    this.obj.outputs[i].appendChild(this.doc.createTextNode(this.txtFormat.call(this, this.values[0][this.ids[i]], (typeof this.obj.outputs[i].outputtyp == 'undefined') ? this.typs[this.ids[i]] : this.obj.outputs[i].outputtyp, (typeof this.obj.outputs[i].outputformat == 'undefined') ? this.formats[this.ids[i]] : this.obj.outputs[i].outputformat )));
  }

  this.clearModify(param.noinputcheck == true);
  return true;
};

MneAjaxWeblet.prototype.showTable = function(weblet, p_param)
{
  var str = "";
  var i,j,k,r,t,f,v;
  var first = null;
  var retval;
  var style;
  var pos;
  var rowstylecol = null;
  var rowstylename = null;
  var param = p_param;
  var tabhead = new Array();
  
  i = null;
  r = -1;
  this.clearModify();
  if ( typeof param == 'undefined' ) param = {};

  if ( typeof param.maintable != 'undefined' && param.maintable != null )
    first = this.obj.tables[param.maintable];
  else if ( typeof this.obj.maintable != 'undefined' && this.obj.maintable != null )
    first = this.obj.tables[this.obj.maintable];
  else
    for ( i in this.obj.tables ) { first = this.obj.tables[i];  break; }

  if ( first == null )
  {
    this.error("Keine Tabelle gefunden");
    return;
  }

  this.obj.old_rownum = -1;
  
  first.clear();
  if ( typeof this.initpar.tabmax_rownum != 'undefined' ) first.max_rownum = this.initpar.tabmax_rownum;
  if ( typeof this.initpar.tabmax_rownum_step != 'undefined' ) first.max_rownum_step = this.initpar.tabmax_rownum_step;
  first.scroll_form = this.origframe;

  if ( typeof this.initpar['valuepre'] != 'undefined' )
  {
    var p = {};
    if ( typeof weblet != 'undefined' && weblet != null )
      for ( i in weblet.act_values )
        p[i+"Input"] = weblet.act_values[i];

    for ( i in param )
      p[i] = param[i];

    if ( MneAjaxWeblet.prototype.write.call(this, this.initpar['valuepre'],  p ) != 'ok' )
    {
      this.error("Fehler in der Voraktion gefunden");
      if ( typeof this.initpar['valuepreerror'] != 'undefined' )
      {
        if ( MneAjaxWeblet.prototype.write.call(this, this.initpar['valuepreerror'],  this.initpar['valuepreerrorparam']) != 'ok' )
        {
          this.error("Fehler in der Voraktion gefunden");
        }
      }
    }
  }

  retval = MneAjaxWeblet.prototype.readData.call(this, weblet, param);

  str = "";
  first.ids = this.ids;
  first.weblet = this;
  this.obj.fields = new Array();
  
  if ( typeof this.initpar.tablecolstyle != 'undefined' )
    first.tdclass = this.initpar.tablecolstyle.split(',');

  if ( typeof this.initpar.tablecoltype != 'undefined' )
  {
    first.plain = false;
    first.input = this.initpar.tablecoltype.split(',');
    if ( this.initpar.dyndata == true )
      {
      var i;
      for ( i = first.input.length; i < this.names.length; i++)
        first.input.push(first.input[i-1]);
      }
    first.return_function = function() { { var w = this.table.weblet; w.showwait(); window.setTimeout(function () { try { w.ok(); w.hidewait(); } catch (e) { w.hidewait(); w.exception("MneAjaxTable::return_function - " + w.id, e); } }, 0 ) } };
  }

  if ( typeof this.initpar.tablehead != 'undefined' )
  {  
    tabhead = this.initpar.tablehead.split(',');
    for ( i=0; i<tabhead.length; i++)
      if ( tabhead[i] != '' ) this.names[i] = tabhead[i];
  }
  
  if ( typeof this.initpar.dyndata != 'undefined' && this.initpar.dyndata != '' )
  {

    for ( var i =0;  i< first.invisible.length; i++)
      first.setVisible(i);
    
    if ( typeof this.initpar.tablehidecols != 'undefined' )
    {
      var hcols = this.initpar.tablehidecols.split(',');     
      for ( var i = 0; i<hcols.length; i++ )
        first.setInvisible(parseInt(hcols[i]));
    }

    if ( typeof this.initpar.tablecolstyle != 'undefined' )
    {
      var vcols = this.initpar.tablecolstyle.split(',');
      first.tdclass = vcols;
    }
  }
  
  if ( this.initpar.tabnohead != true )
  {
     i = null;
     for ( i in this.ids )
      str = str + "'" + this.txtMascarade(this.names[this.ids[i]]) + "',";

    str = str.substring(0, str.length - 1);
    eval("first.addHead(" + str + ")");
  }



  if ( typeof this.initpar.tablerowstyle != 'undefined' )
  {
    rowstylecol  = this.initpar.tablerowstylecol.split(',');
    for ( i = 0; i<rowstylecol.length; i++) rowstylecol[i] = Number(rowstylecol[i]);
    rowstylename = this.initpar.tablerowstyle.split(',');
  }
  
  for ( i = 0; i<this.values.length; i++ )
  {
    str = "";
    style = new Array();
    for ( k=0; k<this.values[i].length; k++ )
    {
      t = this.typs[k];
      f = this.formats[k];
      v = this.values[i][k];
      
      if ( t == 1100 )
      {
        t = this.values[i][this.ids[f]];
        f = "";
      }
      if ( (pos = v.indexOf('||||')) >= 0 )
      {
          style[k] = v.substring(pos + 4, v.length);
          v = v.substring(0,pos);
      }
      else
        {
        style[k] = '';
        }
      str = str + "'" + this.txtMascarade(this.txtFormat.call(this, v, t, f)) + "',";
    }
    
    str = str.substring(0, str.length - 1);
    eval("r = first.add(" + str + ")");
    var rr = first.body.rows[r];
    for ( k = 0; typeof rr != 'undefined' && k < rr.cells.length; k++)
    {
      if ( typeof rr.cells[k].datafield != 'undefined' && rr.cells[k].datafield.type == 'text' )
      {
        var colnum = rr.cells[k].datafield.colnum;
        rr.cells[k].datafield.weblet = this;
        rr.cells[k].datafield.mne_fieldnum = this.obj.fields.length;
        this.obj.fields[this.obj.fields.length] = rr.cells[k].datafield;
        if ( rr.cells[k].datafield.vtype == 'time' || rr.cells[k].datafield.vtype == 'date' )
        {
          rr.cells[k].datafield.value = this.txtFormat.call(this, this.values[i][colnum], this.typs[colnum], this.formats[colnum]);
          rr.cells[k].datafield.mne_timevalue = this.values[i][rr.cells[k].datafield.colnum];
        }
      }
      if ( style[k] != '' )
        this.eleMkClass(rr.cells[k], style[k], true);
    }

    if ( rowstylecol != null && r < first.table.tBodies[0].rows.length )
    {
      try
      {
        
    	for ( j = 0; j<rowstylecol.length; j++)	
    		this.eleMkClass(first.table.tBodies[0].rows[r], rowstylename[j] + this.values[i][rowstylecol[j]], true);
      }
      catch(e)
      {
        this.exception("showTable - rowstyle", e);
      }
    }

    for ( k=0; k<this.values[i].length; k++ )
      first.body.origdata[r][k] = this.values[i][k];
  }

  window.mneDocevents.focus(first.table);
  this.act_values = {};
  return retval;
};

//================================================================================
//MneAjaxWeblet.prototype  Button Hilfsunktionen        
//================================================================================
MneAjaxWeblet.prototype.addParam  = function(p, p_name, p_obj)
{
  var obj = p_obj;
  var name = p_name;
  
  if ( typeof obj == 'undefined' )
  {
    obj = this.obj.inputs[name];
    name = name + "Input";
  }

  if ( typeof obj == 'undefined' )
    throw { message : this.txtSprintf(this.txtGetText("Objekt für name <$1> ist nicht definiert"), name ) };

    if ( typeof p[name] != 'undefined' )
      throw { message : this.txtSprintf(this.txtGetText("Parameter <$1> ist schon definiert"), name ) };

      p[name]= this.getParamValue(obj);

      return p;
};

MneAjaxWeblet.prototype.getParamValue  = function(obj, checkvalue )
{
  var i;
  var retval = '';
  
  if ( typeof obj != 'object' ) return obj;

  if ( checkvalue != false && ( obj.className.indexOf('modifywrong') >= 0 || ( typeof obj.inputcheckobject != 'undefined' && obj.inputcheckobject.wrapper.className.indexOf('modifywrong') >= 0 ) )) 
  {
    i = obj.id.indexOf("Input");
    
    if ( typeof obj.inputcheckobject != 'undefined' )
      throw { message : this.txtSprintf(this.txtGetText("#mne_lang#Bitte einen Wert für <$1> angeben"), obj.inputcheckobject.innerHTML)  };
    else if ( i >= 0 && typeof obj.weblet.obj.labels[obj.id.substr(0,i)] != 'undefined')
      throw { message : this.txtSprintf(this.txtGetText("#mne_lang#Bitte einen Wert für <$1> angeben"),obj.weblet.obj.labels[obj.id.substr(0,i)].innerHTML)  };
    else
      throw { message : this.txtSprintf(this.txtGetText("#mne_lang#Bitte einen Wert für <$1> angeben"), obj.id)  };
  }

  retval =  obj.value;
  switch(obj.type)
  {
  case "checkbox":
    retval =  obj.checked ? "1" : "";
    break;
    
  default:
    if ( obj.inputtyp == 'datetime' || obj.inputtyp == 'date' || obj.inputtyp == 'time' || obj.inputtyp == 'clocktime' || obj.inputtyp == 'interval' || obj.inputtyp == '1000' || obj.inputtyp == '1001' || obj.inputtyp == '1002' || obj.inputtyp == '1003')
      retval = obj.mne_timevalue;
    break;
  }
  
  return retval;
};

MneAjaxWeblet.prototype.getParam  = function(pp)
{
  var i = null;
  var p = pp;
  
  for ( i in this.obj.inputs )
    p = this.addParam(p, i + "Input", this.getParamValue(this.obj.inputs[i]));

  return p;     
};

MneAjaxWeblet.prototype.getIdparam  = function(p, mod)
{
  var i;
  var m = ( typeof mod != 'undefined' ) ? mod : this.okaction;
  
  if ( m == 'mod' )
  {
    for ( i=0; i<this.showids.length; i++ )
    {
      if ( typeof p[this.showids[i] + "Input.old"] != 'undefined' )
        throw { message : this.txtSprintf(this.txtGetText("#mne_lang#Id Parameter <$1> ist schon definiert"), this.showids[i] ) };
        else if ( typeof this.act_values[this.showids[i]] != 'undefined')
          p[this.showids[i] + "Input.old"] = this.act_values[this.showids[i]];
        else
          throw { message : this.txtSprintf(this.txtGetText("#mne_lang#Objekt für name <$1> ist nicht definiert"), this.showids[i] ) };        
    }
  }
  else
    throw { message : this.txtGetText("#mne_lang#MneAjaxWeblet:getIdparam ist nur im Modifymodus erlaubt") };        
    return p;
};

MneAjaxWeblet.prototype.getTableparam = function(pp)
{
  var i,k,r;
  var first = null;
  var p = pp;
  i = null;
  for (i in this.obj.tables)
  {
    if ( first == null ) first = this.obj.tables[i];
    break;
  }
  r = first.body.rows;
  p = this.addParam(p, "t" + i + "length", first.body.rows.length);

  k = 0;
  i = 0;

  try 
  {
    for (i=0; i<r.length; i++)
    {
      for ( k=0; k<r[i].cells.length; k++ )
        p = this.addParam(p, r[i].cells[k].datafield.id + "Input" + i, r[i].cells[k].datafield.value);
    }
  }
  catch(e)
  {
    this.error(this.txtSprintf(this.txtGetText("#mne_lang# Fehler in Reihe $1 und Spalte $2"), i, k));
    throw e;
  }
  return p;
};

MneAjaxWeblet.prototype.showwait = function()
{
  this.eleMkClass(MneAjaxWeblet.html.waitframe, 'show', true);
}

MneAjaxWeblet.prototype.hidewait = function()
{
  this.eleMkClass(MneAjaxWeblet.html.waitframe, 'show', false);
}

MneAjaxWeblet.prototype.checkmodified_single = function(ele)
{
  var e = ( ele.wrapper ) ? ele.wrapper : ele;
  return ( e.className.indexOf('modifyok') != -1 || e.className.indexOf('modifywrong') != -1 );
}

MneAjaxWeblet.prototype.checkmodified = function()
{
  var i = null;
  for ( i in this.obj.inputs )
  {
    if ( this.checkmodified_single(this.obj.inputs[i]) )
      return true;
  }
  for ( i in this.obj.outputs )
  {
    if ( this.checkmodified_single(this.obj.outputs[i]) )
      return true;
  }
  return false;
}

MneAjaxWeblet.prototype.ok = function(setdepend, start, sqlend, showvalue )
{
  p = this.getParam(p);
  if ( this.okaction == 'mod' )
    p = this.getIdparam(p);

  if ( typeof this.btnrequest[this.okaction] == 'undefined' )
    throw { message : this.txtSprintf(this.txtGetText('#mne_lang#keine Buttonaktion für <$1> definiert'),this.okaction) };

  if ( typeof this.initpar.okpre != 'undefined' && this.initpar.okpre != null )
  {
    if ( MneAjaxWeblet.prototype.write.call(this, this.initpar.okpre , p ) != 'ok' )
      return true;
  }

  if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest[this.okaction],  p ) == 'ok' )
  {
    if ( showvalue != false ) this.showValue(this);
    if ( setdepend != false ) this.setDepends("ok");
    
    if ( typeof this.initpar.okpost != 'undefined' && this.initpar.okpost != null )
      if ( MneAjaxWeblet.prototype.write.call(this, this.initpar.okpost , p ) != 'ok' )
        return true;

    return false;
  }
  
  return true;
};

MneAjaxWeblet.prototype.add  = function(setdepend)
{
  var i;
  var values = {};
  var modifyed = this.checkmodified();
  
  if ( this.inputlist != null )
  {
    this.inputlist.popup.hidden();
    this.inputlist = null;
  }

  if ( this.obj.title != null ) this.obj.title.innerHTML = this.titleString.add;

  this.okaction = "add";

  i = null;
  for (i in this.act_values ) 
	  this.old_values[i] = this.act_values[i];

  if ( ! modifyed )
  {

	  for (i in this.obj.inputs)
	  {
		  if (this.obj.inputs[i].notclear != true &&  typeof this.defvalues[i] == 'undefined' )
		  {

			  if (this.obj.inputs[i].tagName == "SELECT" && this.obj.inputs[i].options.length > 0 )
			  {
				  this.showInput(this.obj.inputs[i], this.obj.inputs[i].options[0].value, this.typs[this.ids[i]], false);
				  this.act_values[i] = this.obj.inputs[i].options[0].value;
			  }
			  else
			  {
				  this.showInput(this.obj.inputs[i], '', this.typs[this.ids[i]], false);
				  this.act_values[i] = '';
			  }
		  }
		  else if ( this.obj.inputs[i].tagName == "SELECT" )
		  {
			  this.obj.inputs[i].checkvalue = null;
			  this.act_values[i] = '';
		  }

		  if ( this.obj.inputs[i].inputtyp == 'color' )
		  {
			  this.obj.inputs[i].style.backgroundColor = '';
		  }

	  }

	  for ( i in this.obj.outputs ) if ( this.obj.outputs[i].notclear != true &&  typeof this.defvalues[i] == 'undefined' ){ this.act_values[i] = this.obj.outputs[i].innerHTML = '';}
	  for ( i in this.obj.tables )  { this.obj.tables[i].clearBody(); }
  }

  for (i in this.obj.inputs)
  {
    if ( typeof this.defvalues[i] != 'undefined' && this.defvalues[i] != null && ( ! modifyed || ! this.checkmodified_single(this.obj.inputs[i])) )
    {
      if (this.obj.inputs[i].tagName == "SELECT")
        this.obj.inputs[i].checkvalue = this.defvalues[i];
      this.act_values[i] = this.defvalues[i];
      this.showInput(this.obj.inputs[i], this.defvalues[i], this.typs[this.ids[i]], false);
    }
  }

  for ( i in this.obj.outputs )
  {
    if ( typeof this.defvalues[i] != 'undefined' && this.defvalues[i] != null && ( ! modifyed || ! this.checkmodified_single(this.obj.outputs[i])) )
    {
      this.act_values[i] = this.defvalues[i];
      this.showOutput(this.obj.outputs[i], this.act_values[i], this.typs[this.ids[i]]);
    } 
  }


  for ( i =0; i< this.showids.length; i++ )
  {
    if ( typeof this.defvalues[this.showids[i]] == 'undefined')
      values[this.showids[i]] = '################';
    else if ( this.defvalues[this.showids[i]] == null )
      values[this.showids[i]] = this.old_values[this.showids[i]];
    else
      values[this.showids[i]] = this.defvalues[this.showids[i]];
  }

  for ( i =0; i< this.showids.length; i++ )
    if ( typeof this.obj.inputs[this.showids[i]] != 'undefined')
    { this.old_values[this.showids[i]] = this.act_values[this.showids[i]] = this.obj.inputs[this.showids[i]].value = values[this.showids[i]];}
    else
      this.error ("this.obj.inputs." + this.showids[i] + " ist unbekannt" );

  if ( modifyed != true )
  {
    this.clearModify();
    if ( setdepend != false ) this.setDepends("add");
    return false;
  }
  else
  {
    if ( this.ok(setdepend) == false )
    {
      this.status(this.titleString.added);
      return false;
    }
    return true;
  }
};

MneAjaxWeblet.prototype.del = function(setdepend)
{
  if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
    return false;

  var p = this.getIdparam({});
  if ( typeof this.initpar.delpre != 'undefined' && this.initpar.delpre != null )
  {
    if ( MneAjaxWeblet.prototype.write.call(this, this.initpar.delpre , p ) != 'ok' )
      return true;
  }

  if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest.del, p) == 'ok') 
  {
    this.clearModify(true);
    this.add(setdepend);

    if ( typeof this.initpar.delpost != 'undefined' && this.initpar.delpost != null )
    {
      if ( MneAjaxWeblet.prototype.write.call(this, this.initpar.delpost , p ) == 'ok' )
        return false;
    }
    return false;
  }

  return true;
};

MneAjaxWeblet.prototype.cancel = function()
{
  var i;

  if ( this.inputlist != null )
  {
    this.inputlist.popup.hidden();
    this.inputlist = null;
  }

  i = null;
  for ( i in this.old_values )
    if ( typeof this.act_values[i] == 'undefined' || this.act_values[i] == '' )
      this.act_values[i] = this.old_values[i];
  
  for ( i in this.obj.inputs )
  {
    var val = ( typeof this.act_values[i] != 'undefined' ) ? this.act_values[i] : '';
    this.showInput(this.obj.inputs[i], val, this.typs[this.ids[i]], true);
    if ( this.obj.inputs[i].className.indexOf("modifyok") >= 0 ) this.eleMkClass(this.obj.inputs[i],'modifyno', true, 'modify');
  }
  for ( i in this.obj.outputs )
  {
    var val = ( typeof this.act_values[i] != 'undefined' ) ? this.act_values[i] : '';
    this.showOutput(this.obj.outputs[i], val, this.typs[this.ids[i]]);
  }

  this.clearModify();
  return false;
};

MneAjaxWeblet.prototype.print = function(p_param, report)
{
    var i,n;
    var form = this.win.document.createElement("form");
    var r = ( typeof report == 'undefined' || report == null ) ?  this.initpar.report : report;
    var t = ( typeof this.initpar.reptyp == 'undefined' ) ? 'pdf' : this.initpar.reptyp;
    var param = p_param;

    if ( typeof param == 'undefined' ) param = {};

    form.acceptCharset="utf-8";
    for ( n = 0; 1; n++ )
        if ( typeof param["macro" + n] == 'undefined' ) break;

    i = null;
    for ( i in param )
    {
        if (i.substr(i.length - 9 ) == 'Input.old')
        {
            param["macro" + n++] = "S" + i.substr(0, i.length - 9 ) + "," + param[i];
            param["macro" + n++] = "O" + i.substr(0, i.length - 9 ) + ",=";
        }
    }

    if ( typeof param.wcol != 'undefined' && param.wcol != null )
    {
        var cols = param.wcol.split(",");
        var vals = param.wval.split(",");
        var ops  = param.wop.split(",");
        for ( i in cols )
        {
            param["macro" + n++] = "S" + cols[i] + "," + vals[i];
            param["macro" + n++] = "O" + cols[i] + "," + ops[i];
        }

    }

    form.action = 'report/' + r + "." + t;
    if ( this.havepdf == true )
        form.target = "print" + MneAjaxWeblet.prototype.pcount++;
    form.method = "post";

    form.style.visibility = "hidden";
    this.frame.appendChild(form);

    if ( this.havepdf == true )
        window.open('about:blank', form.target, 'menubar=no,location=no,resizable=yes,scrollbars=yes');

    if ( typeof param.sqlend == 'undefined') param.sqlend = 1;

    for ( i in param )
    {
        form.appendChild(this.doc.createElement('input'));
        form.lastChild.name= i;
        form.lastChild.value = param[i];
    }

    form.submit();
    this.frame.removeChild(form);
    return false;
};

MneAjaxWeblet.prototype.detail = function()
{
  var i;
  var act_values = {};
  
  this.reload = true;
  
  this.initpar.view2 = ! this.initpar.view2;
  this.initpar.noshowatload = true;
  
  for ( i =0; i < this.showids.length; i++ )
     act_values[this.showids[i]] =  this.act_values[this.showids[i]];

  for ( i in this.obj.inputs )
    if ( this.obj.inputs[i].notclear == true )
     act_values[i] =  this.obj.inputs[i].value;
  
  this.load(this.id);
  this.showValue({ act_values : act_values });
  
  if ( typeof this.popup != 'undefined' && this.popup != null )
  {

    this.popup.root.style.width = "10px";
    this.popup.root.style.height = "10px";

    var w = this;
    window.setTimeout(function() { w.popup.resize(true,true); }, 100 );
  }

};

MneAjaxWeblet.prototype.exports = function()
{
  var i = null;
  var form = this.win.document.createElement("form");

  var p = MneAjaxWeblet.prototype.readDataParam.call(this, this, { sqlend : 1 } );
  
  for ( i in this.initpar )
  {
    if ( i.substr(0,6) == 'export' )
      p[i.substr(6)] = this.initpar[i];
  }
  
  form.acceptCharset="utf-8";

  form.action = this.btnrequest["export"];
  form.method = "post";
  
  form.style.visibility = "hidden";
  this.frame.appendChild(form);

  i = null;
  if ( typeof this.getFilter == 'function')
    p = this.getFilter(p);
  
  for ( i in p )
  {
    form.appendChild(this.doc.createElement('input'));
    form.lastChild.name= i;
    form.lastChild.value = p[i];
  }

  if ( typeof this.initpar.exporttablehidecols != 'undefined' )
  {
    form.appendChild(this.doc.createElement('input'));
    form.lastChild.name= "tablehidecols";
    form.lastChild.value = this.initpar.exporttablehidecols ;
  }
  else if ( typeof this.initpar.tablehidecols != 'undefined' )
  {
    form.appendChild(this.doc.createElement('input'));
    form.lastChild.name= "tablehidecols";
    form.lastChild.value = this.initpar.tablehidecols ;
  }
  
  form.submit();
  this.frame.removeChild(form);
  return false;
};


