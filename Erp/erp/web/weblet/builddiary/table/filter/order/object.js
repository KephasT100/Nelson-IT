// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: builddiary/table/filter/order
// ================================================================================
{
  var i;
  var str;
  
  var ivalues = 
  {
      label : weblet.txtGetText("#mne_lang#Auftrag#") 
  }
  
  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  
  var attr =
  {
          hinput : false,
          orderidInput : { checktype : weblet.inChecktype.notempty, inputcheckobject : 'orderdescription' },
  };
  
  weblet.findIO(attr, weblet.frame, weblet.obj.whereframe, true);
  weblet.showOutput(weblet.obj.labels.orderdescription, weblet.initpar.label);
  
  weblet.showValuefilter = weblet.showValue;
  weblet.showValue = function(weblet, param)
  {
    if ( typeof weblet != 'undefined' && weblet != null && typeof weblet.act_values.orderid != 'undefined' && weblet != this)
    {
      this.showInput("orderid", weblet.act_values.orderid);
      this.showOutputDefined("orderdescription", weblet.act_values.orderdescription);
    }
    return this.showValuefilter(weblet, param);

  }
  
  weblet.getFilter = function(pp)
  {
    var p = pp;
    if ( typeof p == 'undefined' || p == null ) p = {};

    p.wcol = ( typeof this.initpar.wcol != 'undefined' ) ? this.initpar.wcol+ ','  : "";
    p.wop  = ( typeof this.initpar.wop  != 'undefined' ) ? this.initpar.wop + ','  : "";
    p.wval = ( typeof this.initpar.wval != 'undefined' ) ? this.initpar.wval + ',' : "";;

    try
    {
      p.wcol += 'orderid';
      p.wop  += "=";
      p.wval += "" + this.obj.inputs.orderid.value;
    }
    catch (e)
    {
      p.wcol = "orderid";
      p.wop  = '=';
      p.wval = "unbekannt";
      throw e;
    }
    return p;
  }

  weblet.print = function()
  {
      var p = this.getFilter(MneAjaxWeblet.prototype.readDataParam.call(this,this));

      p.macro0 = 'ordernumber,' + this.eleGetRawTextContent(this.obj.outputs.ordernumber);
      p.macro1 = 'orderdescription,' + this.eleGetRawTextContent(this.obj.outputs.orderdescription);

      p.macrocount = 2;

      p.schema = "";
      p.query  = "";
      p.table = "";

      return MneAjaxWeblet.prototype.print.call(this,p);
  }

  weblet.clearModify()
}
