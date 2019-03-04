// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/table/detail
// ================================================================================
{
  var i;
  var str = "";
  var attr;
  
  weblet.loadview();

  attr =
  {
      schemaInput : { checktype : weblet.inChecktype.alpha_alphanum },
      tableInput :  { checktype : weblet.inChecktype.alpha_alphanum },
      ownerButton : { value :     weblet.txtGetText('#mne_lang#Auswahl')}
  }
  weblet.findIO(attr);
  weblet.showLabel();
  
  weblet.showids = new Array('schema','table');
  weblet.defvalues = { schema : '', table : '' };
  
  weblet.titleString.add = weblet.txtGetText("#mne_lang#neue Tabelle");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Tabelle bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Tabelle wirklich löschen");

  weblet.btnrequest.add    = "/db/admin/table/table/add.xml" 
  weblet.btnrequest.mod    = "/db/admin/table/table/mod.xml" 
  weblet.btnrequest.del    = "/db/admin/table/table/del.xml" 
  
  weblet.del = function()
  {
    this.titleString.del = this.txtSprintf(this.txtGetText("#mne_lang#Tabelle <$1.$2> wirklich löschen"), this.act_values.schema, this.act_values.table);
    return MneAjaxWeblet.prototype.del.call(this);
  }
  
  weblet.showValue = function(w,param)
  {
    var result = MneAjaxWeblet.prototype.showValue.call(this,w,param);

    this.obj.old_schema = this.act_values.schema;
    this.obj.old_table = this.act_values.table;

    return result;
  }

  weblet.cancel = function(setdepend)
  {
    var result = MneAjaxWeblet.prototype.cancel.call(this,setdepend);

    this.showInput("schema",this.obj.old_schema);
    this.showInput("table",this.obj.old_table);

    return result;
  }

  weblet.owner = function()
  {
    this.parent.subweblets[this.id + 'owner'].popup.show();
    this.parent.subweblets[this.id + 'owner'].showValue(this);
    this.parent.subweblets[this.id + 'owner'].onbtnobj = this;
    return false;

  }
  weblet.onbtnok = function(button)
  {
    var p;

    if ( button.weblet.oid == 'detailowner' )
    {

      p = this.addParam( {sqlend : 1}, 'schema', 'mne_catalog');
      p = this.addParam( p,  'name', 'table_owner');

      p = this.addParam( p,  'par0', this.act_values.schema);
      p = this.addParam( p,  'par1', this.act_values.table);
      p = this.addParam( p,  'par2', button.weblet.act_values.name);

      p = this.addParam( p, 'type0', '#text');
      p = this.addParam( p, 'type1', '#text');
      p = this.addParam( p, 'type2', '#text');

      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
      if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/func/execute.xml", p) == 'ok')
      {
        this.obj.outputs.owner.innerHTML = button.weblet.act_values.name;
        this.parent.subweblets[this.id + 'owner'].popup.hidden();
      }
      else
      {
        return true;
      }
      return false;
    }
    else
    {
      return MneAjaxWeblet.prototype.onbtnok.call(this, button);
    }
  }
}
