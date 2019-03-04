// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/productpart/detail
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
      schema    : 'mne_warehouse',
      query     : 'productpart',
      table     : 'productpart',
      
      okfunction : 'productpart_ok',
      delfunction : 'productpart_del'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput             : false,
      partcostInput        : { onblur : function() { this.weblet.showInputDefined(this.weblet.obj.inputs.partcostsum, this.value * this.weblet.obj.inputs.count.value, 'double') },  onreturn : function() { this.onblur(); } },
      partcostsumInput     : { onblur : function() { if ( Number(this.weblet.obj.inputs.count.value) != 0 ) this.weblet.showInputDefined(this.weblet.obj.inputs.partcost, this.value /  this.weblet.obj.inputs.count.value , 'double') }, onreturn : function() { this.onblur(); } },
      countInput           : { onblur : function() { this.weblet.showInputDefined(this.weblet.obj.inputs.partcostsum, this.value * this.weblet.obj.inputs.partcost.value, 'double') },  onreturn : function() { this.onblur(); } },
      productidInput       : { notclear : true },
      productnameOutput    : { notclear : true },
      fixturetypeidInput   : { inputcheckobject : 'fixturetype' },
      partidInput          : { inputcheckobject : 'partname' },
      okButton             : { "style.width" : "10em" }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("productpartid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Material hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Material bearbeiten");

  var param =
  {
      "schema" : "mne_crm",
      "query"  : "companyown",
      "cols"   : "currencyid,currency",
      "sqlend" : 1
  };

  MneAjaxData.prototype.read.call(weblet, "/db/utils/query/data.xml",  param)
  if ( weblet.values.length > 0 )
    weblet.defvalues = { partcostsumcurrency : weblet.values[0][1], partcostcurrency : weblet.values[0][1] }
  else
    weblet.defvalues = { partcostsumcurrency : '#mne_lang#Währung bitte wählen', partcostcurrency : '#mne_lang#Währung bitte wählen'}

  weblet.showValue = function(weblet)
  {

    if ( weblet == null ) return;

    if ( typeof weblet.act_values.productpartid == 'undefined' || weblet.act_values.productpartid == '' )
    {
      if ( typeof weblet.act_values.productid == 'undefined' || weblet.act_values.productid == '################' )
      {
        alert("#mne_lang#Kein Produkt ausgewählt");
        return false;
      }

      this.add();
      this.showInput(this.obj.inputs.productid, weblet.act_values.productid);
      return;
    }

    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }

  weblet.ok = function(setdepend)
  {
    var result;
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.okfunction,
        typ2 : "double",
        typ5 : "double",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.productpartid);
    p = this.addParam(p, "par1", this.obj.inputs.productid);
    p = this.addParam(p, "par2", this.obj.inputs.count);
    p = this.addParam(p, "par3", this.obj.inputs.partgroup);
    p = this.addParam(p, "par4", this.obj.inputs.partdescription);
    p = this.addParam(p, "par5", this.obj.inputs.partcost);
    p = this.addParam(p, "par6", this.obj.inputs.partid);
    p = this.addParam(p, "par7", this.obj.inputs.fixturetypeid);
    p = this.addParam(p, "par8", this.obj.inputs.unit);

    result = MneAjaxWeblet.prototype.func.call(this, p, "productpartid", setdepend, "ok");
    return result;
  }
  
  weblet.del = function(setdepend)
  {
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values[this.titleString.delid])) != true )
      return false;

    var result;
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.productpartid);

    result = MneAjaxWeblet.prototype.func.call(this, p, null, setdepend, "del");
    return result;
  }

  weblet.onbtnok = function(button)
  {
    var ele;
    if ( this.inputlist != null ) ele = this.inputlist.element;
    else ele = null;

    MneAjaxWeblet.prototype.onbtnok.call(this, button);

    if ( ele == 'partname' )
    {
      this.showInput('fixturetypeid', '');
      this.showOutput('fixturetype', '');
      this.showInput('unit', '');
      this.obj.inputs.partcost.onblur();
    }
    else if ( ele == 'fixturetype' )
    {
      this.showInput('partid', '');
      this.showOutput('partname', '');
      this.obj.inputs.partcost.onblur();
    }
    else if ( ele == 'productname')
    {
    this.obj.inputs.partcost.onblur();
    }
  }


}
