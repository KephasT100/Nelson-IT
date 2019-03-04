// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/reference/select
// ================================================================================
{
  var row;
  var btable;
  var path = weblet.path;
  
  var ivalues = 
  {
     schema : 'mne_crm',
     query  : 'reference',
     
     cols   : 'refid,ref,companyid,personid,ownerrefid,ownerrefname,reftyp,refname',
     scols  : 'reftyp,refname',

     tablehidecols : '0,1,2,3,4,5',
     
     selcol : 'refname',
     
     delbutton : 'showdetail,del',
  }

  weblet.initDefaults(ivalues);

  weblet.loadbase('weblet/allg/table/select', weblet);

  weblet.obj.mkbuttons.push( { id : 'company', value : weblet.txtGetText("#mne_lang#Firma hinzufügen"), space : 'before'} );
  weblet.obj.mkbuttons.push( { id : 'person',  value : weblet.txtGetText("#mne_lang#Person hinzufügen"), space : 'before'} );

  weblet.company = function()
  {
    this.initpar.popup = this.oid + 'company';
    this.initpar.showid = 'companyid';
    
    var popup = this.parent.popups[this.initpar.popup];
    var param = { popup : true };
    
    this.act_values.companyid = '################';
    this.act_values.company = '';
    this.act_values.ref = 'company';
    
    if ( typeof popup != 'undefined' )
    {
      this.obj.popup = popup;
      popup.show(false,false);
      if ( popup.weblet.showValue(this, param ) == false )
        popup.hidden();
      popup.weblet.onbtnobj = this;

      if ( typeof this.popup != 'undefined' ) this.popup.hidden();

      {
        var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize == true, popup.weblet.initpar.popup_repos == true); };
        window.setTimeout(timeout, 10);
      }
    }
    
    return false;
  }

  weblet.person = function()
  {
    this.initpar.popup = this.oid + 'person';
    this.initpar.showid = 'personid';
    var popup = this.parent.popups[this.initpar.popup];
    var param = { popup : true };

    this.act_values.personid = '################';
    this.act_values.fullname = '';
    this.act_values.ref = 'person';

    if ( typeof popup != 'undefined' )
    {
      this.obj.popup = popup;
      popup.show(false,false);
      if ( popup.weblet.showValue(this, param ) == false )
        popup.hidden();
      popup.weblet.onbtnobj = this;

      if ( typeof this.popup != 'undefined' ) this.popup.hidden();
      
      {
        var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize == true, popup.weblet.initpar.popup_repos == true); };
        window.setTimeout(timeout, 10);
      }
    }
    
    return false;
  }
}
