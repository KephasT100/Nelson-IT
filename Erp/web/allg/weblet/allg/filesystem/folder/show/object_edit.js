{

  weblet.titleString.del = weblet.txtGetText("#mne_lang#Ordner/Datei <$1> wirklich löschen ?");
  weblet.titleString.delid = 'selectname';     
  
  weblet.addfile = function()
  {
    if ( this.obj.noselect ) return false;
    
    this.openpopup(this.initpar.popupadd);
    return false;
  };
  
  weblet.rename = function(newname)
  {
    if ( this.obj.noselect ) return false;

    this.act_values.name = this.act_values.selectname;
    var name = ( typeof newname != 'undefined') ? newname : this.act_values.selectname;

    if ( this.act_values.name == null ) return;
    
    this.openpopup(this.initpar.popuprename);
    this.obj.refreshmenuid = ( typeof this.act_values.rootaction == 'undefined' ) ? '' : this.act_values.rootaction.menuid;

    this.parent.subweblets[this.initpar.popuprename].okaction = 'rename';
    this.parent.subweblets[this.initpar.popuprename].showInput("filename", name, null, false );
    this.parent.subweblets[this.initpar.popuprename].obj.inputs.filename.select();
    this.parent.subweblets[this.initpar.popuprename].obj.inputs.filename.focus();
    
    if ( typeof newname != 'undefined' )
      this.win.mneDocevents.fireEvent(this.parent.subweblets[this.initpar.popuprename].obj.buttons.ok, 'click' );
    
    return false;
  };
  
   weblet.delfile = function(setdepend, showvalue)
  {
    var p = {};

    if ( this.obj.noselect || this.act_values.selectname == null ) return false;

    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
      return false;

    var action = ( this.act_values.selectleaf ) ? this.initpar.filedelaction : this.initpar.dirdelaction;
    
    p = this.addParam(p, 'rootInput.old', this.initpar.root);
    p = this.addParam(p, 'dirInput.old', this.act_values.dir);
    p = this.addParam(p, 'filenameInput.old', this.act_values.selectname);

    if ( MneAjaxWeblet.prototype.write.call(this, action,  p ) == 'ok' )
    {
      this.act_values.selectname = null;
      if ( showvalue != false ) { this.eleMkClass(this.obj.title, "modifyok", false); this.showValue(this); }
      if ( setdepend != false ) this.setDepends("del");
      return false;
    }
    return true;
  };

  weblet.download = function()
  {
    var i = null;
    
    var form = this.win.document.createElement("form");
    form.action = this.initpar.filedownloadaction;
    form.method = "post";
    form.style.visibility = "hidden";
    
    this.frame.appendChild(form);

    var p = {};
    p = this.addParam(p, 'rootInput.old', this.initpar.root);
    p = this.addParam(p, 'dirInput.old', this.act_values.dir);
    p = this.addParam(p, 'filenameInput.old', this.act_values.selectname);
    
    for ( i in p )
    {
      form.appendChild(this.doc.createElement('input'));
      form.lastChild.name= i;
      form.lastChild.value = p[i];
    }
    form.submit();
    this.frame.removeChild(form);
    return false;

  };


 }
