// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/query/detail
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();

  weblet.findIO();
  weblet.showLabel();
  
  weblet.delbuttons('add');
  weblet.obj.mkbuttons.push ( { id : 'copy', value : weblet.txtGetText('#mne_lang#Kopieren#'), behind : 'del', space : 'before' } ); 
  
  if ( typeof weblet.initpar.okweblets == 'undefined' ) weblet.initpar.okweblets = { 0 : "jointree", 1 : "column", 2 : "where" };
  
  weblet.showids = new Array("queryid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#neue Abfrage");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Abfrage bearbeiten");
    
  weblet.obj.inputs.schema.modifyreg = weblet.inChecktype.alpha;
  weblet.obj.inputs.query.modifyreg = weblet.inChecktype.alpha;
  weblet.obj.inputs.unionnum.modifyreg = weblet.inChecktype.num1_num;
  
  weblet.checkmodified = function()
  {
    return false;
  }
  
  weblet.add = function()
  {
    MneAjaxWeblet.prototype.add.call(this);
    this.obj.inputs.unionnum.value = 1;

    this.act_values.schema = "";
    this.act_values.query = "";
    this.act_values.queryid = "";
    this.act_values.unionnum = 1;

    MneMisc.prototype.inClear(this.obj.inputs.unionnum);
    for ( i in this.initpar.okweblets )
    {
      if ( this.parent.subweblets[this.initpar.okweblets[i]] != this )
        this.parent.subweblets[this.initpar.okweblets[i]].showValue(this);
    }
  }
  
  weblet.copy = function()
  {
    this.obj.copy = true;
    try { return this.ok(); } catch (e) { this.obj.copy = false; this.exception(e) };
    return true;
  }

  weblet.showValue = function(weblet)
  {
    if ( weblet == null ) return;
    
    if ( typeof weblet.act_values.queryid == 'undefined' || weblet.act_values.queryid == null || weblet.act_values.queryid == "" )
      this.add();
    else
      MneAjaxWeblet.prototype.showValue.call(this, weblet);
  }
  
  weblet.ok = function()
  {
    var i;
    var p = this.getParam({});
    
    
    for ( i in this.initpar.okweblets )
    {
      p = this.parent.subweblets[this.initpar.okweblets[i]].getParam(p);
      this.parent.subweblets[this.initpar.okweblets[i]].ok = function() {};
    }

    this.okaction = "mod";

    p = this.getIdparam(p);
    if ( this.obj.copy == true )
      p = this.addParam(p, "copy", true);
    p = this.addParam(p, "unionnumInput.old", this.act_values.unionnum);
    p = this.addParam(p, "schemaInput.old", this.act_values.schema);
    p = this.addParam(p, "queryInput.old", this.act_values.query);
    
    p = this.addParam(p, "sqlend", 1);
    
    this.obj.copy = false;
    
    if ( MneAjaxWeblet.prototype.write.call(this, "/db/admin/query/ok.xml",  p ) == 'ok' )
    {
      /*
      this.setValue(this.act_values);
      for ( i in this.initpar.okweblets )
      {
        if ( typeof this.parent.subweblets[this.initpar.okweblets[i]].ok_ready != 'undefined' )
          this.parent.subweblets[this.initpar.okweblets[i]].ok_ready(this);
      }
      
       */
      this.showValue(this);
      this.setDepends('ok');
      return false;
    }
    return true;
  }

  weblet.del = function()
  {
    var i;
    var p = this.getParam({});
    
    p = this.getIdparam(p);
    p = this.addParam(p, "sqlend", 1);
   
    if ( this.confirm("#mne_lang#Query wirklich löschen") != true )
      return false;

    if ( MneAjaxWeblet.prototype.write.call(this, "/db/admin/query/del.xml",  p ) == 'ok' )
    {
      this.add();
      return false;
    }
    return true;
  }
}
