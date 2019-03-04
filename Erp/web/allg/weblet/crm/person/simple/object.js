// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/person/detail
// ================================================================================
{
  var i;
  var str = "";

  var ivalues =
  {
           schema : 'mne_crm',
            query : 'person_detail',

            table : 'person',

       dataschema : 'mne_crm',
        datatable : 'persondata',

       addrschema : 'mne_crm',
        addrtable : 'address',

  personnalschema : 'mne_personnal',
   personnaltable : 'personowndata',

     passwdschema : 'mne_system',
      passwdtable : 'personsharepasswd',

      skillschema : 'mne_personnal',
       skilltable : 'personskill',

         refidobj : 'weblet',
        refidname : 'companyid',
      refnamename : 'company',
      
           report : 'mne_person',
     picturepopup : 'picture',

    companyweblet : 'crm_company',
    companyselect : 'all',
      
        delschema : 'mne_crm',
      delfunction : 'person_del',

  };

  var svalues =
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr =
  {
           hinput : false,
    birthdayInput : { inputtyp : 'date' },
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("personid");
  weblet.titleString.add = weblet.txtGetText('#mne_lang#Person hinzufügen');
  weblet.titleString.mod = weblet.txtGetText('#mne_lang#Person bearbeiten');
  weblet.titleString.del = weblet.txtGetText('#mne_lang#Person' + ' <$1>  ' + '#mne_lang#wirklich löschen');
  weblet.titleString.delid = 'fullname';
  
  weblet.defvalues['addressid'] = '################';

  weblet.showValue = function(weblet)
  {
    if (weblet == null || typeof weblet.act_values.personid == 'undefined' || weblet.act_values.personid == '' || weblet.act_values.personid == '################')
    {
      this.add();
      return true;
    }

    return MneAjaxWeblet.prototype.showValue.call(this, weblet);
  }

  weblet.ok = function()
  {
    var i;
    var p = {};
    var name = this.act_values.name;
    var id = this.act_values.id;
    var action;
    var result;

    if (this.okaction == 'add')
    {
      action = "/db/utils/table/insert.xml";
    }
    else
    {
      action = "/db/utils/table/modify.xml";
    }

    p = this.addParam({}, "schema", this.initpar.schema);
    p = this.addParam(p, "table", this.initpar.table);

    p = this.addParam(p, "personidInput.old", this.act_values.personid);
    p = this.addParam(p, "personidInput", this.act_values.personid);

    if ( typeof this.obj.inputs.refid != 'undefined' ) p = this.addParam(p, "refid");
    p = this.addParam(p, "firstname");
    p = this.addParam(p, "lastname");
    p = this.addParam(p, "ownerid");
    p = this.addParam(p, "sex");
    p = this.addParam(p, "sign");
    p = this.addParam(p, "sorting");

    p = this.addParam(p, "rollback", true);

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml", {});
    MneAjaxWeblet.prototype.write.call(this, action, p);

    p = this.addParam({}, "schema", this.initpar.dataschema);
    p = this.addParam(p, "table", this.initpar.datatable);

    p = this.addParam(p, "persondataidInput.old", this.act_values.personid);
    p = this.addParam(p, "persondataidInput", this.act_values.personid);

    p = this.addParam(p, "birthday");
    p = this.addParam(p, "email");
    p = this.addParam(p, "http");
    p = this.addParam(p, "role");
    p = this.addParam(p, "telephonoffice");
    p = this.addParam(p, "telephonpriv");
    p = this.addParam(p, "telephonmobil");
    p = this.addParam(p, "language");
    p = this.addParam(p, "modifyinsert", 1);
    p = this.addParam(p, "rollback", true);

    result = MneAjaxWeblet.prototype.write.call(this, action, p);

    if (this.act_values.addressid != '')
    {
      p = {};

      p = this.addParam(p, "schema", this.initpar.addrschema);
      p = this.addParam(p, "table", this.initpar.addrtable);

      p = this.addParam(p, "addressidInput.old", this.act_values.addressid);
      p = this.addParam(p, "addressidInput", this.act_values.addressid);

      p = this.addParam(p, "refidInput", this.act_values.personid);
      p = this.addParam(p, "addresstypidInput", "000000000001");
      p = this.addParam(p, "postbox");
      p = this.addParam(p, "street");
      p = this.addParam(p, "cityid");
      p = this.addParam(p, "modifyinsert", 1);
      p = this.addParam(p, "rollback", true);
      p = this.addParam(p, "sqlend", 1);

      result = MneAjaxWeblet.prototype.write.call(this, action, p);
    }
    else
    {
      p = this.addParam({}, "schema", this.initpar.addrschema);
      p = this.addParam(p, "table", this.initpar.addrtable);
      p = this.addParam(p, "refidInput.old", this.act_values.personid);
      p = this.addParam(p, "addresstypidInput.old", "000000000001");
      p = this.addParam(p, "rollback", true);
      p = this.addParam(p, "sqlend", 1);

      result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml", p);
    }

    if (result == 'ok')
    {
      this.showValue(this);
      this.setDepends("showValue");
      return false;
    }
    return true;

  }

  weblet.del = function()
  {
    var i;
    var p =
    {
        schema : this.initpar.delschema,
        name   : this.initpar.delfunction,

        par0   : this.getParamValue(this.obj.inputs.personid),
        
        sqlend : 1
    }
    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
      return false;

    return MneAjaxWeblet.prototype.func.call(this, p );
  }

  weblet.cancel = function()
  {
    this.showValue(this);
    return false;
  }

  weblet.print = function()
  {
    var p =
    {
      wval : this.act_values.personid,
      wop : "=",
      wcol : 'personid',
      sort : '',
      sqlend : 1
    };

    MneAjaxWeblet.prototype.print.call(this, p);
    return false;
  }
}
