// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/purchase/invoicedelivery/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'purchaseinvoicedelivery',
    table     : 'purchaseinvoicedelivery',
    hinput    : false
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      
      purchaseinvoiceidInput : { notclear : true },
      invoicenumberOutput    : { notclear : true },
      invoicedateOutput      : { notclear : true }
      
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("purchaseinvoicedeliveryid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Lieferung zur Rechnung hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lieferung zur Rechnung bearbeiten");
       
  weblet.obj.enablebuttons = { 'del' : weblet.obj.buttons.del };
  
  weblet.showValue = function(weblet)
  {

    if  ( weblet != null && ( typeof weblet.act_values.purchaseinvoicedeliveryid == 'undefined' || weblet.act_values.purchaseinvoicedeliveryid == '' || weblet.act_values.purchaseinvoicedeliveryid == '################') )
    {
     this.add();

      if ( typeof weblet.act_values.purchaseinvoiceid != 'undefined' )
      {
        this.showInput("purchaseinvoiceid", weblet.act_values.purchaseinvoiceid, null, true);
        this.showOutputDefined("invoicenumber", weblet.act_values.invoicenumber);
        this.showOutputDefined("invoicedate", weblet.act_values.invoicedate, this.typs[this.ids['invoicedate']]);
      }

      if ( typeof weblet.act_values.purchasedeliveryid != 'undefined' )
      {
        this.showInput("purchasedeliveryid", weblet.act_values.purchasedeliveryid, null, true);
        this.showOutputDefined("deliverynotenumber", weblet.act_values.deliverynotenumber);
        this.showOutputDefined("ordernumber", weblet.act_values.ordernumber);
        this.showOutputDefined("orderdate", weblet.act_values.orderdate, this.typs[this.ids['orderdate']]);
        this.showOutputDefined("part", weblet.act_values.part);
      }
      
      return;
    }
    
    this.enable(true);
    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }    
  
  weblet.add = function(setdepend)
  {
    this.disable();
    return MneAjaxWeblet.prototype.add.call(this, setdepend);
  }

}

