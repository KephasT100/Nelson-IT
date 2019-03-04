// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/person/email
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema : 'mne_crm',
    query  : 'personemail',
    table  : 'personemail'
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();

  var attr = 
  {
      hinput : false,
      personidInput : { inputcheckobject : 'fullname' } 
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("personemailid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Email hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Email bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    if ( typeof weblet.act_values.personid == 'undefined' || weblet.act_values.personid == null || weblet.act_values.personid == '################' )
    {
      alert("#mne_lang#Bitte eine Person auswählen");
      return false;
    }
        
    if ( typeof weblet.act_values.personemailid == 'undefined' || weblet.act_values.personemailid == null || weblet.act_values.personemailid == '################' )
    {
      this.add();
      
      this.showInputDefined("personid", weblet.act_values.personid);
      this.showOutputDefined("fullname", weblet.act_values.fullname);
      
      return;
    }
    
    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }    

}
