// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/weblet/sliderpos
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema : 'mne_application',
    table  : 'htmlcomposetabslider'
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

  weblet.showids = new Array("htmlcomposeid","slidername");
  weblet.defvalues = { name : null, slidername : 'slider' };
  
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Sliderposition hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Sliderposition bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    if ( weblet != null )
      this.defvalues["htmlcomposeid"] = weblet.act_values.htmlcomposeid;
    
    if ( weblet == null || typeof weblet.act_values.slidername == 'undefined' )
    {
      this.act_values.name = 'no weblet';
      this.add();
      return;
    }
      
    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }    

}
