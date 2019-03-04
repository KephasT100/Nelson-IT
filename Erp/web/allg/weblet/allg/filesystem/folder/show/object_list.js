//================================================================================

//Copyright: M.Nelson - technische Informatik
//Die Software darf unter den Bedingungen 
//der APGL ( Affero Gnu Public Licence ) genutzt werden


//weblet: allg/filesytem/folder/show list
//================================================================================
{

  weblet.attrlist = 
  {
      addfileButton   : { checktype : { reg : '#', help : "#mne_lang#Datei hinzufügen" } },
      mldelfileButton : { checktype : { reg : '#', help : "#mne_lang#Datei löschen" } }
  };

  weblet.initlist = function(weblet, param)
  {
    this.obj.tables.content.className = this.obj.tables.content.table.className = "filelist";
    this.obj.tables.content.borderclass = "filelist";
    this.obj.tables.content.multiselect = true;

    this.obj.tables.content.setInvisible(0); 
    this.obj.tables.content.addHead("","","#mne_lang#Name","#mne_lang#Geändert","#mne_lang#letzter Zugriff","#mne_lang#Attribute");
    this.obj.tables.content.sorttyp = new Array(0, 0, this.initpar.sorttyp.FD_NAME, this.initpar.sorttyp.FD_CREATE, this.initpar.sorttyp.FD_MOD, this.initpar.sorttyp.FD_ACCESS )

    this.obj.tables.content.clickCb.body    = function(tab) { tab.weblet.clickBodyList.call(tab.weblet, tab); };
    this.obj.tables.content.clickCb.head    = function(tab) { tab.weblet.clickHeadList.call(tab.weblet, tab); };
    this.obj.tables.content.dblclickCb.body = function(tab) { tab.weblet.dblclickBodyList.call(tab.weblet, tab); };

    if ( weblet.obj.titleleft != null ) weblet.obj.titleleft.innerHTML = '<div id="addfileButton" class="button fileadd"></div> <div id="mldelfileButton" class="button filedel"></div>';
    this.findIO(this.attrlist, this.obj.titleleft )
  }

  weblet.showlist = function()
  {
    var img;
    var r;
    var w = {};
    var item;
    
    w.setValue = function(parameter )
    {

      if ( typeof parameter == 'string' )
        eval("this.act_values = { " + parameter + "}");
      else if ( typeof parameter == 'object' && parameter != null)
        this.act_values = parameter;
      else
        throw { message : "MneAjaxWeblet::setValue::" + this.id + ": Parameter hat falschen Typ" };
    };

    item = this.ids['action']; 

    for ( i=0; i<this.values.length; i++ )
    {  
      eval("w." + this.values[i][item]);

      if ( this.ispicture(w.act_values.name) )
        img = "file/images/mk_icon.php?rootInput.old=" + this.initpar.root + "&dirInput.old=" + this.act_values.dir + '&name=' + w.act_values.name + '&y=15';
      else
        img = 'images/filesystem/'+ this.win.mne_config.stylename  + (( w.act_values.leaf ) ? '/' + w.act_values.filetype + '.png' : '/folder.png');

      r = this.obj.tables.content.add(w.act_values.leaf, "", w.act_values.name, this.txtToDateTime.call(this,w.act_values.modifytime), this.txtToDateTime.call(this,w.act_values.accesstime), this.txtToDateTime.call(this,w.act_values.createtime))
      this.obj.tables.content.body.rows[r].cells[0].style.textAlign = "center";
      if ( this.ispicture(w.act_values.name) )
      {
        img = "file/images/mk_icon.php?rootInput.old=" + this.initpar.root + "&dirInput.old=" + this.act_values.dir + '&name=' + w.act_values.name + '&y=15';
        this.obj.tables.content.body.rows[r].cells[0].innerHTML = '<img class="' + this.obj.tables.content.table.className + '" src="'  + img + '">';
      }
      else
      {
        this.obj.tables.content.body.rows[r].cells[0].innerHTML = '<div class="' + (( w.act_values.leaf ) ? "file file" + w.act_values.filetype : "folder" ) + '"></div>';
      }
    }

    this.act_values["selectleaf"] = null;
    this.act_values["selectname"] = null;
  }

  weblet.clickBodyList = function(tab)
  {
    if ( tab.act_rownum != -1 )
    {
      this.act_values["selectleaf"] = tab.body.origdata[tab.act_rownum][0]
      this.act_values["selectname"] = tab.body.origdata[tab.act_rownum][2];
      this.setDepends('clickbody');
    }
    else
    {
      this.act_values["selectleaf"] = null;
      this.act_values["selectname"] = null;
    }
  }

  weblet.dblclickBodyList = function(tab)
  {
    if ( tab.act_rownum != -1 )
    {
      this.act_values["selectleaf"] = tab.body.origdata[tab.act_rownum][0]
      this.act_values["selectname"] = tab.body.origdata[tab.act_rownum][2];
      if ( this.act_values.selectleaf == false )
      {
        this.act_values.dir = this.act_values.dir + '/' + this.act_values.selectname;
        this.act_values.path = this.act_values.path + ( (this.act_values.path != '' ) ? '->' : '' ) + this.act_values.selectname;
        this.showValue(this);
      }
      else
      {
        this.download();
      }
    }
    else
    {
      this.act_values["selectleaf"] = null;
      this.act_values["selectname"] = null;
    }
  }

  weblet.clickHeadList = function(tab)
  {
    this.obj.sorttyp = tab.sorttyp[tab.tab2col(tab.act_colnum)];
    this.showValue(this);
  }

  weblet.mldelfile = function(setdepend)
  {
    if ( this.obj.noselect ) return false;

    var tab = this.obj.tables.content;
    try 
    {
      var n;

      if ( this.confirm('#mne_lang#Wirklich löschen ?') == true )
      {
        this.obj.noconfirmmessage = true;
        for ( n=0; n<tab.act_rownums.length; n++)
        { 
          this.act_values["selectleaf"] = tab.body.origdata[tab.act_rownums[n]][0]
          this.act_values["selectname"] = tab.body.origdata[tab.act_rownums[n]][2];
          this.delfile(false, false);
        }
        this.obj.noconfirmmessage = false;
      }
    }
    catch(e)
    {
      this.obj.noconfirmmessage = false;
      throw e;
    }

    this.showValue(this);
    if ( setdepend != false ) this.setDepends("mdel"); 
  }
}
