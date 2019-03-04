// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: mail/imap/mailbox
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_mail',
    query     : 'imapmailbox',
    table     : 'imapmailbox',
    
    okschema    : 'mne_mail',
    okfunction  : 'imapmailbox_ok',
    delschema   : 'mne_mail',
    delfunction : 'imapmailbox_del'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("imapmailboxid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Mailbox hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Mailbox bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
  weblet.ok = function(setdepend)
  {

    if ( this.obj.inputs.passwd.value != this.obj.inputs.passwdcheck.value )
    {
      this.error("#mne_lang#Passworte sind nicht gleich");
      return true;
    }

    var p =
    {
        schema : this.initpar.okschema,
        name : this.initpar.okfunction,
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.imapmailboxid);
    p = this.addParam(p, "par1", this.obj.inputs.server);
    p = this.addParam(p, "par2", this.obj.inputs.login);
    p = this.addParam(p, "par3", this.obj.inputs.passwd);

    return MneAjaxWeblet.prototype.func.call(this, p, 'imapmailboxid', setdepend);
  }

  weblet.del = function(setdepend)
  {

    var p =
    {
        schema : this.initpar.delschema,
        name : this.initpar.delfunction,
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.imapmailboxid);

    return MneAjaxWeblet.prototype.func.call(this, p, null, setdepend);
  }

}
