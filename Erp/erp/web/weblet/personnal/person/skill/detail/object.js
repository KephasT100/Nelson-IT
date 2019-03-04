// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/person/skill/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema     : 'mne_personnal',
    query      : 'personskill',
    table      : 'personskill',
    ratinglist : 'rating'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      ratingInput : { selectlist : weblet.initpar.ratinglist },
      personidInput : { notclear : true, inputcheckobject : 'fullname' },
      fullnameOutput : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("personskillid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Qualifikation hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Qualifikation bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    if ( typeof weblet.act_values.personskillid == 'undefined' || weblet.act_values.personskillid == null || weblet.act_values.personskillid == '################' )
    {
      this.defvalues = { personid : weblet.act_values.personid, fullname : weblet.act_values.person };
      this.add();
      return;
    }
    
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
}
