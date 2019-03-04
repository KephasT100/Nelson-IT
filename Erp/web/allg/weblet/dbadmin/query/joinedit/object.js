// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/query/joinedit
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();

  weblet.findIO();
  weblet.showLabel();
  
  weblet.delbuttons(['del','add']);
  
  weblet.showValue = function(weblet)
  {
    var i;
    if ( weblet == null ) return true;
    
    this.act_values = {};
    for ( i in weblet.act_values )
      this.act_values[i] = weblet.act_values[i];
    
    this.obj.inputs.joindefid.value  = weblet.act_values.joindefid;
    this.obj.inputs.tschema.value  = weblet.act_values.tschema;
    this.obj.inputs.ttab.value  = weblet.act_values.ttab;
    this.obj.inputs.tcols.value  = weblet.act_values.tcols;
    this.obj.inputs.fcols.value  = weblet.act_values.fcols;
    this.obj.inputs.op.value  = weblet.act_values.op;
    this.obj.inputs.typ.value  = weblet.act_values.typ;
    
    this.clearModify();
    return false;

  }
  
  weblet.cancel = function()
  {
    this.popup.hidden();
  }
  
  weblet.ok = function()
  {
    
    this.act_values.joindefid = this.obj.inputs.joindefid.value;
    this.act_values.tschema = this.obj.inputs.tschema.value;
    this.act_values.ttab = this.obj.inputs.ttab.value;
    this.act_values.tcols = this.obj.inputs.tcols.value;
    this.act_values.fcols = this.obj.inputs.fcols.value;
    this.act_values.op = this.obj.inputs.op.value;
    this.act_values.typ = this.obj.inputs.typ.value;
    
    this.popup.hidden();
  }
  
}