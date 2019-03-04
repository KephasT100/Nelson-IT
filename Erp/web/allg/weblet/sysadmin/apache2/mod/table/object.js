// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/apache2/mod/table
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
              shownull : true,

             valuepre  : '/sysexec/apache2/mod/rdconfig',
         valuepreerror : '/db/utils/connect/func/execute.xml',
    valuepreerrorparam : { schema : 'mne_system', name : 'apachemod_del', sqlend : 1  },

                schema : 'mne_system',
                query  : 'apachemod',

                  cols : 'apachemodid,enabled',
                 scols : 'apachemodid',
                 
                 tablecoltype : ',bool',
                 
             delbutton : 'mdel,showdetail,exports',
             
             
             okschema : 'mne_system',
              oktable : 'apachemod',
              
              okcols : 'apachemodid,enabled',
              okids : 'apachemodid',

             okpost : '/sysexec/apache2/mod/enable',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadbase('/weblet/allg/table/filter', weblet);
  
  weblet.clickBodyFilter = weblet.clickBody;
  weblet.clickBody = function(tab)
  {
    var w = this;
    this.obj.old_rownum = -1;
    this.clickBodyFilter(tab);
    
    var d = tab.sections['body'].rows[tab.act_rownum].cells[1].datafield;
    if ( typeof d != 'undefined' && d != null && d.className.indexOf('modifyok') != -1 )
      MneDocEvents.prototype.fireEvent.call(this, this.obj.buttons.ok, 'click');
  }

}
