// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dav/share/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_application',
    table     : 'folder',
    query     : 'folder',
    
    delschema : 'mne_catalog',
    delfunction : 'folder_del',
    
    okpost      : '/sysexec/shares/enable',
    delpost     : '/sysexec/shares/disable'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
  };

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("folderid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Freigabe hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Freigabe bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Freigabe <$1> wirklich löschen ?");
  weblet.titleString.delid = 'name';     

  weblet.defvalues['sharecount'] = 0;
  
  weblet.showValue = function(weblet)
  {
    if ( typeof weblet == 'undefined' || weblet == null || weblet.act_values[this.showids[0]] == '' || weblet.act_values[this.showids[0]] == '################' )
    {
      this.add();
      return;
    }
    
    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }; 
  
  weblet.del = function()
  {
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
     return false;
    
    var p =
    {
        schema : this.initpar.delschema,
        name : this.initpar.delfunction,
        
        par0 : this.getParamValue(this.obj.inputs.folderid),
        typ0 : "text",
        
        sqlend : 1   
    }

    return MneAjaxWeblet.prototype.func.call(this, p, "", null, null, 'del');

  }
  
  weblet.onbtnok = function(button)
  {
     var result = MneAjaxWeblet.prototype.onbtnok.call(this, button);
     if ( button.weblet.oid = 'folderselect' )
       this.obj.inputs.location.value = '/' + this.obj.inputs.location.value;

     return result;
  };

}
