// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/purchase/invoice/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'purchaseinvoice',
    table     : 'purchaseinvoice',
    
    okschema : 'mne_warehouse',
    okfunction : 'purchaseinvoice_ok',
    
    payschema : 'mne_warehouse',
    payfunction : 'purchaseinvoice_pay',
    
    hinput : false
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  weblet.obj.mkbuttons.push( { id : "pay", value : weblet.txtGetText("#mne_lang#Bezahlen#"), space : 'before' } );

  var attr = 
  {
      hinput           : weblet.initpar.hinput == true,
      invoicedateInput : { inputtyp : 'date' },
      companyidInput   : { inputcheckobject : "company" }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("purchaseinvoiceid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Rechung hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Rechnung bearbeiten");
       
  weblet.obj.enablebuttons = { "pay" : weblet.obj.buttons.pay };
  
  weblet.showValue = function(weblet)
  {
    this.disable();
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
    
    if ( typeof this.act_values.payed != 'undefined' && this.act_values.payed.substr(0,1) == 'f') this.enable();
  }
  
  weblet.add = function(setdepend)
  {
    var modify = this.checkmodified();
    
    if ( modify )
      weblet.defvalues = { documentnumber : ''};
    else
      weblet.defvalues = { purpose : '', documentnumber : '', invoicenumber : '' };

    MneAjaxWeblet.prototype.add.call(this,setdepend);
  }

  weblet.ok = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.okschema,
        name : this.initpar.okfunction,
        typ0 : "text",
        typ1 : "text",
        typ2 : "text",
        typ3 : "long",
        typ4 : "double",
        typ5 : "text",
        typ6 : "text",
        typ7 : "text",
        typ8 : "text",
        typ9 : "text",
        typ10 : "text",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.purchaseinvoiceid);
    p = this.addParam(p, "par1", this.obj.inputs.documentnumber);
    p = this.addParam(p, "par2", this.obj.inputs.invoicenumber);
    p = this.addParam(p, "par3", this.obj.inputs.invoicedate);
    p = this.addParam(p, "par4", this.obj.inputs.amount);
    p = this.addParam(p, "par5", this.obj.inputs.accountnumber);
    p = this.addParam(p, "par6", this.obj.inputs.bankcode);
    p = this.addParam(p, "par7", this.obj.inputs.remittee);
    p = this.addParam(p, "par8", this.obj.inputs.purpose);
    p = this.addParam(p, "par9", this.obj.inputs.ownaccount);
    p = this.addParam(p, "par10", this.obj.inputs.companyid);

    return MneAjaxWeblet.prototype.func.call(this, p, 'purchaseinvoiceid', setdepend);
  }
  
  weblet.pay = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.payschema,
        name : this.initpar.payfunction,
        typ0 : "text",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.purchaseinvoiceid);

    return MneAjaxWeblet.prototype.func.call(this, p, 'purchaseinvoiceid', setdepend);
  }

}
