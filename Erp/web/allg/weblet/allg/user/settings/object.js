// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/user/settings
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
	  schema : 'mne_application',
	  query : 'userpref',
	  table : 'userpref',
	  
    edit   : false
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      usernameInput  : { checktype : 'notempty'},
      usernameOutput : {},
      addButton      : {},
      delButton      : {},
  }
  
  weblet.findIO(attr);
  weblet.showLabel();

  weblet.defvalues = 
  {
      username : '',
      language : 'de',
      regionselect : 'CH:des',
      timezone : 'MET',
      countrycarcode : 'CH',
      stylename : 'default'
  }
  
  weblet.delbuttons( ['add', 'del'] ); 
  
  weblet.showids = new Array("username");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#neuen Benutzer erstellen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Benutzereinstellungen bearbeiten");
  
  
  weblet.showValue = function(weblet)
  {
    var w = weblet;
    
    if ( weblet == null ) w = { act_values : { username : 'session_user' } };
    
    if ( typeof w.act_values.username == 'undefined' || w.act_values.username == '' || w.act_values.username == '################')
    {
      this.showInput ('username', '#mne_lang#Benutzer hat kein login');
      this.showOutput('username', '#mne_lang#Benutzer hat kein login');
      this.disable();
      return;
    }
    
    this.enable();
    this.obj.inputs.username.value = w.act_values.username;
    return MneAjaxWeblet.prototype.showValue.call(this, w);
  }
  
  weblet.ok = function()
  {
    var p = {};
    
    this.okaction = "mod"

    var r = this.obj.inputs.regionselect.value.split(':');
    this.obj.inputs.region.value = r[0];
    this.obj.inputs.mslanguage.value = r[1];

    return MneAjaxWeblet.prototype.ok.call(this);
  };
  
}
  