// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/company/contact/assoziate
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema : 'mne_crm',
     query : 'company_contact',
      table : 'companyperson',
   
    ownperson : 'fullnameedit'
  };


  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      companyidInput  : { notclear : true },
      personidInput   : { checktype : 'keyvalue' , inputcheckobject : 'fullname' }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array('companypersonid');
  weblet.titleString.add = weblet.txtGetText("#mne_lang#assoziierten Kontakt hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#assoziierten Kontakt bearbeiten");

  weblet.showValue = function(weblet,param)
  {
    if ( typeof weblet == 'undefined' || weblet == null || typeof weblet.act_values.companypersonid == 'undefined' || weblet.act_values.companypersonid == null || weblet.act_values.companypersonid == '################' || weblet.act_values.companypersonid == '' )
    {
      this.add();
      if ( typeof weblet != 'undefined' && weblet != null )
        this.obj.inputs.companyid.value = this.act_values.companyid = weblet.act_values.companyid;

      if ( typeof this.act_values.companyid == 'undefined')
        return false;
      
      return;
    }
      return MneAjaxWeblet.prototype.showValue.call(this,weblet,param);
  }
  
  weblet.add = function(setdepend)
  {
    this.act_values.pcompanyid = '';
    return MneAjaxWeblet.prototype.add.call(this, setdepend);
  }
  
  weblet.del = function(setdepend)
  {
     return MneAjaxWeblet.prototype.del.call(this,setdepend);
  }
  
}
