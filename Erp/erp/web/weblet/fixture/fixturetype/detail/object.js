// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: fixture/fixturetype/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_fixture',
    query     : 'fixturetype',
    table     : 'fixturetype'
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

  weblet.showids = new Array("fixturetypeid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Inventarart hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Inventarart bearbeiten");
       
  weblet.showValue = function(weblet)
  {
    MneAjaxWeblet.prototype.showValue.call(this,weblet);
  }  
  
  weblet.ok = function()
  {
    var i;
    var p = {};
    var action;
    var result;
    
    if ( this.okaction == 'add' ) action = "/db/utils/table/insert.xml";
    else action = "/db/utils/table/modify.xml";
   
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table);
    
    p = this.addParam(p, "fixturetypeidInput.old", this.act_values.fixturetypeid);
    p = this.addParam(p, "fixturetypeidInput", this.act_values.fixturetypeid);
    
    p = this.addParam(p, "description");
    p = this.addParam(p, "fixturetype");

    p = this.addParam(p, "rollback", true);

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    MneAjaxWeblet.prototype.write.call(this, action,  p );
  
    p = {};
    
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table + "tree");
    
    p = this.addParam(p, "fixturetypeidInput.old", this.act_values.fixturetypeid);
    p = this.addParam(p, "fixturetypeidInput",     this.act_values.fixturetypeid);
    
    p = this.addParam(p, "parentidInput", this.obj.inputs.treeparentid.value);
    p = this.addParam(p, "treeidInput", this.obj.inputs.treeid.value == '' ? '################' : this.obj.inputs.treeid.value );
    p = this.addParam(p, "treenameInput", this.obj.inputs.fixturetype.value);
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
    
    p = this.addParam(p, "fixturetypeidInput.old", this.act_values.fixturetypeid);
    p = this.addParam(p, "fixturetypeidInput",     this.act_values.fixturetypeid);
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
