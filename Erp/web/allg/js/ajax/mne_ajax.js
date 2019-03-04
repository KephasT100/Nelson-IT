// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    datei: js/ajax/mne_ajax.js
//================================================================================

// ================================================================================
//  MneAjax          
// ================================================================================
'use strict';
window.MneAjax = function(window)
{
  MneMisc.call(this, window);
  this.req  = new XMLHttpRequest();
  this.req.ajax = this;
  
  this.loadClass = function ( id, path )          { MneAjax.prototype.loadClass.call(this, id, path); };
  this.loadReady = function(evt) {};
  
};

MneAjax.prototype = new MneMisc(window);
MneAjax.prototype.mk_param = function(parameter)
{
  var param = "";
  var p = null;
  var s;
  var sep = "";

  if ( typeof parameter == 'object')
  {

    for ( p in parameter )
    {
      s = encodeURIComponent(parameter[p]);
      param = param + sep + p + "=" + s;
      sep = "&";
    }
  }
  return param;
};

MneAjax.prototype.check_status = function (action, parameter)
{
  
  if ( this.req.status == 201 )
  {
    window.location.reload(false);
    return;
  }
  
  if ( this.req.status == 0 )
  {
      this.error("#mne_lang#Verbindung zum Server unterbrochen");  
      return '';
  }
  
  if ( this.req.status != 200 )
  {
    if ( typeof parameter == 'undefined' || parameter.ignore_notfound != true )
      this.error(this.req.responseText);
    throw { message : "Falscher Status: " + this.req.status };
  }

  if ( this.req.getResponseHeader('Content-Type').indexOf('text/xml') >= 0 )
  {
    try
    {
      var root_node = this.req.responseXML.getElementsByTagName("error");
      this.win.root_node = root_node;
      if ( root_node != null && root_node.length > 0 )
      {
        var i;
        var print_par = false;
        var str,c;
        var nodes;
        var pars;
        var errorfound = 0;
        
        nodes = root_node[0].getElementsByTagName('v');
        for ( i = nodes.length-1; i>=0; i-- )
        {
          if ( ( nodes[i].getAttribute('class') == 'error' || nodes[i].getAttribute('class') == 'warning'))
          {
            print_par = true &&  this.pdebug != true  && parameter.pdebug != true;
            break;
          }
        }

        pars = '';
        if ( print_par && parameter.no_printpar != true )
        {
          pars = "Request: " + action + '\n';
          pars += "Parameter\n";
          for ( i in parameter )
            pars += i + ": " + parameter[i] + "\n";
          pars = pars.substr(0, pars.length - 1);
        }


        for ( i = nodes.length-1; i>=0; i-- )
        {
          str = '';
          while ( i > 0 && nodes[i].getAttribute('class') == 'line')
            str = unescape(nodes[i--].firstChild.data) + '\n' + str;           

          if ( str != '' ) str = '\n' + str;
          str = unescape(nodes[i].firstChild.data) + str;
          c = nodes[i].getAttribute('class');
          if ( c == 'error' ) errorfound = 1
          if ( i == 0 && errorfound )
            str += pars;
          this[c](str);

        }
      }   
    }
    catch(e)
    {
      this.error("#mne_lang#fehlerhaftes XML");
      this.line(e.message)
      this.line(this.req.responseText);
      return "";
    }
    return this.req.responseXML;
  }
  return this.req.responseText;
};

MneAjax.prototype.load = function(action, parameter, async, func )
{
  var param = "";
  if ( typeof parameter == 'undefined' || parameter == null ) parameter = {};
  if ( parameter.async == true ) async = true;
  if ( typeof parameter.mneuserloginname == 'undefined' && typeof window.mne_config != 'undefined' ) parameter.mneuserloginname = window.mne_config.username;

  if ( async == true && this.req.readyState != 0 && this.req.readyState != 4 )
    {
    this.warning("#mne_lang#Warte noch auf anderen Request")
    return;
    }

  param = MneAjax.prototype.mk_param(parameter);

  if ( this.pdebug || parameter.pdebug )
  {
    var i;
    for ( i in parameter )
      this.line( i + ": " + parameter[i], true);    
      this.message("action: " + action);
  }

  if ( action[0] == '/' ) action = action.substr(1);
  this.req.open("POST", action, async == true );
  this.req.ajax = this;
  { var ajax = this; var p = parameter; this.req.onreadystatechange = ( typeof func == 'function' ) ? func : function(evt) { ajax.loadReady(action, p); }; }
  this.req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  try { this.req.send(param); } catch (e ) {console.log(e.message)};

  if ( async == true ) return;

  return this.check_status(action, parameter);
};

  
MneAjax.prototype.classPath = "/js/";
MneAjax.prototype.loadClass = function(name, href)
{
  if ( name != null && typeof eval("this.win." + name ) != 'undefined' ) return;
  MneAjax.prototype.load.call(this, this.classPath + href);
  if ( this.req.getResponseHeader('Content-Type').indexOf("javascript") < 0 )
    this.error("LoadClass: " + this.classPath + href + ": " + this.req.responseText);
  else
    try { this.win.eval(this.req.responseText); } catch(e) { this.exception("LoadClass: /js/" + href + ":",e); }
  
  if ( name != null && typeof this.win[name]  == 'undefined' ) this.error("LoadClass: <" + name + "> wurde nicht definiert");
};

MneAjax.prototype.theme = 'default';
MneAjax.prototype.styles = new Array();
MneAjax.prototype.styleInterest = new Array();
MneAjax.prototype.addStyleInterest = function(obj)
{
  this.styleInterest[this.styleInterest.length] = obj;
};

MneAjax.prototype.styles = {};
MneAjax.prototype.stylePath = "/styles";
MneAjax.prototype.loadCss = function(href, root)
{
  var style;
  var h,hh;
  var r = root;
  
  if ( typeof r == 'undefined' || r == null )
    r = this.stylePath;

  if ( r[0] != '/' ) r = '/' + r;
  
  if ( href[0] != '/' )
    h = r + "/" + MneAjax.prototype.theme + '/' + href;
  else
    h = href;

  
  var index = r + '/' + href;
  if ( typeof MneAjax.prototype.styles[index] != 'undefined' ) return;

  MneAjax.prototype.styles[index] = { "href" : h, object : null };

  hh = h;
  {
    var par = { doc : this.doc, path : hh, root : r, href : href, index : index  };
    var ajax = new MneAjax(this.win);
    ajax.load( hh, {ignore_notfound : true}, true, function(evt)
    {
      if ( this.readyState != 4 ) return;
      if ( this.status != 200 && par.href[0] != '/' )
        par.path = par.root + "/default/" + par.href + "?ignore_notfound=1";            

      var head = par.doc.getElementsByTagName('head')[0];
      var style = par.doc.createElement("link");
      style.rel = "stylesheet";
      style.type = "text/css";
      style.href = par.path.substr(1);

      MneAjax.prototype.styles[par.index].object = style;

      head.appendChild(style);
    });
  }
};
  
MneAjax.prototype.setTheme = function(theme)
{
  var i = 0;
  var s = MneAjax.prototype.styles;
  var head = this.doc.getElementsByTagName('head')[0];

  MneAjax.prototype.styles = new Array();
  MneAjax.prototype.theme = theme;

  for ( i in s)
  {
    if ( s[i].href )
    {
      if ( s[i].object != null ) head.removeChild(s[i].object);
      this.loadCss(s[i].href);
    }
  }
};

// ================================================================================
//  MneAjaxData
// ================================================================================
window.MneAjaxData = function(window)
{
  MneAjax.call(this, window);
  
  this.ids   = new Array();
  this.rids  = new Array();
  this.typs  = new Array();
  this.formats  = new Array();
  this.names = new Array();
  this.values = new Array();
  this.regexps = new Array();
  this.act_values = {};
};

MneAjaxData.prototype = new MneAjax(window);
MneAjaxData.prototype.read = function(action, parameter)
{
  var xmldoc = MneAjax.prototype.load.call(this, action, parameter);
  if ( typeof xmldoc != 'undefined' )
    return this.mk_result(xmldoc);
  else
    return '';
};

MneAjaxData.prototype.mk_result = function(xmldoc)
{
  var i,j,r,nodes,regexp,regexphelp, regexpmod;
  
  this.ids   = new Array();
  this.rids  = new Array();
  this.typs  = new Array();
  this.formats = new Array();
  this.names = new Array();
  this.regexps = new Array();
  this.values = new Array();
  
  if ( this.req.getResponseHeader('Content-Type').indexOf('text/xml') == -1 )
  {
    this.error(xmldoc);
    return;
  }
    
  var root_node = xmldoc.getElementsByTagName("result").item(0);
  if ( root_node == null )
  {
    this.error(xmldoc.lastChild.childNodes[0].textContent);
    this.error(this.req.responseText);
    return;
  }
  
  var head = root_node.getElementsByTagName('head').item(0);
  var body = root_node.getElementsByTagName('body').item(0);

  if ( head != null ) 
  {
    nodes = head.getElementsByTagName('d');
    for ( i = 0; i<nodes.length; i++ )
    {
      this.ids[nodes[i].getElementsByTagName('id')[0].firstChild.data] = i;
      this.rids[i] = nodes[i].getElementsByTagName('id')[0].firstChild.data;
      nodes[i].getElementsByTagName('name')[0].firstChild == null ? this.names[i] = '' : this.names[i] = nodes[i].getElementsByTagName('name')[0].firstChild.data;
      this.typs[i]  = nodes[i].getElementsByTagName('typ')[0].firstChild.data;
      
      r = nodes[i].getElementsByTagName('format');
      if ( r.length > 0 && r[0].firstChild != null )
          this.formats[i] = r[0].firstChild.data;
      else
          this.formats[i] = '';
      r = nodes[i].getElementsByTagName('regexp');
      regexp = '';
      regexphelp = '';
      regexpmod = '';
        if ( r.length > 0)
        {
          if ( r[0].getElementsByTagName('reg')[0].firstChild != null)
            regexp = r[0].getElementsByTagName('reg')[0].firstChild.data;
          if ( r[0].getElementsByTagName('help')[0].firstChild != null)
            regexphelp = r[0].getElementsByTagName('help')[0].firstChild.data;
          if ( r[0].getElementsByTagName('mod')[0].firstChild != null)
            regexpmod = r[0].getElementsByTagName('mod')[0].firstChild.data;
        }


      try
      {
        if ( typeof MneMisc.prototype.inChecktype[regexp] != 'undefined')
        {
          this.regexps[i] = MneMisc.prototype.inChecktype[regexp]; 
        }
        else
          (regexp == '') ? this.regexps[i] = { reg :'', help :'' } : this.regexps[i] = { reg :new RegExp(regexp, regexpmod), help : regexphelp };
      }
      catch (e)
      {
        this.exception(e);
        this.regexps[i] = { reg : '', help : '' };
      }
    }
  }
  
  if ( body == null ) return;

  nodes = body.getElementsByTagName('r');
  for ( i = 0; i<nodes.length; i++ )
  {
    var v = nodes.item(i).getElementsByTagName('v');
    if ( this.names.length !=  v.length) this.message(this.req.responseText);
    this.values[i] = new Array();
    for ( j =0; j<this.names.length; j++ )
    {
        if ( v[j].firstChild != null )
        {
            if(typeof(v[j].textContent) != "undefined")
                this.values[i][j] = decodeURIComponent(v[j].textContent);  
            else
                this.values[i][j] = decodeURIComponent(v[j].firstChild.data); 
        }
        else this.values[i][j] = '';
    }
  }
  if ( nodes.length == 0 )
  {
    if (body.firstChild != null &&  body.firstChild.nodeType == 3)
    {
      if ( body.firstChild.data == 'logout' )
      {
        if ( typeof window.count_weblet != 'undefined' ) window.count_weblet.printout(); 
        window.location.reload();
      }
    }
  }
};

MneAjaxData.prototype.write = function(action, parameter)
{
  var xmldoc;
  var root_node;
  var body;
  var contenttyp;

  xmldoc = MneAjax.prototype.load.call(this, action, parameter);
  contenttyp = this.req.getResponseHeader("Content-type").split(';')[0];

  switch (contenttyp)
  {
    case 'text/plain':
      if (this.req.responseText == '' || this.req.responseText == 'ok') return 'ok';

    default:
    {
      try
      {
        root_node = xmldoc.getElementsByTagName("result").item(0);
        body = root_node.getElementsByTagName('body').item(0);
      }
      catch (e)
      {
        this.error(this.req.responseText);
        throw { message : this.txtGetText("#mne_lang# Fehler beim Schreiben in die Datenbank gefunden") };
      }

      if (typeof body.firstChild != null && body.firstChild.nodeType == 3)
      {
        if (body.firstChild.data != 'ok' && parameter['rollback'] == true)
        {
          MneAjaxData.prototype.write.call(this, "/db/utils/connect/end.xml", { rollback : "true" });
          throw { message : this.txtGetText("#mne_lang# Fehler beim Schreiben in die Datenbank gefunden") };
        }
        return body.firstChild.data;
      }
      else if (typeof body.firstChild != null && body.firstChild.nodeType == 1)
      {
        var i;
        try
        {
          for (i = 0; i < body.childNodes.length; i++)
          {
            if (body.childNodes[i].firstChild != null) this.act_values[body.childNodes[i].tagName] = decodeURIComponent(body.childNodes[i].firstChild.data);
            else this.act_values[body.childNodes[i].tagName] = '';
            if (parameter['debugvalues']) this.message(body.childNodes[i].tagName + ": " + this.act_values[body.childNodes[i].tagName]);
          }
          return "ok";
        }
        catch (e)
        {
          this.error(this.req.responseText);
          this.exception("MneAjaxData::write", e);
        }
      }
      else
      {
        this.message('falscher Kotentype gefunden');
        return "error";
      }
    }
  }
};
  