// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/table/filter/persontime
// ================================================================================
{
  var i;
  var str;
  
  var ivalues = 
  {
      needperson : false,
      starttimename : 'starttime'
  }
  
  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  
  var attr =
  {
          hinput : false,
  startdateInput : { inputtyp : 'date', onkeyup :  function(e) { var result = MneMisc.prototype.inOndate.call(this,e); if ( this.className.indexOf('modifyno') == -1 ) this.weblet.frame.monthSelect.value = -2; }, onreturn : function() { this.weblet.refresh(); } },
    enddateInput : { inputtyp : 'date', onkeyup :  function(e) { var result = MneMisc.prototype.inOndate.call(this,e); if ( this.className.indexOf('modifyno') == -1 ) this.weblet.frame.monthSelect.value = -2; }, onreturn : function() { this.weblet.refresh(); } },
     monthSelect : { weblet : weblet, onchange : function() { this.weblet.setDate(this.value); this.weblet.refresh() } }
  };
  
  if ( weblet.initpar.needperson == true )
  {
    attr.loginnameInput = { checktype : weblet.inChecktype.notempty, inputcheckobject : 'fullname' };
  }
  
  weblet.findIO(attr, weblet.frame, weblet.obj.whereframe, true);
  
  weblet.showValuefilter = weblet.showValue;
  weblet.showValue = function(weblet, param)
  {
    if ( typeof weblet != 'undefined' && weblet != null && typeof weblet.act_values.loginname != 'undefined' && weblet != this )
    {
      this.showInput("loginname", weblet.act_values.loginname);
      if ( weblet.act_values.loginname == 'session_user')
      {
      this.showOutputDefined("fullname", window.mne_config.fullname);
      }
      this.showOutputDefined("fullname", weblet.act_values.fullname);
    }
    return this.showValuefilter(weblet, param);

  }
  
  weblet.setDate = function( month )
  {
    var date = new Date();
    
    if ( month == -2 ) return;

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setDate(1);
    if ( month != - 1)
    {
      if ( month > date.getMonth() )
        date.setFullYear(date.getFullYear() - 1)
      date.setMonth(month);
    }
    
    weblet.showInput("startdate", parseInt(date.getTime() / 1000));

    if ( date.getMonth() == 11 )
    {
      date.setMonth(0);
      date.setFullYear(date.getFullYear() + 1);
    }
    else
    {
      date.setMonth(date.getMonth() + 1);
    }

    weblet.showInput("enddate", parseInt(date.getTime() / 1000) - 86400 );
  }
  
  weblet.setDate(-1);
  
  weblet.getFilter = function(p)
  {
    if ( typeof p == 'undefined' || p == null ) p = {};
    
    try 
    {
      p.wcol = this.initpar.starttimename + "," + this.initpar.starttimename;
      p.wop  = ">=,<";
      p.wval = this.getParamValue(this.obj.inputs.startdate ) + "," + Number(this.getParamValue(this.obj.inputs.enddate) + 86400);

      if ( this.initpar.needperson == true || this.obj.inputs.loginname.value != '' )
      {
        p.wcol += ",loginname";
        p.wop  += ",=";
        p.wval += "," + this.getParamValue(this.obj.inputs.loginname);
        
      }
    }
    catch (e)
    {
      p.wcol = "loginname";
      p.wop  = '=';
      p.wval = "unbekannt";
    }

    return p;
  }
  
  weblet.print = function()
  {
      var p = this.getFilter(MneAjaxWeblet.prototype.readDataParam.call(this,this));

      p.macro0 = 'fullname,' + this.eleGetRawTextContent(this.obj.outputs.fullname);
      p.macro1 = 'startdate,'+ this.txtFormat.call(this, this.getParamValue(this.obj.inputs.startdate),'date');
      p.macro2 = 'enddate,'  + this.txtFormat.call(this, this.getParamValue(this.obj.inputs.enddate),'date');
      p.macrocount = 3;

      p.schema = "";
      p.query  = "";
      p.table = "";

      return MneAjaxWeblet.prototype.print.call(this,p);
  }
  
  weblet.onbtnclicktable = weblet.onbtnclick
  weblet.onbtnclick = function(id, button)
  {
    if ( typeof this.onbtnclicktable == 'function' )
      this.onbtnclicktable(id, button);
    
    if ( id == 'ok' ) 
      this.refresh();
  }

  weblet.clearModify()
}
