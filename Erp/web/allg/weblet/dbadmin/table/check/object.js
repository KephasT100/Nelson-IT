// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/table/check
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();

  var attr =
  {
      hinput     : false,
      nameInput  : { checktype : weblet.inChecktype.alpha_alphanumorempty },
      checkInput : { checktype : weblet.inChecktype.notempty }
  }
  weblet.findIO(attr);
  weblet.showLabel();
  
  weblet.showids = new Array('schema','table','name');
  weblet.defvalues = { schema : null, table : null, name : '' };
  
  weblet.titleString.add = weblet.txtGetText("#mne_lang#neue Checkconstraint");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Checkconstraint bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Checkconstraint wirklich löschen");

  weblet.btnrequest.add    = "/db/admin/table/check/add.xml" 
  weblet.btnrequest.mod    = "/db/admin/table/check/mod.xml" 
  weblet.btnrequest.del    = "/db/admin/table/check/del.xml" 

  weblet.showValue = function(weblet, param)
  {
    if ( weblet == this ) return;
    if ( typeof weblet.act_values.schema != 'string' && typeof weblet.act_values.table != 'string')
    {
      alert('#mne_lang#bitte erst eine Tabelle auswählen');
      return false;
    }
    
    if ( typeof weblet.act_values.name != 'string' )
    {
      this.act_values.schema = weblet.act_values.schema;
      this.act_values.table  = weblet.act_values.table;
      this.add();
    }
    else
      MneAjaxWeblet.prototype.showValue.call(this, weblet);
    
    return true;
  }
    
  weblet.ok = function()
  {
    if ( MneAjaxWeblet.prototype.ok.call(this, false) == false && typeof this.popup != 'undefined')
      this.popup.hidden();
  }
  
  weblet.del = function()
  {
    this.titleString.del = this.txtSprintf(this.txtGetText("#mne_lang#Checkconstraint <$1> wirklich löschen"), this.act_values.name);
    if ( MneAjaxWeblet.prototype.del.call(this, false) == false && typeof this.popup != 'undefined')
      this.popup.hidden();
  }
}