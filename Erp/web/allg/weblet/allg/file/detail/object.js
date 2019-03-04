// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/file/detail
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
      schema            : '',
      query             : '',
      table             : '',
      typselectlist     : 'documenttyp',

      refidname         : '',
      refnamename       : '',
      secondrefidname   : '',
      secondrefnamename : '',
      
      fileidname        : 'fileid'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput             : false,
      sendframe          : { weblet : weblet },
      refidInput         : { notclear : true, inputcheckobject : 'refname' },
      refnameOutput      : { notclear : true },
      secondrefidInput   : { notclear : weblet.initpar.secondrefidname != '' },
      secondrefnameOutput: { notclear : weblet.initpar.secondrefnamename != '' },
      typInput           : { selectlist : weblet.initpar.typselectlist } 

  };

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("fileid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Datei hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Hinzugefügte Datei bearbeiten");

  weblet.defvalues = { typ : 'other', author : window.mne_config.fullname };
  
  weblet.sendready = function()
  {
    var e;

    this.obj.sendform = this.frame.sendframe.contentDocument.getElementById("sendform");
    this.obj.sendform.dataInput.weblet = this;
    this.obj.sendform.dataInput.onchange = function()
    {
      try { this.weblet.data_change(this); } catch (e) { this.webet.exception("MneFile: ", e); }
    };

    var body = this.frame.sendframe.contentDocument.body;
    this.frame.sendframe.style.width  = body.scrollWidth + "px";
    this.frame.sendframe.style.height = body.scrollHeight + "px";
    this.frame.sendframe.style.overflow = "hidden";

    if ( typeof this.popup != 'undefined' )
      this.popup.resize(true,false);

    this.obj.sendform.action = "/db/utils/table/modify.html";

    e = this.doc.createElement('input');
    e.name = "schema";
    e.type = "hidden";
    e.value = this.initpar.schema;
    this.obj.sendform.appendChild(e);

    e = this.doc.createElement('input');
    e.name = "table";
    e.type = "hidden";
    e.value = this.initpar.table;
    this.obj.sendform.appendChild(e);

    this.obj.fileid = e = this.doc.createElement('input');
    e.name = this.initpar.fileidname + "Input.old";
    e.type = "hidden";
    this.obj.sendform.appendChild(e);

    e = this.doc.createElement('input');
    e.name = "sqlend";
    e.type = "hidden";
    e.value = '1';

  };

  weblet.dataready = function()
  {
    try 
    {
      if ( this.frame.sendframe.contentDocument.getElementsByTagName("body")[0].innerHTML == 'ok' )
      {
        var obj = { act_values : {} };
        var i = null;
        for ( i in this.act_values ) obj.act_values[i] = this.act_values[i];
        
        if ( this.initpar.refidname != '')
        {
          obj.act_values[this.initpar.refidname] = obj.act_values.refid;
          obj.act_values[this.initpar.refnamename] = obj.act_values.refname;
        }
        
        if ( this.initpar.secondrefidname)
        {
          obj.act_values[this.initpar.secondrefidname] = obj.act_values.secondrefid;
          obj.act_values[this.initpar.secondrefnamename] = obj.act_values.secondrefname;
        }
        
        this.showValue(obj);
      }
      else
      {
        this.html(this.frame.sendframe.contentDocument.getElementsByTagName("body")[0].innerHTML);
        this.frame.sendframe.src = "/weblet/allg/file/send/view.html";
      }

    }
    catch(e)
    {
      this.exception("MneSupportFile::dataread:", e);
    }
  };

  weblet.enable_buttons = function(enable)
  {
    var i = null;
    for ( i in this.obj.buttons ) this.obj.buttons[i].disabled = enable != true;
  };

  weblet.showValue = function(weblet, param)
  {
    var retval = true;
    
    if ( weblet == this ) return;

    if ( typeof param != 'undefined' && param.popup == true )
      this.obj.nochange = true;

    if ( weblet == null || this.initpar.refidname != '' && (  typeof weblet.act_values[this.initpar.refidname] == 'undefined' || weblet.act_values[this.initpar.refidname] == '################')
                        || this.initpar.secondrefidname != '' && (  typeof weblet.act_values[this.initpar.secondrefidname] == 'undefined' || weblet.act_values[this.initpar.secondrefidname] == '################') )
    {
      this.clearModify();
      this.enable_buttons(false);
      this.frame.sendframe.src = "/weblet/allg/file/send/view.html";
      
      retval = false;
    }
    else
    {
      if ( this.initpar.refidname != '' )
      {
        this.act_values.refid = weblet.act_values[this.initpar.refidname];
        this.act_values.refname = ( typeof weblet.act_values[this.initpar.refnamename] != 'undefined' ) ? weblet.act_values[this.initpar.refnamename] : '';
        this.showOutputDefined(this.obj.outputs.refname, weblet.act_values[this.initpar.refnamename], null, false );
        this.showInputDefined (this.obj.inputs.refid,    weblet.act_values[this.initpar.refidname],   null,   false );
      }
      else
      {
        this.act_values.refid = '';
        this.act_values.refname = '';
        this.showOutputDefined(this.obj.outputs.refname, "", null, false );
        this.showInputDefined (this.obj.inputs.refid,    "", null, false );
      }

      if ( this.initpar.secondrefidname != '' )
      {
        this.act_values.secondrefid = weblet.act_values[this.initpar.secondrefidname];
        this.showOutputDefined(this.obj.outputs.secondrefname,  weblet.act_values[this.initpar.secondrefnamename], null, false );
        this.showInputDefined (this.obj.inputs.secondrefid, weblet.act_values[this.initpar.secondrefidname],   null,   false );
      }
      else
      {
        this.act_values.secondrefid = '';
        this.showOutputDefined(this.obj.outputs.secondrefname,  '', null, false );
        this.showInputDefined (this.obj.inputs.secondrefid, '',   null,   false );
      }

      if ( typeof weblet.act_values.fileid == 'undefined' || weblet.act_values.fileid == null || weblet.act_values.fileid == '################' || weblet.act_values.fileid == '' )
      {
        this.clearModify();
        this.add();
      }
      else
        MneAjaxWeblet.prototype.showValue.call(this,weblet);

      this.enable_buttons(true);

      this.frame.sendframe.src = "/weblet/allg/file/send/view.html";
    }
    
    return retval;
    
  };

  weblet.add = function(setdepend)
  {
    this.obj.nochange = false;
    var result = MneAjaxWeblet.prototype.add.call(this,setdepend);
    return result;

  };

  weblet.ok = function(setdepend)
  {

    if ( this.okaction == 'add' && this.obj.sendform.dataInput.value == '' )
    {
      this.error("#mne_lang#Bitte eine Datei auswählen");
      return true;
    }

    this.obj.nochange = false;
    if ( this.obj.inputs.description.value == '' )
      this.obj.inputs.description.value = this.obj.inputs.name.value;

    var result = MneAjaxWeblet.prototype.ok.call(this, false, true, false, false);
    if ( result == false )
    {
      var obj = { act_values : {} };
      var i = null;
      for ( i in this.act_values ) obj.act_values[i] = this.act_values[i];
      
      if ( this.initpar.refidname != '')
      {
        obj.act_values[this.initpar.refidname] = obj.act_values.refid;
        obj.act_values[this.initpar.refnamename] = obj.act_values.refname;
      }
      
      if ( this.initpar.secondrefidname)
      {
        obj.act_values[this.initpar.secondrefidname] = obj.act_values.secondrefid;
        obj.act_values[this.initpar.secondrefnamename] = obj.act_values.secondrefname;
      }
      
      if ( this.obj.sendform.dataInput.value != '' )
      {
        this.obj.fileid.value = this.act_values.fileid;
        this.obj.sendform.submit();
      }
      else
      {
        MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {} );
        this.showValue(obj);
        if ( typeof this.onbtnobj != 'undefined')
          this.onbtnobj.onbtnclick('ok', this.obj.buttons.ok);
      }
      return false;
    }

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {rollback: "true"} );
    return true;
  };

  weblet.data_change = function(ele)
  {
    var value = ele.files.item(0).name.toLowerCase();
    if ( value != this.obj.inputs.name.value )
    {
      if ( this.obj.inputs.name.className.indexOf('modifyok') < 0 && this.obj.nochange != true ) 
      {
        this.obj.inputs.fileid.value = '################';
        this.obj.inputs.name.value = value;
        this.okaction = "add";
        this.obj.title.innerHTML = this.titleString.add;
        this.eleMkClass(this.obj.inputs.name.wrapper, 'modifyok', true, 'modify');
      }
    }
  };
}
