// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/person/owndata
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      schema    : 'mne_personnal',
      query     : 'personowndata',

    okschema   : 'mne_personnal',
    okfunction : 'personowndata_ok',
    okpost     : '/sysexec/user/data/ok',

    delschema   : 'mne_personnal',
    delfunction : 'personowndata_del',
    delpost     : '/sysexec/user/data/del',
      
           view : weblet.path + "/view.html",
           attr : 
           {
               currencyOutput  : { notclear : true },
               wtimeInput      : { inputtyp : 'time' },
           }
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadbase('/weblet/crm/person/owndata', weblet);
 
  weblet.ok = function (setdepend)
  {
    var p =
    {
        schema : this.initpar.okschema,
        name   : this.initpar.okfunction,

        par0   : this.getParamValue(this.obj.inputs.personowndataid),
        par1   : this.getParamValue(this.obj.inputs.personid),
        par2   : this.getParamValue(this.obj.inputs.loginname),
        par3   : this.getParamValue(this.obj.inputs.active),
        par4   : this.getParamValue(this.obj.inputs.canlogin),
        par5   : this.getParamValue(this.obj.inputs.validuntil),
        par6   : this.getParamValue(this.obj.inputs.color),
        par7   : this.getParamValue(this.obj.inputs.havedav),
        par8   : this.getParamValue(this.obj.inputs.havesmb),
        par9   : this.getParamValue(this.obj.inputs.unitcost),
        par10  : this.getParamValue(this.obj.inputs.wtime),
        par11  : this.getParamValue(this.obj.inputs.unixid),
        par12  : this.getParamValue(this.obj.inputs.unixgrp),

        typ3   : 'bool',
        typ4   : 'bool',
        typ5   : 'long',
        typ7   : 'bool',
        typ8   : 'bool',
        typ9   : 'double',
        typ10  : 'long',
        typ11  : 'long',
        typ12  : 'long',

        "loginnameInput.old" : this.act_values.loginname,
 
        sqlend : 1
    }
    var result = MneAjaxWeblet.prototype.func.call(this, p, 'personowndataid', true, null, 'ok');

    return result;
  }

}
