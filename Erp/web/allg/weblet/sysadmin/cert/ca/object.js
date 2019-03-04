// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: sysadmin/cert/ca
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    schema    : 'mne_system',
    query     : 'certca',
    table     : 'certca',
    
    okpost : '/sysexec/cert/ca/enable',
    noprint_par : true,
    
    filedownloadaction : '/file/download.html',
    root : 'cert',
    dirname : 'ca'
    
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();
  weblet.delbuttons('del,add');
  weblet.obj.mkbuttons.push({ id : 'download', value : weblet.txtGetText("#mne_lang#Download CA#"), space : 'before'});

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      passwdInput : { checktype : 'notempty' } 
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("certcaid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Zertifizierungsstelle hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Zertifizierungsstelle bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Zertifizierungsstelle <$1> wirklich löschen ?");
  weblet.titleString.delid = 'name';     
  
  weblet.defvalues = 
  {
      certcaid : 0,
      country : weblet.win.mne_config.countrycarcode,
      state   : '',
      city    : weblet.win.mne_config.uowncity,
      org     : weblet.win.mne_config.uowncompany,
      orgunit : '',
      email   : weblet.win.mne_config.uownemail
  }
  
  weblet.showValue = function(weblet)
  {
    MneAjaxWeblet.prototype.showValue.call(this, { act_values : {certcaid : 0} }, { ignore_notfound : true });
    if ( this.values.length == 0 )
      this.add();
    
    return true;
  }    
  
  weblet.download = function()
  {
    var i = null;
    
    var form = this.win.document.createElement("form");
    form.action = this.initpar.filedownloadaction;
    form.method = "post";
    form.style.visibility = "hidden";
    
    this.frame.appendChild(form);

    var p = {};
    p = this.addParam(p, 'rootInput.old', this.initpar.root);
    p = this.addParam(p, 'dirInput.old',  this.initpar.dirname);
    p = this.addParam(p, 'filenameInput.old', 'ca.crt');
    
    for ( i in p )
    {
      form.appendChild(this.doc.createElement('input'));
      form.lastChild.name= i;
      form.lastChild.value = p[i];
    }
    form.submit();
    this.frame.removeChild(form);
    return false;

  };


}
