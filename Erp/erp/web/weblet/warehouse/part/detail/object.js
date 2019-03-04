// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/part/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_warehouse',
    query     : 'part',
    table     : 'part',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("partid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Teil hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Teil bearbeiten");
  weblet.defvalues = { treeid : '################'}

  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.partid == 'undefined' || weblet.act_values.partid == null )
    {
      this.add();
      return;
    }
    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
  weblet.ok = function(setdepend)
  {
    var i;
    var p = {};
    var action;
    var result;
    
    if ( this.okaction == 'add' ) action = "/db/utils/table/insert.xml";
    else action = "/db/utils/table/modify.xml";
   
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table);
    
    p = this.addParam(p, "partidInput.old", this.act_values.partid);
    p = this.addParam(p, "partidInput", this.act_values.partid);
    
    p = this.addParam(p, "part");
    p = this.addParam(p, "parttype");

    p = this.addParam(p, "rollback", true);

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    MneAjaxWeblet.prototype.write.call(this, action,  p );
  
    if ( this.okaction == 'add' )
    {
      p = {};
      p = this.addParam(p, "schema", this.initpar.schema);
      p = this.addParam(p, "table",  this.initpar.table + "storagemasterdata");
      
      p = this.addParam(p, "partstoragemasterdataidInput", '################');
      p = this.addParam(p, "partidInput", this.act_values.partid);

      MneAjaxWeblet.prototype.write.call(this, action,  p );
    }
    
    p = {};
    
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table + "tree");
    
    p = this.addParam(p, "partidInput.old", this.act_values.partid);
    p = this.addParam(p, "partidInput",     this.act_values.partid);
    
    p = this.addParam(p, "parentidInput", this.obj.inputs.treeparentid.value);
    p = this.addParam(p, "treeidInput", this.obj.inputs.treeid.value == '' ? '################' : this.obj.inputs.treeid.value );
    p = this.addParam(p, "treenameInput", this.obj.inputs.part.value + " " + this.obj.inputs.parttype.value);
    p = this.addParam(p, "modifyinsert", 1);
    p = this.addParam(p, "rollback", true);
    p = this.addParam(p, "sqlend", 1);

    result = MneAjaxWeblet.prototype.write.call(this, action,  p );

    if ( result == 'ok' )
    {
      this.showValue(this);
      if ( setdepend != false ) this.setDepends("ok");
      return false;
    }
    return true;
  }

    weblet.del = function()
  {
    var p = {};
    var result;
    
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values.part)) != true )
      return false;

    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( result != 'ok' ) return true;
    
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table + "tree");
    
    p = this.addParam(p, "partidInput.old", this.act_values.partid);
    p = this.addParam(p, "partidInput",     this.act_values.partid);
    p = this.addParam(p, "rollback", true);
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok' ) return true;

    p.table = this.initpar.table + 'storagemasterdata';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok' ) return true;

    p.table = this.initpar.table + 'vendor';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok' ) return true;

    p.table = 'storageoptpart';
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result != 'ok' ) return true;

    p.table = this.initpar.table;
    p.sqlend = 1;
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    if ( result == 'ok' )
    {
      this.add();
      return false;
    }
    return true;
  }


}
