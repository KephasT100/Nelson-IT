// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/procedures/detail
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadClass("MneEditArea", "editarea/editarea.js");
  
  weblet.loadview();

  weblet.findIO(
      {
        ownerButton: { value : weblet.txtGetText("#mne_lang#Auswahl") },
        provolatileInput : { selectlist : "provolatile" },
      }
  );
  
  weblet.showLabel();

  weblet.obj.editarea = new MneEditArea(window, "textEdit");
  weblet.obj.editarea.show();
  
  weblet.btnrequest.add    = "/db/utils/connect/func/mod.xml";
  weblet.btnrequest.mod    = "/db/utils/connect/func/mod.xml";
  weblet.btnrequest.del    = "/db/utils/connect/func/del.xml";

  weblet.titleString.add = weblet.txtGetText("#mne_lang#neue Funktion");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Funktion bearbeiten");
  
  weblet.defvalues = { provolatile : 'v' };
  
  weblet.showValue = function(weblet, param)
  {
    if ( weblet == null ) { this.add(false); return; }

    MneAjaxWeblet.prototype.showValue.call(this,weblet,param);
    this.obj.editarea.setText(this.obj.inputs.text.value);
  };
  
  weblet.ok = function()
  {
    this.obj.inputs.text.value = this.obj.editarea.getText();
    return MneAjaxWeblet.prototype.ok.call(this);
  };
  
  weblet.getParam = function(pp)
  {
    var p = pp;
    p = this.addParam( {sqlend : 1}, 'par0', this.obj.inputs.schema);
    p = this.addParam( p,  'par1', this.obj.inputs.fullname);
    p = this.addParam( p,  'par2', this.obj.inputs.rettype);
    p = this.addParam( p,  'par3', this.obj.inputs.text);
    p = this.addParam( p,  'par4', this.obj.inputs.asowner.checked ? "true" : "false");
    p = this.addParam( p,  'par5', this.obj.inputs.provolatile );

    p = this.addParam( p, 'type0', '#text');
    p = this.addParam( p, 'type1', '#text');
    p = this.addParam( p, 'type2', '#text');
    p = this.addParam( p, 'type3', '#text');
    p = this.addParam( p, 'type4', '#bool');
    p = this.addParam( p, 'type5', '#text');
    return p;
  };

  weblet.del = function(setdepend)
  {
    var p = { sqlend : 1 };
    p = this.addParam( p, 'schemaInput.old', this.obj.inputs.schema);
    p = this.addParam( p, 'fullnameInput.old', this.obj.inputs.fullname);

    if ( this.confirm(this.txtSprintf(this.txtGetText('#mne_lang#Funktion <$1> wirklich löschen ?'),this.obj.inputs.fullname.value)) != true )
        return false;

    MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest.del, p) == 'ok') this.add(setdepend);
    return false;
  };
  
  weblet.owner = function()
  {
    this.parent.subweblets[this.id + 'owner'].popup.show();
    this.parent.subweblets[this.id + 'owner'].showValue(this);
    this.parent.subweblets[this.id + 'owner'].onbtnobj = this;
    return false;
  };
  
  weblet.onbtnok = function(button)
  {
    var p;
    
    if ( button.weblet.oid == 'detailowner' )
    {
      p = this.addParam( {sqlend : 1}, 'schema', 'pg_catalog');
      p = this.addParam( p,  'table', 'pg_proc');
      p = this.addParam( p,  'proownerInput', this.parent.subweblets[this.id + 'owner'].act_values.id);
      p = this.addParam( p,  'oidInput.old', this.obj.inputs.id);

      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
      if ( MneAjaxWeblet.prototype.write.call(this, "/db/utils/table/modify.xml", p) == 'ok')
      {
        this.obj.outputs.ownername.firstChild.data = this.parent.subweblets[this.id + 'owner'].act_values.name;
        this.clearModify();
        this.parent.subweblets[this.id + 'owner'].popup.hidden();
      }
      return false;
    }
    else
    {
      return MneAjaxWeblet.prototype.onbtnok.call(this, button);
    }

  };
  
  weblet.wresize = function()
  {
    var h = this.origframe.offsetHeight;
    var t = this.posGetTop(this.obj.editarea.frame, this.origframe);
    
    var w = this.origframe.offsetWidth;
    var l = this.posGetLeft(this.obj.editarea.frame, this.origframe);
    
    this.obj.editarea.frame.style.width = ( w - l - 24 ) + "px";
    this.obj.editarea.frame.style.height = ( h - t - 14 ) + "px";
    this.obj.editarea.resize();
  };
  
  {
    var self = weblet;
    window.setTimeout(function() { self.wresize(); }, 100);
  }
}
