// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: shipment/invoice/detail
// ================================================================================
{
  var i;
  var str = "";
  var ivalues = 
  {

      schema : 'mne_shipment',
      query : 'invoice_detail',
      distinct : 'true',
      orderweblet : 'crm_order',
      orderselect : 'all',

      report : 'mne_invoice',
      invoicereport : 'mne_invoice',
      reminder1report : 'mne_reminder1',
      reminder2report : 'mne_reminder2',
      reminder3report : 'mne_reminder3',

      okfunction : 'invoice_ok',
      delfunction : 'invoice_del',
      sendfunction : 'invoice_send',
      payedfunction : 'invoice_payed',

      reminder1function : 'invoice_reminder1',
      reminder2function : 'invoice_reminder2',
      reminder3function : 'invoice_reminder3'
  };

  var svalues = 
  {
      table : 'invoice'
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      paidInput : { disabled : true },
      invoicedInput : { disabled : true },
      lumpsumInput : { disabled : true },
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.obj.mkbuttons.push( { id : "send",      value : weblet.txtGetText('#mne_lang#Versenden#'), space : 'before' });
  weblet.obj.mkbuttons.push( { id : "reminder1", value : weblet.txtGetText('#mne_lang#1. Mahnung#'), space : 'before' });
  weblet.obj.mkbuttons.push( { id : "reminder2", value : weblet.txtGetText('#mne_lang#2. Mahnung#')});
  weblet.obj.mkbuttons.push( { id : "reminder3", value : weblet.txtGetText('#mne_lang#3. Mahnung#')});
  weblet.obj.mkbuttons.push( { id : "payed",     value : weblet.txtGetText('#mne_lang#Bezahlt#'), space : 'before'} );

  weblet.showids = new Array("invoiceid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Rechnung hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Rechnung bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Rechnung <$1> wirklich löschen");
  weblet.titleString.delname = 'num'; 
  
  weblet.showValue = function(weblet)
  {
	  MneAjaxWeblet.prototype.showValue.call(this,weblet);

      this.obj.buttons.payed.disabled = true;

      if ( this.act_values.invoiced == "#mne_lang#wahr" )
	  {
        this.obj.buttons.del.disabled = true;
        this.obj.buttons.send.disabled = true;
        if ( this.act_values.paid != "#mne_lang#wahr" ) this.obj.buttons.payed.disabled = false;
	  }
	  else
	  {
        this.obj.buttons.del.disabled = false;
        this.obj.buttons.send.disabled = false;
	  }
	  
	  this.eleMkClass( this.obj.labels.firstreminder,  "modifywrong", this.act_values.firstreminder == "#mne_lang#wahr" );
	  this.eleMkClass( this.obj.labels.secondreminder, "modifywrong", this.act_values.secondreminder == "#mne_lang#wahr" );
	  this.eleMkClass( this.obj.labels.thirdreminder,  "modifywrong", this.act_values.thirdreminder == "#mne_lang#wahr" );

  }    
  
  weblet.add = function()
  {
    this.act_values.invoiceid = 'empty';
  }
  
  weblet.del = function()
  {    
    if ( this.confirm(this.txtSprintf(this.titleString.del,this.act_values[this.titleString.delname])) == false )
      return false;
    
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        par0 : this.act_values.invoiceid,
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
        par0 : this.act_values.invoiceid,
        typ0 : "text",
        par1 : this.obj.inputs.ownerid.value,
        typ1 : "text",
        par2 : this.obj.inputs.textid.value,
        typ2 : "text",
        par3 : this.obj.inputs.condid.value,
        typ3 : "text",
        par4 : this.obj.inputs.withtimesheet.checked,
        typ4 : "bool",
        par5 : this.obj.inputs.paysum.value,
        typ5 : "double",
        par6 : this.obj.inputs.invoicetime.value,
        typ6 : "long",
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
        wval : this.act_values.invoiceid,
        wop  : "=",
        wcol : 'invoiceid',
        sort : '',
        macro0 : "lettersubject,\\Hordernumber: \\Bordernumber\\newline\\Hnum: \\Bnum",
        macro1 : "nosalutation,true",
        language : this.act_values.language,

        sqlend : 1
    };
    
    if ( this.act_values.condid == '' ) 
    {
      alert(this.txtGetText('#mne_lang#Bitte Rechnungskonditionen auswählen'));
      return true;
    }
    
    if ( this.act_values.textid == '' ) 
    {
      alert(this.txtGetText('#mne_lang#Bitte Rechnungstext auswählen'));
      return true;
    }
    
    this.initpar.report = this.initpar.invoicereport;
    MneAjaxWeblet.prototype.print.call(this,p);
    return false;
  }
  
  weblet.send = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.sendfunction,
        par0 : this.act_values.invoiceid,
        typ0 : "text",
        sqlend : 1
    };

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      if ( this.act_values.result == this.act_values.invoiceid )
      {
        this.showValue(this);
        this.setDepends("showValue");
        this.print();
      }
      return false;
    }
    return true;
  }
  
  weblet.ordernumber = function()
  {
    {
      var w = this.parent;
      var val = { orderid : this.act_values.orderid };
      w.show(this.initpar.orderweblet);
      w.subweblets[this.initpar.orderselect].setValue(val);
    }
  }

  weblet.payed = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.payedfunction,
        par0 : this.act_values.invoiceid,
        typ0 : "text",
        sqlend : 1
    };

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      if ( this.act_values.result == this.act_values.invoiceid )
      {
        this.showValue(this);
        this.setDepends("showValue");
      }
      return false;
    }
    return true;
  }

  weblet.reminder = function(func,report,need)
  {
    var p =
    {
        schema : this.initpar.schema,
        name : func,
        par0 : this.act_values.invoiceid,
        typ0 : "text",
        sqlend : 1
    };

    this.initpar.report = report;
    
    if ( need != '#mne_lang#wahr' )
      if ( this.confirm("#mne_lang#Mahnung noch nicht notwendig oder schon versendet - wirklich drucken ?") == false )
        return false;
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      if ( this.act_values.result == this.act_values.invoiceid )
      {
        this.showValue(this);
        this.setDepends("showValue");
        var p =
        {
            wval : this.act_values.invoiceid,
            wop  : "=",
            wcol : 'invoiceid',
            sort : '',
            sqlend : 1
        };
        MneAjaxWeblet.prototype.print.call(this,p);
      }
      return false;
    }
    return true;
  }
  
  weblet.reminder1 = function() { return this.reminder(this.initpar.reminder1function, this.initpar.reminder1report, this.act_values.firstreminder) };
  weblet.reminder2 = function() { return this.reminder(this.initpar.reminder2function, this.initpar.reminder2report, this.act_values.secondreminder) };
  weblet.reminder3 = function() { return this.reminder(this.initpar.reminder3function, this.initpar.reminder3report, this.act_values.thirdreminder) };

}
