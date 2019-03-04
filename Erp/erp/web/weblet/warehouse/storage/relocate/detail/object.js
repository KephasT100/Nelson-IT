// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/storage/relocate/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'relocation',
    table     : 'relocation',
    
       okfunction : "relocation_ok",
      delfunction : "relocation_del",
    readyfunction : "relocation_ready",
    
    disable_button : false,
    disable_new    : false,
    disable_old    : true,
    
    countname      : 'restcount',
    
    oldstoragelocationid   : 'oldstoragelocationid',
    oldstoragelocationname : 'oldstoragelocationname'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();
  weblet.obj.mkbuttons.push( { id : 'ready', value : weblet.txtGetText("#mne_lang#Fertig#"), space : 'before' } );

  var attr = 
  {
      hinput : ( weblet.initpar.hinput == true ),
      oldstorageidInput : { disabled : weblet.initpar.disable_old },
      newstorageidInput : { disabled : weblet.initpar.disable_new, notclear : true },
      newstoragelocationidInput : { inputcheckobject : "newstoragelocationname" },
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("relocationid");
  weblet.defvalues = { partingoingid : null };
  
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Lagerauftrag hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Lagerauftrag bearbeiten");
       
  weblet.checkmodified = function()
  {
    return false;
  }
  
  weblet.showValue = function(weblet)
  {
    if ( weblet != null && typeof weblet.act_values.partingoingid != 'undefined')
    {
     this.act_values.partingoingid = weblet.act_values.partingoingid;
     this.showInput( this.obj.inputs.partingoingid, weblet.act_values.partingoingid, this.typs[this.ids['partingoingid']], false);
    }

    if ( weblet == null || typeof weblet.act_values.relocationid == 'undefined' || weblet.act_values.relocationid == null )
    {
      this.add();
      
      if ( weblet != null && typeof weblet.act_values.partstoragelocationid != 'undefined' && weblet.act_values.partstoragelocationid != '' )
      {
        this.act_values.oldstoragelocationid = weblet.act_values[this.initpar.oldstoragelocationid];
        
        this.showInput( this.obj.inputs.oldstoragelocationid, weblet.act_values[this.initpar.oldstoragelocationid], this.typs[this.ids['oldstoragelocationid']], false);
        this.showInput( this.obj.inputs.partstoragelocationid, weblet.act_values.partstoragelocationid, this.typs[this.ids['partstoragelocationid']], false);
        this.showInput( this.obj.inputs.partid, weblet.act_values.partid, this.typs[this.ids['partid']], false);
        this.showInput( this.obj.inputs.oldstorageid, weblet.act_values.storageid, this.typs[this.ids['oldstorageid']], false);
        this.showInput( this.obj.inputs.count, weblet.act_values[this.initpar.countname], this.typs[this.ids['count']], weblet.act_values[this.initpar.countname] != 0 );

        this.showOutput( this.obj.outputs.oldstoragelocationname, weblet.act_values[this.initpar.oldstoragelocationname], this.typs[this.ids['oldstoragelocationname']], false);
        if ( this.initpar.disable_button || ( typeof weblet.act_values.partoutgoingid != 'undefined' && weblet.act_values.partoutgoingid != '' ) )
          this.disable();
        else
          this.enable();
      }
      else
      {
        this.disable();
      }
      return ( weblet == null || weblet.act_values.partoutgoingid == '' );
    }
    
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
    if ( this.initpar.disable_button || this.act_values.partoutgoingid != '' )
      this.disable();
    else
      this.enable();

    return ( weblet == null || this.act_values.partoutgoingid == '' );
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
    p = this.addParam(p, "par0", this.obj.inputs.relocationid);
    p = this.addParam(p, "par1", this.obj.inputs.partstoragelocationid);
    p = this.addParam(p, "par2", this.obj.inputs.newstoragelocationid);
    p = this.addParam(p, "par3", this.obj.inputs.personid);
    p = this.addParam(p, "par4", this.obj.inputs.count);
    p = this.addParam(p, "par5", this.obj.inputs.sequence);
    
    return this.func(p, "relocationid", setdepend );
  }

  weblet.del = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.delfunction,
        typ0 : "text",
        sqlend : 1   
    }
    p = this.addParam(p, "par0", this.obj.inputs.relocationid);
    return this.func(p, null, setdepend );
  }
  
  weblet.ready = function()
  {
    var p =
    {
        schema : this.initpar.schema,
        name : this.initpar.readyfunction,
        typ0 : "text",
        sqlend : 1   
    }
    var act_values = { partingoingid : this.act_values.partingoingid, partoutgoingid : this.act_values.partoutgoingid, relocationid : '################'};

    p = this.addParam(p, "par0", this.obj.inputs.relocationid);
    if ( this.func(p, null, false ) == false )
    {
      var a = this.act_values;
      this.act_values = act_values;
      this.setDepends("func");
      this.act_values = a;
      return false;
    }

    return true;
  }
  
}
