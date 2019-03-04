// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/weblet/subwebletselectdetail
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();

  var attr = 
  {
      hinput : false,
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array('htmlcomposetabselectid');
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Selektionstabelle hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Selektionstabelle bearbeiten");
      
  weblet.showValue = function(weblet)
  {
    var i;

    if ( weblet == null ) return;
    
    if ( typeof weblet.act_values.htmlcomposeid != 'undefined' || weblet.act_values.htmlcomposeid != null  )
      this.defvalues["htmlcomposeid"] = weblet.act_values.htmlcomposeid;
    else
      this.defvalues['htmlcomposeid'] = 'no weblet';

    if ( this.eleIsNotdefined(weblet.act_values)  || this.eleIsNotdefined(weblet.act_values[this.showids[0]]) || weblet.act_values[this.showids[0]] == '################' )
    {
      this.add();
      return;
    }
    
    MneAjaxWeblet.prototype.showValue.call(this, weblet);
  }

  weblet.checkmodified = function()
  {
    return false;
  }
  
}