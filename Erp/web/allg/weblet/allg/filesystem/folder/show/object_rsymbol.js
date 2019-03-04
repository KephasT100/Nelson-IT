// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            

//    weblet: allg/filesytem/folder/show list
// ================================================================================
{
  
  MneAjax.prototype.load.call(weblet, weblet.obj.filesystempath + "/view_rsymbol_ele.html");
  weblet.obj.rframe_elehtml = weblet.req.responseText;
  
  weblet.win.mneDocevents.addInterest("mousedown", weblet);
  weblet.win.mneDocevents.addInterest("mouseup", weblet);

  weblet.mousedown = function(evt)
  {
    this.obj.rframe.actimg = null;

    var e = this.findrsymbol(evt.target);
    if ( e != null && e.weblet == this ) this.obj.rframe.actimg = e;
    else return true;
    
    if (  evt.target.tagName == "INPUT" && evt.target.className.indexOf('file_rsymbol_name_selected') >= 0 )
      return true;

    this.obj.rframe.nextimg = this.obj.rframe.actimg.nextSibling;
    
    this.obj.rframe.actimg.posx = this.posGetLeft(this.obj.rframe.actimg, this.doc.body) - evt.clientX;
    this.obj.rframe.actimg.posy = this.posGetTop(this.obj.rframe.actimg, this.doc.body) - evt.clientY 

    this.obj.rframe.actimg.style.left = (this.obj.rframe.actimg.posx + evt.clientX ) + "px";
    this.obj.rframe.actimg.style.top  = (this.obj.rframe.actimg.posy + evt.clientY ) + "px";

    if ( this.obj.dragit == true && evt.shiftKey == false && evt.ctrlKey == false && this.initpar.needmove == true )
      this.win.mneDocevents.addInterest("mousemove", weblet);

    return false;
  }
  
  weblet.mousemove = function(evt)
  {
    var i;
    
    if ( this.obj.rframe.actimg.parentNode != this.doc.body )
    {
      if ( Math.abs(this.obj.rframe.actimg.posx + evt.clientX - this.posGetLeft(this.obj.rframe.actimg,this.doc.body) )  < 10
        && Math.abs(this.obj.rframe.actimg.posy + evt.clientY - this.posGetTop (this.obj.rframe.actimg,this.doc.body) )  < 10 ) 
        return false;

      this.doc.body.appendChild(this.obj.rframe.actimg);
      this.eleMkClass(this.obj.rframe.actimg, "file_rsymbol_ele_move", true);
      this.eleMkClass(this.obj.rframe.emptyframe, "file_rsymbol_ele_empty_active", true);
    }

    this.obj.rframe.actimg.style.left = (this.obj.rframe.actimg.posx + evt.clientX ) + "px";
    this.obj.rframe.actimg.style.top  = (this.obj.rframe.actimg.posy + evt.clientY ) + "px";
    
    if ( this.obj.rframe.overimg != null )
    {
      this.eleMkClass(this.obj.rframe.overimg, "file_rsymbol_ele_over", false);
      this.obj.rframe.overimg = null
    }
    for ( i = this.obj.rframe.frame.firstChild; i != null; i = i.nextSibling )
    {
      if ( i != this.obj.rframe.actimg && this.win.mneDocevents.checkInside(evt, i) )
      {
        this.obj.rframe.overimg = i;
        this.eleMkClass(i, "file_rsymbol_ele_over", true);
       break;
      }
    }
    return false;
  }
  
  weblet.mouseup = function(evt)
  {
    
    if ( this.obj.dragit == true && evt.shiftKey == false && evt.ctrlKey == false )
        this.win.mneDocevents.removeInterest("mousemove", weblet);

    var e = this.findrsymbol(evt.target);
    if ( e == null ) return true;
    
    
    if ( e.weblet != this )
    {
      if ( this.obj.noselect == false && this.win.mneDocevents.checkInside(evt, this.origframe) )
      {
        var p = {};
        action = this.initpar.filelinkaction;
        
        p = this.addParam(p, "rootInput.old", this.initpar.root);
        p = this.addParam(p, "dirInput.old", e.selectdir);
        p = this.addParam(p, "filenameInput.old", e.selectname);
        p = this.addParam(p, "dirInput", this.act_values.dir);
        p = this.addParam(p, "filenameInput", e.selectname);
        if ( MneAjaxWeblet.prototype.write.call(this, action,  p ) == 'ok' )
        {
          this.showValue(this);
          this.setDepends("add");
          return false;
        }
      }
      return false;
    }
    
    if ( this.obj.rframe.actimg == null ) return true;

    var wasmoved = this.obj.rframe.actimg.className.indexOf('file_rsymbol_ele_move') >= 0;

    if ( ! wasmoved )
    {
      if (  evt.target.tagName == "INPUT" && evt.target.className.indexOf('file_rsymbol_name_selected') >= 0 )
        return true;
        
      if ( evt.shiftKey == false && evt.ctrlKey == false )
        this.unselect(true);
      else
      {
        if ( this.obj.rframe.selectimg != null )
        {
          for ( i = this.obj.rframe.selectimg;  i != this.obj.rframe.lastChild; i = i.nextSibling )
            this.eleMkClass(this.obj.rframe.selectimg.text, "file_rsymbol_name_selected", false);
        }
      }
      
      if ( evt.shiftKey == true && this.obj.rframe.selectimg != null )
      {
        var i;
        for ( i = this.obj.rframe.selectimg;  i != null && i != this.obj.rframe.actimg; i = i.nextSibling );
        if ( i == null )
        {
          for ( i = this.obj.rframe.selectimg;  i != null && i != this.obj.rframe.actimg; i = i.previousSibling )
            this.eleMkClass(i, "file_rsymbol_ele_selected", true);
        }
        else
        {
          for ( i = this.obj.rframe.selectimg;  i != null && i != this.obj.rframe.actimg; i = i.nextSibling )
            this.eleMkClass(i, "file_rsymbol_ele_selected", true);
        }
      }
    }

    this.act_values["selectleaf"] = 1;
    this.act_values["selectname"] = this.obj.rframe.actimg.selectname;
    this.obj.rframe.selectimg = this.obj.rframe.actimg;

    { var t = this.obj.rframe.selectimg.text; if ( evt.target.tagName == 'INPUT' ) this.win.setTimeout(function() { t.focus(); t.setSelectionRange(99999,99999)}, 1); }

    this.eleMkClass(this.obj.rframe.selectimg, "file_rsymbol_ele_selected", true);
    this.eleMkClass(this.obj.rframe.selectimg.text, "file_rsymbol_name_selected", true);

    this.eleMkClass(this.obj.rframe.actimg, "file_rsymbol_ele_move", false);
    this.eleMkClass(this.obj.rframe.emptyframe, "file_rsymbol_ele_empty_active", false);

    if (this.initpar.needmove && this.obj.rframe.overimg != null)
    {
      this.eleMkClass(this.obj.title, "modifyok", true);
      if ( this.win.mneDocevents.checkInside(evt, this.origframe) == true )
          this.obj.rframe.nextimg = this.obj.rframe.overimg;
      this.eleMkClass(this.obj.rframe.overimg, "file_rsymbol_ele_over", false);
    }
    else if ( this.obj.rframe.overimg != null )
    {
      this.eleMkClass(this.obj.rframe.overimg, "file_rsymbol_ele_over", false); 
    }

    if ( this.obj.rframe.nextimg == null ) this.obj.rframe.frame.appendChild(this.obj.rframe.actimg);
    else this.obj.rframe.nextimg.parentNode.insertBefore(this.obj.rframe.actimg, this.obj.rframe.nextimg);

 
    this.obj.rframe.nextimg = null;
    this.obj.rframe.actimg = null;
    this.obj.rframe.overimg = null;

    if ( !wasmoved )
    {
      this.clickelement(evt);
    }

    this.setDepends('mouseup');
    return false;
  }
  
  weblet.clickelement = function(evt)
  {
    if ( evt.target.id == 'del' )
    {
      if ( this.delfile(false,false) == false  && this.act_values.selectname == null )
      {
        this.obj.rframe.selectimg.parentNode.removeChild(this.obj.rframe.selectimg);
        this.act_values["selectleaf"] = null;
        this.act_values["selectname"] = null;
      };
    }
  }
  
  weblet.findrsymbol = function(ele)
  {
    var e = ele;
    
    while( e != null && e.id != "element"  && e.file_rsymbol_element != 1 ) e = e.parentNode; 
    return e;
    
  }
  
  weblet.unselect = function(onlyclear)
  {
    
    for ( i = this.obj.rframe.frame.firstChild; i != this.obj.rframe.frame.lastChild; i = i.nextSibling )
    {
      this.eleMkClass(i, "file_rsymbol_ele_selected", false);
      this.eleMkClass(i.text, "file_rsymbol_name_selected", false);
      i.text.value = i.selectname;
    }

    if ( onlyclear ) return;
    
    this.obj.rframe.selectimg = null;
    this.obj.rframe.nextimg = null;
    this.obj.rframe.actimg = null;
    this.obj.rframe.overimg = null;
  }

  weblet.attrrsymbol = 
  {
    addfileButton   : { checktype : { reg : '#', help : "#mne_lang#Datei hinzufügen" } },
    msdelfileButton : { checktype : { reg : '#', help : "#mne_lang#Datei löschen" } },
  };

  weblet.initrsymbol = function(weblet, param)
  {
    this.obj.rframe = { actimg : null, overimg : null, selectimg : null, nextimg : null, emptyframe : this.doc.createElement("div"), modified : false, images : new Array() };
    this.obj.rframe.frame = this.eleGetById(this.frame, "contentFrame");
    this.obj.rframe.emptyframe.className = 'file_rsymbol file_rsymbol_ele_empty'
    this.obj.rframe.emptyframe.innerHTML = this.obj.rframe_elehtml;
    this.eleGetById(this.obj.rframe.emptyframe, "file_rsymbol_ele_img_frame").innerHTML = '<div id="file_rsymbol_ele_frame" class="file_rsymbol_ele_empty"></div>';

    if ( weblet.obj.titleleft != null ) weblet.obj.titleleft.innerHTML = '<div id="addfileButton" class="button fileadd"></div> <div id="msdelfileButton" class="button filedel"></div>';
    this.findIO(this.attrrsymbol, this.obj.titleleft )

  }
  
  weblet.showrsymbol = function()
  {
    var img;
    var r;
    var ele;
    var w = {};
    var date = (new Date()).getTime();
    var item = this.ids['action']; 
    
    w.setValue = function(parameter )
    {

      if ( typeof parameter == 'string' )
        eval("this.act_values = { " + parameter + "}");
      else if ( typeof parameter == 'object' && parameter != null)
        this.act_values = parameter;
      else
        throw { message : "MneAjaxWeblet::setValue::" + this.id + ": Parameter hat falschen Typ" };
    };

    for ( i=0; i<this.values.length; i++ )
    {  
      eval("w." + this.values[i][item]);
      var p =
      {
          "rootInput.old" : this.initpar.root,
          "dirInput.old"  : this.act_values.dir,
          x               : 150,
          y               : 150,
          date            : date 
      }

      p.name = w.act_values.name;
      if ( this.ispicture(w.act_values.name) )
        img = "file/images/mk_icon.php?" + this.mk_param(p);
      else
        img = 'images/filesystem/'+ this.win.mne_config.stylename  + (( w.act_values.leaf ) ? '/' + w.act_values.filetype + '_big.png' : '/folder_big.png');
      
      if ( w.act_values.leaf  || this.initpar.withdir == true )
      {
        ele = this.doc.createElement('div');
        ele.className = 'file_rsymbol';
        ele.id = 'element';
        ele.lastclick = 0;
        ele.innerHTML = this.obj.rframe_elehtml;
        this.eleGetById(ele, "file_rsymbol_ele_img_frame").innerHTML  = '<img id="image" class="file_rsymbol_ele file_rsymbol_ele_img" src="'  + img + '"/>';
        this.eleGetById(ele, "file_rsymbol_ele_text_frame").innerHTML = '<input type="text" id="text" class="file_rsymbol_name" value="' + w.act_values.name + '">';

        var attr =
        {
            text     : { weblet : this, eleframe : ele  },
            element  : { weblet : this, eleframe : ele , selectdir : this.act_values.dir, selectname : w.act_values.name, file_rsymbol_element : 1 },
            del      : { weblet : this, eleframe : ele  },
            image    : { weblet : this }
        };

        this.findIO(attr, ele);
        this.obj.rframe.frame.appendChild(ele);
        
        ele.txtOnkeyup = function(e)
        {
          var evt = this.weblet.evtMkEvent(this.weblet.win, e);
          if (evt.keyCode == 13)
          {
            try
            {
              this.weblet.rename(this.value);
            }
            catch (e)
            {
              this.weblet.exception("rename:", e);
            }
          }
        }
        
      }
    }
    
    this.obj.rframe.frame.appendChild(this.obj.rframe.emptyframe);
    
    this.act_values["selectleaf"] = null;
    this.act_values["selectname"] = null;
  }
  
  weblet.msdelfile = function(setdepend)
  {
    var i;
    try 
    {
      var n;
      if ( this.confirm('#mne_lang#Dateien wirklich löschen ?') == true )
      {
        this.obj.noconfirmmessage = true;
        for ( i = this.obj.rframe.frame.firstChild; i != this.obj.rframe.frame.lastChild;  )
        {
          if ( i.className.indexOf('file_rsymbol_ele_selected') >= 0 )
          {
            this.act_values["selectleaf"] = 1;
            this.act_values["selectname"] = i.selectname;
            this.delfile(false, false);
            n = i;
            i = i.nextSibling;
            n.parentNode.removeChild(n);
          }
          else
          {
            i = i.nextSibling;
          }
        }
        this.obj.noconfirmmessage = false;
      }
    }
    catch(e)
    {
      this.obj.noconfirmmessage = false;
      throw e;
    }

    if ( setdepend != false ) this.setDepends("mdel"); 
  }
}
