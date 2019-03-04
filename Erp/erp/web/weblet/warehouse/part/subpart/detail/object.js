// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/part/subpart/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'partsubpart',
    table     : 'partsubpart',

    okfunction : 'partsubpart_ok'
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

  weblet.showids = new Array("partsubpartid");
  
  weblet.titleString.add = weblet.txtGetText("#mne_lang#hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    if ( weblet == null )
      return false;

    if ( typeof weblet.act_values.partsubpartid == 'undefined' )
    {  
      this.defvalues.partid = weblet.act_values.partid;
      this.add();
      return true;
    }
    
    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
  weblet.add = function(setdepend)
  {
    var modify = this.checkmodified();
    var result = MneAjaxWeblet.prototype.add.call(this);
    
    if ( modify ) return result;
    
    this.obj.outputs.name.innerHTML = ' ';

    if ( typeof setdepend == 'string') return;

    this.parent.popups[this.oid + 'addselect'].show();
    this.parent.popups[this.oid + 'addselect'].weblet.onbtnobj = this;
    {
      var popup = this.parent.popups[this.oid + 'addselect'];
      var timeout = function() { popup.resize.call(popup, false, false ); }
      window.setTimeout(timeout, 100);
    }
    return false;
  }
  
  weblet.select = function()
  {
    this.parent.popups[this.oid + 'addselect'].show();
    this.parent.popups[this.oid + 'addselect'].weblet.onbtnobj = this;
    {
      var popup = this.parent.popups[this.oid + 'addselect'];
      var timeout = function() { popup.resize.call(popup, false, false ); }
      window.setTimeout(timeout, 100);
    }
    return false;
  }
    
  weblet.del = function()
  {
    return MneAjaxWeblet.prototype.del.call(this,"noadd");
  }

  weblet.ok = function()
  {
    if ( this.obj.inputs.partid.value == '' || this.obj.inputs.partid.value == 'undefined' || this.obj.inputs.partid.value == '################' )
    {
      alert('#mne_lang#Bitte Teil auswählen');
      return true;
    }
       
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.okfunction,
        
        par0 : this.getParamValue(this.obj.inputs.partsubpartid),
        typ0 : "text",
        
        par1 : this.getParamValue(this.obj.inputs.partid),
        typ1 : "text",
        
        par2 : this.getParamValue(this.obj.inputs.subpartid),
        typ2 : "text",
        
        par3 : this.getParamValue(this.obj.inputs.count),
        typ3 : "long",
                
        sqlend : 1   
    }
        
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.act_values.partsubpartid = this.act_values.result;
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }

  weblet.onbtnok = function(button)
  {
    if ( button.weblet == this.parent.subweblets[this.oid + 'addselect'])
    {
      this.obj.inputs.subpartid.value = button.weblet.act_values.partid;
      this.showOutput(this.obj.outputs.name, button.weblet.act_values.name);
      this.setModify(this.obj.outputs.name);
    }
    else
      MneAjaxWeblet.prototype.onbtnok.call(this,button);
  }
}
