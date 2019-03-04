// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/purchase/delivery/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    hinput : false,
    
    schema    : 'mne_warehouse',
    query     : 'purchasedelivery_detail',
    table     : 'purchasedelivery',
    
    okschema   : 'mne_warehouse',
    okfunction : 'purchasedelivery_ok',
      
    delschema   : 'mne_warehouse',
    delfunction : 'purchasedelivery_del',
      
    purchaseschema    : 'mne_warehouse',
    purchasequery     : 'purchase'
    
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : weblet.initpar.hinput,
      deliverydateInput : { inputtyp : 'date' },
      purchaseidInput : { inputcheckobject : 'partname'},
      storagelocationidInput : { inputcheckobject : "storagelocation" },

  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("purchasedeliveryid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Lieferung hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lieferung bearbeiten");
       
  weblet.defvalues = { ownerid : weblet.win.mne_config.personid, ownername : weblet.win.mne_config.fullname };
  
  weblet.showValue = function(weblet)
  {
    
    if ( weblet == null || typeof weblet.act_values.purchasedeliveryid == 'undefined'|| weblet.act_values.purchasedeliveryid == '' )
    {
     this.add(false);
     if ( weblet != null &&  typeof weblet.act_values.purchaseid != 'undefined'  )
      {
       var data = new MneAjaxData(this.win);
        var p = 
        {
            schema : this.initpar.purchaseschema,
            query  : this.initpar.purchasequery,
            cols   : 'ordernumber,partname',
            "purchaseidInput.old" : weblet.act_values.purchaseid,
            sqlend : 1
        }
        
        data.read('/db/utils/query/data.xml', p);
        if (  data.values.length > 0 )
        {
          this.showInput("purchaseid", weblet.act_values.purchaseid, this.typs[this.ids['purchaseid']], true);
          this.showOutput("ordernumber", data.values[0][data.ids['ordernumber']] , this.typs[this.ids['ordernumber']], true);
          this.showOutput("partname",   data.values[0][data.ids['partname']],    this.typs[this.ids['partname']]);

          this.act_values.ordernumber = data.values[0][data.ids['ordernumber']];
        }
      }
      this.setDepends('add');
      return;
    }

    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }    

  weblet.add = function(setdepend)
  {
    
    this.defvalues = { deliverydate : parseInt(( new Date()).getTime() / 1000), partingoingid : '################', documentnumber : '' }
    var result = MneAjaxWeblet.prototype.add.call(this,setdepend);
    this.enable();
    
    return result;
  }
  
  weblet.ok = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.okschema,
        name : this.initpar.okfunction,
        typ0 : "text",
        typ1 : "text",
        typ2 : "text",
        typ3 : "text",
        typ4 : "long",
        typ5 : "long",
        typ6 : "text",
        typ7 : "bool",
        sqlend : 1   
    }

    p = this.addParam(p, "par0", this.obj.inputs.purchasedeliveryid);
    p = this.addParam(p, "par1", this.obj.inputs.purchaseid);
    p = this.addParam(p, "par2", ( this.obj.inputs.purchaseid.value == '' ) ? this.obj.inputs.partid : '');
    p = this.addParam(p, "par3", this.obj.inputs.deliverynotenumber);
    p = this.addParam(p, "par4", this.obj.inputs.deliverydate);
    p = this.addParam(p, "par5", this.obj.inputs.count);
    p = this.addParam(p, "par6", this.obj.inputs.documentnumber);
    p = this.addParam(p, "par7", this.obj.inputs.overwrite);
    p = this.addParam(p, "par8", this.obj.inputs.partingoingid);
    p = this.addParam(p, "par9", this.obj.inputs.partstoragelocationid);
    p = this.addParam(p, "par10", this.obj.inputs.storagelocationid);
    p = this.addParam(p, "par11", this.obj.inputs.vendorid);

    return MneAjaxWeblet.prototype.func.call(this, p, 'purchasedeliveryid', setdepend);
  }
  
  weblet.del = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.delschema,
        name : this.initpar.delfunction,
        typ0 : "text",
         sqlend : 1   
    }

    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
      return false;
    
    p = this.addParam(p, "par0", this.obj.inputs.purchasedeliveryid);
    return MneAjaxWeblet.prototype.func.call(this, p );
  }

  weblet.onbtnok = function(button)
  {
    var ele;
    if ( this.inputlist != null ) ele = this.inputlist.element;
    else ele = null;

    if ( ele == 'partname' )
      {
      var inputlist = this.inputlist;
      this.add();
      this.inputlist = inputlist;
      }
    return MneAjaxWeblet.prototype.onbtnok.call(this, button);
  }
  
}
