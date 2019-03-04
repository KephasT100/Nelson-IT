// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/selectlist/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_application',
    table     : 'selectlist',
    table     : 'selectlist'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      nameInput : { notclear : true }
  };

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("name","value");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Element hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Element bearbeiten");
       
  weblet.defvalues = { value : '', name : '' };
  
  weblet.showValue = function(weblet)
  {
    if ( this.obj.setdepend == true ) return;
    
    if ( weblet == null || typeof weblet.act_values.value == 'undefined' )
    {
      this.add(false);
      if ( weblet != null  && typeof weblet.act_values.name != 'undefined' && weblet.act_values.name != null && weblet.act_values.name != '' )
      {
        this.act_values.name = weblet.act_values.name;
        this.showInput(this.obj.inputs.name, weblet.act_values.name);
        this.obj.setdepend = true;
        try { this.setDepends('showvalue'); } catch(e) { this.obj.setdepend = false; throw(e); }
        this.obj.setdepend = false;
      }
      this.clearModify();
      return;
    }

    return MneAjaxWeblet.prototype.showValue.call(this, weblet);
  };   
  
  weblet.add = function()
  {
    var name = this.act_values.name;
    var retval =  MneAjaxWeblet.prototype.add.call(this, false);
    if ( name )
    {
      this.showInput(this.obj.inputs.name, name );
      this.clearModify();
    }
    return false;
  }

  weblet.del = function()
  {
    var name = this.obj.inputs.name.value;
    var result = MneAjaxWeblet.prototype.del.call(this,false);
    
    if ( result == false )
    {
      this.act_values.name = name;
      this.showInput(this.obj.inputs.name, weblet.act_values.name);
      this.obj.setdepend = true;
      try { this.setDepends('showvalue'); } catch(e) { this.obj.setdepend = false; throw(e); }
      this.obj.setdepend = false;
    }

    return result;
  };

}
