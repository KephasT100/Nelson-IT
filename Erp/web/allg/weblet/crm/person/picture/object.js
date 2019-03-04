// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/person/picture
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
      schema            : 'mne_crm',
      table             : 'personpicture'
  };

  weblet.initDefaults(ivalues);
  weblet.loadview();

  var attr = 
  {
      hinput             : false,
      sendframe          : { weblet : weblet },
  };

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.delbuttons('add');
  
  weblet.showids = new Array("personpictureid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Bild hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Bild bearbeiten");

  weblet.defvalues = {};
  
  weblet.sendready = function()
  {
    var e;

    this.obj.sendform = this.frame.sendframe.contentDocument.getElementById("sendform");
    this.obj.sendform.dataInput.weblet = this;
    this.obj.sendform.dataInput.name = "pictureInput";

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
    e.name = "personpictureidInput.old";
    e.type = "hidden";
    e.value = this.obj.inputs.personpictureid.value;
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
      if ( this.frame.sendframe.contentDocument.body.innerHTML == 'ok' )
      {
        var obj = {};
        obj.act_values = this.act_values;

        if ( typeof this.onbtnobj != 'undefined')
          this.onbtnobj.onbtnclick('ok', this.obj.buttons.ok);

        this.popup.hidden();
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

    if ( weblet == null  || typeof weblet.act_values.personid == 'undefined' || weblet.act_values.personid == null || weblet.act_values.personid == '################') 
    {
      this.enable_buttons(false);
      this.frame.sendframe.src = "/weblet/allg/file/send/view.html";
      
      retval = false;
    }
    else
    {

      MneAjaxWeblet.prototype.showValue.call(this, { act_values : { personpictureid : weblet.act_values.personid }}, { ignore_notfound : true } );
      if ( this.values.length == 0 ) this.add();
      this.showInput("personpictureid", weblet.act_values.personid );
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
  
  weblet.cancel = function()
  {
    if ( typeof this.popup != 'undefined' )
      this.popup.hidden();
  }

  weblet.ok = function(setdepend)
  {

    if ( this.obj.sendform.pictureInput.value == '' )
    {
      this.error("#mne_lang#Bitte eine Datei auswählen");
      return true;
    }

    var result = MneAjaxWeblet.prototype.ok.call(this, false, true, false);
    if ( result == false )
    {
        this.obj.fileid.value = this.act_values.personpictureid;
        this.obj.sendform.submit();
        return false;
    }
  };
}
