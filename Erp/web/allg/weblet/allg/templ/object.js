// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/templ
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    styleName : 'style.css',
    schema    : '',
    query     : '',
    table     : ''
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
  weblet.titleString.add = weblet.txtGetText("#mne_lang#hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#<$1> wirklich löschen ?");
  weblet.titleString.delid = 'name';     
  
  weblet.showValue = function(weblet, param)
  {
    if ( weblet == null || this.eleIsNotdefined(weblet.act_values)  || this.eleIsNotdefined(weblet.act_values[this.showids[0]]) || weblet.act_values[this.showids[0]] == '################'  || weblet.act_values[this.showids[0]] == '' )
    {
      this.add();
      return;
    }
    return MneAjaxWeblet.prototype.showValue.call(this, weblet, param)
  }    

}
