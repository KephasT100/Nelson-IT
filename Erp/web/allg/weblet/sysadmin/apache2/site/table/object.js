// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/apache2/site/table
// ================================================================================
{
  var i;
  var str = "";
  var row;
  var btable;
  var path = weblet.path;

  var ivalues = 
  {
              shownull : true,

             valuepre  : '/sysexec/apache2/site/rdconfig',

                schema : 'mne_system',
                query  : 'apachesite',

                  cols : 'apachesiteid,enabled,domain,alias,documentroot,httpsonly',
                 scols : 'apachesiteid',
                 
                 tablehidecols: '',
                 
                 tablecoltype : ',bool,,,,bool',
                 
                 popup : 'sitedetail',
                 
              okschema : 'mne_system',
              oktable : 'apachesite',
              
              okcols : 'apachesiteid,enabled,,,,httpsonly',
              okids : 'apachesiteid',

             okpost : '/sysexec/apache2/site/enable',
  
                 };

  weblet.initDefaults(ivalues);

  weblet.loadbase('/weblet/allg/table/filter', weblet);
  weblet.obj.mkbuttons.push({ id : 'certadd', value : weblet.txtGetText("#mne_lang#Add Zertifikat"), behind : 'showdetail', space : 'before' } );
  weblet.obj.enablebuttonsvalue.push('certadd');
  
  weblet.reset = function()
  {
    this.parent.popups.certadd.hidden();
    MneAjaxWeblet.prototype.reset.call(this);
  }
  
  weblet.showValueFilter = weblet.showValue;
  weblet.showValue = function(weblet, param)
  {
    this.showValueFilter(weblet, param)  
  }
  
  weblet.certadd = function()
  {
    this.act_values.dir = "";
    this.openpopup("certadd").weblet.obj.inputs.filename.value = this.act_values.apachesiteid + ".crt";
    
  }
  
  weblet.onbtnclickfilter = weblet.onbtnclick;
  weblet.onbtnclick = function(id, button)
  {
    if ( button.weblet.id  == 'popupcertadd' )
    {
      this.parent.popups.certadd.hidden();
      this.ok();
      return;
    }
  
    return weblet.onbtnclickfilter(id, button);
  }
}
