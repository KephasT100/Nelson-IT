// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/menu/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_application',
    query     : 'menu_edit',
    table     : 'menu'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      parentidInput : { notclear : true },
      menunameInput : { notclear : true, onkeydown : function() { this.weblet.add(); this.weblet.obj.inputs.parentid.value = ""; this.weblet.obj.outputs.parentname.innerHTML = ""; } },
      parentnameOutput :{ notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("menuid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Menüeintrag hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Menüeintrag bearbeiten");
       
  weblet.checkmodified = function()
  {
    return false;
  }
  
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.menuid == 'undefined' || weblet.act_values.menuid == '################') 
    {
      if ( weblet != null )
      {
        this.showInput(this.obj.inputs.menuname, weblet.act_values.menuname);
      }
      this.add();
      return;
    }

    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }    
  
}
