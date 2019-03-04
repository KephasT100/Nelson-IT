// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/time/day
// ================================================================================
{
  var i;
  var str = "";
  var obj;
  var hcols;

  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");

  var ivalues = 
  {

      styleName : 'style.css',
      schema    : 'mne_personnal',
      table     : 'time',

      slotstartschema : 'mne_personnal',
      slotstarttable  : 'timemanagement_param',

      personquery : 'timeday',
      personcols  : 'needtime,personid,loginname,fullname,wtime,dayname,day,duration',
      personcolstyle : ',,,,,mne_personal_dayname,,bold',
      personrowstyle: 'result',
      personrowstylecol : '0',
      persontablehidecols   : '0,1,2',

      timeschema      : 'mne_personnal',
      timequery       : 'time',
      timecols        : "timeid,start,orderproducttimeid,orderid,ordernumber,orderdescription,productnumber,productname,stepdescription,clocktime,clocktimeend,duration,comment,refname",
      timescols       : "start",
      timedistinct    : 1,
      
      timetablehidecols   : '0,1,2,3,11',
      timecolstyle    : ",,,,input8,,input8,,rdonly,input4,input4,input4,,,",
      timetablecoltype  : 'hidden,,hidden,hidden,text,,text,,text,time,time,time,text',

      orderschema : 'mne_crm',
      orderquery  : 'order_detail',

      orderproducttimeschema : 'mne_personnal',
      orderproducttimequery  : 'orderproducttime',
      orderproducttimecheckquery  : 'orderproducttime',

      okschema    : 'mne_personnal',
      okfunction  : "time_mod",

      delschema   : 'mne_personnal',
      delfunction : "time_del",

      returntimeout : 0,
      
      inputlist_ignore_notdefined : true,
  };

  weblet.initDefaults(ivalues);

  weblet.loadview();
  weblet.frame.position = "relative";
  weblet.eleMkClass(weblet.frame, 'mne_personal_time_day');

  weblet.obj.mkbuttons.push({ id: 'actday', value : weblet.txtGetText('#mne_lang#Heute'), space : 'before'});
  
  weblet.obj.timeids = weblet.initpar.timecols.split(',');
  weblet.obj.editable = weblet.initpar.timecolstyle.split(',');

  weblet.obj.personids = weblet.initpar.personcols.split(',');
  for ( i=0; i<weblet.obj.personids.length; i++ )
  {
    if ( weblet.obj.personids[i] == 'day')
      weblet.obj.daycol = i;

    if ( weblet.obj.personids[i] == 'dayname')
      weblet.obj.daynamecol = i;
  }

  var attr = 
  {
      hinput : true,
      login                   : { remove : ( weblet.win.mne_config.username != 'admindb' ), weblet : weblet, onkeyup : function(e) { var evt = MneDocEvents.prototype.mkEvent(this.weblet.win, e);  if ( evt.keyCode == 13 ) this.weblet.showValue(this.weblet); } },              
      prevButton              : { onmousedown : function() { this.weblet.eleMkClass(this, 'docprevdown', true)}, onmouseup : function() { this.weblet.eleMkClass(this, 'docprevdown', false)}},
      nextButton              : { onmousedown : function() { this.weblet.eleMkClass(this, 'docnextdown', true)}, onmouseup : function() { this.weblet.eleMkClass(this, 'docnextdown', false)}},

  }

  weblet.findIO(attr);
  weblet.showids = new Array();

  weblet.obj.tables.detail.clickCb["body"] = function(tab) { tab.weblet.dblclick_detail.call(tab.weblet, tab); }
  weblet.obj.tables.detail.table.style.tableLayout = "fixed";
  for ( var i = 0, hcols = this.initpar.persontablehidecols.split(','); i<hcols.length; i++ )
    weblet.obj.tables.detail.setInvisible(parseInt(hcols[i]));

  weblet.obj.tables.time.clickCb["head"] = function(tab) { tab.weblet.sort_time.call(tab.weblet, tab); }
  weblet.obj.tables.time.clickCb["body"] = function(tab) { tab.weblet.click_time.call(tab.weblet, tab); }
  weblet.obj.tables.time.ignoreUnselect = true;
  for ( var i = 0, hcols = this.initpar.timetablehidecols.split(','); i<hcols.length; i++ )
    weblet.obj.tables.time.setInvisible(parseInt(hcols[i]));

  weblet.obj.scols = weblet.initpar.timescols;

  weblet.obj.date = new Date();
  weblet.obj.date.setHours(0);
  weblet.obj.date.setMinutes(0);
  weblet.obj.date.setSeconds(0);
  
  weblet.obj.ajaxread = new MneAjaxData(weblet.win);

  weblet.obj.lasttime = 0;
  weblet.obj.slotstart = 0;
  
  weblet.obj.orderid = '';
  weblet.obj.ordernumber = '';
  weblet.obj.productid = '';
  weblet.obj.productnumber = '';
  
  var param =
  {
      "schema" : weblet.initpar.slotstartschema,
      "table"  : weblet.initpar.slotstarttable,
      "cols"   : "slotstart",
      "sqlend" : 1
  };

  weblet.obj.ajaxread.read("/db/utils/table/data.xml",  param)
  if ( weblet.obj.ajaxread.values.length > 0 )
    weblet.obj.lasttime = weblet.obj.slotstart = weblet.obj.ajaxread.values[0][0];

  weblet.getParam = MneAjaxWeblet.prototype.getParam;

  weblet.obj.rownum = -1;
  weblet.obj.colnum = -1;
  weblet.obj.ismodifyed = false;

  weblet.readData(weblet, { schema : 'mne_personnal', query : 'personskill', cols : 'skillid', wcol : 'loginname', wval : window.mne_config.loginname});
  weblet.obj.skillids = "('" + weblet.values.join("','").toString() + "')";

  weblet.showValue = function(weblet)
  {
    var i;

    if ( typeof weblet != 'undefined' && weblet != null && typeof weblet.initpar.vdayname != 'undefined' )
    {
      var yy = parseInt(weblet.act_values[weblet.initpar.vdayname].substr(4,4));
      var mm = parseInt(weblet.act_values[weblet.initpar.vdayname].substr(2,2));
      var dd = parseInt(weblet.act_values[weblet.initpar.vdayname].substr(0,2));
      this.obj.date.setFullYear(yy);
      this.obj.date.setMonth(mm - 1);
      this.obj.date.setDate(dd);
      
      this.obj.rownum = -1;
      this.obj.colnum = -1;
    }

    this.obj.ismodifyed = false;
    this.obj.inputs = {};

    if ( this.win.mne_config.username == 'admindb' && this.frame.login.value != '') this.obj.loginname = this.frame.login.value; else this.obj.loginname = 'session_user';

    this.obj.date.setHours(0);
    this.obj.date.setMinutes(0)
    this.obj.date.setSeconds(0);
    this.obj.daystart = parseInt(Number(this.obj.date.getTime()) / 1000);
    this.obj.fulldaynamestart = this.txtAddNull(this.obj.date.getDate(),2) + this.txtAddNull(this.obj.date.getMonth() + 1,2) + this.txtAddNull(this.obj.date.getFullYear(),4)

    this.act_values['vday'] = this.obj.date.getDate();
    this.act_values['vmonth'] = this.obj.date.getMonth() + 1;
    this.act_values['vyear'] = this.obj.date.getFullYear();
    
    this.obj.date.setDate(1);
    this.obj.month = parseInt(Number(this.obj.date.getTime()) / 1000);

    this.obj.date.setMonth(0);
    this.obj.year = parseInt(Number(this.obj.date.getTime()) / 1000);

    this.obj.date.setTime((this.obj.daystart + 86400 + 3600) * 1000);
    this.obj.date.setHours(0);
    this.obj.date.setMinutes(0)
    this.obj.date.setSeconds(0);
    this.obj.dayend = parseInt(Number(this.obj.date.getTime()) / 1000);

    this.obj.date.setTime(this.obj.daystart * 1000);

    this.act_values['loginname'] = this.obj.loginname;
    this.act_values['day'] = this.obj.daystart;

    this.initpar.tablecolstyle = this.initpar.personcolstyle;
    this.initpar.tablecoltype = this.initpar.personcoltype;
    this.initpar.tablerowstyle = this.initpar.personrowstyle;
    this.initpar.tablerowstylecol = this.initpar.personrowstylecol;
    this.initpar.tablehidecols = this.initpar.persontablehidecols;
    this.initpar.distinct = this.initpar.persondistinct;

    this.initpar.sschema = this.initpar.personschema;
    this.initpar.squery = this.initpar.personquery;
    this.initpar.cols = this.initpar.personcols;
    this.initpar.scols = 'sortcol';
    var p = {};

    p.maintable = 'detail';
    p.wcol = 'loginname,day,vfullday,loginname';
    p.wop = '=,=,o=,=',
    p.wval = this.obj.loginname + "," + this.obj.daystart + "," + this.obj.fulldaynamestart + "," + this.obj.loginname;

    MneAjaxWeblet.prototype.showTable.call(this, this, p);
    if ( this.values.length > 1 )
      this.obj.tables.detail.delRow(1);

    if ( this.obj.tables.detail.body.origdata.length > 0 )
    {
      for ( i in this.ids)
        this.act_values[i] = this.obj.tables.detail.body.origdata[0][this.ids[i]];

      this.act_values['day'] = this.obj.daystart;
      this.obj.personid = this.act_values.personid;
      
      this.obj.tables.detail.setData(0, this.ids['day'], this.obj.daystart, this.typs[this.ids['day']]);

      this.show_time();
    }
    else
    {
      this.obj.personid = '';
      this.show_time();
    }

    this.act_values['loginname'] = this.obj.loginname;
    this.act_values['day'] = this.obj.daystart;
    this.act_values['month'] = this.obj.month;
    this.act_values['year'] = this.obj.year;
    this.act_values['personid'] = this.obj.personid;
    
    this.act_values['vday'] = this.obj.date.getDate();
    this.act_values['vmonth'] = this.obj.date.getMonth() + 1;
    this.act_values['vyear'] = this.obj.date.getFullYear();
  }    


  weblet.ok = function(t)
  {
    var i;
    for( i in this.obj.inputs )
    {
      if (this.obj.inputs[i].wrapper && this.obj.inputs[i].wrapper.className.indexOf('modifywrong') != -1 )
      {
        this.error('#mne_lang#Bitte alle Werte korrekt ausfüllen');
        return;
      }
    }

    if ( ! this.obj.inputs.timeid )
    {
      this.error("#mne_lang#Bitte eine Zeile auswählen");
      return ;
    }
    
    var value = this.obj.daystart + parseInt(this.obj.inputs.clocktime.mne_timevalue);

    var duration;
    if ( typeof this.obj.inputs.duration != 'undefined' )
      duration = parseInt(this.obj.inputs.duration.mne_timevalue);
    else
      duration = parseInt(this.obj.inputs.clocktimeend.mne_timevalue) - parseInt(this.obj.inputs.clocktime.mne_timevalue);

    var p =
    {
        schema : this.initpar.okschema,
        name : this.initpar.okfunction,
        typ0 : "text",
        typ1 : "text",
        typ2 : "text",
        typ3 : "long",
        typ4 : "long",
        typ5 : "text",
        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.timeid);
    p = this.addParam(p, "par1", this.obj.inputs.orderproducttimeid);
    p = this.addParam(p, "par2", this.obj.personid);
    p = this.addParam(p, "par3", value);
    p = this.addParam(p, "par4", duration);
    p = this.addParam(p, "par5", this.obj.inputs.comment);

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok' )
    {
      this.obj.ismodifyed = false;
      this.obj.rownum = this.obj.tables.time.act_rownum;
      this.obj.colnum = this.obj.tables.time.tab2col(this.obj.tables.time.act_colnum);
      this.act_values.timeid = this.act_values.result;
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }

  weblet.getAddvals = function()
  {
    var val = new Array(this.obj.timeids.length);

    val.fill('');
    val[this.ids['timeid']] = '################'
    val[this.ids['clocktime']] = this.obj.lasttime;
    val[this.ids['clocktimeend']] = this.obj.lasttime;

    return val;
  }

  weblet.add = function()
  {
    if ( this.obj.personid == '' ) return false;
    
    var tab = this.obj.tables.time;
    var val = this.getAddvals();

    var r = tab.add.apply(tab, val);
    
    tab.body.rows[r].cells[tab.col2tab(this.ids['clocktime'])].datafield.value = this.txtFormat(this.obj.lasttime, this.typs[this.ids['clocktime']],this.formats[this.ids['clocktime']])
    tab.body.rows[r].cells[tab.col2tab(this.ids['clocktimeend'])].datafield.value = this.txtFormat(this.obj.lasttime, this.typs[this.ids['clocktimeend']],this.formats[this.ids['clocktimeend']])

    for ( i=0; i < tab.body.rows[r].cells.length; i++)
      this.mk_input(tab.body.rows[r].cells[i].datafield,  this.obj.timeids[tab.tab2col(i)]);

    return false;
  }
  

  weblet.cancel = function()
  {
    this.obj.rownum = -1;
    this.obj.colnum = -1;
    this.obj.ismodifyed = false;
    this.showValue();
    return false;
  }

  weblet.del = function()
  {
    var str;

    if ( ! this.obj.inputs.timeid )
    {
      this.error("#mne_lang#Bitte eine Zeile auswählen");
      return '';
    }

    var p =
    {
        schema : this.initpar.delschema,
        name : this.initpar.delfunction,
        typ0 : "text",
        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.timeid);

    if ( typeof this.obj.inputs.duration != 'undefined' )
      str = this.txtSprintf(this.txtGetText("#mne_lang#Eintrag <$1> wirklich löschen"), this.obj.inputs.clocktime.value + " / " + this.obj.inputs.duration.value);
    else
      str = this.txtSprintf(this.txtGetText("#mne_lang#Eintrag <$1> wirklich löschen"), this.obj.inputs.clocktime.value + " - " + this.obj.inputs.clocktimeend.value);

    if ( this.confirm(str) != true )
      return false;

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.obj.rownum = -1;
      this.obj.colnum = -1;
      this.obj.ismodifyed = false;
      this.showValue(null);
      this.setDepends("del");
      return false;
    }
    return true;
  }

  weblet.prev = function()
  {
    this.obj.buttons.prev.blur();
    this.obj.date.setTime((this.obj.daystart - 86400 + 3600) * 1000);
    this.obj.colnum = 0;
    this.showValue();
    this.setDepends("prev");
    return false;
  }

  weblet.next = function()
  {    
    this.obj.buttons.next.blur();
    this.obj.date.setTime((this.obj.daystart + 86400 + 3600) * 1000);
    this.obj.colnum = 0;
    this.showValue();
    this.setDepends("next");

    return false;
  }
  
  weblet.actday = function()
  {
    this.obj.date = new Date();
    this.obj.date.setHours(0);
    this.obj.date.setMinutes(0);
    this.obj.date.setSeconds(0);

    this.showValue();
    
  }

  weblet.mk_input = function (d, valueid )
  {
    if ( typeof d == 'object')
    {
      
      MneMisc.prototype.inClear(d);
      d.valueid = valueid;
      
      if ( d.className.indexOf("rdonly") != -1 )
      {
        d.onkeydownsave = d.onkeydown;
        d.onkeydown = function(evt) { if ( evt.keyCode == 9 ) return this.onkeydownsave(evt); return window.mneDocevents.cancelEvent(this.win, evt); }
        d.onkeyup = null;
      }
      else if ( valueid ==  'ordernumber' )
      {
        d.onkeyupsave = d.onkeyup;
        d.onkeyup = function(evt)
        {
          d.onkeyupsave(evt);
          if ( ! evt ) return;

          var w = this.weblet;
          if ( w.obj.timeoutid_ordernumber != 'undefined' ) window.clearTimeout(w.obj.timeoutid_ordernumber);
          w.obj.timeoutid_ordernumber = window.setTimeout(function() { try { w.obj.timeout_ordernumber.call(w) } catch(e) {}; }, w.initpar.returntimeout );
        }
        d.onkeydownsave = d.onkeydown;
        d.onkeydown = function(evt)
        {
          if ( evt.keyCode == 9 )
          {
            if ( this.weblet.obj.ordernumber != '' )
              this.value = this.weblet.obj.ordernumber;
          }
          d.onkeydownsave(evt);
        }
        d.onselectvalue = function ()
        {
          this.weblet.obj.timeoutid_ordernumber = 'selected';
          this.weblet.obj.timeout_ordernumber.call(this.weblet);
        }

      }
      else if ( valueid ==  'productnumber' )
      {
        d.onkeyupsave = d.onkeyup;
        d.onkeyup = function(evt)
        {
          d.onkeyupsave(evt);
          if ( ! evt ) return;

          var w = this.weblet;
          if ( w.obj.timeoutid_productnumber != 'undefined' ) window.clearTimeout(w.obj.timeoutid_productnumber);
          w.obj.timeoutid_productnumber = window.setTimeout(function() { try { w.obj.timeout_productnumber.call(w) } catch(e) {}; }, w.initpar.returntimeout );
        }
        d.onkeydownsave = d.onkeydown;
        d.onkeydown = function(evt)
        {
          if ( evt.keyCode == 9 )
            {
            if ( this.weblet.obj.productnumber != '' )
              this.value = this.weblet.obj.productnumber;
            }
          d.onkeydownsave(evt);
        }
        d.onselectvalue = function ()
        {
          this.weblet.obj.timeoutid_productnumber = 'selected';
          this.weblet.obj.timeout_productnumber.call(this.weblet);
        }
      }

      d.onfocus = function( e )
      {
        var wrapper = this.wrapper;
        if ( this.table.act_rownum != this.rownum )
        {
          this.table.findCell(this.table.body.rows[this.rownum].cells[this.table.col2tab(this.colnum)], false);
        }
 
        if ( this.sendtab == true ) { this.sendtab = false; wrapper.weblet.obj.showinputlist = true; wrapper.weblet.firetab(this); return; }
        
        if ( ( this.className.indexOf("rdonly") != -1 || wrapper.weblet.obj.showinputlist == true ) && wrapper.inputlistele )
        {
          try
          {
            var showinputlist = 1;
            if ( this.valueid == 'stepdescription')
            {
              var p = Object.assign({}, wrapper.selval);
              var w = new MneAjaxWeblet(wrapper.weblet.win)

              p['skillidInput.old'] = wrapper.weblet.obj.skillids;
              p['skillidOp.old'] = 'in';
              p.cols += ',' + p.showcols;
              eval("w.showdynpar = {" + p.showdynpar + "}");
              
              w.readData(wrapper.weblet, p);
              if ( w.values.length == 1 )
              {
                wrapper.weblet.inputlist = { obj : p.obj.split(','), id: p.showcols.split(','), element : p.id, inputlistele : wrapper.inputlistele  };
                wrapper.weblet.onbtnok({ weblet : w })
                wrapper.weblet.firetab(this);
                showinputlist = 0;
              }
            }
            
            if ( showinputlist )
            {
              wrapper.weblet.show_inputlist.call(wrapper.weblet, wrapper.selval, wrapper.inputlistele);
            }
          }
          catch (e)
          {
            this.weblet.exception("focus", e);
          }
          wrapper.weblet.obj.showinputlist = false;
        }

        if ( this == wrapper.weblet.obj.inputs.clocktime ||  this == wrapper.weblet.obj.inputs.clocktimeend || this == wrapper.weblet.obj.inputs.duration )
          this.setSelectionRange(0, this.value.length);
          
      }

    }
  }
  
  weblet.show_time = function()
  {
    var i,j;

    this.initpar.tablecolstyle = this.initpar.timecolstyle;
    this.initpar.tablerowstyle = this.initpar.timerowstyle;
    this.initpar.tablerowstylecol = this.initpar.timerowstylecol;
    this.initpar.tablecoltype  = this.initpar.timetablecoltype;
    this.initpar.tablehidecols = this.initpar.timetablehidecols;
    this.initpar.distinct = this.initpar.timedistinct;

    this.initpar.stylePath = this.initpar.timestylePath;
    
    this.initpar.sschema = this.initpar.timeschema;
    this.initpar.squery = this.initpar.timequery;
    this.initpar.cols =  this.initpar.timecols;
    this.initpar.scols = this.obj.scols;
    this.initpar.distinct = 1;

    var p = {};
    var tab = this.obj.tables.time;

    p.maintable = 'time';
    p.wcol = 'start,start,loginname';
    p.wop = '>=,<,=',
    p.wval = this.obj.daystart + "," + this.obj.dayend + "," + this.obj.loginname;

    this.obj.inputs = {};
    this.showTable(this, p);

    if ( this.values.length > 0 ) 
        this.obj.lasttime = Number(this.values[this.values.length - 1][this.ids['clocktimeend']]);
    else
      this.obj.lasttime = this.obj.slotstart;

    this.obj.timeids = this.initpar.cols.split(',');
    this.obj.rtimeids = {};

    for ( i =0; i<this.obj.timeids.length; i++ )
      this.obj.rtimeids[this.obj.timeids[i]] = i;

    for ( j=0; j < tab.body.rows.length; j++)
      for ( i=0; i < tab.body.rows[j].cells.length; i++)
        this.mk_input(tab.body.rows[j].cells[i].datafield,  this.obj.timeids[tab.tab2col(i)]);

    while ( this.obj.personid != '' && this.obj.tables.time.body.rows.length < 12 )
      this.add();

    if ( this.obj.rownum != -1 && this.obj.colnum != -1 && this.obj.rownum  < this.obj.tables.time.body.rows.length )
    {
      this.obj.tables.time.findCell(this.obj.tables.time.body.rows[this.obj.rownum].cells[this.obj.tables.time.col2tab(this.obj.colnum)], false, false);
      this.click_time(this.obj.tables.time)
    }
    else
    {
      this.obj.rownum = this.obj.colnum = -1;
    }
    
    return false;
  }

  weblet.dblclick_detail = function(tab)
  {
    tab.unselect();
    this.act_values.date = this.obj.daystart;

    this.parent.popups['selectday'].show();
    this.parent.popups['selectday'].weblet.onbtnobj = this;
    this.parent.popups['selectday'].weblet.showValue(this);
    {
      var popup = this.parent.popups['selectday'];
      var timeout = function() { popup.resize.call(popup, true, false ); }
      window.setTimeout(timeout, 100);
    }
    return false;

  }

  weblet.sort_time = function(tab)
  {
    var i;
    var col = tab.tab2col(tab.act_colnum);
    for ( i in this.ids ) if ( col == this.ids[i] ) break;

    this.obj.scols = i;
    this.show_time();
  }

  weblet.click_time = function(tab)
  {
    var i,j;
    var trownum, tcolnum;
    var rownum, colnum;

    if ( this.inputlist != null )
      this.inputlist.popup.hidden();

    trownum = tab.act_rownum;
    tcolnum = tab.act_colnum;
    
    rownum = this.obj.rownum;
    colnum = tab.col2tab(this.obj.colnum);
    
    if ( rownum != -1 && rownum != trownum  )
    {
      for ( i in this.obj.inputs )
      {
        if ( this.obj.inputs[i].wrapper && this.obj.inputs[i].wrapper.className.indexOf('modifyok') != -1 ) 
        {
          if ( document.activeElement )
            {
            document.activeElement.blur();
            if ( document.activeElement.onmouseout == 'function' ) document.activeElement.onmouseout();
            }
          if ( this.confirm("#mne_lang#Die Spalte wurde geändert - sollen die Werte geschrieben werden ?") == true )
          {
            if ( this.ok() != false )
            {
              tab.findCell(tab.body.rows[rownum].cells[colnum]);
              if ( tab.body.rows[rownum].cells[colnum].datafield ) tab.body.rows[rownum].cells[colnum].datafield.focus();
            }
            else
            {
              tab.findCell(tab.body.rows[trownum].cells[tcolnum]);
              if ( tab.body.rows[trownum].cells[tcolnum].datafield ) tab.body.rows[trownum].cells[tcolnum].datafield.focus();
            }
          }
          else
          {
            this.obj.rownum = -1;
            tab.findCell(tab.body.rows[rownum].cells[colnum]);
            if ( tab.body.rows[rownum].cells[colnum].datafield ) tab.body.rows[rownum].cells[colnum].datafield.focus();
          }
          return;
        }
      }
    }

    this.obj.orderid = '';
    this.obj.ordernumber = '';
    this.obj.productid = '';
    this.obj.productnumber = '';

    this.obj.rownum = tab.act_rownum;
    this.obj.colnum = tab.tab2col(tab.act_colnum);
    if ( this.obj.colnum == -1 )
      {
      this.setDepends('clicktime');
      return;
      }

    for ( this.obj.fields=[], i=0, j=0; i < this.obj.timeids.length; i++)
    {
      var d;
      this.act_values[this.obj.timeids[i]] = tab.getData(this.obj.rownum, i);
      if ( ( d = tab.getDatafield(this.obj.rownum, i ) ) != null )
      {
        if ( d.parentNode != null ) 
        {
          d.mne_fieldnum = j++;
          this.obj.fields.push(d);
        }
        this.obj.inputs[this.obj.timeids[i]] = d;
      }
    }
    
    this.setDepends('clicktime');
  }

  weblet.find_empty = function()
  {
    var i;
    for ( i = 0; i<this.obj.tables.time.body.rows.length; i++)
    {
      if ( this.obj.tables.time.getData(i,0) == '################' )
      {
        this.obj.tables.time.findCell(this.obj.tables.time.body.rows[i].cells[0], false, false);
        return;
      }

    }
  }

  weblet.setModify = function(obj, modify)
  {
    if ( typeof obj != 'undefined' && obj != null && obj.id.indexOf("Input") >= 0 ) 
      this.obj.ismodifyed = ( modify != 'modifyno' );

    return MneAjaxWeblet.prototype.setModify.call(this, obj, modify);
  }


  weblet.ordernumber_ready = function(w)
  {
    var d = this.obj.tables.time.getDatafield(this.obj.rownum, this.obj.rtimeids['ordernumber']);

    if ( this.obj.rtimeids['orderid'] ) this.obj.tables.time.setData(this.obj.rownum, this.obj.rtimeids['orderid'],'' );
    if ( this.obj.rtimeids['refname'] ) this.obj.tables.time.setData(this.obj.rownum, this.obj.rtimeids['refname'], '' );
    if ( this.obj.rtimeids['orderdescription'] ) this.obj.tables.time.setData(this.obj.rownum, this.obj.rtimeids['orderdescription'], '' );

    this.obj.orderid = '';
    this.obj.ordernumber = '';
    
    d.setSelectvalues(w.values, [1], 0 );

    if ( w.values.length == 1 )
    {
      this.obj.orderid = w.values[0][1];
      this.obj.ordernumber = w.values[0][0];
      if ( this.obj.rtimeids['orderid'] ) this.obj.tables.time.setData(this.obj.rownum, this.obj.rtimeids['orderid'], w.values[0][1] );
      if ( this.obj.rtimeids['refname'] ) this.obj.tables.time.setData(this.obj.rownum, this.obj.rtimeids['refname'], w.values[0][2] );
      if ( this.obj.rtimeids['orderdescription'] ) this.obj.tables.time.setData(this.obj.rownum, this.obj.rtimeids['orderdescription'], w.values[0][3] );
      this.setModify(d, "modifyok" );
      if ( this.win.mne_config.dayreportautotab.substr(0,1) != "f" )
      {
        if ( this.obj.rtimeids['ordernumber'] ) this.obj.tables.time.setData(this.obj.rownum, this.obj.rtimeids['ordernumber'], w.values[0][0] );
        this.firetab(d);
      }
    }
    else if ( w.values.length > 0 )
    {
      this.setModify(d, "modifywarning");
    }
    else
    {
      this.setModify(d, "modifywrong" );
    }
  }

  weblet.obj.timeout_ordernumber = function()
  {
    var w = new MneAjaxData(this.win);
    var ordernumber = this.obj.tables.time.getData(this.obj.rownum, this.obj.rtimeids['ordernumber'], false);

    var param =
    {
        "schema" : this.initpar.orderschema,
        "query"  : this.initpar.orderquery,
        "cols"   : "ordernumber,orderid,refname,description",
        "closedInput.old" : "false",
        "openInput.old" : "true",
        "wcol" : 'ordernumber',
        "wop" : 'like',
        "wval" : ordernumber + "%",
        "sqlend" : 1
    };

    if ( typeof this.obj.timeoutid_ordernumber == 'undefined' )
      return;

    delete this.obj.timeoutid_ordernumber;

    w.loadReadyWeblet = this;
    w.loadReady = function()
    {
      if ( this.req.readyState == 4 )
      {
        this.mk_result(this.check_status());
        this.loadReadyWeblet.ordernumber_ready.call(this.loadReadyWeblet, this);
      }
    }
    w.load("/db/utils/query/data.xml",  param, true);
  }

  weblet.productnumber_ready = function(w)
  {
    var d = this.obj.inputs.productnumber;
    
    this.obj.productid = '';
    this.obj.productnumber = '';

    if ( this.obj.rtimeids['productname'] ) this.obj.tables.time.setData(this.obj.rownum, this.obj.rtimeids['productname'], '' );

    d.setSelectvalues(w.values, [2], 0 );
    if ( w.values.length > 0 )
    {
      this.setModify(d,"modifywarning");
      if ( w.values.length == 1 )
      {
        this.obj.productid = w.values[0][1];
        this.obj.productnumber = w.values[0][0];

        if ( this.obj.rtimeids['productname'] ) this.obj.tables.time.setData(this.obj.rownum, this.obj.rtimeids['productname'], w.values[0][1] );
        this.setModify(d,"modifyok");

        if ( this.inputlist != null ) this.inputlist.popup.hidden();
        if ( this.win.mne_config.dayreportautotab.substr(0,1) != "f" ) this.firetab(this.obj.tables.time.getDatafield(this.obj.rownum, this.obj.rtimeids['productnumber']));
      }
      else
      {
        this.setModify(d,"modifywarning");
      }
    }
    else
    {
      this.setModify(this.obj.inputs.productnumber,"modifywrong");
    }
    
    delete this.obj.timeoutid_productnumber;
  }

  weblet.obj.timeout_productnumber = function()
  {
    var w = new MneAjaxData(this.win);

    var ordernumber = this.obj.tables.time.getData(this.obj.rownum, this.obj.rtimeids['ordernumber'], false);
    var productnumber = this.obj.tables.time.getData(this.obj.rownum, this.obj.rtimeids['productnumber'], false);
    
    if ( productnumber == '' ) return;

    var param =
    {
        schema : this.initpar.orderproducttimeschema,
        query  : this.initpar.orderproducttimequery,
        cols   : "productnumber,productname",

        "ordernumberInput.old"       : ordernumber,
        "productnumberInput.old" : productnumber + '%',
        "productnumberOp.old"    : 'like',
        
        distinct : 1,
        sqlend : 1
    };

    if ( typeof this.obj.timeoutid_productnumber == 'undefined' )
      return;

    
    w.loadReadyWeblet = this;
    w.loadReady = function()
    {
      if ( this.req.readyState == 4 )
      {
        this.mk_result(this.check_status());
        this.loadReadyWeblet.productnumber_ready.call(this.loadReadyWeblet, this);
      }
    }
    w.load("/db/utils/query/data.xml",  param, true);
  }

  
  weblet.onbtnclick = function(typ, button)
  {
    var i;

    if ( button.weblet.oid == 'selectday')
    {
      if ( typ != 'cancel' )
      {
        this.obj.date.setTime(button.weblet.act_values.date * 1000);
        this.showValue();
        this.setDepends("showValue");
      }
      return;
    }
    
    if ( typ != 'ok' ) return;
    
    var element = (new String(this.inputlist.obj)).split(',')[0];
    var obj = this.obj.tables.time.getDatafield(this.obj.rownum, this.obj.rtimeids[element]).sendtab = true;
  }
  
  weblet.firetab = function(ele)
  {
    var evt = new KeyboardEvent("keydown", {ctrlKey : true, keyCode : 9, cancelable : true });
    this.win.mneDocevents.fireEvent(ele, evt);
  }

}
