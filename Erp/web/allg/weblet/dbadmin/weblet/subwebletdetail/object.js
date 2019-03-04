// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/weblet/subwebletdetail
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
    editweblet  : 'textedit'
  };

  var svalues = 
  {
  };
  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : false,
      nameInput        : { notclear : true },
      idInput          : { checktype : weblet.inChecktype.alphanum },
      positionInput    : { checktype : weblet.inChecktype.alphanum },
      subpositionInput : { checktype : weblet.inChecktype.num },
      pathInput        : { checktype : weblet.inChecktype.dir },
      initparInput     : { "style.width" : "666px", wrap : "off", spellcheck : false, weblet : weblet, ondblclick  : function() { try { this.weblet.edit(this); } catch(e) { this.weblet.exception(this.weblet.oid + "- edit:", e); } return false; } },
   };

  weblet.findIO(attr);
  weblet.showLabel();
    
  weblet.showids = new Array('htmlcomposetabid');
  weblet.titleString.add = weblet.txtGetText("#mne_lang#neues Subweblet");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Subweblet bearbeiten");
     
  weblet.showValue = function(weblet)
  {

    if ( weblet == null ) return;
    
    if ( typeof this.initpar.editweblet != 'undefined')
      this.parent.popups[this.initpar.editweblet].hidden();
 
    if ( typeof weblet.act_values.htmlcomposeid != 'undefined' || weblet.act_values.htmlcomposeid != null  )
        this.defvalues["htmlcomposeid"] = weblet.act_values.htmlcomposeid;
    else
        this.defvalues['htmlcomposeid'] = 'no weblet';
    
    
    if ( this.eleIsNotdefined(weblet.act_values)  || this.eleIsNotdefined(weblet.act_values[this.showids[0]]) || weblet.act_values[this.showids[0]] == '################' )
    {
      this.add();
      return;
    }

    return MneAjaxWeblet.prototype.showValue.call(this, weblet);
  };
  
  
  weblet.ok = function()
  {

    var p = {};
    var id = this.act_values.id;
    var action;
    var result;
    
    if ( this.okaction == 'add' ) action = "/db/utils/table/insert.xml";
    else action = "/db/utils/table/modify.xml";
   
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  'htmlcomposetab');
    
    p = this.addParam(p, "htmlcomposetabidInput.old", this.obj.inputs.htmlcomposetabid);
    
    p = this.addParam(p, "htmlcomposeid");
    p = this.addParam(p, "htmlcomposetabid");
    p = this.addParam(p, "id");
    p = this.addParam(p, "ugroup");
    p = this.addParam(p, "path");
    p = this.addParam(p, "position");
    p = this.addParam(p, "subposition");
    p = this.addParam(p, "loadpos");
    p = this.addParam(p, "initpar");
    p = this.addParam(p, "depend");
    p = this.addParam(p, "custom");
    p = this.addParam(p, "ownerInput", '');

    p = this.addParam(p, "rollback", true);

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    MneAjaxWeblet.prototype.write.call(this, action,  p );

    p = {};
    
    p = this.addParam(p, "htmlcomposetabidInput.old", this.obj.inputs.htmlcomposetabid);
    
    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  'htmlcomposetabnames');
    p = this.addParam(p, "htmlcomposeid");
    p = this.addParam(p, "htmlcomposetabidInput", this.act_values.htmlcomposetabid);
    p = this.addParam(p, "customInput", this.obj.inputs.namecustom);
    p = this.addParam(p, "label_en");
    p = this.addParam(p, "label_de");
    p = this.addParam(p, "modifyinsert", 1);
    
    p = this.addParam(p, "sqlend", 1);
   
    result = MneAjaxWeblet.prototype.write.call(this, action,  p );
    
    if ( result == 'ok' )
    {
      this.showValue(this);
      return false;
    }
    return true;
  };

  weblet.del = function()
  {
    var p = {};
    var result;
    
    if ( this.confirm(this.txtSprintf(this.txtGetText('#mne_lang#Subweblet <$1> tatsächlich löschen'),this.act_values.id)) != true )
      return false;
    
   MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );

    p = this.addParam(p, "schema", this.initpar.schema);
    p = this.addParam(p, "table",  'htmlcomposetabnames');
    p = this.addParam(p, "htmlcomposetabidInput.old", this.obj.inputs.htmlcomposetabid);
    p = this.addParam(p, "rollback", true);

    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );

    p.table = 'htmlcomposetab';
    p.rollback = false;
    p.sqlend = 1;
    result = MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/delete.xml",  p );
    
    if ( result == 'ok' )
    {
      this.add();
      return false;
    }
    return true;
  };
  
  weblet.edit = function(obj)
  {
    this.act_values.text = obj.value;
    this.obj.act_edit = obj;
    
    if ( typeof this.initpar.editweblet != 'undefined')
    {
      var popup = this.parent.popups[this.initpar.editweblet];
      popup.show(false,false);
      if ( popup.weblet.showValue(this) == false )
      {
        popup.hidden();
        this.obj.act_edit = null;
      }
      else
        popup.weblet.onbtnobj = this;

      {
        var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize != false, popup.weblet.initpar.popup_repos == true); };
        window.setTimeout(timeout, 10);
      }
    }
    return false;
  };
  
  weblet.onbtnclick = function(id, button)
  {
    if ( id == 'ok' )
    {
      if ( this.obj.act_edit !=  null )
      {
        if ( this.obj.act_edit.value != button.weblet.act_values.text )
        {
          this.obj.act_edit.value = button.weblet.act_values.text;
          this.obj.act_edit.onkeyup();
        }
      }
      this.obj.act_edit = null;
    }
  };
}
