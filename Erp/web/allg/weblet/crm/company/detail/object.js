// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/company/detail
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      styleName : 'style.css',
      
      schema : 'mne_crm',
      query  : 'company_detail',
       table : 'company',
      
      addrschema : 'mne_crm',
      addrtable  : 'address',

      dataschema : 'mne_crm',
      datatable  : 'companydata',

      ownschema : 'mne_crm',
      owntable  : 'companyown',

      report : 'mne_company_detail',

      reportheader : 'reportheader',
      hinput : false
 };

  weblet.initDefaults(ivalues);

  weblet.loadview();

  var attr = 
  {
      hinput : ( weblet.initpar.hinput == true ),
  }

  weblet.findIO(attr);
  weblet.showLabel();

  if ( typeof weblet.initpar.vcardimport == 'undefined' )
    weblet.obj.buttons.vcard.disabled = true;
  
  weblet.obj.companyownframe = weblet.frame.querySelector('#companyownframe');
    
  weblet.obj.inputs.companyown.onclick = function(evt)
  {
      this.weblet.eleMkClass(this.weblet.obj.companyownframe, 'nocompanyown', ! this.checked );
  }

  weblet.showids = new Array("companyid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Firma hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Firma bearbeiten");
  
  weblet.defvalues = 
  {
       addressid : '################',
    companyownid : '################',
         ownerid : weblet.win.mne_config.personid,
      companyown : false,
       ownername : weblet.win.mne_config.fullname,
     owncurrency : weblet.win.mne_config.currency
  }

  weblet.vcard = function()
  {
    this.parent.popups[this.initpar.vcardimport].show();
    this.parent.subweblets[this.initpar.vcardimport].showValue(this);
    return false;
  }

  weblet.setVcard = function(name, value)
  {
    if ( name == 'city' && this.obj.inputs.cityid.value != '' )
    {
      this.showOutput(this.obj.outputs.city, value);
      return true;
    }
    
    if ( name == 'postcode' && this.obj.inputs.cityid.value != '' )
    {
      this.showOutput(this.obj.outputs.postcode, value);
      return true;
    }
    
    return false;
  }

  weblet.reportheader = function()
  {
    if ( typeof this.parent.popups[this.initpar.reportheader] != 'undefined' )
    {
    this.parent.popups[this.initpar.reportheader].show();
    this.parent.subweblets[this.initpar.reportheader].showValue(this);
    return false;
    }
    
  }

  weblet.add = function()
  {
    this.eleMkClass(this.obj.companyownframe, 'nocompanyown', true );
    return MneAjaxWeblet.prototype.add.call(this);
  }
  
  weblet.ok = function()
  {
    var i;
    var p = {};
    var name = this.act_values.name;
    var id = this.act_values.id;
    var action;
    var result;
    
    if ( this.okaction == 'add' ) action = "/db/utils/table/insert.xml";
    else action = "/db/utils/table/modify.xml";
   
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  this.initpar.table);
    
    p = this.addParam(p, "companyidInput.old", this.act_values.companyid);
    p = this.addParam(p, "companyidInput", this.act_values.companyid);
    
    p = this.addParam(p, "nameInput", this.obj.inputs.company);
    p = this.addParam(p, "sorting");
    p = this.addParam(p, "ownerid");

    p = this.addParam(p, "rollback", true);

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    MneAjaxWeblet.prototype.write.call(this, action,  p );
  
    p = {};
    
    p = this.addParam(p, "schema", this.initpar.dataschema);
    p = this.addParam(p, "table",  this.initpar.datatable);
    
    p = this.addParam(p, "companydataidInput.old", this.act_values.companyid);
    p = this.addParam(p, "companydataidInput",     this.act_values.companyid);
    
    p = this.addParam(p, "categorie");
    p = this.addParam(p, "email");
    p = this.addParam(p, "fax");
    p = this.addParam(p, "http");
    p = this.addParam(p, "language");
    p = this.addParam(p, "telefon");
    p = this.addParam(p, "mobile");
    p = this.addParam(p, "modifyinsert", 1);
    p = this.addParam(p, "rollback", true);

    result = MneAjaxWeblet.prototype.write.call(this, action,  p );

    this.showObject(this.obj.inputs.companyown.checked);
    if ( this.obj.inputs.companyown.checked ) 
    {
      p = {};

      p = this.addParam(p, "schema", this.initpar.ownschema);
      p = this.addParam(p, "table",  this.initpar.owntable);

      p = this.addParam(p, "companyownidInput.old", ( this.act_values.companyownid == '' )? '################' : this.act_values.companyownid);
      p = this.addParam(p, "companyownidInput",     ( this.act_values.companyownid == '' )? '################' : this.act_values.companyownid);

      p = this.addParam(p, "companyidInput", this.act_values.companyid);
      p = this.addParam(p, "currencyInput", this.obj.inputs.owncurrency);
      p = this.addParam(p, "prefixInput", this.obj.inputs.companyownprefix);
      p = this.addParam(p, "account");
      p = this.addParam(p, "blz");
      p = this.addParam(p, "bank");
      p = this.addParam(p, "modifyinsert", 1);
      p = this.addParam(p, "rollback", true);

      result = MneAjaxWeblet.prototype.write.call(this, action,  p );
      
      p = {};

      p = this.addParam(p, "schema", this.initpar.ownschema);
      p = this.addParam(p, "table",  this.initpar.owntable);
      p = this.addParam(p, "currencyInput", this.obj.inputs.owncurrency);
      p = this.addParam(p, "modifyall", '1');
      p = this.addParam(p, "rollback", true);

      result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/modify.xml",  p );
    
    }
    else
    {
      p = {};

      p = this.addParam(p, "schema", this.initpar.ownschema);
      p = this.addParam(p, "table",  this.initpar.owntable);

      p = this.addParam(p, "companyidInput.old", this.act_values.companyid);
      p = this.addParam(p, "rollback", true);

      result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );

    }

    p = {};
    
    p = this.addParam(p, "schema", this.initpar.addrschema);
    p = this.addParam(p, "table",  this.initpar.addrtable);
    
    p = this.addParam(p, "addressidInput.old", this.obj.inputs.addressid);
    p = this.addParam(p, "addressid");
    if ( p.addressidInput == '') p.addressidInput = '################';
    
    p = this.addParam(p, "refidInput", this.act_values.companyid);
    p = this.addParam(p, "addresstypidInput", "000000000001");
    p = this.addParam(p, "postbox");
    p = this.addParam(p, "street");
    p = this.addParam(p, "cityid");
    p = this.addParam(p, "modifyinsert", 1);
    p = this.addParam(p, "rollback", true);
    p = this.addParam(p, "sqlend", 1);

    result = MneAjaxWeblet.prototype.write.call(this, action,  p );
    
    if ( result == 'ok' )
    {
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;

  }
  
  weblet.showValue = function(weblet, param)
  {
    if ( this.eleIsNotdefined( weblet ) || ! this.eleHavevalue(weblet.act_values.companyid) )
    {
      this.add();
      return;
    }
    
    var retval = MneAjaxWeblet.prototype.showValue.call(this, weblet, param);
    if ( typeof this.parent.popups[this.initpar.reportheader] != 'undefined' )
    {
      if ( this.obj.inputs.companyown.checked != true )
      {
        this.parent.popups[this.initpar.reportheader].hidden();
        this.eleMkClass(this.obj.companyownframe, 'nocompanyown', true );
      }
      else
      {
        if ( this.parent.popups[this.initpar.reportheader].isclosed != true )
          this.parent.subweblets[this.initpar.reportheader].showValue(this);
        this.eleMkClass(this.obj.companyownframe, 'nocompanyown', false );
      }
    }
    else
    {
      this.obj.inputs.companyown.checked = false;
      this.eleMkClass(this.obj.companyownframe, 'nocompanyown', true );
      this.obj.inputs.companyown.disabled = true;
    }

    return retval;
  }
  
  weblet.del = function()
  {
      var i;
      var p = {};
      var result;
      
      if ( this.confirm(this.txtSprintf("#mne_lang#Firma <$1> wirklich löschen ?", this.act_values.company)) != true )
        return;
      
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );

      p = this.addParam(p, "schema", this.initpar.addrschema);
      p = this.addParam(p, "table",  this.initpar.addrtable);
      p = this.addParam(p, "addressidInput.old", this.act_values.addressid);
      p = this.addParam(p, "rollback", true);

      result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );

      p = this.addParam({}, "schema", this.initpar.dataschema);
      p = this.addParam(p,  "table",  this.initpar.datatable);
      p = this.addParam(p,  "companydataidInput.old", this.act_values.companyid);
      p = this.addParam(p,  "rollback", true);

      result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
      p = this.addParam({}, "schema", this.initpar.schema);
      p = this.addParam(p,  "table",  this.initpar.table);
      p = this.addParam(p,  "companyidInput.old", this.act_values.companyid);
      p = this.addParam(p,  "rollback", true);
      p.sqlend = 1;

      result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
      
      if ( result == 'ok' )
      {
        this.add();
        return false;
      }
      return true;
  }
  
  weblet.print = function()
  {
    var p =
    {
        wval : this.act_values.companyid,
        wop  : "=",
        wcol : 'companyid',
        sort : '',
        sqlend : 1
    };
    
    MneAjaxWeblet.prototype.print.call(this,p);
    return false;  
  }
  
}
