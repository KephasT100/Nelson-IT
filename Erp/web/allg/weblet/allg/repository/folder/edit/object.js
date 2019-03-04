// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/repository/folder/edit
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
      styleName : 'style.css',
      root : 'repository',

      diraddaction : '/db/utils/repository/mkdir.xml',
      dirdelaction : '/db/utils/repository/rmdir.xml',

      repaddaction : '/db/utils/repository/addfile.xml',

      fileaddaction : '/db/utils/repository/mkfile.html',
      filedelaction : '/db/utils/repository/rmfile.xml',

      mvaction : '/db/utils/repository/mv.xml',

      view   : 'viewdir',
      filepopup : 'addfile',
      popupname : 'detailpopup',
      
      autocommit : true
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.obj.mkbuttons_type = {
      viewdir : [ 
        { id : 'adddir',     value : weblet.txtGetText('#mne_lang#Ordner Hinzufügen#')},
        { id : 'addfile',    value : weblet.txtGetText('#mne_lang#Datei Hinzufügen#')},
        { id : 'rename',     value : weblet.txtGetText('#mne_lang#Umbenennen#')},
        { id : 'del',        value : weblet.txtGetText('#mne_lang#Löschen#')}
        ],
      viewfile : [
        { id : 'addvfile',   value : weblet.txtGetText('#mne_lang#Datei Hinzufügen#')},
        { id : 'rename',     value : weblet.txtGetText('#mne_lang#Umbenennen#')},
        { id : 'del',        value : weblet.txtGetText('#mne_lang#Löschen#')}
      ],
      viewfileY : [
        { id : 'repadd',       value : weblet.txtGetText('#mne_lang#Datei Hinzufügen#')},
        { id : 'rename',       value : weblet.txtGetText('#mne_lang#Umbenennen#')},
        { id : 'del',          value : weblet.txtGetText('#mne_lang#Löschen#')}
      ],
      viewroot : [ 
        { id : 'adddir',     value : weblet.txtGetText('#mne_lang#Ordner Hinzufügen#')},
        { id : 'addfile',    value : weblet.txtGetText('#mne_lang#Datei Hinzufügen#')},
        ],
  }

  weblet.obj.mkbuttons = weblet.obj.mkbuttons_type[this.initpar.view]
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
  weblet.btnrequest['repadd']  = weblet.initpar.repaddaction;

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

    this.okaction = '';
    this.closepopups();
    
    if ( this.act_values.action == 'submenu' )
    {
      this.obj.delaction = "dirdel";
      if ( this.initpar.view != 'viewdir')
      {
        this.reload = 1;
        this.initpar.view = "viewdir";
        
        this.obj.inputs = {};
        this.load(this.id);

        this.popup.root.style.width = "10px";
        this.popup.root.style.height = "10px";

        var w = this;
        window.setTimeout(function() { w.popup.resize(true,false); }, 100 );


        return this.showValue(weblet);
      }
    }
    else if ( this.act_values.action == 'root' )
    {
      if ( this.initpar.view != 'viewroot' )
      {
        this.initpar.view = "viewroot";
        this.reload = 1;

        this.obj.inputs = {};
        this.load(this.id);

        this.popup.root.style.width = "10px";
        this.popup.root.style.height = "10px";

        var w = this;
        window.setTimeout(function() { w.popup.resize(true,false); }, 100 );

        return this.showValue(weblet);
      }
    }
    else if ( this.act_values.action != 'submenu' )
    {
      this.obj.delaction = "filedel";
      if ( (this.initpar.view != 'viewfile' && this.act_values.status != 'Y') || ( this.initpar.view != 'viewfileY' && this.act_values.status == "Y" ) )
      {
        if ( this.act_values.status == 'Y' )
          this.initpar.view = "viewfileY";
        else
          this.initpar.view = "viewfile";
        this.reload = 1;

        this.obj.inputs = {};
        this.load(this.id);

        this.popup.root.style.width = "10px";
        this.popup.root.style.height = "10px";

        var w = this;
        window.setTimeout(function() { w.popup.resize(true,false); }, 100 );

        return this.showValue(weblet);
      }
    }

    this.act_values.dir = ( this.act_values.menuid.lastIndexOf('/') < 0 ) ? "" : this.act_values.menuid.substring(0,this.act_values.menuid.lastIndexOf('/'));
    this.clearModify();
  };

  weblet.addvfile = function()
  {
    
    var action = this.act_values.menu.actions[this.act_values.menuid].rootaction;
    var filename;

    this.closepopups(true);
    filename = this.act_values.menuid.substr(this.act_values.menuid.lastIndexOf('/') + 1);


    if ( typeof action != 'undefined' )
    {
      this.act_values.menuid  = action.menuid;
      this.act_values.name    = action.name;
      this.act_values.path    = action.path;
      this.act_values.submenu = true;
    }
    else
    {
      this.act_values.action = "root";
      this.act_values.menuid  = "";
      this.act_values.name    = "";
      this.act_values.path    = "";
      this.act_values.submenu = true;
    }

    this.addfile();
    this.parent.popups[this.initpar.filepopup].weblet.obj.inputs.filename.value = filename; 

    return false;
  };

  weblet.addfile = function()
  {
    var popupname = this.initpar.filepopup;

    this.closepopups(true);
    
    this.act_values.repositoryid = this.parent.act_values.repositoryid;
    
   if ( typeof popupname != 'undefined')
    {
      var popup = this.parent.popups[popupname];
      var param = { popup : true, refreshweblet : this.obj.pweblet };
      if ( typeof popup != 'undefined' )
      {
        popup.refreshobj = this;
        popup.hidden = function(e)
        {
          MneAjaxPopup.prototype.hidden.call(this);
          if ( typeof e != 'undefined' && typeof e.target != 'undefined' && e.target.id == 'closebutton' && this.refreshobj.initpar.refresh_allways == true )
            this.refreshobj.refresh.call(this.refreshobj);
        };
        popup.show(false,false);
        if ( popup.weblet.showValue(this, param ) == false )
          popup.hidden();
        popup.weblet.onbtnobj = this;
        popup.weblet.setDepends('popup');

        {
          var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize == true, popup.weblet.initpar.popup_repos == true); };
          window.setTimeout(timeout, 10);
        }
      }
    }
    return false;
    
  };

  weblet.cancelfile = function()
  {
    this.okaction = '';
    return false;
  };
  
  weblet.repadd = function()
  {
    this.okaction = 'repadd';
    return this.ok();
  };
  
  weblet.open_popup = function()
  {
    var popupname = this.initpar.popupname;
    
    this.act_values.repositoryid = this.parent.act_values.repositoryid;
   this.closepopups(true);
    if ( typeof popupname != 'undefined')
    {
      var popup = this.parent.popups[popupname];
      var param = { popup : true, refreshweblet : this.obj.pweblet };
      if ( typeof popup != 'undefined' )
      {
        popup.show(false,false);
        {
          var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize == true, popup.weblet.initpar.popup_repos == true); };
          window.setTimeout(timeout, 10);
        }
        
        return popup.weblet.getFrame();
      }
    }
    return false;
    
  };
  
  weblet.adddir = function()
  {
    var editframe;
    
    this.okaction = 'diradd';
    
    var menu = this.act_values.menu;
    var f;

    if ( this.act_values.action == 'root')
    {
      f = menu.frame;
    }
    else
    {
      var action = this.act_values.menu.actions[this.act_values.menuid];
      if ( action.frame == null || action.frame.parentNode == null)
        menu.submenu(this.act_values.menuid);
      f = action.frame;
    }

    editframe = this.open_popup();
    MneAjax.prototype.load.call(this, this.path + "/rename.html");
    editframe.innerHTML = this.req.responseText;

    this.eleMkElements(editframe);
    this.findIO({}, this.frame, editframe);

    this.clearModify();
    this.showInput("filename", "neu", null, true );
    this.obj.inputs.filename.select();
    this.obj.inputs.filename.focus();
    return false;
  };

  weblet.rename = function()
  {
    this.okaction = 'rename';
    
    if ( this.act_values.action == 'root') return false;

    var editframe = this.open_popup();
    MneAjax.prototype.load.call(this, this.path + "/rename.html");
    editframe.innerHTML = this.req.responseText;

    this.eleMkElements(editframe);
    this.findIO({}, this.frame, editframe);

    this.clearModify();
    this.showInput("filename", this.act_values.name, null, true );
    this.obj.inputs.filename.select();
    this.obj.inputs.filename.focus();
    return false;
  };

  weblet.del = function(setdepend)
  {
    var p = {};

    this.closepopups(true);

    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
      return false;

    p = this.addParam(p, 'rootInput.old', this.initpar.root);
    p = this.addParam(p, 'repositoryidInput.old', this.parent.act_values.repositoryid);
    p = this.addParam(p, 'dirInput.old', this.act_values.dir);
    p = this.addParam(p, 'filenameInput.old', this.act_values.name);
    p = this.addParam(p, 'statusInput.old', this.act_values.status);
    p = this.addParam(p, 'autocommitInput', ( this.initpar.autocommit == true ) ? "true" : "" );

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

  weblet.ok = function(setdepend)
  {
    var p = {};
    var menuid;
    
    this.closepopups(true);

    p = this.addParam(p, 'rootInput.old', this.initpar.root);
    p = this.addParam(p, 'repositoryidInput.old', this.parent.act_values.repositoryid);
    p = this.addParam(p, 'dirInput.old', this.act_values.dir);
    p = this.addParam(p, 'filenameInput.old', this.act_values.name);
    if ( typeof this.obj.inputs.repnote != 'undefined' && this.obj.inputs.repnote != null ) p = this.addParam(p, 'commitmessageInput', this.obj.inputs.repnote.value);
    if ( typeof this.obj.inputs.shortrev != 'undefined' && this.obj.inputs.shortrev != null ) p = this.addParam(p, 'shortrev');
    p = this.addParam(p, 'autocommitInput', ( this.initpar.autocommit == true ) ? "true" : "" );
    switch(this.okaction)
    {
    case 'repadd':
      p = this.addParam(p, 'filenameInput', this.act_values.name);
      menuid = ( typeof this.act_values.rootaction == 'undefined' ) ? '' : this.act_values.rootaction.menuid;
      break;
    case 'rename':
      p = this.addParam(p, 'filename');
      menuid = ( typeof this.act_values.rootaction == 'undefined' ) ? '' : this.act_values.rootaction.menuid;
      break;
    case 'diradd':
      menuid = this.act_values.menuid;
      p = this.addParam(p, 'filename');
      menuid = this.act_values.menuid;
      break;
    default:
      this.error('#mne_lang#Keine Ok - Aktion definiert');
    return true;
    }
 
    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest[this.okaction],  p ) == 'ok' )
    {
      this.act_values.menu.refresh(menuid, true);
      if ( setdepend != false ) this.setDepends("ok");
      return false;
    }
    return true;
  };
  
  weblet.onbtnclick = function(id, button)
  {
    if ( id == 'dataready')
    {
      this.act_values.menu.refresh(this.act_values.menuid, true);
      this.setDepends("dataready");
    }
  };
}
