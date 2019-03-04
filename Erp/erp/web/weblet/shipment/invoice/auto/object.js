// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: shipment/invoice/auto
// ================================================================================
{
  var i;
  var str;
  
  weblet.loadview();

  var ivalues = 
  {
    schema         : 'mne_shipment',
    invoiceprint   : "invoiceprint",
    reminder1print : "reminder1print",
    reminder2print : "reminder2print",
    reminder3print : "reminder3print",
    invoiceopen    : "invoiceopen",
    invoiceit      : "invoiceit",
    reminder1      : "reminder1",
    reminder2      : "reminder2",
    reminder3      : "reminder3"
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  var attr = 
  {
		  hinput : false
  }

  weblet.findIO(attr);
  weblet.showLabel();
  weblet.obj.mkbuttons = [];

  if ( weblet.obj.title != null ) weblet.titleString.mod = weblet.titleString.add = weblet.obj.title.innerHTML

  weblet.showids = new Array();
  
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.invoiceauto == 'undefined')
    {
    	return;
    }

    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
  weblet.print = function()
  {
	  if ( typeof this.act_values.invoiceauto == 'undefined' )
	  {
		  alert(this.txtGetText("#mne_lang#Kein Rechnungslauf ausgewählt"));
		  return false;
	  }
	
	  this.printparam = Array();
	  this.printparam[0] = { schema : this.initpar.schema, autoreport : this.initpar.invoiceprint,   selwcol : "invoiceauto", selwop : "=", selwval : this.act_values.invoiceauto };
	  this.printparam[1] = { schema : this.initpar.schema, autoreport : this.initpar.reminder1print, selwcol : "invoiceauto", selwop : "=", selwval : this.act_values.invoiceauto };
	  this.printparam[2] = { schema : this.initpar.schema, autoreport : this.initpar.reminder2print, selwcol : "invoiceauto", selwop : "=", selwval : this.act_values.invoiceauto };
	  this.printparam[3] = { schema : this.initpar.schema, autoreport : this.initpar.reminder3print, selwcol : "invoiceauto", selwop : "=", selwval : this.act_values.invoiceauto };

	  this.initpar.report = 'autoreport';
	  var param = this.printparam[this.act_values.ntyp];
	  MneAjaxWeblet.prototype.print.call(this,param);
	  
	  return false;
  }

  weblet.autotext = function()
  {
	  this.initpar.report = 'autoreport';
	  var param = { schema : this.initpar.schema, autoreport : this.initpar.invoiceopen, rowwarning : "false", rowwarningtext : '#mne_lang#Keine Rechnungen zum versenden vorhanden' };
	  
	  MneAjaxWeblet.prototype.print.call(this,param);
	  
	  return false;
  }

  weblet.autostart = function()
  {
	  this.initpar.report = 'autoreport';
	  var param = { schema : this.initpar.schema, autoreport : this.initpar.invoiceit, rowwarning : "false", rowwarningtext : '#mne_lang#Keine Rechnungen zum versenden vorhanden' };
	  
	  MneAjaxWeblet.prototype.print.call(this,param);
	  
	  return false;
  }


  weblet.reminder1 = function()
  {
	  this.initpar.report = 'autoreport';
	  var param = { schema : this.initpar.schema, autoreport : this.initpar.reminder1, rowwarning : "false", rowwarningtext : '#mne_lang#Keine Mahnungen zum versenden vorhanden'  };
	  
	  MneAjaxWeblet.prototype.print.call(this,param);
	  
	  return false;
  }
  
  weblet.reminder2 = function()
  {
	  this.initpar.report = 'autoreport';
	  var param = { schema : this.initpar.schema, autoreport : this.initpar.reminder2, rowwarning : "false", rowwarningtext : '#mne_lang#Keine Mahnungen zum versenden vorhanden'  };
	  
	  MneAjaxWeblet.prototype.print.call(this,param);
	  
	  return false;
  }
  
  weblet.reminder3 = function()
  {
	  this.initpar.report = 'autoreport';
	  var param = { schema : this.initpar.schema, autoreport : this.initpar.reminder3, rowwarning : "false", rowwarningtext : '#mne_lang#Keine Mahnungen zum versenden vorhanden'  };
	  
	  MneAjaxWeblet.prototype.print.call(this,param);
	  
	  return false;
  }
}