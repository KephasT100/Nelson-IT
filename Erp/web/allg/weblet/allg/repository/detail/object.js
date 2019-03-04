// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/repository/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    stylePath: '/styles',
    styleName : 'repository.css',
    hinput    :  false,
    
    schema    : 'mne_repository',
    query     : 'repository',
    table     : 'repository',
    
    action    : '/db/utils/repository/data.xml',

    root      : 'repository'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview(null, this.path + (( weblet.initpar.views == true ) ? '/views.html' : '/view.html'));

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
  };

  weblet.findIO(attr);
  weblet.showLabel();
  
  weblet.showids = new Array("repositoryid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Aktenordner hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Aktenordner bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Aktenordner <$1> wirklich löschen ?");
  weblet.titleString.delid = 'repositoryid';     
  
  weblet.btnrequest  =
  {
        add : "/db/utils/repository/insert.xml",
        mod : "/db/utils/repository/modify.xml",
        del : '/db/utils/repository/delete.xml',
     commit : '/db/utils/repository/commit.xml',
      send  : '/db/utils/trust/repmail.xml'
  };

  if ( weblet.initpar.views )
    weblet.delbuttons('ok,add,del,cancel');
  else 
    weblet.obj.mkbuttons.push({ id : 'send',  value : this.txtGetText('#mne_lang#Versenden'), space : 'before', before : 'del' });

  weblet.defvalues   = { root : weblet.initpar.root};
  
  //weblet.origframe.mne_myslider.setPosition(30);

  
  weblet.showValue = function(weblet)
  {
    if ( weblet == null || typeof weblet.act_values.repositoryid == 'undefined' || weblet.act_values.repositoryid == null || weblet.act_values.repositoryid == '################')
    {
      this.add();
      return;
    }

    var result = MneAjaxWeblet.prototype.showValue.call(this, weblet );
    
    if ( this.act_values.mustsend[0] != 'f' && this.initpar.views == true )
      this.origframe.style.backgroundColor='#ffA000';
    else
      delete this.origframe.style.backgroundColor;
  };
  
  weblet.del = function( setdepend )
  {
    var p = { sqlend : 1 };
    
    p.schema = this.initpar.schema;
    p.table = this.initpar.table; 

    p = this.getIdparam(p);

    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
      return false;

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest.del, p) == 'ok') this.add(setdepend);
    return false;
  };

  weblet.commit = function( setdepend )
  {
    var p = { sqlend : 1 };
    
    if ( this.obj.inputs.commitmessage.value == "" && this.confirm('#mne_lang#Änderungsmitteilung ist leer - fortfahren ?"') != true )
      return false;
    
    p = this.getIdparam(p);

    p.schema = this.initpar.schema;
    p.table = this.initpar.table; 
    p = this.addParam(p, "commitmessage");

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest.commit, p) == 'ok')
    {
      this.setDepends("commit");
    }
    return false;
  };
  
  weblet.send = function()
  {
    var p = {};
    
    p = this.addParam(p, "repositoryid", this.obj.inputs.repositoryid );

    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest.send, p) == 'ok')
    {
      this.message("#mne_lang#Mails versendet");
      this.setDepends("send");
      return false;
    }
    
    return true;
  };

}
