// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/domain/sogo
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema : 'mne_system',
    query  : 'sogo',
    table  : 'sogo',
      
    okpost : '/sysexec/sogo/enable',

  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  weblet.delbuttons('add,cancel');
  weblet.setbuttonpar('ok', 'value', weblet.txtGetText('#mne_lang#Aktivieren#'));

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      passwdInput : { checktype : 'notempty' } 
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("sogoid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Groupware hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Groupware bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Groupware wirklich löschen?");
 
  weblet.defvalues = { sogoid : 0 };
  
  weblet.showValue = function(weblet, param)
  {
    this.disable();
    var p = typeof param != 'undefined' ? param : {} ;
    p.ignore_notfound = 1;
    var result = MneAjaxWeblet.prototype.showValue.call(this, {act_values : { sogoid : '0'} }, p )
    if ( this.values.length == 0 )
    {
      this.add(false);
      return;
    }
    if ( this.obj.inputs.certok.checked && this.obj.inputs.domainok.checked )
      this.enable();
    return result;
  }    
  
  weblet.checkmodified = function()
  {
    return false;
  }
  
  weblet.add = function(setdepend)
  {
    var param;
    
    MneAjaxWeblet.prototype.add.call(this, setdepend);
    this.obj.inputs.certok.checked  = this.obj.inputs.domainok.checked  = false;
    this.disable();

    param =
    {
        "schema" : "mne_system",
        "query"  : "domain",
        "cols"   : "domainid",
        "wcol"   : 'typ,typ',
        "wop"    : '=,o=',
        "wval"   : "primary,second",
        "sqlend" : 1,
        ignore_notfound : 1
    };
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param)
    if ( this.values.length > 0 )
      this.obj.inputs.domainok.checked  = true;

    param =
    {
        "schema" : "mne_system",
        "query"  : "certca",
        "cols"   : "certcaid",
        "sqlend" : 1,
        ignore_notfound : 1
    };
    MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml",  param)
    if ( this.values.length > 0 )
      this.obj.inputs.certok.checked  = true;

    if ( this.obj.inputs.certok.checked && this.obj.inputs.domainok.checked )
      this.enable();
 
    if ( setdepend )
      this.setDepends("add");
  }

}
