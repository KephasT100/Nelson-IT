// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/user/settings
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_personnal',
    table     : 'userpref',
    
    ignore_notfound : 1
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

  weblet.showids = new Array("username");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Benutzereinstellungen hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Benutzereinstellungen bearbeiten");
       
  weblet.defvalues = 
  {
      username : '',
  }

  weblet.showValue = function(weblet)
  {
    var w = weblet;
    
    if ( w == null || typeof w.act_values.username == 'undefined' || w.act_values.username == '' || w.act_values.username == '################')
    {
      this.add();
      this.obj.inputs.username.value = this.act_values.username = '';
      this.showOutput(this.obj.outputs.username, this.act_values.username);
      return;
    }

    MneAjaxWeblet.prototype.showValue.call(this,weblet, { ignore_notfound : true } );

    if ( this.values.length == 0 )
    {
      this.add();
      this.obj.inputs.username.value = this.act_values.username = weblet.act_values.username;
      this.showOutput(this.obj.outputs.username, this.act_values.username);
    }
  }    

}
