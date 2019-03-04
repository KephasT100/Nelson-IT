// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/storage/personnal
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'storagepersonnal',
    table    : 'storagepersonnal'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      storageid : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("storagepersonnalid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Lagerangestellen hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lagerangestellten bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.storagepersonnalid == 'undefined' )
    {
      this.add();
      if ( typeof weblet.act_values.storageid != 'undefined')
      {
        this.showInput(this.obj.inputs.storageid, weblet.act_values.storageid, this.typs[this.id['storageid']], false);
      }
      
      return true;
    }
    
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }    

}
