// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/dav/card/active
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    hinput    :  false,
    schema    : 'mne_crm',
    query     : 'cardsactive',
    table    : 'cardsinactive'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      selectInput : { selectlist : weblet.initpar.selectlist } 
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("id");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Carddav Konfiguration hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Carddav Konfiguration bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#<$1> wirklich löschen ?");
  weblet.titleString.delid = 'name';     
  
  weblet.defvalues["userid"] = window.mne_config.username;
  
  weblet.showValue = function(weblet)
  {
    
    this.enable();

    if ( weblet != this )
    {
      if ( weblet == null
           || (  ( typeof weblet.act_values.personid == 'undefined'  || weblet.act_values.personid == null  || weblet.act_values.personid == '################' )
              && ( typeof weblet.act_values.companyid == 'undefined' || weblet.act_values.companyid == null || weblet.act_values.companyid == '################' )) )
      {
        this.add();
        this.disable();
        return
      }
    }

    if ( weblet == this ) this.defvalues["id"] = this.obj.inputs.id.value = weblet.act_values.id;
    else if ( typeof weblet.act_values.personid != 'undefined' ) this.defvalues["id"] = this.obj.inputs.id.value = weblet.act_values.personid;
    else this.defvalues['id'] = this.obj.inputs.id.value = weblet.act_values.companyid;
    
    MneAjaxWeblet.prototype.showValue.call(this, {act_values : {id : this.defvalues['id']} }, {ignore_notfound : true});
    if ( this.values.length == 0 )
      this.add();
  }
  
  weblet.checkmodified = function()
  {
    return false;
  }
  
}
