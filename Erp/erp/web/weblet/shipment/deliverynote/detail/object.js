// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: shipment/deliverynote/detail
// ================================================================================
{
  var i;
  var str = "";
  
  weblet.loadview();

  var ivalues = 
  {
      schema : 'mne_shipment',
      query : 'deliverynote_detail',
      orderweblet : 'crm_order',
      orderselect : 'all',

      okfunction : 'deliverynote_ok',
      delfunction : 'deliverynote_del',
      deliverfunction : 'deliverynote_ready',
      invoicefunction : 'deliverynote_invoice',
      report : "mne_deliverynote",

      invoiceweblet   : 'shipment_invoice',
      invoiceselect   : 'all',

      orderweblet   : 'crm_order',
      orderselect   : 'all',
  };

  var svalues = 
  {
      table : 'deliverynote'
  };

  weblet.initDefaults(ivalues, svalues);

  var attr = 
  {
      hinput : false,
      selectInput : { selectlist : weblet.initpar.selectlist } 
  }

  weblet.findIO(attr);
  weblet.showLabel();
  
  weblet.delbuttons('add');
  weblet.obj.mkbuttons.push({ id: 'deliver', value : weblet.txtGetText('#mne_lang#Ausliefern#'), space : 'before' });
  weblet.obj.mkbuttons.push({ id: 'invoice', value : weblet.txtGetText('#mne_lang#Rechnung#') });
  
  weblet.showids = new Array("deliverynoteid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Lieferschein hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lieferschein bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Lieferschein <$1> wirklich löschen");
  weblet.titleString.delname = 'deliverynotenumber';     

  weblet.showValue = function(weblet)
  {
    MneAjaxWeblet.prototype.showValue.call(this, weblet );

    this.obj.buttons.del.disabled = false;
    this.obj.buttons.invoice.disabled = true;
    this.obj.buttons.deliver.disabled = false;

    if ( this.act_values.delivered == "#mne_lang#wahr" )
    {
      this.obj.buttons.del.disabled = true;
      this.obj.buttons.deliver.disabled = true;
      if ( this.act_values.invoicenum == '' )
        this.obj.buttons.invoice.disabled = false;
    }
  }    
  
  weblet.add = function()
  {
  }
  
  weblet.del = function()
  {    
    if ( this.confirm(this.txtSprintf(this.titleString.del,this.act_values[this.titleString.delname])) == false )
      return false;
    
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        par0 : this.act_values.deliverynoteid,
        typ0 : "text",
        sqlend : 1
    };
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      if ( this.act_values.result != 'failed' )
      {
        var i;
        for ( i in this.obj.inputs )  this.obj.inputs[i].value = '';
        for ( i in this.obj.outputs ) this.obj.outputs[i].innerHTML = ' ';
        this.setDepends("del");
      }
      return false;
    }

    return true;
  }
  weblet.ok = function()
  {    
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.okfunction,
        par0 : this.act_values.deliverynoteid,
        typ0 : "text",
        par1 : this.obj.inputs.ownerid.value,
        typ1 : "text",
        par2 : this.obj.inputs.contactid.value,
        typ2 : "text",
        sqlend : 1
    };
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.showValue(this);
      this.setDepends("showValue");
      return false;
  }

    return true;
  }

  weblet.print = function()
  {
    
    var p =
    {
        wval : this.act_values.deliverynoteid,
        wop  : "=",
        wcol : 'deliverynoteid',
        sort : '',
        macro0 : "lettersubject,\\Hordernumber: \\Bordernumber\\newline\\Hdeliverynotenumber: \\Bdeliverynotenumber",
        macro1 : "nosalutation,true",
        language : this.act_values.language,
        sqlend : 1
    };
    
    MneAjaxWeblet.prototype.print.call(this,p);
    return false;
  }
  
  weblet.deliver = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.deliverfunction,
        par0 : this.act_values.deliverynoteid,
        typ0 : "text",
        sqlend : 1
    };

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      if ( this.act_values.result == this.act_values.deliverynoteid )
      {
        this.showValue(this);
        this.setDepends("showValue");
        this.print();
      }
      return false;
    }
    return true;
  }
  
  weblet.invoice = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.invoicefunction,
        par0 : this.act_values.deliverynoteid,
        typ0 : "text",
        sqlend : 1
    };

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      var w = this.parent;
      var result = this.act_values.result;
      w.show(weblet.initpar.invoiceweblet);
      w.subweblets[weblet.initpar.invoiceselect].setValue("invoiceid : '" + result + "'");
      return false;
    }
    return true;
  }
  
  weblet.ordernumber = function()
  {
    if ( typeof this.act_values.orderid == 'undefined' )
    {
      this.error("#mne_lang#Keine Lieferschein ausgewählt");
      return false;
    }

    if ( this.win.mne_config.group.erpcrm == true || this.win.mne_config.username == 'admindb')
    {
      var w = this.parent;
      var result = this.act_values.orderid;
      w.show(weblet.initpar.orderweblet);
      w.subweblets[weblet.initpar.orderselect].setValue("orderid : '" + result + "'");
    }

    return true;
  }

  weblet.invoicenum = function()
  {
    if ( typeof this.act_values.invoiceid == 'undefined' || this.act_values.invoiceid == '' )
    {
      this.error("#mne_lang#Keine Rechnung vorhanden");
      return false;
    }

    {
      var w = this.parent;
      var result = this.act_values.invoiceid;
      w.show(weblet.initpar.invoiceweblet);
      w.subweblets[weblet.initpar.invoiceselect].setValue("invoiceid : '" + result + "'");
    }

    return true;
  }

}
