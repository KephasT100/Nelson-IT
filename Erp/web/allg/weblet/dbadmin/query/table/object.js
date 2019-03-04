// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/query/table
// ================================================================================
{
  weblet.loadview();

  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");

  weblet.obj.mkbuttons = 
  [
    { id : 'selectcol', value : weblet.txtGetText("#mne_lang#auswählen") },
    { id : 'func', value : weblet.txtGetText("#mne_lang#Funktion") },
  ];

  var attr =
  {
  };
  weblet.findIO(attr);
  
  weblet.showids = new Array("schema","table");

  weblet.obj.tables.columns.weblet = weblet;
  weblet.obj.tables.columns.clickCb['body'] = function(table)
  {
    table.weblet.obj.selectvalue = table.act_text;
  }
  weblet.obj.tables.columns.dblclickCb['body'] = function(table)
  {
    table.weblet.obj.selectvalue = table.act_text;
    table.weblet.selectcol(table.weblet);
  }
  
  weblet.obj.selectweblet = weblet.initpar.selectweblet;
  weblet.setSelectweblet = function(weblet)
  {
    this.obj.selectweblet = weblet;
  }
  
  weblet.showValue = function(weblet, param)
  {
    if ( weblet == null ) return;
    
    MneAjaxWeblet.prototype.showTable.call(this, weblet, param);

    this.act_values.tabnum = (( weblet.act_values.tabnum )? weblet.act_values.tabnum : '');
    this.act_values.schema = weblet.act_values.schema;
    this.act_values.table = weblet.act_values.table;
    
    this.obj.contentframe.querySelector('#tabname').innerHTML = this.act_values.tabnum + ' ' + this.act_values.schema + '.' + this.act_values.table;
  }
  
  weblet.selectcol = function(weblet)
  {
    if ( typeof this.obj.selectweblet == 'string') this.obj.selectweblet = this.parent.subweblets[this.obj.selectweblet];
    if ( typeof this.obj.selectweblet != 'undefined' && this.obj.selectweblet != null )
      this.obj.selectweblet.select(this, this.obj.selectvalue);
    return false;
  }
  
  weblet.func = function(weblet)
  {
    if ( typeof this.obj.selectweblet == 'string') this.obj.selectweblet = this.parent.subweblets[this.obj.selectweblet];
    if ( typeof this.obj.selectweblet != 'undefined' && this.obj.selectweblet != null )
      this.obj.selectweblet.func(this);
    return false;
  }
  
  
}