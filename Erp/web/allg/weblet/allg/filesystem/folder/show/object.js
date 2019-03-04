// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/filesystem/folder/show
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
    stylePath : null,
    styleName : 'filesystem.css',
    
    action : '/file/ls.xml',
    
    diraddaction : '/file/mkdir.xml',
    dirdelaction : '/file/rmdir.xml',

    fileaddaction : '/file/mkfile.html',
    filedelaction : '/file/rmfile.xml',
    filelinkaction : '/file/mklink.xml',
    filedownloadaction : '/file/download.html',

    mvaction : '/file/mv.xml',
    
    popupadd : 'fileadd',
    popuprename : 'filerename',
    popupselect : 'dirselect',
    
    sorttyp : { FD_NAME : 0, FD_CREATE : 1, FD_MOD : 2, FD_ACCESS : 3 },
  
      withdir : false,
     showpath : true,
     needmove : false,
    delbutton : '',
    
    startdir : '',

  };

  var svalues = 
  {
  };

  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
      dirselectButton : { checktype : { reg : '#', help : "#mne_lang#Verzeichnis auswählen"} },
      dirlistButton   : { checktype : { reg : '#', help : "#mne_lang#Listenansicht"} },
      dirsymbolButton : { checktype : { reg : '#', help : "#mne_lang#Symbolansicht"} }
  }

  if ( weblet.obj.title  != null && weblet.initpar.showpath )
    {
    weblet.obj.title.innerHTML     = '<div id="dirselectButton" class="button dirselect"></div> <div style="display:inline-block"></div>';
    weblet.obj.title = weblet.obj.title.lastChild;
    }
  if ( weblet.obj.titleright != null ) weblet.obj.titleright.innerHTML = '<div id="dirlistButton" class="button dirlist"></div><div id="dirsymbolButton" class="button dirsymbol"></div>' + weblet.obj.titleright.innerHTML;

  weblet.findIO(attr);
  weblet.findIO(attr, weblet.obj.titlecontainer);

  weblet.obj.viewtype = ( typeof weblet.win.mne_config.dirtype == 'undefined' ) ? 'list': weblet.win.mne_config.dirtype;
  weblet.obj.rframe   = {};
  weblet.obj.noselect = true;
  weblet.obj.dragit   = false;
  
  weblet.obj.filesystempath = weblet.path;
  weblet.act_values = { dir : weblet.initpar.startdir, path : weblet.initpar.startdir.replace(/\//g, "->"), filename : null };
  
  MneAjax.prototype.load.call(weblet, weblet.obj.filesystempath + "/object_list.js");
  try { eval(weblet.req.responseText); } catch(e) { weblet.exception("load list:",e); }

  MneAjax.prototype.load.call(weblet, weblet.obj.filesystempath + "/object_rsymbol.js");
  try { eval(weblet.req.responseText); } catch(e) { weblet.exception("load rsymbol:",e); }

  MneAjax.prototype.load.call(weblet, weblet.obj.filesystempath + "/object_edit.js");
  try { eval(weblet.req.responseText); } catch(e) { weblet.exception("load edit:",e); }


  weblet.showValue = function(weblet, param)
  {
    
    if ( weblet == null || this.eleIsNotdefined(weblet.act_values))
    {
      this.act_values = {};
      this.act_values.dir = this.initpar.startdir;
      this.act_values.path =  this.initpar.startdir.replace(/\//g, "->");
      this.act_values.filename = null;
      weblet = this;
    }
    
    if ( this.obj.title.className.indexOf("modifyok") >= 0)
    {
      if ( this.confirm('#mne_lang#Reihenfolge wurde verändern - neu anzeigen ?') != true )
        return;
    }

    if ( weblet != this )
    {
      if ( typeof param != 'undefined' && param.setdependid == "del" )
      {
        if ( this.act_values.dir == weblet.act_values.dir && weblet.act_values.filename == null )
        {
          this.act_values.dir = weblet.act_values.parentdir;
          this.act_values.path = weblet.act_values.parentpath;
          this.act_values.filename = null;
        }
      }
      else
      {
        this.act_values = {};
        this.act_values.dir = weblet.act_values.dir;
        this.act_values.path = ( weblet.act_values.filename == null ) ? weblet.act_values.path : weblet.act_values.parentpath;
        this.act_values.filename = null;
      }
    }

    this.eleMkClass(this.obj.title, "modifyok", false);
    this.obj.noselect = false;
    
    this.closepopups();
    this.init(this, param);
    this["init" + this.obj.viewtype](this, param);
    
    if ( this.obj.title != null && this.initpar.showpath ) this.obj.title.innerHTML = this.act_values.path + '&nbsp;<div id="dirselectButton" class="button search"></div>';
    this.findIO(attr, this.obj.titlecontainer);

    MneAjaxWeblet.prototype.readData.call(this, this);
    
    this["show" + this.obj.viewtype]();
    
    if ( this.initpar.delbutton != '' )
    {
      var b = this.initpar.delbutton.split(',');
      for ( var i=0; i < b.length; i++)
      {
        if ( typeof this.obj.buttons[b[i]] != 'undefined')
        {
          this.obj.buttons[b[i]].parentNode.removeChild(this.obj.buttons[b[i]]);
          delete this.obj.buttons[b[i]];
        }
      }
    }
  }    
  
  weblet.readDataParam = function(weblet, param)
  {
    var p = ( typeof param == 'undefined' ) ? {} : param;
    
    p['rootInput.old'] = this.initpar.root;
    p['dirInput.old'] = weblet.act_values.dir;
    p['idname'] = "fullname";
    p['singledir'] = 1;
    p['sorttyp'] = this.obj.sorttyp;
   
    return p;
  }
  
  weblet.init = function(weblet, param)
  {
      var attr = {};
      
      MneAjax.prototype.load.call(this, this.obj.filesystempath + "/view_" + this.obj.viewtype + ".html");
      this.obj.contentframe.innerHTML = this.req.responseText;
      this.eleMkClass(this.scrollframe, "fileshow fileshow_" + this.obj.viewtype, true, 'fileshow'); 

      this.findIO(attr);
  }
  
  weblet.dirselect = function()
  {
    this.openpopup(this.initpar.popupselect);
    return false;
  };

  weblet.ispicture = function(name)
  {
    str = name.toLowerCase().split('.');
    if ( str.length > 1 )
      switch(str[str.length - 1] )
      {
      case "jpg" :
      case "jpeg" :
      case "png" :
      case "tiff" :
      case "gif" :
        return true;

      default:
        return false;
      }
    
    return false;
  }
  
  weblet.dirlist = function()
  {
      this.win.mne_config.dirtype = this.obj.viewtype = 'list';
      this.showValue(this);
      this.obj.buttons.dirlist.blur();
  }
  
  weblet.dirsymbol = function()
  {
      this.win.mne_config.dirtype = this.obj.viewtype = 'rsymbol';
      this.showValue(this);
      this.obj.buttons.dirsymbol.blur();
  }
  
  weblet.onbtnclick = function(id, button)
  {
    if ( button.weblet.oid == this.initpar.popupselect )
    {
      this.act_values.dir = button.weblet.act_values.menuid;
      this.act_values.path = button.weblet.act_values.path;
      this.act_values.filename = null;
      this.showValue(this);
      this.setDepends('dirselect')
    }
  };
}
