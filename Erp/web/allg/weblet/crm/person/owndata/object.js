// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/person/owndata
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      schema    : 'mne_crm',
      query     : 'personowndata',

    valuepre   : '/sysexec/user/data/update',
    
    okschema   : 'mne_crm',
    okfunction : 'personowndata_ok',
    okpost     : '/sysexec/user/data/ok',
      
    delschema   : 'mne_crm',
    delfunction : 'personowndata_del',
    delpost     : '/sysexec/user/data/del'
  };

  var svalues = 
  {
  };

  var attr = 
  {
      hinput : false,
      colorInput      : { inputtyp : 'color', inputcheckobject : 'color'},
      validuntilInput : { inputtyp : 'date' },
      unixtable       : { 'style.display' : 'none'   },
  }

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();
  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("personowndataid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Personendaten hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Personendaten bearbeiten");
       
  weblet.delbuttons('del,add');
  weblet.obj.domaintyp = '';
  var param =
  {
      "schema" : "mne_system",
      "query"  : "domain",
      "cols"   : "typ",
      "sqlend" : 1
  };
  
  MneAjaxData.prototype.read.call(weblet, "/db/utils/query/data.xml",  param)
  if ( weblet.values.length > 0 )
  {
    weblet.obj.domaintyp = weblet.values[0][0];
    weblet.frame.unixtable.style.display = ( weblet.obj.domaintyp != '' ) ? 'unset' : 'none';
  }

  weblet.showValue = function(weblet, param)
  {
    
    this.enable();
    var retval = MneAjaxWeblet.prototype.showValue.call(this, weblet, { ignore_notfound : true });
    if ( this.values.length == 0 )
    {
      this.add(false);
      if ( weblet != null )
      {
        this.showInput (this.obj.inputs.personid,  weblet.act_values.personid, this.typs[this.ids['personid']], false );
        this.showOutput(this.obj.outputs.fullname, weblet.act_values.fullname, this.typs[this.ids['fullname']]);
      }
      else
      {
        this.disable();
      }
    }
    
    return retval;
  }    
  
  
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
        par9   : this.getParamValue(this.obj.inputs.unixid),
        par10  : this.getParamValue(this.obj.inputs.unixgrp),

        typ3   : 'bool',
        typ4   : 'bool',
        typ5   : 'long',
        typ7   : 'bool',
        typ8   : 'bool',
        typ9   : 'long',
        typ10  : 'long',
        
        "loginnameInput.old" : this.act_values.loginname,
        
        sqlend : 1
    }
    
    var result = MneAjaxWeblet.prototype.func.call(this, p, 'personowndataid', true, null, 'ok');

    return result;
  }
}
