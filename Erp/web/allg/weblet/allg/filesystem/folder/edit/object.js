// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/filesystem/folder/edit
// ================================================================================
{
  var i;
  var str = "";
  var w;
  
  var ivalues = 
  {
      styleName : 'style.css',

      diraddaction : '/file/mkdir.xml',
      dirdelaction : '/file/rmdir.xml',

      fileaddaction : '/file/mkfile.html',
      filedelaction : '/file/rmfile.xml',

      mvaction : '/file/mv.xml',

      view   : 'viewdir',

      popupadd : 'fileadd',
      popuprename : 'filerename',
    
      noleaf : false
      
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.initpar.view = weblet.initpar.view + (( weblet.initpar.noleaf ) ? "_noleaf" : "");
  MneAjax.prototype.load.call(weblet, weblet.path + "/" + weblet.initpar.view + ".html");
  weblet.frame = weblet.origframe;
  weblet.frame.innerHTML = weblet.req.responseText;

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
  };

  weblet.findIO(attr);

  weblet.btnrequest['diradd']  = weblet.initpar.diraddaction;
  weblet.btnrequest['dirdel']  = weblet.initpar.dirdelaction;
  weblet.btnrequest['fileadd'] = weblet.initpar.fileaddaction;
  weblet.btnrequest['filedel'] = weblet.initpar.filedelaction;
  weblet.btnrequest['rename']  = weblet.initpar.mvaction;

  weblet.titleString.add = weblet.txtGetText("#mne_lang#hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Ordner/Datei <$1> wirklich löschen ?");
  weblet.titleString.delid = 'name';     

  weblet.showValue = function(weblet)
  {

    this.obj.pweblet = weblet;
    if ( typeof weblet != 'undefined' && weblet != null )
      this.act_values = weblet.act_values;
    else
      this.act_values = {};
 
    this.closepopups();
    this.okaction = '';
    this.reload = 0;

    if ( this.act_values.action == 'submenu' )
    {
      this.obj.delaction = "dirdel";
      if ( this.initpar.view.substr(0,7) != 'viewdir')
      {
        this.reload = 1;
        this.initpar.view = "viewdir";
      }
    }
    else if ( this.act_values.action == 'root' )
    {
      if ( this.initpar.view.substr(0,8) != 'viewroot' )
      {
        this.initpar.view = "viewroot";
        this.reload = 1;
      }
    }
    else if ( this.act_values.action != 'submenu' )
    {
      this.obj.delaction = "filedel";
      if ( this.initpar.view.substr(0,8) != 'viewfile' )
      {
        this.initpar.view = "viewfile";
        this.reload = 1;
      }
    }
    
    if ( this.reload )
    {
      this.obj.inputs = {};
      this.load(this.id);

      this.popup.root.style.width = "10px";
      this.popup.root.style.height = "10px";

      var w = this;
      window.setTimeout(function() { w.popup.resize(true,false); }, 100 );

      return this.showValue(weblet);
    }

    this.clearModify();
  };
  

  weblet.addfile = function()
  {
    this.openpopup(this.initpar.popupadd, this.popup.root, { adddir : false});
    this.popup.hidden();
    return false;
  };

  weblet.adddir = function()
  {
    this.openpopup(this.initpar.popuprename, this.popup.root, { adddir : true });
    this.popup.hidden();
    this.obj.refreshmenuid = this.act_values.dir;

    this.parent.subweblets[this.initpar.popuprename].okaction = 'adddir';
    t
    this.parent.subweblets[this.initpar.popuprename].showInput("filename", "neu", null, false );
    this.parent.subweblets[this.initpar.popuprename].obj.inputs.filename.select();
    this.parent.subweblets[this.initpar.popuprename].obj.inputs.filename.focus();
    
    return false;
  };

  weblet.rename = function()
  {
    if ( this.act_values.action == 'root') return false;

    this.openpopup(this.initpar.popuprename, this.popup.root);
    this.popup.hidden();
    
    this.obj.refreshmenuid = ( this.act_values.leaf == "" ) ? this.act_values.parentdir : this.act_values.dir;

    this.parent.subweblets[this.initpar.popuprename].okaction = 'rename';
    this.parent.subweblets[this.initpar.popuprename].showInput("filename", this.act_values.name, null, false );
    this.parent.subweblets[this.initpar.popuprename].obj.inputs.filename.select();
    this.parent.subweblets[this.initpar.popuprename].obj.inputs.filename.focus();
    
    return false;
  };

  weblet.del = function(setdepend)
  {
    var p = {};

    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
      return false;

    p = this.addParam(p, 'rootInput.old', this.initpar.root);
    p = this.addParam(p, 'dirInput.old', this.act_values.dir);
    if ( this.act_values.filename != null )
      p = this.addParam(p, 'filenameInput.old', this.act_values.filename);

    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest[this.obj.delaction],  p ) == 'ok' )
    {
      this.popup.hidden();
      if ( typeof this.act_values.rootaction != 'undefined' )
        this.act_values.menu.refresh(this.act_values.rootaction.menuid, true);
      else
        this.act_values.menu.refresh('', true);
      if ( setdepend != false ) this.setDepends("del");
      return false;
    }
    return true;
  };

  weblet.onbtnclick = function(id, button)
  {
    if ( id == 'dataready')
    {
      this.act_values.menu.refresh(this.act_values.menuid, true);
    }
    else if ( id == 'ok' && button.weblet.oid == this.initpar.popuprename )
    {
      this.act_values.menu.refresh(this.obj.refreshmenuid, true);
      this.act_values.name = button.weblet.act_values.name;
      if ( this.act_values.leaf == "")
      {
        this.act_values.menuid = this.act_values.dir = this.act_values.parentdir + '/' + this.act_values.name;
        this.act_values.path = this.act_values.parentpath + "->" + this.act_values.name;
      }
      else
      {
        this.act_values.filename = this.act_values.name;
        this.act_values.menuid = this.act_values.dir + '/' + this.act_values.name;
        this.act_values.path = this.act_values.parentpath + "->" + this.act_values.name;
      }
      this.setDepends('rename');     
    }

  };
}
