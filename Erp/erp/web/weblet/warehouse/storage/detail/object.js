// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/storage/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'storage',
    table     : 'storage',
    
    delschema : 'mne_warehouse',
    delfunction : 'storage_del',
    
       storagetyp : 'storagetype',
     storageclass : 'storageclass',
    storageloctyp : 'storageloctype',
    
      createpopup : 'create',
    optimizepopup : 'optimize',
      
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();

  weblet.obj.mkbuttons.push( { id: "create", value : weblet.txtGetText("#mne_lang#Erstellen#"), space : 'before' } );
  weblet.obj.mkbuttons.push( { id: "optimize", value : weblet.txtGetText("#mne_lang#Optimierung#"), show : typeof weblet.parent.popups[weblet.initpar.createpopup] != 'undefined' } );

  var attr = 
  {
      hinput : false,
      storagetypidInput    : { selectlist : weblet.initpar.storagetyp },
      storageclassInput    : { selectlist : weblet.initpar.storageclass },
      storagelocationtypidInput : { selectlist : weblet.initpar.storageloctyp },
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("storageid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Lager hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lager bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Lager <$1> wirklich löschen ?");
  weblet.titleString.delid = 'description';     

  weblet.showValue = function(weblet)
  {
    var popup = this.parent.popups[this.initpar.createpopup];
    if ( typeof popup != 'undefined' ) popup.hidden();
    
    popup = this.parent.popups[this.initpar.optimizepopup];
    if ( typeof popup != 'undefined' ) popup.hidden();
    
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }    

  weblet.create = function()
  {
    var popup = this.parent.popups[this.initpar.createpopup];

    if ( typeof popup != 'undefined' )
    {
      popup.show(false,false);
      if ( popup.weblet.showValue(this, param ) == false )
        popup.hidden();
    }
    
    return false;
  }
  
  weblet.optimize = function()
  {
    var popup = this.parent.popups[this.initpar.optimizepopup];

    if ( typeof popup != 'undefined' )
    {
      popup.show(false,false);
      if ( popup.weblet.showValue(this, param ) == false )
        popup.hidden();
    }
    
    return false;
  }
  
    weblet.del = function(setdepend)
  {
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
      return false;

    var result;
    var p =
    {
        schema : this.initpar.delschema,
        name : this.initpar.delfunction,
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.storageid);
    
    result = MneAjaxWeblet.prototype.func.call(this, p, "" , true, "del");
    return result;

  }

}
