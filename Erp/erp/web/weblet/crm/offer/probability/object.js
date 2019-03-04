// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/offer/probability
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema          : 'mne_crm',
    query           : 'offerprobability',
    table           : 'offerprobability',
    probabilitylist : 'offerprobability',

    ignore_notdefined : true
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      probabilityInput : { selectlist : weblet.initpar.probabilitylist },
      expectedorderdateInput : { inputtyp : 'date' }
  }

  weblet.findIO(attr);
  weblet.showLabel();
  weblet.delbuttons('add,del');

  weblet.showids = new Array('offernumber');
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Vorhersage hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Vorhersage bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    
    MneAjaxWeblet.prototype.showValue.call(this, weblet, { ignore_notfound : true });
    if ( this.values.length == 0 || this.obj.inputs.offernumber.value == '################')
    {
      var i;
      this.add(false);
      if ( typeof weblet.act_values.offernumber != 'undefined' )
      {
        this.showInput(this.obj.inputs.offernumber, weblet.act_values.offernumber);
        this.showOutput(this.obj.outputs.offernumber, weblet.act_values.offernumber, this.typs[this.ids['offernumber']]);
        this.obj.buttons.ok.disabled = false;
      }
    }
    else if ( this.values.length != 0 )
    {
      this.obj.buttons.ok.disabled = this.act_values.probability == 100;
    }
  }
  
  weblet.add = function(setdepend)
  {
    MneAjaxWeblet.prototype.add.call(this,setdepend);
  }
  
  weblet.ok = function(setdepend)
  {
    if ( this.obj.inputs.offernumber.value == '################' )
    {
      this.error('#mne_lang#Keine Offerte ausgewählt');
      return true;
    }
    
    if ( this.act_values.probability == 100 )
    {
      this.error("#mne_lang#Das Angebot ist geschlossen");
      return true;
    }

    return MneAjaxWeblet.prototype.ok.call(this,setdepend);
  }
  
}
