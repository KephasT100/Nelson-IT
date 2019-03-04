// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/timemanagement/person/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema      : 'mne_personnal',
    query       : 'persontimemanagement',
    table       : 'timemanagement',
    timetyplist : 'timetyp',
    startlist   : 'timemanagementslot',
    pweblet     : 'person',
    oweblet     : 'project',
    
    okschema    : 'mne_personnal',
    okfunction  : 'timemanagement_mod',
    
    delschema   : 'mne_personnal',
    delfunction : 'timemanagement_del',

    cleanschema    : 'mne_personnal',
    cleanfunction  : 'timemanagement_cleanup'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();
  
  weblet.obj.mkbuttons.push( { id : "all", value : weblet.txtGetText("#mne_lang#alle Personen#"), space : "before" } );
  weblet.obj.mkbuttons.push( { id : "cleanup", value : weblet.txtGetText("#mne_lang#Bereinigen#"), space : "before" } );

  var attr = 
  {
      hinput                    : false,
      startdayInput             : { inputtyp : 'date', notclear : true, checktype : weblet.inChecktype.notempty },
      starttimeInput            : { selectlist : weblet.initpar.startlist },
      durationInput             : { inputtyp : 'time', checktype : weblet.inChecktype.notempty },
      timetypInput              : { selectlist : weblet.initpar.timetyplist },
      productnameOutput         : { notclear : true },
      orderproducttimeidInput   : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("timemanagementid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Zeitplanung hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Zeitplanung bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    
    if ( weblet == null )
    {
      this.add();
      this.obj.inputs.orderproducttimeid.value = this.act_values.orderproducttimeid = '';
      this.act_values.skillid = '%';
      this.showOutput(this.obj.outputs.productname, '', this.typs[this.ids['productname']])
      this.showOutput(this.obj.outputs.skilltext, '', this.typs[this.ids['skilltext']])
      return true;
    }
    
    if ( typeof weblet.act_values.timemanagementid == 'undefined' || weblet.act_values.timemanagementid == null || weblet.act_values.timemanagementid == '' )
    {
      this.add();
      this.obj.inputs.orderproducttimeid.value = this.act_values.orderproducttimeid = weblet.act_values.orderproducttimeid;
      this.act_values.skillid = weblet.act_values.skillid;

      this.showInput (this.obj.inputs.duration, weblet.act_values.timeneeded, this.typs[this.ids['duration']], true);
      this.showOutput(this.obj.outputs.productname, weblet.act_values.productname, this.typs[this.ids['productname']])
      this.showOutput(this.obj.outputs.skilltext, weblet.act_values.skilltext, this.typs[this.ids['skilltext']])

      return true;
    }
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
  weblet.checkmodified = function()
  {
    return false;
  }
  
  weblet.cancel = function()
  {
    MneAjaxWeblet.prototype.cancel.call(this);
    this.obj.inputs.orderproducttimeid.value = this.act_values.orderproducttimeid = '';
    this.act_values.skillid = '%';
    this.showOutput(this.obj.outputs.productname, '', this.typs[this.ids['productname']])
    this.showOutput(this.obj.outputs.skilltext, '', this.typs[this.ids['skilltext']])
    this.showOutput(this.obj.outputs.fullname, '', this.typs[this.ids['fullname']])
    return true;
   }
  
  weblet.ok = function()
  {
    this.obj.inputs.start.value = parseInt(this.obj.inputs.startday.mne_timevalue) + parseInt(this.obj.inputs.starttime.value);

    if ( this.obj.inputs.orderproducttimeid.value == '' && this.obj.inputs.timetyp.value == '0' )
    {
      alert("#mne_lang#Bitte Arbeitsschritt auswählen");
      return;
    }
    
    var p =
    {
        schema : this.initpar.okschema,
        name : this.initpar.okfunction,
        typ0 : "text",
        typ1 : "long",
        typ2 : "text",
        typ3 : "long",
        typ4 : "long",
        typ5 : "text",
        typ6 : "text",
        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.timemanagementid);
    p = this.addParam(p, "par1", this.obj.inputs.timetyp);
    p = this.addParam(p, "par2", this.obj.inputs.personid);
    p = this.addParam(p, "par3", this.obj.inputs.start);
    p = this.addParam(p, "par4", this.obj.inputs.duration);
    p = this.addParam(p, "par5", this.obj.inputs.timetyp.value == 0 ? this.obj.inputs.orderproducttimeid : '');
    p = this.addParam(p, "par6", this.obj.inputs.note);
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.act_values.timemanagementid = this.act_values.result;
      this.showValue(this);
      this.parent.weblets[this.initpar.pweblet].showValue({act_values : { personid : this.obj.inputs.personid.value }});
      this.parent.weblets[this.initpar.oweblet].showValue({act_values : { orderid  : this.obj.inputs.orderid.value }});
      return false;
    }
    this.parent.weblets[this.initpar.pweblet].showValue({act_values : { personid : this.obj.inputs.personid.value }});
    this.parent.weblets[this.initpar.oweblet].showValue({act_values : { orderid  : this.obj.inputs.orderid.value }});
    return true;
  }
  
  weblet.del = function()
  {
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
      return false;

    var personid = this.obj.inputs.personid.value;
    var orderid = this.obj.inputs.orderid.value;
    var p =
    {
        schema : this.initpar.delschema,
        name : this.initpar.delfunction,
        typ0 : "text",
        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.timemanagementid);
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.parent.weblets[this.initpar.pweblet].showValue({act_values : { personid : personid }});
      this.parent.weblets[this.initpar.oweblet].showValue({act_values : { orderid  : orderid }});
    }

    return false;
  }
  
  weblet.showall = function()
  {
    this.parent.weblets[this.initpar.pweblet].setSkill({ act_values : { skillid : "%" }});
    return false;
  }
  
  weblet.cleanup = function()
  {
    var p =
    {
        schema : this.initpar.cleanschema,
        name : this.initpar.cleanfunction,
        sqlend : 1   
    }
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.parent.weblets[this.initpar.pweblet].showValue(null);
      this.parent.weblets[this.initpar.oweblet].showValue(null);
      return false;
    }
    this.parent.weblets[this.initpar.pweblet].showValue(null);
    this.parent.weblets[this.initpar.oweblet].showValue(null);
    return true;
  }

  weblet.setPerson = function(weblet)
  {
    this.showInput(this.obj.inputs.personid, weblet.act_values.personid, this.typs[this.ids['personid']], true);
    if ( typeof weblet.act_values.fullname != 'undefined' )
      this.showOutput(this.obj.outputs.fullname, weblet.act_values.fullname );
    else
      this.showOutput(this.obj.outputs.fullname, weblet.act_values.firstname + " " + weblet.act_values.lastname);
    
  }
  
  weblet.setTime = function(startdate, starttime, duration)
  {
    this.showInput(this.obj.inputs.startday, startdate, this.typs[this.ids['startday']], true);
    this.showInput(this.obj.inputs.starttime, starttime, this.typs[this.ids['starttime']], true);
    this.showInput(this.obj.inputs.duration, duration,this.typs[this.ids['duration']], true);
  }
  
  weblet.setOrderproduct = function(weblet)
  {
    this.showInput(this.obj.inputs.timetyp, 0, this.typs[this.ids['timetyp']], true);
    this.showInput(this.obj.inputs.orderproducttimeid, weblet.act_values.orderproducttimeid, this.typs[this.ids['orderproducttimeid']], true);
    this.showOutput(this.obj.outputs.productname, weblet.act_values.productname);
    this.showOutput(this.obj.outputs.skilltext, weblet.act_values.skilltext);
    
    if ( this.act_values.skillid != weblet.act_values.skillid )
    {
      this.showInput(this.obj.inputs.personid, '', this.typs[this.ids['personid']], true);
      this.showOutput(this.obj.outputs.fullname, '');
      this.act_values.skillid = weblet.act_values.skillid;
    }
    
    this.parent.weblets[this.initpar.pweblet].setSkill(this);
  }
}
