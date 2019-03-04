// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/storage/create
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    styleName : 'style.css',
    schema    : 'mne_warehouse',
    query     : 'storage',
    
      okschema : 'mne_warehouse',
    okfunction : 'storagecreate_ok'
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  weblet.delbuttons('del,add');
  
  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("storageid");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lager erstellen");
  
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.storageid == 'undefined' || weblet.act_values.storageid == null || weblet.act_values.storageid == '################' )
      return false;
    
    MneAjaxWeblet.prototype.showValue.call(this,weblet, { ignore_notfound : true });
    if ( this.values.length == 0 )
      this.add(false);
    this.enable();
 }    
  
  weblet.ok = function(setdepend)
  {
    var result;
    var p =
    {
        schema : this.initpar.okschema,
        name : this.initpar.okfunction,
        typ1 : "long",
        typ2 : "long",
        typ3 : "long",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.storageid);
    p = this.addParam(p, "par1", this.obj.inputs.xcount);
    p = this.addParam(p, "par2", this.obj.inputs.ycount);
    p = this.addParam(p, "par3", this.obj.inputs.zcount);
    p = this.addParam(p, "par4", this.obj.inputs.xsname);
    p = this.addParam(p, "par5", this.obj.inputs.ysname);
    p = this.addParam(p, "par6", this.obj.inputs.zsname);

    result = MneAjaxWeblet.prototype.func.call(this, p, "dummy", true, "ok");
    
    this.popup.hidden();
    return result;

  }

}
