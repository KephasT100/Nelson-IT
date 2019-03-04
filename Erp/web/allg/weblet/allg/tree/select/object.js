// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/tree/select
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
    closepopupok  : true,
    weblet        : weblet
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  

  if ( ( typeof weblet.initpar.popup == 'undefined' || typeof weblet.parent.subweblets[weblet.initpar.popup] == 'undefined' ) &&  typeof weblet.initpar.addaction == 'undefined' && typeof weblet.initpar.delaction == 'undefined' )
  {
    weblet.loadview(weblet.contentframe, weblet.path + "/view_select.html");
    weblet.obj.mkbuttons = 
      [
        { id : 'reload', value : weblet.txtGetText('#mne_lang#Aktualisieren'), space : 'behind' },
        { id : 'ok',     value : this.txtGetText('Ok')},
        { id : 'cancel', value : this.txtGetText('#mne_lang#Abbrechen')},
      ];
  }
  else
  {
    weblet.loadview();
    weblet.obj.mkbuttons = 
      [
        { id : 'reload', value : weblet.txtGetText('#mne_lang#Aktualisieren'), space : 'behind' },
        { id : 'ok',     value : this.txtGetText('Ok')},
        { id : 'cancel', value : this.txtGetText('#mne_lang#Abbrechen')},
        { id : 'add',    value : ( typeof weblet.initpar.popup != 'undefined' && typeof weblet.parent.subweblets[weblet.initpar.popup] != 'undefined') ? weblet.txtGetText("#mne_lang#hinzufügen/ändern") : this.txtGetText('#mne_lang#Hinzufügen'), show : ! ( typeof weblet.initpar.delaction == 'undefined' && typeof weblet.initpar.table == 'undefined' && ( typeof weblet.initpar.popup == 'undefined' || typeof weblet.parent.subweblets[weblet.initpar.popup] == 'undefined' )) },
        { id : 'del',    value : this.txtGetText('#mne_lang#Löschen'), space : 'after', show : ! ( typeof weblet.initpar.delaction == 'undefined' && typeof weblet.initpar.table == 'undefined' && ( typeof weblet.initpar.popup == 'undefined' || typeof weblet.parent.subweblets[weblet.initpar.popup] == 'undefined' )) },
        { id : 'rename', value : this.txtGetText('#mne_lang#Umbenennen'), show : ! ( weblet.initpar.noleaf != true ) },
      ];
  }

  var attr =
  {
  };
  weblet.findIO(attr);

  weblet.eleMkClass(weblet.frame, 'treeselect', true );
  weblet.loadClass("MneAjaxMenu", "menu/mne_amenu.js");
  if ( typeof weblet.initpar.classname == 'undefined') weblet.initpar.classname = 'tree';

  weblet.initpar.showsubmenu = true;
  weblet.obj.menu = new MneAjaxMenu(weblet.win, weblet.obj.outputs.tree, weblet.initpar);
  weblet.obj.menuparam = weblet.initpar;
  weblet.obj.menuparam.weblet = weblet;

  weblet.act_values.parentid = '';
  weblet.act_values.parentname = '';
  weblet.act_values.item = '';
  
  weblet.titleString.del = '<$1> #mne_lang#Wirklich Löschen';
  weblet.titleString.delid = 'parentid';
  
  weblet.reset = function()
  {
    if ( typeof this.obj.menu != 'undefined' && this.obj.menu != null )
       this.obj.menu.release();

    return MneAjaxWeblet.prototype.reset.call(this);
  };

  weblet.setValue = function(param)
  {
    var i = 0;
    if ( typeof param == 'string' ) eval("param = {" +  param + "}");

    this.showOutputExists(this.obj.outputs.path, this.obj.menu.act_action.path);
    
    for ( i in param )
      this.act_values[i] = param[i];

    if ( typeof param.menuid != 'undefined' )
    {
      if ( param.menuid.indexOf("ref") == 0 )
      {
        this.act_values.parentid = "";
        this.act_values.parentname = "";
        
        this.obj.inputs.parentname.value = this.act_values.parentname;
        this.act_values.item = '';
        this.obj.inputs.item.value = this.act_values.item;

        this.act_values.refid    = param.menuid.substr(3);
        this.act_values.refname  = param.name;
        this.obj.inputs.parentname.value = this.act_values.refname;
      }
      else
      {
        var a;

        if ( param.submenu == true )
        {
          this.act_values.parentid = param.menuid;
          this.act_values.parentname = param.name;
          this.obj.inputs.parentname.value = this.act_values.parentname;
          
        }
        else
        {
          this.act_values.itemid = param.menuid;
          this.act_values.item = param.name;
          this.obj.inputs.item.value = this.act_values.item;
        }

        a = this.obj.menu.actions[param.menuid];
        if ( typeof a != 'undefined')
        {
          while ( typeof a.rootaction != 'undefined' && a.rootaction != null ) a = a.rootaction;

          if ( a.menuid.indexOf('ref') == 0 )
          {
            this.act_values.refid = a.menuid.substr(3);
            this.act_values.refname = a.name;
          }
      }
      }
    }
    else if ( param.submenu == true )
    {
      this.act_values.parentname = param.name;
      this.obj.inputs.parentname.value = this.act_values.parentname;
      
    }
    else
    {
      this.act_values.item = param.name;
      this.obj.inputs.item.value = this.act_values.item;      
    }

  };
  
  weblet.refresh = function(menuid)
  {
     this.obj.menu.refresh(menuid);
  };

  weblet.resize = function()
  {
    if ( typeof this.popup != 'undefined' )
      this.popup.resize(this.initpar.resize == true,this.initpar.repos == true);
  };

  weblet.showValue = function(weblet)
  {
    var i = 0,n;
    var error_found = false;
    var param = {};

    if ( weblet == null )
    {
      this.act_values.parentid = this.act_values.item = ''; 
    }

    if ( weblet == null || weblet == this ) return; 
    for (i in this.initpar)
      param[i] = this.initpar[i];

    var sw =  ( this.obj.showdynparweblet ) ? this.obj.showdynparweblet : weblet; 
    for (i in this.showdynpar)
      {
        this.obj.havedynpar = true;
        this.obj.showdynparweblet = sw;
        if ( this.showdynpar[i].substr(0,1) == '#' )
        {
          param[i] = this.showdynpar[i].substr(1);
        }
        else if ( this.showdynpar[i].substr(0,1) == '%' )
        {
          n = this.showdynpar[i].substr(1);
          if ( typeof sw.obj.inputs[n] != 'undefined' )
          {
            param[i] = this.getParamValue(sw.obj.inputs[n]);
          }
          else if ( this.initpar.ignore_notdefined != true )
          {
            error_found = true;
            this.error(this.txtSprintf('Inputelement <$1:$2> unbekannt', i, this.showdynpar[i]));
          }
        }
        else if (typeof sw.act_values[this.showdynpar[i]] != 'undefined')
        {
          param[i] = sw.act_values[this.showdynpar[i]];
        }
        else if ( this.initpar.ignore_notdefined != true )
        {
          error_found = true;
          this.error(this.txtSprintf('Parameter <$1:$2> unbekannt', i, this.showdynpar[i]));
        }
      }

      if (error_found)
      {
        for (i in sw.act_values)
          this.warning(i + ": " + sw.act_values[i], true);
        this.warning('Mögliche Werte');
      }
    
    if ( typeof weblet.act_values[this.initpar.refid] != 'undefined')
      this.act_values.refid = this.act_values[this.initpar.refid];
    else
      this.act_values.refid = '';

    if ( typeof weblet.act_values[this.initpar.refname] != 'undefined')
      this.act_values.refname = this.act_values[this.initpar.refname];
    else
      this.act_values.refname = '';
    
    this.act_values.parentid = '';
    this.act_values.parentname = '';
    this.obj.inputs.parentname.value = this.act_values.parentname;
    this.act_values.item = '';
    this.obj.inputs.item.value = this.act_values.item;

    if ( this.obj.havedynpar == true )
    {
      this.obj.menuparam = param;
      this.obj.menuparam.weblet = this;
      if ( typeof this.obj.menu != 'undefined' && this.obj.menu != null )
        this.obj.menu.release();
      this.obj.menu = new MneAjaxMenu(this.win, this.obj.outputs.tree, this.obj.menuparam);
      delete this.act_values.menuid;
    }
  };
  
  weblet.getIdparam = function(pp)
  {
    var cols;
    var p = pp;
    
    if ( this.obj.addactive == true && typeof this.initpar.addaction != 'undefined' )
        return p;
    
    if ( this.obj.delactive == true && typeof this.initpar.delaction  != 'undefined' )
    {
      this.btnrequest['del'] = this.initpar.delaction;
      p = {};
      for ( i in this.initpar.delparam )
        p[i] = eval(this.initpar.delparam[i]);
      
      return p;
    }
    
    p.schema = this.initpar.schema;
    p.table  = this.initpar.table;
    
    cols = this.initpar.dcols.split(',');
    
    p[cols[0] + "Input.old"] = this.act_values.parentid;
    return p;
  };
  
  weblet.getParam = function(pp)
  {
     var cols;
     var i = 0;
     var p;
     
     if ( this.obj.addactive == true && typeof this.initpar.addaction != 'undefined' )
     {
        this.btnrequest['add'] = this.initpar.addaction;
        p = {};
        for ( i in this.initpar.addparam )
          p[i] = eval(this.initpar.addparam[i]);
     }
     else if ( this.obj.delactive == true && typeof this.initpar.delaction  != 'undefined' )
     {
       return {};
     }
     else
     {
       p = pp;

       p.schema = this.initpar.schema;
       p.table  = this.initpar.table;

       cols = this.initpar.ecols.split(',');

       if ( cols.length != 4 && cols.length != 3 )
         throw { message : "Spaltenlänge muss 3 oder 4 sein" };

         p[cols[0] + "Input"] = this.act_values.parentid;
         p[cols[1] + "Input"] = '################';
         p[cols[2] + "Input"] = this.obj.inputs.item.value;
         if ( cols.length == 4 )
           p[cols[3] + "Input"] = this.act_values.refid;

     }
     return p;
  };

  weblet.dblclick = function()
  {
    return this.obj.buttons.ok.onclick.call(this.obj.buttons.ok);
  };
  
  weblet.ok = function()
  {
    return false;
  };
  
  weblet.cancel = function()
  {
    this.onbtnobj = {};
    if ( typeof this.popup != 'undefined' )
      this.popup.hidden();
    return false;
  } ;
  
  weblet.add = function(setdepend)
  {
    var result;
    var i = 0;
    var save = {};
    
    if ( typeof this.initpar.popup != 'undefined' )
    {
      var popup = this.parent.popups[this.initpar.popup];
      popup.show(false,false);
      if ( popup.weblet.showValue(this) == false )
        popup.hidden();
      popup.weblet.onbtnobj = this;
      this.popup.hidden();
      {
        var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize != false, popup.weblet.initpar.popup_repos == true); };
        window.setTimeout(timeout, 10);
      }
      return false;
    }
      
    if ( this.obj.delactive == true ) return;
    
    if ( this.obj.inputs.item.value == '' )
    {
      this.error("#mne_lang#Bitte eine Wert eingeben");
      return true;
    }
    
    for ( i in this.act_values ) save[i] = this.act_values[i];
    
    this.okaction = 'add';
    this.obj.addactive = true;
    result = MneAjaxWeblet.prototype.ok.call(this, false);
    this.obj.addactive = false;
    for ( i in save ) this.act_values[i] = save[i] ;

    if ( typeof this.act_values.menuid == 'undefined')
    {
      if ( typeof this.obj.menu != 'undefined' && this.obj.menu != null )
        this.obj.menu.release();
      this.obj.menu = new MneAjaxMenu(this.win, this.obj.outputs.tree, this.initpar);
    }
    else     
      this.obj.menu.submenu(this.act_values.menuid , true);
    
    return result;
  };
  
  weblet.del = function()
  {
    var result;
    
    if ( typeof this.initpar.popup != 'undefined')
    {
      var popup = this.parent.popups[this.initpar.popup];
      popup.show(popup.weblet.initpar.popup_resize != false, popup.weblet.initpar.popup_repos == true, false );
      popup.weblet.showValue(this);
      popup.weblet.onbtnobj = this;
      popup.weblet.obj.buttons.del.onclick.call(popup.weblet.obj.buttons.del);
      return false;
    }

    if ( this.act_values.parentid.indexOf("ref") == 0 )
    {
      this.error(this.txtGetText("#mne_lang#Kann die Referenz nicht löschen"));
      return;
    }
    
    this.obj.delactive = true;
    result = MneAjaxWeblet.prototype.del.call(this);
    this.obj.delactive = false;
    
    if ( typeof this.act_values.menuid == 'undefined' || typeof this.obj.menu.actions[this.act_values.menuid].rootaction == 'undefined' )
    {
      if ( typeof this.obj.menu != 'undefined' && this.obj.menu != null )
        this.obj.menu.release();
      this.obj.menu = new MneAjaxMenu(this.win, this.obj.outputs.tree, this.initpar);
      delete this.act_values.menuid;
    }
    else
      this.obj.menu.submenu(this.obj.menu.actions[this.act_values.menuid].rootaction.menuid , true);

    this.act_values.parentid = '';
    this.act_values.parentname = '';
    this.obj.inputs.parentname.value = this.act_values.parentname;
    this.act_values.item = '';
    this.obj.inputs.item.value = this.act_values.parentname;

    return result;
  };
  
  weblet.reload = function()
  {
    if ( this.obj.havedynpar == true )
      this.showValue(this.obj.showdynparweblet);
    else
    {

      if ( typeof this.obj.menu != 'undefined' && this.obj.menu != null )
        this.obj.menu.release();
      this.obj.menu = new MneAjaxMenu(this.win, this.obj.outputs.tree, this.obj.menuparam);
      delete this.act_values.menuid;

      this.act_values = {};
      this.act_values.parentid = '';
      this.act_values.parentname = '';
      this.obj.inputs.parentname.value = this.act_values.parentname;
      this.act_values.item = '';
      this.obj.inputs.item.value = this.act_values.parentname;
    }

    return false;
  };

  weblet.rename = function()
  {
    var cols;
    var i = 0;
    var p = {};
    var save = {};


    if ( typeof this.initpar.modaction != 'undefined' )
    {
      this.btnrequest['mod'] = this.initpar.modaction;
      p = {};
      for ( i in this.initpar.modparam )
        p[i] = eval(this.initpar.modparam[i]);
     
    }
    else
    {
      p.schema = this.initpar.schema;
      p.table  = this.initpar.table;

      cols = this.initpar.ecols.split(',');

      if ( cols.length != 4 && cols.length != 3 )
        throw { message : "Spaltenlänge muss 3 oder 4 sein" };

        p[cols[1] + "Input.old"] = this.act_values.menuid;
        p[cols[2] + "Input"] = this.obj.inputs.item.value;
        if ( cols.length == 4 )
          p[cols[3] + "Input"] = this.act_values.refid;
    }

    for ( i in this.act_values ) save[i] = this.act_values[i];    
    if ( p.nosql != true ) 
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );
    
    result = MneAjaxWeblet.prototype.write.call(this, this.btnrequest['mod'],  p ) == 'ok';

    if ( result && this.act_values.submenu == true )
    {
      this.act_values.menuid = this.act_values.menuparentid + "/" + this.obj.inputs.item.value;
      this.obj.inputs.parentname.value = this.obj.inputs.item.value;
      this.obj.inputs.item.value = this.act_values.item = '';
    }

    if ( typeof this.act_values.menuparentid == 'undefined' || this.act_values.menuparentid == null )
    {
      if ( typeof this.obj.menu != 'undefined' && this.obj.menu != null )
        this.obj.menu.release();
      this.obj.menu = new MneAjaxMenu(this.win, this.obj.outputs.tree, this.initpar);
    }
    else
    {
      this.obj.menu.submenu(this.act_values.menuparentid , true);
      if ( this.act_values.submenu == true )
        this.obj.menu.submenu(this.act_values.menuid , true);
    }

    return (result == false);

  };

  weblet.onbtnclick = function(id, button)
  {
    var popup = this.parent.popups[this.initpar.popup];
 
    if ( id == 'del' || id == 'ok' || this.initpar.refresh_allways == true )
    {
      var weblet = ( typeof button != 'undefined' ) ? button.weblet : popup.weblet;
      if ( weblet.errorfound != true )
      {
        if ( ( id == 'ok' || id == 'cancel' ) && this.initpar.notclose != true ) 
          popup.hidden();

        if ( this.initpar.refresh_allways == true )
          this.reload();

        try
        {
          var p =
          {
              schema : this.initpar.schema,
              query  : this.initpar.query,
              cols   : 'action',

              sqlend : 1
          };

          p[weblet.showids[0] + "Input.old"] = weblet.act_values[weblet.showids[0]];

          MneAjaxData.prototype.read.call(this, "/db/utils/query/data.xml", p);
                  
         if ( this.values.length > 0 )
          {
            var id = this.ids['action'];
            var action = this.values[0][id];
            str = action.split("(")[0].replace(/ *$/, "");
            if ( str == 'setValue')
            {
              eval("this." + action);
              this.obj.buttons.ok.onclick.call(this.obj.buttons.ok);
            }
            else
            {
              this.popup.show();
              this.reload();
              return;
            }
          }
          else
          {
            this.popup.show();
            this.reload();
            return;
          }        
        }
        catch(e)
        {
          this.popup.show();
          this.reload();
          return;
        }
      }
    }
  };
}
