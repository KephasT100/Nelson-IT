{
  var i,str;
  
  var ivalues = 
  {
      stylePath : '/weblet/builddiary/time/day',
      oid       : weblet.oid,

      timeschema      : 'mne_builddiary',
      timequery       : 'time',
      timecols        : "have_bd,count_bd,present,timeid,orderproducttimeid,presentid,start,bdtimeid,orderid,ordernumber,orderdescription,productnumber,productname,stepdescription,clocktime,clocktimeend,duration,comment,bclocktime,bclocktimeend,weather,temperature",
      timeeditcols    : "ordernumber,productnumber,stepdescription,date,clocktime,duration,comment,bclocktime,bclocktimeend,weather,temperature",

      timerowstyle: 'bd,bdc,bdp',
      timerowstylecol : '0,1,2',
      
      timetablehidecols   : '0,1,2,3,4,5,6,7,8',
      timecolstyle    : ",,,,,,,,,input8,,input8,,rdonly,input4,input4,input4,,input4 bd,input4 bd,input6 rdonly bd,input2 center bd",
      timetablecoltype  : ',,,hidden,hidden,hidden,,,hidden,text,,text,,text,time,time,,text,time,time,text,text',
      
      okschema : 'mne_builddiary',
      delschema : 'mne_builddiary',
      
      styleName : 'style.css'
  };

  weblet.initDefaults(ivalues);

  weblet.loadbase('weblet/personnal/time/day', weblet, weblet.initpar.oid);
  
  weblet.ok = function()
  {

    var value, bvalue, bduration, retval;
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
    if ( typeof this.obj.inputs.duration != 'undefined' && this.obj.inputs.duration.className.indexOf("rdonly") == -1 )
      duration = parseInt(this.obj.inputs.duration.mne_timevalue);
    else
      duration = parseInt(this.obj.inputs.clocktimeend.mne_timevalue) - parseInt(this.obj.inputs.clocktime.mne_timevalue);

    if ( this.obj.inputs.bclocktime.value != '' && this.obj.inputs.bclocktimeend.value != '' && ( this.obj.inputs.presentid.value != '' || this.obj.inputs.bclocktime.wrapper.className.indexOf('modifyok') != -1 || this.obj.inputs.bclocktimeend.wrapper.className.indexOf('modifyok') != -1) )
    {
      bvalue = this.obj.daystart + parseInt(this.obj.inputs.bclocktime.mne_timevalue);
      bduration = parseInt(this.obj.inputs.bclocktimeend.mne_timevalue) - parseInt(this.obj.inputs.bclocktime.mne_timevalue);

      if (( bduration < 0 || bvalue < value || bvalue > ( value + duration) || ( bvalue + bduration ) > ( value + duration ) ) )
      {
        this.warning("#mne_lang#Zeitangaben Bautagebuch und Zeiterfassung überschneiden sich");
      }      
      
      if ( this.obj.inputs.temperature.value == '' )
        {
        this.error('#mne_lang#Bitte eine Temperatur angeben');
        return true;
        }
    }
    else
    {
      bvalue = 0;
      bduration = 0;
    }

    var p =
    {
        schema : this.initpar.okschema,
        name : this.initpar.okfunction,

        typ0 : "text",
        typ1 : "text",
        typ2 : "text",
        typ3 : "text",
        typ4 : "long",
        typ5 : "long",
        typ6 : "text",

        typ7 : 'long',
        typ8 : 'long',
        typ9 : 'text',
        typ10 : 'long',

        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.presentid);
    p = this.addParam(p, "par1", this.obj.inputs.timeid);
    p = this.addParam(p, "par2", this.obj.inputs.orderproducttimeid);
    p = this.addParam(p, "par3", this.obj.personid);
    p = this.addParam(p, "par4", value);
    p = this.addParam(p, "par5", duration);
    p = this.addParam(p, "par6", this.obj.inputs.comment);

    p = this.addParam(p, "par7", bvalue);
    p = this.addParam(p, "par8", bduration);
    p = this.addParam(p, "par9", this.obj.inputs.weather);
    p = this.addParam(p, "par10", this.obj.inputs.temperature);

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
}
