// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/outgoing/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema     : 'mne_warehouse',
    query      : 'partoutgoing',
    okfunction : 'partoutgoing_ok',
    delfunction : 'partoutgoing_del',
    fetchfunction : 'partoutgoing_fetch',
    orderfunction : 'partoutgoing_order',
    showbuttons : true,
    revokelocation : 'revokelocation',
    revokelocationid : 'tostoragelocationid'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();
  weblet.obj.mkbuttons.push( { id : "fetch", value : weblet.txtGetText("#mne_lang#Abgeholt#"), space : 'before' } );
  weblet.obj.mkbuttons.push( { id : "order", value : weblet.txtGetText("#mne_lang#Auftrag setzen#") } );

  if ( weblet.initpar.showbuttons != true ) weblet.obj.mkbuttons = [];
  
  var attr = 
  {
      hinput : false,
      partidInput : { inputcheckobject : "partname" },
      spartstoragelocationidInput : { inputcheckobject : "storagelocationname" },
      outstoragelocationidInput : { inputcheckobject : "outstoragelocationname" },
      outstorageidInput : { checktype : 'notempty' }
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array('partoutgoingid');
  weblet.defvalues = { 'outstorageid' : null };
  
  if ( weblet.initpar.showbuttons == true )
  {
    weblet.titleString.add = weblet.txtGetText("#mne_lang#Auslagerung hinzufügen");
    weblet.titleString.mod = weblet.txtGetText("#mne_lang#Auslagerung bearbeiten");
  }
  else
  {
    weblet.obj.title = null;
  }
  
  weblet.showValue = function(weblet, param)
  {
    if ( weblet == null || typeof weblet.act_values.partoutgoingid == 'undefined' || weblet.act_values.partoutgoingid == '################')
    {
      this.add();
      return;
    }
    MneAjaxWeblet.prototype.showValue.call(this,weblet, {noinputcheck : true} );
  }
  
  weblet.ok = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.okfunction,
        typ0 : "text",
        typ1 : "text",
        typ2 : "text",
        typ3 : "text",
        typ4 : "long",
        typ5 : "text",
        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.partoutgoingid);
    p = this.addParam(p, "par1", this.obj.inputs.outstoragelocationid);
    p = this.addParam(p, "par2", this.obj.inputs.spartstoragelocationid);
    p = this.addParam(p, "par3", this.obj.inputs.orderproductpartid);
    p = this.addParam(p, "par4", this.obj.inputs.count);
    p = this.addParam(p, "par5", this.obj.inputs.personid);
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.act_values.partoutgoingid = this.act_values.result;
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;
  }
  
  weblet.del = function()
  {
    if ( this.noconfirm != true )
      if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values[this.titleString.delid])) != true )
        return false;

    this.noconfirm = false;
    
    if ( this.act_values.storagelocationid == '' )
    {
      var weblet = this.parent.subweblets[this.initpar.revokelocation];
      weblet.popup.show(); 
      weblet.showValue(this);
      {
        var popup = weblet.popup;
        var timeout = function() { popup.resize.call(popup, true, false); }
        window.setTimeout(timeout, 10);
      }
      weblet.onbtnobj = this;
      return false;
    }
    
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        typ0 : "text",
        typ1 : "text",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.partoutgoingid);
    p = this.addParam(p, "par1", this.act_values.storagelocationid);
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.add();
      return false;
    }
    return true;
  }
  weblet.fetch = function()
  {

    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.fetchfunction,
        typ0 : "text",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.partoutgoingid);
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.act_values.partoutgoingid = this.act_values.result;
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }

    return true;
  }

  weblet.order = function()
  {

    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.orderfunction,
        typ0 : "text",
        typ1 : "text",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.partoutgoingid);
    p = this.addParam(p, "par1", this.obj.inputs.orderproductpartid);
    
    if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok')
    {
      this.act_values.partoutgoingid = this.act_values.result;
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }

    return true;
  }
  
  weblet.onbtnok = function(button)
  {
    if ( button.weblet == this.parent.subweblets[this.initpar.revokelocation] )
    {
      if ( typeof button.weblet.act_values[this.initpar.revokelocationid] != 'undefined' )
      {
        this.act_values.storagelocationid = button.weblet.act_values[this.initpar.revokelocationid];
        button.weblet.popup.hidden();
        this.noconfirm = true;
        this.del();
      }
      else
      {
        this.error("#mne_lang#Kein Ziellagerplatz ausgewählt");
      }
      return;
    }
    
    return MneAjaxWeblet.prototype.onbtnok.call(this, button);
  }
}
