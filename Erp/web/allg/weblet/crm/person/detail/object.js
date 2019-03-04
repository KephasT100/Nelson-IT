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

    pictureschema : 'mne_crm',
     picturetable : 'personpicture',

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

  weblet.initDefaults(ivalues);
  weblet.loadview();

  var attr =
  {
           hinput : false,
       refidInput : { value : weblet.initpar.refid },
     pictureImage : { 'style.backgroundImage' : "url('weblet/crm/person/detail/female.png')" },
     pictureButton : { disabled : ( typeof weblet.parent.popups[weblet.initpar.picturepopup] == 'undefined') },
    birthdayInput : { inputtyp : 'date' },
  }

  weblet.findIO(attr);
  weblet.showLabel();

  window.setTimeout(function()
 {
    var p = weblet.frame.pictureImage.parentNode;
    var diff = ( p.parentNode.previousElementSibling.offsetHeight - p.parentNode.offsetHeight );
    p.style.height = ( p.offsetHeight + diff ) + "px"
  }, 0);
  
  weblet.obj.mkbuttons.push( { id : 'oaddr', value : weblet.txtGetText("#mne_lang#eigene Adresse#"), space : 'before'});
  weblet.obj.mkbuttons.push( { id : 'raddr', value : weblet.txtGetText("#mne_lang#geerbte Adresse#") });
  
  weblet.showids = new Array("personid");
  weblet.titleString.add = weblet.txtGetText('#mne_lang#Kontakt hinzufügen');
  weblet.titleString.mod = weblet.txtGetText('#mne_lang#Kontakt bearbeiten');
  weblet.titleString.del = weblet.txtGetText('#mne_lang#Kontakt' + ' <$1>  ' + '#mne_lang#wirklich löschen');
  weblet.titleString.delid = 'fullname';
  
  weblet.check_address = function()
  {
    if (this.act_values.addressid != '')
    {
      this.obj.buttons.oaddr.disabled = true;
      this.obj.buttons.raddr.disabled = false;

      if (typeof this.obj.buttons.city != 'undefined')
        this.obj.buttons.city.disabled = false;

      this.obj.inputs.street.disabled = false;
      this.obj.inputs.postbox.disabled = false;
    }
    else
    {
      this.obj.buttons.oaddr.disabled = false;
      this.obj.buttons.raddr.disabled = true;

      if (typeof this.obj.buttons.city != 'undefined')
        this.obj.buttons.city.disabled = true;
      this.obj.inputs.street.disabled = true;
      this.obj.inputs.postbox.disabled = true;
    }
  }

  weblet.showValue = function(weblet)
  {
    if (typeof this.initpar.vcardimport == 'undefined')
      this.obj.buttons.vcard.disabled = true;

    if (weblet == null || typeof weblet.act_values.personid == 'undefined'
        || weblet.act_values.personid == ''
        || weblet.act_values.personid == '################')
    {
      this.add();
      return true;
    }

    MneAjaxWeblet.prototype.showValue.call(this, weblet);
    this.check_address();

    if (this.act_values.havepicture == '1')
      this.frame.pictureImage.style.backgroundImage = "url('/db/utils/table/file.data?schema=mne_crm&table=personpicture&cols=picture&personpictureidInput.old="
                                  + this.act_values.personid
                                  + "&count="
                                  + (new Date()).getTime()
                                  + "&sqlend=1')";
    else if (this.act_values.sex == "1") this.frame.pictureImage.style.backgroundImage = "url('weblet/crm/person/detail/male.png')";
    else this.frame.pictureImage.style.backgroundImage = "url('weblet/crm/person/detail/female.png')";

  }

  weblet.vcard = function()
  {
    this.parent.popups[this.initpar.vcardimport].show();
    this.parent.subweblets[this.initpar.vcardimport].showValue(this);
    return false;
  }

  weblet.setVcard = function(name, value)
  {
    if (name == 'city' && this.obj.inputs.cityid.value != '')
    {
      this.showOutput(this.obj.outputs.city, value);
      return true;
    }

    if (name == 'postcode' && this.obj.inputs.cityid.value != '')
    {
      this.showOutput(this.obj.outputs.postcode, value);
      return true;
    }

    return false;
  }

  weblet.add = function()
  {
    this.act_values.ownerid = this.obj.inputs.ownerid.value = weblet.win.mne_config.personid;
    this.showOutputExists('ownername', weblet.win.mne_config.fullname);

    if (this.initpar.refidname == null)
    {
      this.defvalues['refid'] = '';
      this.defvalues['addressid'] = '################';
    }
    else
    {
      if (this.initpar.refidname[0] != '#')
        eval("this.defvalues['refid'] = " + this.initpar.refidobj + "." + this.initpar.refidname);
      else
        this.defvalues['refid'] = this.initpar.refidname.substr(1);

      eval("this.defvalues['refname'] = " + this.initpar.refidobj + "." + this.initpar.refnamename);

      this.defvalues['addressid'] = '';
    }

    this.frame.pictureImage.src = "weblet/crm/person/detail/female.png";
    MneAjaxWeblet.prototype.add.call(this);
    this.check_address();
    return false;
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

  weblet.oaddr = function()
  {
    if (this.act_values.addressid == '')
      this.act_values.addressid = '################';

    this.check_address();
    this.eleMkClass(this.obj.outputs.city, 'modifyok', true, 'modify');
    return true;
  }

  weblet.raddr = function()
  {
    if (this.act_values.refid != '') this.act_values.addressid = '';

    this.check_address();
    this.eleMkClass(this.obj.outputs.city, 'modifyok', true, 'modify');
    return (this.act_values.refid != '');
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

  weblet.picture = function()
  {
    if (typeof this.initpar.picturepopup != 'undefined')
    {
      var popup = this.parent.popups[this.initpar.picturepopup];
      var param =
      {
        popup : true
      };
      if (typeof popup != 'undefined')
      {
        popup.show(false, false);
        if (popup.weblet.showValue(this, param) == false) popup.hidden();
        popup.weblet.onbtnobj = this;

        {
          var timeout = function()
          {
            popup.resize.call(popup,
                popup.weblet.initpar.popup_resize != false,
                popup.weblet.initpar.popup_repos == true);
          };
          window.setTimeout(timeout, 10);
        }
      }
    }
    return false;
  };

  weblet.refname = function()
  {
    if (this.act_values.refid != '')
    {
      var w = this.parent;
      var val =
      {
        companyid : this.act_values.refid
      };
      w.show(this.initpar.companyweblet);
      w.subweblets[this.initpar.companyselect].setValue(val);
      return false;
    }
    return false;
  }

  weblet.onbtnclick = function(id, button)
  {
    if (this.inputlist != null)
    {
      if (this.inputlist.element == 'refname')
      {
        if (this.act_values.addressid == '################')
          this.act_values.addressid = '';
        this.check_address();

      }
    }
    else if (button.weblet.oid = this.initpar.picturepopup)
    {
      this.showValue(this);
    }
  }

}
