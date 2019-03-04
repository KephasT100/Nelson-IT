// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: hoai/workphase/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_hoai',
    query     : 'workphase',
    
    okfunction : 'workphase_ok',
    
    ignore_notfound : '1'
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

  weblet.showids = new Array();
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Leistungsphasen bearbeiten");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Leistungsphasen bearbeiten");
  
  weblet.delbuttons('add,del')
       
  weblet.showValue = function(weblet)
  {
    if ( weblet == null ) return;
    
    this.obj.buttons.ok.disabled = false;
    if ( typeof weblet.act_values.feenameid != 'undefined')
      MneAjaxWeblet.prototype.showValue.call(this,weblet);
    
    if ( this.values.length == 0 )
    {
      this.add();
      if ( typeof weblet.act_values.feenameid != 'undefined' )
      {
        this.showInput(this.obj.inputs.law, weblet.act_values.feenameid);
        this.showOutput(this.obj.outputs.lawname, weblet.act_values.feenameid);
      }
      else
        this.obj.buttons.ok.disabled = true;
    }
  }
  
  weblet.ok = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name  : this.initpar.okfunction,
        typ0  : "text",
        typ1  : "text",
        typ2  : "double",
        typ3  : "text",
        typ4  : "double",
        typ5  : "text",
        typ6  : "double",
        typ7  : "text",
        typ8  : "double",
        typ9  : "text",
        typ10 : "double",
        typ11 : "text",
        typ12 : "double",
        typ13 : "text",
        typ14 : "double",
        typ15 : "text",
        typ16 : "double",
        typ17 : "text",
        typ18 : "double",
        typ19 : "text",
        typ20 : "text",
        typ21 : "text",
        typ22 : "text",
        typ23 : "text",
        typ24 : "text",
        typ25 : "text",
        typ26 : "text",
        typ27 : "text",
        sqlend : 1   
    }
    
    for ( i = 1; i< 10; i++)
      if ( this.obj.inputs['phasename' + i].value == '' ) this.obj.inputs['value' + i].value = '';
      
    p = this.addParam(p, "par0", this.obj.inputs.law);
    p = this.addParam(p, "par1", this.obj.inputs.phasename1);
    p = this.addParam(p, "par2", this.obj.inputs.value1);
    p = this.addParam(p, "par3", this.obj.inputs.phasename2);
    p = this.addParam(p, "par4", this.obj.inputs.value2);
    p = this.addParam(p, "par5", this.obj.inputs.phasename3);
    p = this.addParam(p, "par6", this.obj.inputs.value3);
    p = this.addParam(p, "par7", this.obj.inputs.phasename4);
    p = this.addParam(p, "par8", this.obj.inputs.value4);
    p = this.addParam(p, "par9", this.obj.inputs.phasename5);
    p = this.addParam(p, "par10", this.obj.inputs.value5);
    p = this.addParam(p, "par11", this.obj.inputs.phasename6);
    p = this.addParam(p, "par12", this.obj.inputs.value6);
    p = this.addParam(p, "par13", this.obj.inputs.phasename7);
    p = this.addParam(p, "par14", this.obj.inputs.value7);
    p = this.addParam(p, "par15", this.obj.inputs.phasename8);
    p = this.addParam(p, "par16", this.obj.inputs.value8);
    p = this.addParam(p, "par17", this.obj.inputs.phasename9);
    p = this.addParam(p, "par18", this.obj.inputs.value9);

    p = this.addParam(p, "par19", this.obj.inputs.productid1);
    p = this.addParam(p, "par20", this.obj.inputs.productid2);
    p = this.addParam(p, "par21", this.obj.inputs.productid3);
    p = this.addParam(p, "par22", this.obj.inputs.productid4);
    p = this.addParam(p, "par23", this.obj.inputs.productid5);
    p = this.addParam(p, "par24", this.obj.inputs.productid6);
    p = this.addParam(p, "par25", this.obj.inputs.productid7);
    p = this.addParam(p, "par26", this.obj.inputs.productid8);
    p = this.addParam(p, "par27", this.obj.inputs.productid9);

    p = this.addParam(p, "par28", this.obj.inputs.oproductnumber1);
    p = this.addParam(p, "par29", this.obj.inputs.oproductnumber2);
    p = this.addParam(p, "par30", this.obj.inputs.oproductnumber3);
    p = this.addParam(p, "par31", this.obj.inputs.oproductnumber4);
    p = this.addParam(p, "par32", this.obj.inputs.oproductnumber5);
    p = this.addParam(p, "par33", this.obj.inputs.oproductnumber6);
    p = this.addParam(p, "par34", this.obj.inputs.oproductnumber7);
    p = this.addParam(p, "par35", this.obj.inputs.oproductnumber8);
    p = this.addParam(p, "par36", this.obj.inputs.oproductnumber9);
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok' )
    {
      this.showValue({ act_values : { feenameid : this.obj.inputs.law.value }});
      return false;
    }
  }

}