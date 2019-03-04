// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/user/passwd
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_crm',
    query     : 'userpasswd',

    okschema   : 'mne_catalog',
    okfunction : 'userpasswd',  
    okpost     : '/sysexec/user/passwd/setpasswd'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("personid");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Password bearbeiten");

  weblet.delbuttons( ['add', 'del'] ); 
  
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
        this.showInput(this.obj.inputs.username, weblet.act_values.loginname, this.typs[this.ids['username']]);
      }
      else
      {
        this.showOutput(this.obj.inputs.username, "");
        this.showInput(this.obj.inputs.passwd1, "");
        this.showInput(this.obj.inputs.passwd2, "");
      }
    }
    
    if ( this.obj.inputs.username.value == '' ) this.disable();

    return retval;
  }    

  weblet.ok = function(setdepend)
  {
    if ( this.obj.inputs.username.value == '' )
    {
      this.error("#mne_lang#Die Person hat kein login");
      return;
    }

    if ( this.obj.inputs.passwd1.value != this.obj.inputs.passwd2.value )
    {
      alert("#mne_lang#Passworte sind nicht gleich");
      return true;
    }
    
    var p =
    {
        schema : this.initpar.okschema,
        name   : this.initpar.okfunction,
        par0   : this.obj.inputs.username.value,
        typ0   : "text",
        par1   : this.obj.inputs.passwd1.value,
        typ1   : "text",
        sqlend : 1   
    }
    
    return MneAjaxWeblet.prototype.func.call(this, p, 'loginname', setdepend, 'ok', 'ok');
  }
  
}