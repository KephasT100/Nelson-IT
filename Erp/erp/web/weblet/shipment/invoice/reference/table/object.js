// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: shipment/invoice/reference/table
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      addschema : 'mne_shipment',
      addfunction : "invoiceref_ok",
      
      delschema : 'mne_shipment',
      delfunction: "invoiceref_del",

      paidschema : 'mne_shipment',
      paidfunction : "invoiceref_payed"
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  MneAjaxWeblet.prototype.loadbase.call(weblet, "weblet/allg/table/fix", weblet);
 
  weblet.obj.mkbuttons.push( { id : 'paid', value : weblet.txtGetText("#mne_lang#Bezahlt"), disabled : true })
  
  weblet.onbtnclick = function(id, button)
  {
    if ( id != 'ok' ) return false;
    
    var p =
    {
        schema : this.initpar.addschema,
        name : this.initpar.addfunction,
        par0 : this.act_values.invoiceid,
        typ0 : "text",
        par1 : button.weblet.act_values.refid,
        typ1 : "text",
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
  
  weblet.del = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.delschema,
        name : this.initpar.delfunction,
        par0 : this.act_values.invoicerefid,
        typ0 : "text",
        sqlend : 1
    };

    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      if ( this.obj.tables.content.act_rownums.length == 1 )
      {
        this.showValue(this);
        this.setDepends("showValue");
      }
      return false;
    }

    return true;
  }

  weblet.paid = function()
  {
    var p =
    {
        schema : this.initpar.paidschema,
        name : this.initpar.paidfunction,
        par0 : this.act_values.invoicerefid,
        typ0 : "text",
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

}
