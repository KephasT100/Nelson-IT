// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/time/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      schema   : 'mne_personnal',
      query    : 'time',
      table    : 'time',
      querymax : 'timemax',

      slotstartschema : 'mne_personnal',
      slotstarttable  : 'timemanagement_param',
      
      persondataschema : 'mne_personnal',
      persondataquery  : 'personowndatapublic',
      
      funcschema  : 'mne_personnal',
      okfunction  : "time_mod",
      delfunction : "time_del",
      
      orderschema : 'mne_crm',
      orderquery  : 'order_detail',

      orderproducttimeschema : 'mne_personnal',
      orderproducttimequery  : 'orderproducttime_skill',
      orderproducttimecheckquery  : 'orderproducttime'
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  
  weblet.obj.mkbuttons.push( { id : 'okadd', value : weblet.txtGetText("#mne_lang#Ok/Hinzufügen"), before : 'ok' });
  weblet.obj.mkbuttons.push( { id : 'next', value : weblet.txtGetText("#mne_lang#Neuer Schritt#") });

  var attr = 
  {
      hinput                  : false,
      useridInput             : { notclear : true },
      orderproducttimeidInput : { notclear : true, checktype : weblet.inChecktype.notempty, inputcheckobject : "stepdescription" },
      orderidInput            : { notclear : true },
      ordernumberInput        : { notclear : true, checktype : weblet.inChecktype.notempty, onkeyup : function(evt) { try { this.weblet.onkeyup(this,evt) } catch(e) { this.weblet.exception("Ordernumber", e) } } },
      nameOutput              : { notclear : true },
      refnameOutput           : { notclear : true },
      productnameOutput       : { notclear : true },
      productnumberInput      : { notclear : true, onkeyup : function(evt) { try { this.weblet.onkeyup(this, evt) } catch(e) { this.weblet.exception("Produktnumber", e) } } },
      stepdescriptionOutput   : { notclear : true },
      orderdescriptionOutput  : { notclear : true },
      dateInput               : { inputtyp : 'date', notclear : true, checktype : weblet.inChecktype.notempty },
      clocktimeInput          : { inputtyp : 'time', onkeydown : function() { this.weblet.obj.inputs.clocktimeend.value = '' }},
      clocktimeendInput       : { inputtyp : 'time', onkeydown : function() { this.weblet.obj.inputs.duration.value = '' } },
      durationInput           : { inputtyp : 'time', onkeydown : function() { this.weblet.obj.inputs.clocktimeend.value = '' }},
      commentInput            : { spellcheck : false },
      daytextOutput           : { outputtyp : 'day', notclear : true }

  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("timeid");
  
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Zeiteintrag hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Zeiteintrag bearbeiten");
       
  weblet.obj.ajaxread = new MneAjaxData(weblet.win);
  
  weblet.obj.slotstart = 0;
  var param =
  {
      "schema" : weblet.initpar.slotstartschema,
      "table"  : weblet.initpar.slotstarttable,
      "cols"   : "slotstart",
      "sqlend" : 1
  };
  
  weblet.obj.ajaxread.read("/db/utils/table/data.xml",  param)
  if ( weblet.obj.ajaxread.values.length > 0 )
    weblet.obj.slotstart = weblet.obj.ajaxread.values[0][0];

  param =
  {
      "schema" : weblet.initpar.persondataschema,
      "query"  : weblet.initpar.persondataquery,
      "cols"   : "personid,fullname,loginname",
      "loginnameInput.old" : "session_user",
      "sqlend" : 1
  };
  
  weblet.obj.ajaxread.read("/db/utils/query/data.xml",  param)
  if ( weblet.obj.ajaxread.values.length > 0 )
  {
    weblet.showInput(weblet.obj.inputs.userid, weblet.obj.ajaxread.values[0][0]);
    weblet.showOutput(weblet.obj.outputs.name, weblet.obj.ajaxread.values[0][1])
    weblet.showInput(weblet.obj.inputs.loginname, weblet.obj.ajaxread.values[0][2]);
    weblet.act_values.loginname =  weblet.obj.ajaxread.values[0][2];
  }
  
  weblet.showValue = function(weblet)
  {
   
    this.obj.inputs.clocktimeend.disabled = false;
	if ( weblet == null || typeof weblet.act_values.timeid == 'undefined' || weblet.act_values.timeid == '################')
	{
		this.add();
		if ( weblet != null )
		{
		  if ( typeof weblet.act_values.orderproducttimeid != 'undefined' )
		    {
            this.showInput(this.obj.inputs.orderproducttimeid, weblet.act_values.orderproducttimeid);
            this.showInput(this.obj.inputs.ordernumber, weblet.act_values.ordernumber);
            this.showInput(this.obj.inputs.productnumber, weblet.act_values.productnumber);

            this.showOutput(this.obj.outputs.orderdescription, weblet.act_values.orderdescription);
            this.showOutput(this.obj.outputs.stepdescription, weblet.act_values.stepdescription);
            this.showOutput(this.obj.outputs.productname, weblet.act_values.productname);
            this.showOutput(this.obj.outputs.refname, weblet.act_values.refname);
		    }
		}  
	}
	else
	{
        MneAjaxWeblet.prototype.showValue.call(this,weblet);
        this.obj.act_timeid = weblet.act_values.timeid;
        if ( this.act_values.duration > 86400 ) this.obj.inputs.clocktimeend.disabled = true;
        if ( weblet.win.mne_config.timeauto.substr(0,1) != "t" )
        {
          this.showOutput(this.obj.labels.interval, "");
          this.showOutput(this.obj.outputs.interval, "");
        }

	}
    
    if ( typeof this.act_values.ordernumber == 'undefined' )
      this.act_values.ordernumber = '';
    
    if ( typeof this.obj.timeoutid != 'undefined')
    {
  	  window.clearTimeout(this.obj.timeoutid);
      this.showOutput(this.obj.labels.interval, "noauto");
      delete this.obj.timeoutid;
    }

    var param =
    {
        "schema" : this.initpar.schema,
        "query"  : this.initpar.querymax,
        "cols"   : "start,startday,starttime,userid",
        "loginnameInput.old" : this.act_values.loginname,
        "sqlend" : 1
    };
    
    this.obj.ajaxread.read("/db/utils/query/data.xml",  param)
    
    if ( this.obj.ajaxread.values.length > 0 )
        this.act_values.lasttime = Number(this.obj.ajaxread.values[0][0]) - 200000;
    else
        this.act_values.lasttime = 0;
        
    if ( weblet == null  && this.win.mne_config.timeauto.substr(0,1) == "t" )
    {
      if ( this.obj.ajaxread.values.length > 0 )
      {
        var day   = this.obj.ajaxread.values[0][1];
        var start = this.obj.ajaxread.values[0][2];
        var param =
        {
            "schema" : this.initpar.schema,
            "query"  : this.initpar.query,
            "cols"   : "timeid",
            "useridInput.old" : this.obj.ajaxread.values[0][3],
            "startInput.old" : this.obj.ajaxread.values[0][0],
            "sqlend" : 1
        };
        
        this.obj.ajaxread.read( "/db/utils/query/data.xml",  param)
        if ( this.obj.ajaxread.values.length > 0 )
        {
          this.act_values.timeid = this.obj.ajaxread.values[0][0];
          MneAjaxWeblet.prototype.showValue.call(this,this);
          if ( this.act_values.duration > 86400 ) this.obj.inputs.clocktimeend.disabled = true;
          if ( this.act_values.interval < 43300 )
          {
            var self = this;
            var timeout = function() { try { self.obj.timeout.call(self) } catch(e) {}; };
            var d = new Date();
            if ( typeof this.obj.timeoutid == 'undefined')
            {
              this.obj.timeoutid = window.setTimeout(timeout, 1100 - ( d.getTime() % 1000 ));
              this.showOutput(this.obj.labels.interval, "auto");
            }
          }
          else
          {
            var interval = this.act_values.interval;
            this.showOutput(this.obj.outputs.interval, interval, "interval", true);
            this.showOutput(this.obj.labels.interval, "noauto");
          }
        }
      }
    }
  }    
  
  weblet.checkmodified = function()
  {
    return false;
  }

  weblet.add = function(setdepend)
  {
    var param =
    {
        "schema" : this.initpar.schema,
        "query"  : this.initpar.querymax,
        "cols"   : "start,startday,starttime,daytext,userid,duration",
        "loginnameInput.old" : "session_user",
        "sqlend" : 1
    };
    
    this.obj.ajaxread.read("/db/utils/query/data.xml",  param)
    
    if ( this.obj.ajaxread.values.length > 0 )
        this.act_values.lasttime = Number(this.obj.ajaxread.values[0][0]) - 200000;
    
    this.obj.inputs.clocktimeend.disabled = false;
	  MneAjaxWeblet.prototype.add.call(this,false);

    if ( this.obj.intimeout != true )
    	this.obj.act_timeid = this.act_values.timeid;
    this.obj.intimeout = false;
    
    if ( typeof this.obj.timeoutid != 'undefined')
    {
  	  window.clearTimeout(this.obj.timeoutid);
      this.showOutput(this.obj.labels.interval, "noauto");
      delete this.obj.timeoutid;
    }

    var d = new Date();

    var nexttime = Number(this.obj.inputs.clocktime.mne_timevalue) + Number(this.obj.inputs.duration.mne_timevalue);
    var actdate = ( d.getTime() / 1000 ) - (( d.getTime() / 1000 ) % 86400) + ( d.getTimezoneOffset() * 60);
    
    if ( this.obj.inputs.date.value == '' )
    {
      if ( this.obj.ajaxread.values.length > 0 )
      {
        this.showInput(this.obj.inputs.date, Number(this.obj.ajaxread.values[0][1]), '1001', true);
        this.showInput(this.obj.inputs.clocktime, Number(this.obj.ajaxread.values[0][2]) + Number(this.obj.ajaxread.values[0][5]), 'interval', true);
        this.showInput(this.obj.inputs.clocktimeend, Number(this.obj.ajaxread.values[0][2]) + Number(this.obj.ajaxread.values[0][5]), 'interval', true);
        this.showInput(this.obj.inputs.duration, 0, 'interval', true);
        this.showOutput(this.obj.outputs.daytext, this.obj.ajaxread.values[0][3], 'day', true);
      }
      else
      {
        this.showInput(this.obj.inputs.date, actdate, '1001', true);
        this.showInput(this.obj.inputs.clocktime, this.obj.slotstart, 'interval', true);
        this.showInput(this.obj.inputs.clocktimeend, this.obj.slotstart, 'interval', true);
        this.showInput(this.obj.inputs.duration, 0, 'interval', true);
        this.showOutput(this.obj.outputs.daytext, d.getDay() + 1, 'day', true);
      }
    }
    else
    {
      if ( this.obj.ajaxread.values.length > 0 && Number(this.obj.ajaxread.values[0][1] ) == this.obj.inputs.date.mne_timevalue )
        nexttime = Number(this.obj.ajaxread.values[0][2] ) + Number(this.obj.ajaxread.values[0][5] )

      this.obj.inputs.date.onkeyup();
      this.showInput(this.obj.inputs.clocktime, nexttime, 'interval', true);
      this.showInput(this.obj.inputs.clocktimeend, nexttime, 'interval', true);
      this.showInput(this.obj.inputs.duration, 0, 'interval', true);

      var param =
      {
          "schema" : weblet.initpar.schema,
          "query"  : weblet.initpar.query,
          "cols"   : "start",
          wcol     : "loginname,start,start",
          wval     : "session_user," + ( Number(this.obj.inputs.date.mne_timevalue) + nexttime) + "," + ( Number(this.obj.inputs.date.mne_timevalue) + 86400 ),
          wop      : "=,>=,<=",
          scols    : "start",
          "sqlend" : 1
      };
      
      weblet.obj.ajaxread.read("/db/utils/query/data.xml",  param)
      if ( weblet.obj.ajaxread.values.length > 0 )
      {
        this.showInput(this.obj.inputs.clocktimeend, Number(weblet.obj.ajaxread.values[0][0]) - Number(this.obj.inputs.date.mne_timevalue), 'interval', true);
        this.showInput(this.obj.inputs.duration, Number(weblet.obj.ajaxread.values[0][0]) - Number(this.obj.inputs.date.mne_timevalue) - Number(this.obj.inputs.clocktime.mne_timevalue), 'interval', true);
      }

    }
    
    this.setDepends('add');
    return false;
  }
  
  weblet.cancel = function()
  {
	 this.act_values.timeid = this.obj.act_timeid;
	 this.showValue(this);
	 if ( this.okaction == "add" )
	 {
		 this.obj.timeoutid_productnumber = "add";
		 this.obj.timeout_productnumber.call(this,true);
		 
		 if ( this.obj.inputs.productnumber.className.indexOf('modifywrong') >= 0 )
			 {
			 this.obj.timeoutid_ordernumber = "add";
			 this.obj.timeout_ordernumber.call(this,true);
			 }
	 }
	 return false;
  }
  
  weblet.write = function()
  {
  	this.obj.inputs.start.value = Number(this.obj.inputs.date.mne_timevalue) + Number(this.obj.inputs.clocktime.mne_timevalue);
  	if ( this.obj.inputs.start.value == "NaN")
  	{
  		this.error("#mne_lang#Bitte die Zeiteingaben überprüfen");
  		return true;
  	}

  	if ( this.obj.inputs.clocktimeend.disable != true && this.obj.inputs.clocktimeend.value != '' )
  	{
  		var duration = Number(this.obj.inputs.clocktimeend.mne_timevalue) - Number(this.obj.inputs.clocktime.mne_timevalue);
  		if ( duration < 0 ) duration = duration + 86400;
  		this.showInput(this.obj.inputs.duration,  duration, 'interval', true);
  	}
    
    var p =
    {
        schema : this.initpar.funcschema,
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
    p = this.addParam(p, "par2", this.obj.inputs.userid);
    p = this.addParam(p, "par3", this.obj.inputs.start);
    p = this.addParam(p, "par4", this.obj.inputs.duration);
    p = this.addParam(p, "par5", this.obj.inputs.comment);
    
    return MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p);
  }
  
  weblet.ok = function()
  {
    if ( this.write() == 'ok' )
    {
      this.act_values.timeid = this.act_values.result;
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    
    return true;
  }
  
  weblet.okadd = function()
  {
    if ( this.write() == 'ok' )
    {
      this.add();
      return false;
    }
    
    return true;
  }
  
  weblet.del = function()
  {
    var p =
    {
        schema : this.initpar.funcschema,
        name : this.initpar.delfunction,
        typ0 : "text",
        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.act_values.timeid);
    
    if ( this.confirm(this.txtSprintf(this.txtGetText("#mne_lang#Eintrag <$1> wirklich löschen"), this.obj.inputs.date.value + " - " + this.obj.inputs.clocktime.value + " / " + this.obj.inputs.duration.value)) != true )
      return false;

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.showValue(null);
      this.setDepends("del");
      return false;
    }
    return true;
  }
  
  weblet.next = function()
  {
    this.add();
    
    var nexttime = Number(this.obj.inputs.clocktime.mne_timevalue) + Number(this.obj.inputs.duration.mne_timevalue);
    this.showInput(this.obj.inputs.clocktime, nexttime, 'interval', true);
    var interval = Number((new Date).getTime() / 1000) - Number(this.obj.inputs.date.mne_timevalue) - Number(this.obj.inputs.clocktime.mne_timevalue);
    this.showInput(this.obj.inputs.duration, Number(interval / 3600, 10) * 3600, "interval", true);
  }
  
  weblet.actday = function()
  {
    var d = new Date();
    var actdate = ( d.getTime() / 1000 ) - (( d.getTime() / 1000 ) % 86400) + ( d.getTimezoneOffset() * 60);
    this.showInput(this.obj.inputs.date, actdate, 'date', true);
    this.showInput(this.obj.inputs.clocktime, this.obj.slotstart, 'interval', true);
    this.showInput(this.obj.inputs.clocktimeend, this.obj.slotstart, 'interval', true);
    this.showInput(this.obj.inputs.duration, 0, 'interval', true);
    this.showOutput(this.obj.outputs.daytext, d.getDay() + 1, 'day', true);
    return this.add();
  }
  
  weblet.onbtnclick = function(id, button)
  {
    if ( button.weblet.oid == 'selectday' )
    {
      if ( ( this.obj.inputs.clocktime.className.indexOf("modifyok") == -1 ||
           this.obj.inputs.date.mne_timevalue != this.act_values.date ) && 
           this.okaction == 'add')
      {
        this.showInput(this.obj.inputs.clocktime, this.obj.slotstart, 'interval', true);
        this.showInput(this.obj.inputs.clocktimeend, this.obj.slotstart, 'interval', true);
        this.showInput(this.obj.inputs.duration, 0, 'interval', true);
      }
      this.setDepends('selectday');
    }
    else if ( button.weblet.oid == this.oid + 'inputlistordernumber' )
    {
      this.obj.timeoutid_ordernumber = "onbtnclick";
      this.obj.timeout_ordernumber.call(this,true);
    }
    else if ( button.weblet.oid == this.oid + 'inputlistproductnumber' )
    {
      this.obj.timeoutid_productnumber = "onbtnclick";
      this.obj.timeout_productnumber.call(this,true);
    }
    else if ( button.weblet.oid == this.oid + 'inputliststepdescription' )
    {
      this.setModify(this.obj.labels.stepdescription,"modifyno");
    }
  }
  
  weblet.onkeyup = function(obj, evt)
  {
    if ( typeof evt == 'undefined' || evt == null )
    {
      MneMisc.prototype.inOnmodify.call(obj);
      return;
    }

    if ( obj.id == 'ordernumberInput' )
    {
       var self = this;
       var timeout = function() { try { self.obj.timeout_ordernumber.call(self) } catch(e) {}; };
       if ( this.obj.timeoutid_ordernumber != 'undefined' )
         window.clearTimeout(this.obj.timeoutid_ordernumber);
       this.obj.timeoutid_ordernumber = window.setTimeout(timeout, 500 );
    }
    else if ( obj.id == 'productnumberInput' )
    {
       var self = this;
       var timeout = function() { try { self.obj.timeout_productnumber.call(self) } catch(e) {}; };
       if ( this.obj.timeoutid_productnumber != 'undefined' )
         window.clearTimeout(this.obj.timeoutid_productnumber);
       this.obj.timeoutid_productnumber = window.setTimeout(timeout, 500 );
    }
  }
  
  weblet.obj.timeout = function()
  {
    var d = new Date();
    var interval = Number(d.getTime() / 1000) - Number(this.obj.inputs.date.mne_timevalue) - Number(this.obj.inputs.clocktime.mne_timevalue);
    this.showOutput(this.obj.outputs.interval, interval - Number(this.act_values.duration,10), "interval", true);

    if ( interval > Number(this.act_values.duration,10) + 3600 )
    {
      if ( this.confirm("#mne_lang#Soll die Zeit auf den aktuellen Projektschritt erfasst werden ?"))
      {
        this.showInput(this.obj.inputs.duration, Number(interval / 3600, 10) * 3600, "interval", true);
        this.obj.inputs.clocktimeend.value = '';
        var timeid = this.act_values.timeid;
        this.ok(false);
        this.act_values.timeid = this.act_values.result;
        this.showValue(this);
      }
    }

    {
      var self = this;
      var timeout = function() { try { self.obj.timeout.call(self) } catch(e) {}; };
      this.obj.timeoutid = window.setTimeout(timeout, 601000 - ( (new Date()).getTime() % 600000 ));
      this.showOutput(this.obj.labels.interval, "auto");
    }
  }
  
  weblet.obj.timeout_ordernumber = function(noadd)
  {
    var w = new MneAjaxData(this.win);
    var param =
    {
        "schema" : this.initpar.orderschema,
        "query"  : this.initpar.orderquery,
        "cols"   : "orderid,refname,description",
        "ordernumberInput.old" : this.obj.inputs.ordernumber.value,
        "closedInput.old" : "false",
        "openInput.old" : "true",
        "sqlend" : 1
    };

    if ( typeof this.obj.timeoutid_ordernumber == 'undefined' )
      return;

    delete this.obj.timeoutid_ordernumber;

    this.obj.intimeout = true;
    if ( noadd != true )
      this.add();
    this.obj.intimeout = false;

    w.read("/db/utils/query/data.xml",  param);

    if ( w.values.length > 0 )
    {
      this.showInput(this.obj.inputs.orderid, w.values[0][0], null, true);
      this.showOutput(this.obj.outputs.refname, w.values[0][1]);
      this.showOutput(this.obj.outputs.orderdescription, w.values[0][2]);
      this.act_values.ordernumber = this.obj.inputs.ordernumber.value;
      this.setModify(this.obj.inputs.ordernumber,"modifyok");
    }
    else
    {
      this.showOutput(this.obj.outputs.refname, "");
      this.showOutput(this.obj.outputs.orderdescription, "");
      this.setModify(this.obj.inputs.ordernumber,"modifywrong");
    }

    this.showInput(this.obj.inputs.orderproducttimeid, "", null, true);
    this.showInput(this.obj.inputs.productnumber, "", null, true);
    this.showOutput(this.obj.outputs.productname, "");
    this.showOutput(this.obj.outputs.stepdescription, "");
  }
  
  weblet.obj.timeout_productnumber = function(noadd)
  {
    var w = new MneAjaxData(this.win);
    var param =
    {
        "schema" : this.initpar.orderproducttimeschema,
        "query"  : this.initpar.orderproducttimequery,
        "cols"   : "productname,orderproducttimeid,stepdescription",
        "orderidInput.old" : this.obj.inputs.orderid.value,
        "productnumberInput.old" : this.obj.inputs.productnumber.value,
        "loginInput.old" : "session_user",
        "sqlend" : 1
    };
    
    if ( typeof this.obj.timeoutid_productnumber == 'undefined' )
      return;
    delete this.obj.timeoutid_productnumber;

    if ( this.obj.inputs.productnumber.value == '' )
      return;
    
    this.obj.intimeout = true;
    if ( noadd != true )
      this.add();
    this.obj.intimeout = false;

    w.read("/db/utils/query/data.xml",  param);

    if ( w.values.length > 0 )
    {
      this.showOutput(this.obj.outputs.productname, w.values[0][0]);
      this.showOutput(this.obj.outputs.stepdescription, "");
      
      this.showInput(this.obj.inputs.orderproducttimeid, "", null, true);
      this.setModify(this.obj.inputs.productnumber,"modifyok");
      if ( w.values.length == 1 )
      {
        this.showInput(this.obj.inputs.orderproducttimeid, w.values[0][1], null, true);
        this.showOutput(this.obj.outputs.stepdescription, w.values[0][2]);
      }
      else
      {
        this.showInput(this.obj.inputs.orderproducttimeid, '', null, true);
        this.showOutput(this.obj.outputs.stepdescription, '');
      }
    }
    else
    {
      param =
      {
          "schema" : this.initpar.orderproducttimeschema,
          "query"  : this.initpar.orderproducttimecheckquery,
          "cols"   : "productnumber,productname",
          "orderidInput.old" : this.obj.inputs.orderid.value,
          "productnumberInput.old" : this.obj.inputs.productnumber.value,
          "sqlend" : 1
      };
      
      w.read("/db/utils/query/data.xml",  param);

      if ( w.values.length == 0 )
      {
        this.setModify(this.obj.inputs.productnumber,"modifywrong");
      }
      else
      {
        this.showOutput(this.obj.outputs.productname, w.values[0][1]);
        this.showOutput(this.obj.outputs.stepdescription, "");
        
        this.showInput(this.obj.inputs.orderproducttimeid, "", null, true);
        this.setModify(this.obj.inputs.productnumber,"modifyok");
      }
    }
  }
}
