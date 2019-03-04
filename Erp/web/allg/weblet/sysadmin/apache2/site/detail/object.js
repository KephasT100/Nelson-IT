// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/apache2/site/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_system',
    query     : 'apachesite',
    table     : 'apachesite',
    
     okpost : '/sysexec/apache2/site/enable',
    delpost : '/sysexec/apache2/site/cleanup',
    
    noprint_par : true,

  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      renewcertInput : { onchange : function() { this.weblet.renewchange() }}
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("apachesiteid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Webseite hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Webseite bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Webseite <$1> wirklich löschen ?");
  weblet.titleString.delid = 'apachesiteid';     
  
  weblet.defvalues = { apachesiteid : "", enabled : "true" };
  
  weblet.showValue = function(weblet, param)
  {
    var retval;
    if ( weblet == null || this.eleIsNotdefined(weblet.act_values)  || this.eleIsNotdefined(weblet.act_values[this.showids[0]]) || weblet.act_values[this.showids[0]] == '################' )
    {
      this.add();
      return;
    }

    retval = MneAjaxWeblet.prototype.showValue.call(this, weblet, param);
    this.renewchange();
    
    return retval;
  }    
  
  weblet.add = function(setdepend)
  {
    this.create_checkpopup( this.obj.inputs.passwd, MneMisc.prototype.inChecktype.notempty );
    MneMisc.prototype.inClear(this.obj.inputs.passwd);
    return MneAjaxWeblet.prototype.add.call(this, setdepend);
  }

  weblet.renewchange = function()
  {
    if ( this.obj.inputs.renewcert.checked  || this.okaction != 'mod' )
      this.create_checkpopup( this.obj.inputs.passwd, MneMisc.prototype.inChecktype.notempty );
    else
      this.create_checkpopup( this.obj.inputs.passwd, { reg : '' } );

    MneMisc.prototype.inClear(this.obj.inputs.passwd);
  }
  

}
