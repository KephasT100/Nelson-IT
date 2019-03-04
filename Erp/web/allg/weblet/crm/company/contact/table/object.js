// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/company/contact/table
// ================================================================================
{
  var btable, row;
  
  var ivalues = 
  {
      checkid : 'companyid',
      showtitle : true,

        schema : 'mne_crm',
         query : 'company_contact',
          cols : 'companypersonid,personid,fullname,email,telephonoffice,telephonmobil,description,pcompany',

     tablehidecols : '0,1', 

              showdynpar : '"companyidInput.old" : "companyid"',
        showdynparweblet : 'detail',
        holddynparvalues : true,
        shownull         : true,

        showlabel : { de : 'Mitarbeitenden hinzufügen/ändern', en : 'add/modify employee' },

        popup : 'fullnameedit',
        assoziatepopup : 'contactedit'
  }

  weblet.initDefaults(ivalues);
  weblet.initpar.personpopup = weblet.initpar.popup;
  
  weblet.loadbase('/weblet/allg/table/fix', weblet);
 
  weblet.obj.mkbuttons.push ( { id: 'assoziate', value : weblet.txtGetText('#mne_lang#Assoziierten hinzufügen/ändern'), behind : 'showdetail' });
  
  weblet.obj.enablebuttons.push('assoziate');
  
  weblet.showdetailfixbase = weblet.showdetail;
  weblet.showdetail = function(weblet, param)
  {
    this.initpar.popup = this.initpar.personpopup;
    return this.showdetailfixbase(this.initpar.personpopup );
  }

  weblet.assoziate = function()
  {
    this.initpar.popup = this.initpar.assoziatepopup;
    return this.showdetailfixbase(this.initpar.assoziatepopup );
  }
  
  weblet.delfix = weblet.del;
  weblet.del = function(setdepend)
  {
    var popup;
    if ( this.act_values.companypersonid != '')
      this.initpar.popup = this.initpar.assoziatepopup;
    else
      this.initpar.popup = this.initpar.personpopup;

    return weblet.delfix(setdepend);
    
  }
}