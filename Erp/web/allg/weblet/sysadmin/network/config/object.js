// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/network/config
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    hinput    : false,
    
    schema    : 'mne_system',
    table     : 'network',
        
    okpost    : '/sysexec/network/wrconfig'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      typInput : { onchange : function(evt) { try { this.weblet.typchange(); } catch(e) {  this.weblet.exception("#mne_lang#Typeauswahl#", e); } MneMisc.prototype.inOnmodify.call(this); return true; } },
  };

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("networkid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Interface hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Interface bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#<$1> wirklich löschen ?");
  weblet.titleString.delid = 'networkid';     
  
  weblet.defvalues = { networkid : ''};

  weblet.obj.enablebuttons = {};
  for ( i in weblet.obj.inputs )
    weblet.obj.enablebuttons[i] = weblet.obj.inputs[i];
  
  delete weblet.obj.enablebuttons['networkid'];
  delete weblet.obj.enablebuttons['typ'];
  
  weblet.showValue = function(weblet, param)
  {
    this.disable();
    if ( weblet == null || this.eleIsNotdefined(weblet.act_values.networkid) || weblet.act_values.networkid == '################' )
    {
      this.add();
      return;
    }
    
    var result =  MneAjaxWeblet.prototype.showValue.call(this,weblet);
    this.typchange();
    
    return result;
  };

  weblet.ok = function(setdepend)
  {
    var networkid = this.obj.inputs.networkid.value;
    this.obj.inputs.configured.value = 1;
    var result = MneAjaxWeblet.prototype.ok.call(this, false, true, true, false);
    if ( result == false )
    {
      MneAjaxWeblet.prototype.clearModify.call(this);
      this.setDepends('ok');
      this.showValue({act_values: { networkid : networkid}});
    }
    return result;
  };
  
  weblet.typchange = function()
  {
    if ( this.obj.inputs.typ.value == 'static' )
      this.enable();
    else
      this.disable();

  };
}
