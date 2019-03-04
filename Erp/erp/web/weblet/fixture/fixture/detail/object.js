// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: fixture/fixture/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_fixture',
    query     : 'fixture',
    table    : 'fixture'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      fixturetypeidInput : { inputcheckobject : 'fixturetype'}
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("fixtureid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Inventarartikel hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Inventarartikel bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || weblet.act_values.fixtureid == 'undefined' || weblet.act_values.fixtureid == null )
    {
      return this.add();
    }
    return MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }
  
  weblet.add = function()
  {
    var result = MneAjaxWeblet.prototype.add.call(this);
    this.obj.inputs.treeid.value = "################";
    return result;
  }
  
  weblet.ok = function()
  {
    var i;
    var p = {};
    var action;
    var result;
    
    if ( this.obj.inputs.purchasedeliveryid.value == '' && this.confirm('#mne_lang#Teil ohne Bestellung inventarisieren ?') != true )
      return true;

    if ( this.okaction == 'add' ) action = "/db/utils/table/insert.xml";
    else action = "/db/utils/table/modify.xml";
   
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table);
    
    p = this.addParam(p, "fixtureidInput.old", this.act_values.fixtureid);
    p = this.addParam(p, "fixtureidInput", this.act_values.fixtureid);
    
    p = this.addParam(p, "ownerid");
    p = this.addParam(p, "partid");
    p = this.addParam(p, "description");
    p = this.addParam(p, "fixturenumber");
    p = this.addParam(p, "partingoingid");
    p = this.addParam(p, "purchasedeliveryid");
    p = this.addParam(p, "fixturetypeid");

    p = this.addParam(p, "rollback", true);

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    MneAjaxWeblet.prototype.write.call(this, action,  p );
  
    p = {};
    
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table + "tree");
    
    p = this.addParam(p, "fixtureidInput.old", this.act_values.fixtureid);
    p = this.addParam(p, "fixtureidInput",     this.act_values.fixtureid);
    
    p = this.addParam(p, "parentidInput", this.obj.inputs.treeparentid.value);
    p = this.addParam(p, "treeidInput", this.obj.inputs.treeid.value == '' ? '################' : this.obj.inputs.treeid.value );
    p = this.addParam(p, "treenameInput", ( this.obj.inputs.description.value != '' ) ? this.obj.inputs.description : this.obj.outputs.partname.innerHTML );
    p = this.addParam(p, "modifyinsert", 1);
    p = this.addParam(p, "rollback", true);
    p = this.addParam(p, "sqlend", 1);

    result = MneAjaxWeblet.prototype.write.call(this, action,  p );

    if ( result == 'ok' )
    {
      this.showValue(this);
      this.setDepends('ok');
      return false;
    }
    return true;
  }

    weblet.del = function()
  {
    var p = {};
    var result;
    
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.act_values.partname)) != true )
      return false;

    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( result != 'ok' ) return true;
    
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table + "tree");
    
    p = this.addParam(p, "fixtureidInput.old", this.act_values.fixtureid);
    p = this.addParam(p, "fixtureidInput",     this.act_values.fixtureid);
    p = this.addParam(p, "rollback", true);
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
