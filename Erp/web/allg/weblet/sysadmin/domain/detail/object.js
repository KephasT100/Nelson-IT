// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/domain/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {

    hinput : false,
    schema    : 'mne_system',
    query     : 'domain',

    inputlist_ignore_notdefined : 1,
    
    
    domainselectlist : 'domaintyp',
    
    okschema : 'mne_system',
    okfunction : 'domain_ok',
    okpost : '/sysexec/domain/detail/enable',
    
    modifyschema : 'mne_system',
    modifyfunction : 'domain_modify',
    modifypost : '/sysexec/domain/detail/modify',
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();

  weblet.delbuttons('del,add');
  weblet.setbuttonpar('ok', 'value', weblet.txtGetText('#mne_lang#Erstellen#'));
  weblet.obj.mkbuttons.push( { id : 'modify', value : weblet.txtGetText('#mne_lang#Netzparameter übernehmen#'), after : 'ok' } );

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      typInput : { selectlist : weblet.initpar.domainselectlist, onchange : function(evt){ this.weblet.typ (this.value) } },
      adminpassword2Input : { nodatabase : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("domainid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Domain hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Domain bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Domain <$1> wirklich löschen ?");
  weblet.titleString.delid = 'domain';     
  
  weblet.defvalues = { domainid : '0000000000000000'};
  
  weblet.showValue = function(weblet, param)
  {
    MneAjaxWeblet.prototype.showValue.call(this, { act_values : {domainid : '0000000000000000'}}, { ignore_notfound : true });
    if ( this.values.length == 0 )
      this.add();
    
    this.obj.ninputs.adminpassword2.value = '';
    this.typ(this.act_values.typ)
    return true;
  }    
  
  weblet.ok = function(setdepend)
  {

    var p =
    {
      schema : this.initpar.okschema,
      name :   this.initpar.okfunction,
      
      sqlend : 1
    }
    
    p = this.addParam(p, 'par0',  this.obj.inputs.domainid);
    p = this.addParam(p, 'par1',  this.obj.inputs.domain);
    p = this.addParam(p, 'par2',  this.obj.inputs.workgroup);
    p = this.addParam(p, 'par3',  this.obj.inputs.typ);
    p = this.addParam(p, 'par4',  this.obj.inputs.description);
    p = this.addParam(p, 'par5',  this.obj.inputs.netdevice);
    p = this.addParam(p, 'par6',  this.obj.inputs.primaryaddr);
    p = this.addParam(p, 'par7',  this.obj.inputs.primaryname);
    p = this.addParam(p, 'par8',  this.obj.inputs.dnsforwarder);
    p = this.addParam(p, 'par9',  this.obj.inputs.dhcpstart);
    p = this.addParam(p, 'par10', this.obj.inputs.dhcpend);
    p = this.addParam(p, 'adminpassword');
    p = this.addParam(p, 'admin');
    
    if ( this.obj.inputs.typ.value != 'standalone' && this.obj.inputs.adminpassword.value == '' )
    {
      this.warning("#mne_lang#Bitte eine Password eingeben")
      return true;
    }
    
    if (this.obj.inputs.adminpassword.value !=  this.obj.ninputs.adminpassword2.value)
    {
      this.warning("#mne_lang#Die Passworte sind nicht gleich")
      return true;
    }

    if ( this.act_values.typ == '' )
        return MneAjaxWeblet.prototype.func.call(this, p, 'domainid', setdepend, 'ok', 'ok');
      
    if ( this.obj.inputs.typ.value == 'primary' || this.obj.inputs.typ.value == 'second' )
    {

      if ( weblet.confirm("#mne_lang#Domaindaten wirklich ändern? Alle Domaindaten ins besondere die Benutzer und deren Passwörter werden gelöscht") )
      {
        if ( weblet.confirm("#mne_lang#Wirklich alles löschen?") )
        {
        return MneAjaxWeblet.prototype.func.call(this, p, 'domainid', setdepend, 'ok', 'ok');
        }
      }
    }
    else
    {
        return MneAjaxWeblet.prototype.func.call(this, p, 'domainid', setdepend, 'ok', 'ok');
    }
  }
  
  weblet.modify = function(setdepend)
  {
    var p =
    {
      schema : this.initpar.modifyschema,
      name :   this.initpar.modifyfunction,
      
      sqlend : 1
    }
    
    p = this.addParam(p, 'par0', this.obj.inputs.domainid);
    p = this.addParam(p, 'par1', this.obj.inputs.netdevice);
    p = this.addParam(p, 'par2', this.obj.inputs.dnsforwarder);
    p = this.addParam(p, 'par3', this.obj.inputs.dhcpstart);
    p = this.addParam(p, 'par4', this.obj.inputs.dhcpend);
    
    return MneAjaxWeblet.prototype.func.call(this, p, 'domainid', setdepend, 'modify', 'modify');
  }
 
  weblet.typ = function(typ)
  {
    this.obj.enablebuttons =
    {
        admin : this.obj.inputs.admin,
        adminpassword : this.obj.inputs.adminpassword,
        netdevice : this.obj.inputs.netdevice,
        primaryname : this.obj.inputs.primaryname,
        primaryaddr : this.obj.inputs.primaryaddr
    };

    this.enable();
    switch(typ)
    {
      case 'primary' :
        this.obj.enablebuttons = { admin : this.obj.inputs.admin, primaryname : this.obj.inputs.primaryname, primaryaddr : this.obj.inputs.primaryaddr };
        break;
      case 'second' :
        this.obj.enablebuttons = {};
        break;
    }
    
    this.disable(true);
    if ( typ != this.act_values.typ ) this.setModify(this.obj.inputs.typ);
    
  }
      
}
