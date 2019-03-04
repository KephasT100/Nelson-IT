// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/ingoing/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema     : 'mne_warehouse',
    query      : 'partingoing',
    okfunction : 'partingoing_ok',
    delfunction : 'partingoing_del',
    showbuttons : true,
    buttondisable : false,
    
    autoselect : { deliverynotenumber : "partingoingid" }
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  if ( weblet.initpar.showbuttons != true )
  {
    var ele = weblet.eleGetById( weblet.frame, "buttontable");
    ele.parentNode.removeChild(ele);
  }
  
  var attr = 
  {
      hinput : false,
      deliverydateInput : { inputtyp : 'date', checktype : weblet.inChecktype.notempty },
      storagelocationidInput : { inputcheckobject : "storagelocation" },
      countInput : { readOnly : true },
      storageidInput : { checktype : 'notempty'}
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array('partingoingid');
  weblet.defvalues = { 'storageid' : null };
  
  if ( weblet.initpar.showbuttons == true )
  {
    weblet.titleString.add = weblet.txtGetText("#mne_lang#Lieferung hinzufügen");
    weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lieferung bearbeiten");
  }
  else
  {
    weblet.obj.title = null;
  }
  
  weblet.showValue = function(weblet, param)
  {
    if ( weblet == null || typeof weblet.act_values.partingoingid == 'undefined' || weblet.act_values.partingoingid == '################' || weblet.act_values.partingoingid == '')
    {
      this.add();
      if ( weblet != null && typeof weblet.act_values.purchasedeliveryid != 'undefined' && weblet.act_values.purchasedeliveryid != null && weblet.act_values.purchasedeliveryid != '')
      {
        this.showInput("purchasedeliveryid", weblet.act_values.purchasedeliveryid);
        this.showOutput("deliverynotenumber", weblet.act_values.deliverynotenumber);
        this.showOutput("part", weblet.act_values.part);
        this.showOutput("parttype", weblet.act_values.parttype);
        if ( this.initpar.buttondisable == true ) this.enable();
      }
      else if ( this.initpar.buttondisable == true ) 
      {
        this.disable();
      }
      return;
    }
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
  weblet.ok = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.okfunction,
        typ0 : "text",
        typ1 : "text",
        typ2 : "text",
        typ3 : "text",
        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.partingoingid);
    p = this.addParam(p, "par1", this.obj.inputs.purchasedeliveryid);
    p = this.addParam(p, "par2", this.obj.inputs.partstoragelocationid);
    p = this.addParam(p, "par3", this.obj.inputs.storagelocationid);
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.act_values.partingoingid = this.act_values.result;
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }
  
  weblet.del = function()
  {
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values[this.titleString.delid])) != true )
      return false;

    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        typ0 : "text",
        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.partingoingid);
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.add();
      return false;
    }
    return true;
  }
  

}
