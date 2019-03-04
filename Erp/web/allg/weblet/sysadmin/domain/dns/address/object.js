// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/domain/dns/address
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_system',
    query     : 'dnsaddress',
    
    cols : 'dnsaddressid,name,record,address,fix,mac',
    scols: 'name',
    
    tablehidecols : '0',
    tablecolstyle : 'left,left input15,left,left input20,left bool,left input15',
    tablecoltype  : ',text,selection,text,bool,text',
    
    valuepre : '/sysexec/domain/dns/rdvalue',
    
    okfunction : 'dnsaddress_ok',
    okcols : '0,1,3,2,4,5',
    oktyps : 'text,text,text,text,long,text',
    okpost : '/sysexec/domain/dns/okhost',
    
    delparam : { schema : "mne_system", table : "dnsaddress", delid : "dnsaddressid" },
    delpre   : '/sysexec/domain/dns/delhost',
    delpost  : '/sysexec/domain/dhcp/mkfix',
    
    showlabel : { de : 'hinzufügen', en : 'add' },
    buttonsenable : true,
    
    reshowvalue : true,
    inputlist_ignore_notdefined : true,
    
    popup : null
    
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadbase('/weblet/allg/table/filter', weblet);
  
  weblet.enable();
  weblet.obj.enablebuttons = { 'ok' : weblet.obj.buttons.ok, 'mdel' : weblet.obj.buttons.mdel };
  
  weblet.showdetail = function(setdepend)
  {
    var r = this.obj.tables.content.addRow('################', '', 'A', '', '', '');
    var i;
    var cells = this.obj.tables.content.body.rows[r].cells;
    for ( i in cells )
      if ( typeof cells[i].datafield != 'undefined' && cells[i].datafield.type != "hidden" ) { cells[i].datafield.focus(); break; }
  }

}
