// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/storage/optimize
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'storageopt',
    
    okschema : 'mne_warehouse',
    okfunction : 'storageopt_ok'

  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      xtimeInput : { inputtyp : 'time', inputformat : 'l' },
      ytimeInput : { inputtyp : 'time', inputformat : 'l' },
      ztimeInput : { inputtyp : 'time', inputformat : 'l' }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("storageoptid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Parameter Lageroptimierung ");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Parameter Lageroptimierung ");
  
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.storageid == 'undefined' || weblet.act_values.storageid == null || weblet.act_values.storageid == '################' )
    {
      this.disable();
      this.add(false);
      return false;
    }
    
    var w = { act_values : { storageoptid : weblet.act_values.storageid } };
    MneAjaxWeblet.prototype.showValue.call(this, w, { ignore_notfound : true });
    if ( this.values.length == 0 )
      this.add(false);
    this.obj.inputs.storageoptid.value = this.obj.inputs.storageid.value = weblet.act_values.storageid;
    this.enable();
  }    
  
  weblet.ok = function(setdepend)
  {
    var result;
    var  p =
    {
        schema : this.initpar.okschema,
        name : this.initpar.okfunction,
        typ1 : "long",
        typ2 : "long",
        typ3 : "long",
        typ4 : "long",
        typ5 : "long",
        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.storageoptid);
    p = this.addParam(p, "par1", this.obj.inputs.stockpos);
    p = this.addParam(p, "par2", this.obj.inputs.releasepos);
    p = this.addParam(p, "par3", this.obj.inputs.xtime);
    p = this.addParam(p, "par4", this.obj.inputs.ytime);
    p = this.addParam(p, "par5", this.obj.inputs.ztime);

    result = MneAjaxWeblet.prototype.func.call(this, p, "dummy", true, "ok");
    this.popup.hidden();
    return result;

  }

}
