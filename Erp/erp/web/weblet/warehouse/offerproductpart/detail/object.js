// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/offerproductpart/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema     : 'mne_warehouse',
    query      : 'offerproductpart',
    table      : 'offerproductpart',

    okschema    : 'mne_warehouse',
    okfunction  : 'offerproductpart_ok',

    delschema   : 'mne_warehouse',
    delfunction : 'offerproductpart_del'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      partcostInput        : { onblur : function() { this.weblet.showInputDefined(this.weblet.obj.inputs.partcostsum, this.weblet.txtMkValue(this.value) * this.weblet.txtMkValue(this.weblet.act_values.productcount) * this.weblet.txtMkValue(this.weblet.obj.inputs.count.value), 'double') },  onreturn : function() { this.onblur(); } },
      partcostsumInput     : { onblur : function() { if ( Number( this.weblet.txtMkValue(this.weblet.act_values.productcount) * this.weblet.txtMkValue(this.weblet.obj.inputs.count.value) ) != 0 ) this.weblet.showInputDefined(this.weblet.obj.inputs.partcost, this.weblet.txtMkValue(this.value) / ( this.weblet.txtMkValue(this.weblet.act_values.productcount) * this.weblet.txtMkValue(this.weblet.obj.inputs.count.value) ), 'double') }, onreturn : function() { this.onblur(); } },
      countInput           : { onblur : function() { this.weblet.showInputDefined(this.weblet.obj.inputs.partcostsum, this.weblet.txtMkValue(this.value) * this.weblet.txtMkValue(this.weblet.act_values.productcount) * this.weblet.txtMkValue(this.weblet.obj.inputs.partcost.value), 'double') },  onreturn : function() { this.onblur(); } },
      partidInput          : { inputcheckobject : 'partname' },
      fixturetypeidInput   : { inputcheckobject : 'fixturetype' },
      partnameOutput       : { notclear : true },
      partcountOutput      : { notclear : true },
      offeridInput         : { notclear : true },
      offerproductidInput  : { notclear : true, inputcheckobject : 'productname', checktype : MneMisc.prototype.inChecktype.notempty },
      productnameOutput    : { notclear : true },
      productcountOutput   : { notclear : true }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("offerproductpartid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Material hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Material bearbeiten");
       
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

  weblet.showValue = function(weblet)
  {
    var result;
    
    if ( weblet == null || typeof weblet.act_values.offerproductpartid == 'undefined' || weblet.act_values.offerproductpartid == null || weblet.act_values.offerproductpartid == '' )
    {
      this.add();
      if ( weblet != null )
      {
        this.act_values.offerid = weblet.act_values.offerid;
        this.showInputDefined("count", 1);
        this.showInputDefined("count", weblet.act_values.count, null, true);

        if ( typeof weblet.act_values.offerproductid != 'undefined' )
        {
          this.showInput("offerproductid", weblet.act_values.offerproductid);
          this.showOutput("productname",   weblet.act_values.productname);
          this.showOutput("productcount",   weblet.act_values.productcount);
          this.act_values.productcount = weblet.act_values.count;
        }
        else
          {
          this.showInput("offerproductid", '', null, true);
          this.showOutput("productname",   '', null, true);
          this.showOutput("productcount",   '1', null, true);
         
          }
        if ( typeof weblet.act_values.partdescription != 'undefined' )
        {
          this.showInput("partdescription", weblet.act_values.partdescription, null, true);
          this.showInput("partcost", weblet.act_values.partcost, null, true);
          this.obj.inputs.partcost.onblur();
        }
        if ( typeof weblet.act_values.fixturetype != 'undefined' )
        {
          this.showOutput("fixturetype", weblet.act_values.fixturetype);
          this.showInput("fixturetypeid", weblet.act_values.fixturetypeid, null, true);
          this.obj.inputs.partcost.onblur();
        }
        
        this.showInputDefined("unit", weblet.act_values.unit, null, true);
        
      }
      return;
    }

    result = MneAjaxWeblet.prototype.showValue.call(this,weblet);
    
    if ( this.act_values.partcurrency == '' )
    {
      this.showOutput(this.obj.outputs.partcurrency,  this.obj.defaultcurrency,   this.typs[this.ids['partcurrency']])
      this.showOutput(this.obj.outputs.partcurrencysum,  this.obj.defaultcurrency,   this.typs[this.ids['partcurrency']])
    }
    
    return result;
  }
  
  weblet.add = function(setdepend)
  {
    var modify = this.checkmodified();
    var result = MneAjaxWeblet.prototype.add.call(this,setdepend);

    if ( modify )
    {
      this.showOutput(this.obj.outputs.partcurrency,  this.obj.defaultcurrency,   this.typs[this.ids['partcurrency']])

      this.showOutput(this.obj.outputs.partcurrencysum,  this.obj.defaultcurrency,   this.typs[this.ids['partcurrency']])
      if ( typeof this.act_values.productcount == 'undefined' || this.act_values.productcount == 0 ) this.act_values.productcount = 1;
      if ( typeof this.act_values.productname == 'undefined' ) this.act_values.productname = '';
      this.showInput("partcost", 0.0);
      this.showInput("partcostsum", 0.0);
    }
    return result;
  }
  
  weblet.ok = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.okschema,
        name   : this.initpar.okfunction,
        sqlend : 1   
    };

    p = this.addParam(p, "par0", this.obj.inputs.offerproductid );
    p = this.addParam(p, "par1", this.obj.inputs.offerproductpartid );
    p = this.addParam(p, "par2", this.obj.inputs.partgroup );
    p = this.addParam(p, "par3", this.obj.inputs.partdescription );
    p = this.addParam(p, "par4", this.obj.inputs.partid );
    p = this.addParam(p, "par5", this.obj.inputs.fixturetypeid );
    p = this.addParam(p, "par6", this.obj.inputs.count );
    p = this.addParam(p, "par7", this.obj.inputs.partcost );
    p = this.addParam(p, "par8", this.obj.inputs.unit );
    p = this.addParam(p, "par9", this.obj.inputs.pownerid );

    p = this.addParam(p, "typ6", "double" );
    p = this.addParam(p, "typ7", "double" );
    
    return MneAjaxWeblet.prototype.func.call(this, p, "offerproductpartid", setdepend);
  }

  weblet.del = function(setdepend)
  {
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values[this.titleString.delid])) != true )
      return false;

    var p =
    {
        schema : this.initpar.delschema,
        name   : this.initpar.delfunction,
        sqlend : 1   
    };

    p = this.addParam(p, "par0", this.obj.inputs.offerproductpartid );
    
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
