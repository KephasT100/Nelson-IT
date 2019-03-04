// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/table/filter/ordertime
// ================================================================================
{
  var i;
  var str;
  
  var ivalues = 
  {
      needorderid   : true,
      starttimename : 'starttime',
      label : weblet.txtGetText("#mne_lang#Auftrag#") 
  }
  
  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  
  var attr =
  {
          hinput : false,
          orderidInput : { checktype : weblet.inChecktype.notempty, inputcheckobject : 'orderdescription' },
        startdateInput : { inputtyp : 'date', onkeyup :  function(e) { var result = MneMisc.prototype.inOndate.call(this,e); if ( this.className.indexOf('modifyno') == -1 ) this.weblet.frame.monthSelect.value = -2; }, onreturn : function() { this.weblet.refresh(); } },
          enddateInput : { inputtyp : 'date', onkeyup :  function(e) { var result = MneMisc.prototype.inOndate.call(this,e); if ( this.className.indexOf('modifyno') == -1 ) this.weblet.frame.monthSelect.value = -2; }, onreturn : function() { this.weblet.refresh(); } },
           monthSelect : { weblet : weblet, onchange : function() { this.weblet.setDate(this.value); this.weblet.refresh() } }
  };
  
  weblet.findIO(attr, weblet.frame, weblet.obj.whereframe, true);
  weblet.showOutput(weblet.obj.labels.orderdescription, weblet.initpar.label);
  
  if ( typeof weblet.initpar.report != 'undefined' && typeof weblet.initpar.report_single == 'undefined' ) weblet.initpar.report_single = weblet.initpar.report;
  if ( typeof weblet.initpar.report != 'undefined' && typeof weblet.initpar.report_all    == 'undefined' ) weblet.initpar.report_all    = weblet.initpar.report;
    
  weblet.setDate = function( month )
  {
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setDate(1);

    if ( month == -2 ) return;

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

  weblet.showValuefilter = weblet.showValue;
  weblet.showValue = function(weblet, param)
  {
    var p = param;
    if ( typeof p == 'undefined' || p == null ) p = {};

    if (weblet == null) return;
    if (weblet != this) this.act_values = {};

    if ( weblet != this )
    {
        this.showInputDefined("orderid", weblet.act_values.orderid, null, true);
        this.showOutputDefined("ordernumber", weblet.act_values.ordernumber);
        this.showOutputDefined("orderdescription", weblet.act_values.orderdescription);
    }
    return this.showValueBase(weblet, this.getFilter(p));
    
  }

  weblet.getFilter = function(pp)
  {

    var p = pp;
    if ( typeof p == 'undefined' || p == null ) p = {};

    try
    {
      p.wcol = this.initpar.starttimename + "," + this.initpar.starttimename;
      p.wop  = ">=,<";
      p.wval = this.getParamValue(this.obj.inputs.startdate ) + "," + Number(this.getParamValue(this.obj.inputs.enddate) + 86400);

      if ( this.initpar.needorderid == true )
      {
        if ( this.obj.inputs.orderid.value != '' )
        {
          p.wcol += ',orderid';
          p.wop  += ",=";
          p.wval += "," + this.getParamValue(this.obj.inputs.orderid );
        }
        else
        {
          p.no_vals = true;
        }
      }
      
      if ( this.obj.inputs.my.checked == true )
      {
        p.wcol += ',loginname';
        p.wop  += ',=';
        p.wval += ',session_user'
      }
    }
    catch (e)
    {
      this.exception("ordertime", e)
      p.no_vals = true;
    }
    return p;
  }

  
  weblet.print = function()
  {
      var p = this.getFilter(MneAjaxWeblet.prototype.readDataParam.call(this,this));

      p.macro0 = 'ordernumber,' + this.eleGetRawTextContent(this.obj.outputs.ordernumber);
      p.macro1 = 'orderdescription,' + this.eleGetRawTextContent(this.obj.outputs.orderdescription);
      p.macro2 = 'startdate,'+ this.txtFormat.call(this, this.getParamValue(this.obj.inputs.startdate),'date');
      p.macro3 = 'enddate,'  + this.txtFormat.call(this, this.getParamValue(this.obj.inputs.enddate),'date');
      p.macro4 = 'owntime,'  + this.obj.inputs.my.checked;

      p.schema = "";
      p.query  = "";
      p.table = "";

      if ( this.obj.inputs.my.checked == true )
        return MneAjaxWeblet.prototype.print.call(this,p, this.initpar.report_single);
      
      return MneAjaxWeblet.prototype.print.call(this,p, this.initpar.report_all);
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
