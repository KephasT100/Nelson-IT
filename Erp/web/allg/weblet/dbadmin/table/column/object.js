// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/table/column
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();

  var attr =
  {
      hinput : false,
      columnInput : { checktype : weblet.inChecktype.alpha_alphanum },
      lengthInput : { checktype : weblet.inChecktype.num },
  };

  weblet.findIO(attr);
  weblet.showLabel();
 
  weblet.showids = new Array('schema','table','column');
  weblet.defvalues = { schema : null, table : null, column : '', ndpytype : '-1' };
  
  weblet.titleString.add = weblet.txtGetText("#mne_lang#neue Spalte");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Spalte bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Spalte <$1> wirklich löschen");
  weblet.titleString.delid = 'column';
  
  weblet.btnrequest.add    = "/db/admin/table/column/add.xml";
  weblet.btnrequest.mod    = "/db/admin/table/column/mod.xml";
  weblet.btnrequest.del    = "/db/admin/table/column/del.xml";

  weblet.showValue = function(weblet,param)
  {
    if ( typeof weblet.act_values.schema == 'undefined' ||
         typeof weblet.act_values.table  == 'undefined' )
    {
      alert(this.txtGetText('#mne_lang#Bitte erst Tabellen auswählen'));
      return false;
    }
    
    this.act_values.schema = weblet.act_values.schema;
    this.act_values.table  = weblet.act_values.table;

    if ( typeof weblet.act_values.column == 'undefined')
      this.add();
    else
      return MneAjaxWeblet.prototype.showValue.call(this,weblet);
    
    return true;
  };
}