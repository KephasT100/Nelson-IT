// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/table/filter/timename
// ================================================================================
{
  var i;
  var str;
  
  var attr =
  {
          starttimeInput : { inputtyp : 'clocktime' },
          endtimeInput   : { inputtyp : 'clocktime' },
          startdateInput : { inputtyp : 'date' },
          enddateInput   : { inputtyp : 'date' },
          monthSelect    : {   weblet : weblet, onchange : function() { this.weblet.setDate(this.value); this.weblet.refresh(); } }
  };

  weblet.findIO(attr, weblet.frame, weblet.obj.whereframe, true);
  
  weblet.setDate = function( month )
  {
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setDate(1);
    if ( month != - 1) date.setMonth(month);
    
    weblet.showInput("startdate", date.getTime() / 1000);

    if ( date.getMonth() == 11 )
    {
      date.setMonth(0);
      date.setFullYear(date.getFullYear() + 1);
    }
    else
    {
      date.setMonth(date.getMonth() + 1);
    }

    weblet.showInput("enddate", date.getTime() / 1000);
    weblet.showInput("starttime", 0);
    weblet.showInput("endtime", 0);
  };
  
  weblet.setDate(-1);
  
  weblet.getFilter = function(pp)
  {
    var p = pp;
    if ( typeof p == 'undefined' || p == null ) p = {};
    
    p.wcol = "-starttime,-starttime";
    p.wop  = ">=,<";
    p.wval = (this.obj.inputs.starttime.mne_timevalue + this.obj.inputs.startdate.mne_timevalue) + "," + (this.obj.inputs.endtime.mne_timevalue + this.obj.inputs.enddate.mne_timevalue);

    if ( this.obj.inputs.loginname.value != '' )
    {
      p.wcol += ",loginname";
      p.wop  += ",=";
      p.wval += "," + this.obj.inputs.loginname.value;
    }
    return p;
  };

}