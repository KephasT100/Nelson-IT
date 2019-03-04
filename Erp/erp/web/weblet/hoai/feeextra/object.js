// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: hoai/feeextra
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    showtitle : true,
    schema    : 'mne_hoai',
    table     : 'feeextra',
    query     : 'feeextra'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      nameInput : { selectlist : 'hoia_extrafee' },
      lawInput  : { notclear : true },
      yearInput : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("feeextraid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#HOAI Exraleistung hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#HOAI Extraleistung bearbeiten");
       
  weblet.defvalues = { year : '2013' };
  
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.feeextraid == 'undefined' )
    {
      this.add();
      this.act_values.law = ( typeof weblet.act_values.law != 'undefined' ) ? weblet.act_values.law : '';
      this.showInputDefined("law", weblet.act_values.law);
      this.showOutputDefined("lawname", weblet.act_values.law);
      this.showOutputDefined("lawname", weblet.act_values.lawname);
      return true;
    }
    
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
  weblet.add = function(setdepend)
  {
    var result = MneAjaxWeblet.prototype.add.call(this, setdepend);
    return result;
  }

}
