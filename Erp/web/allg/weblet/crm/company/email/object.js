// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/company/email
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_crm',
    query     : 'companyemail',
    table     : 'companyemail'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      companyidInput : { inputcheckobject : 'company' } 
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("companyemailid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Email hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Email bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    if ( typeof weblet.act_values.companyid == 'undefined' || weblet.act_values.companyid == null || weblet.act_values.companyid == '################' )
    {
      alert("#mne_lang#Bitte eine Firma auswählen");
      return false;
    }
        
    if ( typeof weblet.act_values.companyemailid == 'undefined' || weblet.act_values.companyemailid == null || weblet.act_values.companyemailid == '################' )
    {
      this.add();
      
      this.showInputDefined("companyid", weblet.act_values.companyid);
      this.showOutputDefined("company", weblet.act_values.company);
      
      return;
    }
    
    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }    

}
