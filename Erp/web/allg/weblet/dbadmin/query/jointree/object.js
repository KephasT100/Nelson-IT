// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/query/jointree
// ================================================================================
{

  weblet.doc.oncontextmenu = function() { return false; }
  weblet.obj.mkbuttons = [];
  
  weblet.eleMkClass(weblet.frame, 'treemain', true);
  //weblet.pdebug = 1;

  var onmouseup = function(evt)
  {
    var weblet = evt.target.parentNode.weblet;
    var action = evt.target.parentNode.action;
    var root = evt.target.parentNode;
    
    if (evt.button != 0 )
    {
      weblet.act_values['schema'] = action.tschema;
      weblet.act_values['table'] = action.ttab;
      weblet.act_values['tabnum'] = action.tabnum;
      weblet.showdetail(action.tabnum);
    }
  }

  var onclick = function(evt)
  {
    var open = false;
    var weblet = evt.target.parentNode.weblet;
    var action = evt.target.parentNode.action;
    var root = evt.target.parentNode;
    
    if (evt.button == 0 )
    {
      if ( evt.offsetX < 12 )
      {
        weblet.showTable(action.tschema, action.ttab, action.frame);

        if (action.frame.firstChild == null) weblet.eleMkClass(root, 'treeleaf', true, 'tree');
        else weblet.eleMkClass(root, 'menuopen',  ( root.className.indexOf('menuopen') == -1 ));
      }
      else
      {
        weblet.act_values['schema'] = action.tschema;
        weblet.act_values['table'] = action.ttab;
        weblet.act_values['tabnum'] = action.tabnum;
        weblet.setDepends('select');
      }
    }
    
    evt.stopPropagation();
    evt.preventDefault();
  }
  
  var ontouchstart = function(evt)
  {
    evt.target.starttime = evt.timeStamp;
  }
  var ontouchend = function(evt)
  {
    if ( (evt.timeStamp - evt.target.starttime) > 1000 )
      evt.target.onmouseup({ target : evt.target, button : 1 });
  }

  weblet.mkElement = function(values, str, classname)
  {
    var tabnum = this.tabnum++;
    
    var div = this.doc.createElement("div");
    div.innerHTML = '<div class="treelink">' + tabnum + " " + str + '</div><div class="treemain"></div>';
    div.firstChild.onclick = onclick;
    div.firstChild.onmouseup = onmouseup;
    div.firstChild.ontouchstart = ontouchstart;
    div.firstChild.ontouchend = ontouchend;

    div.className = classname;
    div.weblet = this;
    div.param =
    {
        joindefid : values[this.ppos.joindefid],
        tschema   : values[this.ppos.tschema],
        ttab      : values[this.ppos.ttab],
        tcols     : values[this.ppos.tcols],
        fcols     : values[this.ppos.fcols],
        op        : values[this.ppos.op],
        typ       : values[this.ppos.typ]
    };
    
    div.action =
    {
        tabnum : tabnum,
        tschema : values[this.ppos.tschema],
        ttab : values[this.ppos.ttab],
        frame : div.lastChild,
    };
    
    div.action.frame.tables = {};

    this.obj.divs[div.action.tabnum] = div;
    return div;
  }
  
  weblet.showTable = function(schema,table,frame)
  {
    var param =
    {
      "schema" : "mne_application",
      "table"  : "joindef",
      "cols" : "joindefid,tschema,ttab,fcols,tcols,op,typ",
      "scols" : "tschema,ttab",
      "fschemaInput.old" : schema,
      "ftabInput.old" : table,
      "sqlend" : 1
    };
    
    MneAjaxData.prototype.read.call(this, "/db/utils/table/data.xml", param);
  
    var ele;
    var i;
    var str;

    this.ppos = {};
    this.ppos.joindefid = this.ids['joindefid'];
    this.ppos.tschema = this.ids['tschema'];
    this.ppos.ttab = this.ids['ttab'];
    this.ppos.tcols = this.ids['tcols'];
    this.ppos.fcols = this.ids['fcols'];
    this.ppos.op = this.ids['op'];
    this.ppos.typ = this.ids['typ'];
    
    for ( i = 0; i<this.values.length; i++ )
    {
      if ( typeof frame.tables[this.values[i][this.ppos.joindefid]] == 'undefined')
      {
        str = this.values[i][this.ppos.tschema] + "." + this.values[i][this.ppos.ttab] + " ( " + this.values[i][this.ppos.fcols] + " : " + this.values[i][this.ppos.tcols] + " : " + this.values[i][this.ppos.op] + " ) - " + this.values[i][this.ppos.typ]
        ele = this.mkElement( this.values[i], str, "tree");
        frame.appendChild(ele);
        frame.tables[this.values[i][this.ppos.joindefid]] = ele.action.tabnum;
      }
    }

  }

  weblet.showView = function(weblet)
  {
    var param =
    {
      "schema" : "mne_application",
      "table"  : "querytables",
      "cols" : "joindefid,deep,tabnum,fcols,tschema,ttab,tcols,op,typ",
      "scols" : "tabid",
      "queryidInput.old" : weblet.act_values.queryid,
      "sqlend" : 1
    };
    var max_tabnum;
    
    MneAjaxData.prototype.read.call(this, "/db/utils/table/data.xml", param);
  
    if ( this.values.length == 0 )
    {
      this.warning(this.txtSprintf("#mne_lang#Keine Werte für <$1> gefunden", "queryid: " + param["queryidInput.old"] ));
      return;
    }
    
    this.ppos = {};
    this.ppos.joindefid = this.ids['joindefid'];
    this.ppos.deep = this.ids['deep'];
    this.ppos.tabnum = this.ids['tabnum'];
    this.ppos.tschema = this.ids['tschema'];
    this.ppos.ttab = this.ids['ttab'];
    this.ppos.tcols = this.ids['tcols'];
    this.ppos.fcols = this.ids['fcols'];
    this.ppos.op = this.ids['op'];
    this.ppos.typ = this.ids['typ'];

    var frame = this.frame;
    var i;
    var str;
    var ele;
    var deep;
    var old_deep;
    var frames = new Array();
    
    this.tabnum = max_tabnum = parseInt(this.values[0][this.ppos.tabnum]);
    str = this.values[0][this.ppos.tschema] + "." + this.values[0][this.ppos.ttab];
    ele = this.mkElement( this.values[0], str, "tree menuopen");

    frame.appendChild(ele);
    ele.appendChild(ele.action.frame);

    this.act_values['schema'] = this.values[0][this.ppos.tschema];
    this.act_values['table'] = this.values[0][this.ppos.ttab];
    this.act_values['tabnum'] = 0;

    old_deep = 0;
    for ( i = 1; i<this.values.length; i++ )
    {
          this.tabnum = parseInt(this.values[i][this.ppos.tabnum]);
      if ( this.tabnum > max_tabnum ) max_tabnum = this.tabnum;
      
      if ( this.values[i][this.ppos.deep] > old_deep )
      {
        frames[frames.length] = frame;
        frame = ele.action.frame;
      }
      else if ( this.values[i][this.ppos.deep] < old_deep )
      {
        var j;
        var deep = parseInt(this.values[i][this.ppos.deep]);

        frame = frames[deep];
        frames = frames.slice(0, deep);
      }
      old_deep = this.values[i][this.ppos.deep];
      str = this.values[i][this.ppos.tschema] + "." + this.values[i][this.ppos.ttab] + " ( " + this.values[i][this.ppos.fcols] + " : " + this.values[i][this.ppos.tcols] + " : " + this.values[i][this.ppos.op] + " ) - " + this.values[i][this.ppos.typ]
      if ( i == ( this.values.length - 1 ) || old_deep >= this.values[i+1][this.ppos.deep] )
        ele = this.mkElement( this.values[i], str, "tree");
      else
        ele = this.mkElement( this.values[i], str, "tree menuopen");
      frame.appendChild(ele);
      
      frame.tables[this.values[i][this.ppos.joindefid]] = ele.action.tabnum;
    }
    this.tabnum = max_tabnum + 1;
  }

  weblet.mousedown = function(evt)
  {
    if ( evt.target.weblet != this ) return true;

    var obj = evt.target;
    var action = evt.target.action;
    if ( typeof action != 'undefined' && typeof action.mousedown != 'undefined' ) eval(action.mousedown);
    return true;
  }

  weblet.click = function (evt)
  { 
   if ( evt.target.weblet != this ) return true;

    var obj = evt.target;
    var action = evt.target.action;
    if ( typeof action != 'undefined' && action != null ) eval(evt.target.action.click);
    return true;
  }
  
  //weblet.win.mneDocevents.addInterest("mousedown", weblet);
 // weblet.win.mneDocevents.addInterest("click", weblet);
  
  weblet.showValue = function(weblet)
  {
    var ele;
    var i;
    
    if ( weblet == null ) return;
    
    this.frame.innerHTML = "";
    this.tabnum = 0;
    this.obj.divs = new Array();

    if ( typeof weblet.act_values.queryid == 'undefined' || weblet.act_values.queryid == null || weblet.act_values.queryid == "" )
    {
      if ( typeof weblet.act_values.schema != 'undefined' && typeof weblet.act_values.table != 'undefined' )
      {
        this.act_values['schema'] = weblet.act_values.schema;
        this.act_values['table'] = weblet.act_values.table;
        this.act_values['tabnum'] = this.tabnum;

        this.ppos = {};
        this.ppos.joindefid = 0;
        this.ppos.tschema = 1;
        this.ppos.ttab = 2;
        this.ppos.tcols = 3;
        this.ppos.fcols = 4;
        this.ppos.op = 5;
        this.ppos.typ = 6;
        var values = new Array('', weblet.act_values.schema, weblet.act_values.table, '', '', '', 1);
        ele = this.mkElement(values, weblet.act_values.schema + "." + weblet.act_values.table, "tree");
        this.frame.appendChild(ele);
      }
      else
      {
        var i;
        this.act_values['schema'] = '';
        this.act_values['table'] = '';
        this.act_values['tabnum'] = 0;
        this.setDepends("select");
      }
    }
    else
      this.showView(weblet);
  }
  
  weblet.getParam = function(p)
  {
    this.tabid = 0;
    this.deep = 0;

    if ( typeof this.frame == 'undefined' || this.frame.firstChild == null )
      throw { message : "#mne_lang#Keine Tabellen definiert", stack: "/dbadmin/view/jointree/getParam()" }
      
    p = this.getFrameParam(this.frame.firstChild, p);
    return this.addParam(p, "janzahl", this.tabid);
  }
  
  weblet.getFrameParam = function(frame,p)
  {
    var i;
    
    p = this.addParam(p, "jointabid" + this.tabid, this.tabid);
    p = this.addParam(p, "joindeep" + this.tabid, this.deep);
    p = this.addParam(p, "jointabnum" + this.tabid, frame.action.tabnum);

    p = this.addParam(p, "joinjoindefid" + this.tabid, frame.param.joindefid);
    p = this.addParam(p, "jointschema" + this.tabid, frame.param.tschema);
    p = this.addParam(p, "jointtab" + this.tabid, frame.param.ttab);
    
    p = this.addParam(p, "jointcols" + this.tabid, frame.param.tcols);
    p = this.addParam(p, "joinfcols" + this.tabid, frame.param.fcols);
    p = this.addParam(p, "joinop" + this.tabid, frame.param.op);
    p = this.addParam(p, "jointyp" + this.tabid, frame.param.typ);

    this.tabid++;
    this.deep++;
    for ( i = 0; frame.action.frame != null && i < frame.action.frame.childNodes.length; i++ )
      p = this.getFrameParam(frame.action.frame.childNodes[i], p)
   
    this.deep--;
    return p;
  }

  weblet.showdetail = function(tabnum)
  {
    if ( typeof this.initpar.popup != 'undefined')
    {
      var popup = this.parent.popups[this.initpar.popup];
      var p = {};
      var i;
      
      for ( i in this.obj.divs[tabnum].param ) p[i] = this.obj.divs[tabnum].param[i];
      p.tabnum = tabnum;
      p.div = this.obj.divs[tabnum];
      
      popup.show(false,false);
      if ( popup.weblet.showValue( { act_values : p } ))
        popup.hidden();
      popup.weblet.onbtnobj = this;

      {
        var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize != false, popup.weblet.initpar.popup_repos == true); }
        window.setTimeout(timeout, 10);
      }

    }
    return false;
  }
  
  weblet.onbtnok = function(button)
  {
    var i;
    var div = button.weblet.act_values.div;
    
    for ( i in div.param )
    {
      if ( div.param[i] != button.weblet.act_values[i] )
        div.param.joindefid = '';
      div.param[i] = button.weblet.act_values[i];
    }

    this.eleMkClass(div.firstChild, "modifyok", true, 'modify');;
    
    div.firstChild.innerHTML = div.action.tabnum + " " + div.param.tschema + "." + div.param.ttab + " ( " + div.param.fcols + " : " + div.param.tcols + " : " + div.param.op + " ) - " + div.param.typ
    
  }
  
  weblet.ok_ready = function(weblet)
  {
     var i;
     for ( i=0; i< this.obj.divs.length; i++ )
       if ( typeof this.obj.divs[i] != 'undefined' )
         this.eleMkClass(this.obj.divs[i].firstChild, "modifyno", true, "modify");
  }

}
