// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/skill/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_personnal',
    query     : 'skill',
    table     : 'skill',
    
    okschema : 'mne_personnal',
    okfunction : 'skill_update'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : true
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("skillid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Fähigkeit hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Fähigkeit bearbeiten");
       
   weblet.defvalues = { skillid : '' };
  
  weblet.showValue = function(weblet)
  {
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  } 
  
  weblet.add = function(setdepend)
  {
    var modified = this.checkmodified();
    if ( modified )
      weblet.defvalues = { skillid : this.obj.inputs.skillid.value };
    
    try { var result = MneAjaxWeblet.prototype.add.call(this,setdepend); } catch ( e ) { weblet.defvalues = { skillid : '' }; throw e; }
    
    weblet.defvalues = { skillid : '' };
    return result;
  }

  weblet.ok = function(setdepend)
  {
    var result = MneAjaxWeblet.prototype.ok.call(this, setdepend);
    
    if ( result == false )
    {
      var p =
      {
          schema : this.initpar.okschema,
          name : this.initpar.okfunction,
          typ0 : "text",
          sqlend : 1   
      }

      p = this.addParam(p, "par0", this.obj.inputs.skillid);
      if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok' )
        return false;
    }
    return result;
  }

}
