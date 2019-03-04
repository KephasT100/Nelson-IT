// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/orderproductpart/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'orderproductpart',
    table     : 'orderproductpart',
    
     okfunction : 'orderproductpart_ok',
    delfunction : 'orderproductpart_del',
    
    inputlist_ignore_notdefined : true
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview(null, this.path + ( ( weblet.initpar.view2 || ( typeof weblet.initpar.view2 == 'undefined' && ( weblet.win.mne_config.group["erpfixture"] == true || weblet.win.mne_config.group["erpwarehouse"] == true ))) ? '/view2.html' : '/view1.html') );

  var attr = 
  {
      hinput : false,
      partcostInput    : { onblur : function() { this.weblet.showInput(this.weblet.obj.inputs.partcostsum, this.value * this.weblet.act_values.productcount * this.weblet.obj.inputs.count.value, 'double') } },
      partcostsumInput : { onblur : function() { if ( this.weblet.act_values.productcount != 0 ) this.weblet.showInput(this.weblet.obj.inputs.partcost, this.value / ( this.weblet.act_values.productcount * this.weblet.obj.inputs.count.value ), 'double') } },

      partnameOutput       : { notclear : true },
      partcountOutput      : { notclear : true },
      orderidInput         : { notclear : true },
      orderproductidInput  : { notclear : true, inputcheckobject : 'productname' },
      productnameOutput    : { notclear : true },
      productcountOutput   : { notclear : true },
      
      detailButton : { checked : weblet.initpar.view2 }
  }

  if ( weblet.initpar.view2 == true )
  {
    attr['partidInput']          = { inputcheckobject : 'partname' };
    attr['fixturetypeidInput']   = { inputcheckobject : 'fixturetype' };
    
    attr['partcostInput'].onreturn    = function() { this.onblur(); };
    attr['partcostsumInput'].onreturn = function() { this.onblur(); };
  }
  
  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("orderproductpartid");
  
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Material hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Material bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Material <$1> wirklich löschen");
  weblet.titleString.delid = 'partdescription';
       
  weblet.obj.defaultcurrencyid = "";
  weblet.obj.defaultcurrency   = "#mne_lang#Währung bitte wählen";
  var param =
  {
      "schema" : "mne_crm",
      "query"  : "companyown",
      "cols"   : "currencyid,currency",
      "sqlend" : 1
  };
  
  MneAjaxData.prototype.read.call(weblet, "/db/utils/query/data.xml",  param)
  if ( weblet.values.length > 0 )
  {
    weblet.obj.defaultcurrencyid = weblet.values[0][0];
    weblet.obj.defaultcurrency   = weblet.values[0][1];
  }

  weblet.defvalues = {powner : weblet.win.mne_config.fullname, pownerid : weblet.win.mne_config.personid };
  
  weblet.showValue = function(weblet)
  {
    var retval;
    
    if ( weblet == null || typeof weblet.act_values.orderproductpartid == 'undefined' || weblet.act_values.orderproductpartid == '' || weblet.act_values.orderproductpartid == '################')
    {
      this.clearModify();
      this.add();
      if ( weblet != null )
      {
        this.showInput(this.obj.inputs.orderid, weblet.act_values.orderid);
        this.act_values.orderid = weblet.act_values.orderid;
 
        if ( typeof weblet.act_values.orderproductid != 'undefined' )
        {
          this.showInput(this.obj.inputs.orderproductid, weblet.act_values.orderproductid);
        }
        else if ( this.act_values.orderid != weblet.act_values.orderid )
        {
          this.showInput(this.obj.inputs.orderproductid, "", this.typs[this.ids['orderproductid']], true);
          this.showOutput(this.obj.outputs.productname, "");
          this.showOutput(this.obj.outputs.productcount, "");
          this.act_values.productcount = 1;
        }

        if ( typeof weblet.act_values.partdescription != 'undefined' )
        {
          this.showInput(this.obj.inputs.partdescription, weblet.act_values.partdescription, this.typs[this.ids['partdescription']], true);
          this.showInput(this.obj.inputs.count, weblet.act_values.count, this.typs[this.ids['count']], true);
          this.showInput(this.obj.inputs.partcost, weblet.act_values.partcost, this.typs[this.ids['partcost']], true);
        }
        else
        {
          this.showInput(this.obj.inputs.partdescription, "", this.typs[this.ids['partdescription']], true);
          this.showInput(this.obj.inputs.count, 0, this.typs[this.ids['count']], true);
          this.showInput(this.obj.inputs.partcost, 0, this.typs[this.ids['partcost']], true);
        }
      }
      return;
    }
    
    if ( typeof this.obj.inputs.partcostcalc != 'undefined' ) this.obj.inputs.partcostcalc.disabled = true;

    retval = MneAjaxWeblet.prototype.showValue.call(this,weblet);
    if ( typeof this.popup != 'undefined' && this.popup != null )
      this.popup.resize(true,false);

    return retval;

  }
  
  weblet.add = function(setdepend)
  {
    var modify = this.checkmodified();
    var result = MneAjaxWeblet.prototype.add.call(this,setdepend);
    
    if ( ! modify )
    {
      this.showInputExists(this.obj.inputs.partcostcalc, 0.0, this.typs[this.ids['partcostcalc']], true);

      this.showOutput(this.obj.outputs.partcurrency,  this.obj.defaultcurrency,   this.typs[this.ids['partcurrency']])
      this.showOutputExists(this.obj.outputs.partcurrencycalc,  this.obj.defaultcurrency,   this.typs[this.ids['partcurrencycalc']])

      this.clearModify();
      if ( typeof this.obj.inputs.partcostcalc != 'undefined' ) this.obj.inputs.partcostcalc.disabled = true;
      if ( typeof this.act_values.productname == 'undefined' ) this.act_values.productname = '';
    }

    return result;
  }
  
  weblet.partcostcalc = function()
  {
    this.obj.inputs.partcostcalc.disabled = !this.obj.inputs.partcostcalc.disabled;
    return false;
  }
  
  weblet.ok = function(setdepend)
  {
    
    if ( this.initpar.view2 != true )
    {
      this.showInput(this.obj.inputs.count, 0);
      this.showInput(this.obj.inputs.partcost, this.obj.inputs.partcostsum.value);
      
      if ( this.obj.inputs.actcount.value == '' )
        this.showInput(this.obj.inputs.actcount, 1);
      
    }

    var p =
    {
        schema : this.initpar.schema,
        name   : this.initpar.okfunction,
        sqlend : 1   
    };

    p = this.addParam(p, "par0", this.obj.inputs.orderproductid );
    p = this.addParam(p, "par1", this.obj.inputs.orderproductpartid );
    p = this.addParam(p, "par2", this.obj.inputs.partgroup );
    p = this.addParam(p, "par3", this.obj.inputs.partdescription );
    p = this.addParam(p, "par4", this.obj.inputs.partid );
    p = this.addParam(p, "par5", this.obj.inputs.fixturetypeid );
    p = this.addParam(p, "par6", this.obj.inputs.count );
    p = this.addParam(p, "par7", this.obj.inputs.partcost );
    p = this.addParam(p, "par8", ( typeof this.obj.inputs.partcostcalc != 'undefined' ) ? this.obj.inputs.partcostcalc : 0);
    p = this.addParam(p, "par9", this.obj.inputs.actcount );
    p = this.addParam(p, "par10", this.obj.inputs.unit );
    p = this.addParam(p, "par11", this.obj.inputs.pownerid );

    p = this.addParam(p, "typ6", "double" );
    p = this.addParam(p, "typ7", "double" );
    p = this.addParam(p, "typ8", "double" );
    p = this.addParam(p, "typ9", "double" );
    
    return MneAjaxWeblet.prototype.func.call(this, p, "orderproductpartid", setdepend);
  }

  weblet.del = function(setdepend)
  {
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values[this.titleString.delid])) != true )
      return false;

    var p =
    {
        schema : this.initpar.schema,
        name   : this.initpar.delfunction,
        sqlend : 1   
    };

    p = this.addParam(p, "par0", this.obj.inputs.orderproductpartid );
    
    return MneAjaxWeblet.prototype.func.call(this, p, null, setdepend);
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
