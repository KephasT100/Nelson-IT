// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/tree/show
// ================================================================================
{
  var param;
  var i;
  var showdynpar;

  weblet.loadClass("MneAjaxMenu", "menu/mne_amenu.js");
  if (typeof weblet.initpar.classname == 'undefined') weblet.initpar.classname = 'tree';
  if (typeof weblet.initpar.weblet == 'undefined')    weblet.initpar.weblet = weblet;

  weblet.findIO();
  weblet.obj.mkbuttons = [];

  weblet.obj.refid = null;
  if (typeof weblet.parent.initpar != 'undefined')
  {
    if (typeof weblet.initpar.wcol == 'undefined' && typeof weblet.parent.initpar.wcol != 'undefined' ) weblet.initpar.wcop = weblet.parent.initpar.wcol;
    if (typeof weblet.initpar.wop  == 'undefined' && typeof weblet.parent.initpar.wop  != 'undefined' )  weblet.initpar.wop = weblet.parent.initpar.wop;
    if (typeof weblet.initpar.wval == 'undefined' && typeof weblet.parent.initpar.wval != 'undefined' ) weblet.initpar.wval = weblet.parent.initpar.wval;
    if (typeof weblet.initpar.showdynpar != 'undefined')
    {
      if ( typeof weblet.parent.initpar.showdynpar != 'undefined' )
      {
        eval("showdynpar = {" + weblet.parent.initpar.showdynpar + "}");
        if (typeof showdynpar["wval"] != 'undefined')
        {
          weblet.initpar.wval = weblet.parent.act_values[showdynpar["wval"]];
        }
        if (typeof showdynpar["name"] != 'undefined')
        {
          weblet.initpar.name = weblet.parent.act_values[showdynpar["name"]];
        }
      }
    }
  }
  
  if (!( typeof  weblet.initpar.noreadatload != 'undefined' || ( weblet.initpar.noreadatload == true ) || typeof weblet.initpar.needvalues != 'undefined') )
  {
    weblet.obj.menu = new MneAjaxMenu(weblet.win, weblet.obj.contentframe, weblet.initpar);
    weblet.obj.act_menuid = ' ';
  }
  
  if ( typeof weblet.initpar.popup != 'undefined' && weblet.initpar.popup != null )
    weblet.doc.oncontextmenu = function() { return false; }

  weblet.setValue = function(p, setdepend)
  {
    var result;
    var i;
    var param = p;
    var sub;
    
    if ( typeof this.obj.menu.showcols == 'undefined' && this.sends.length == 1 )
    {
      var s = this.sends[0].split(":");
      if ( typeof this.parent.subweblets[s[0]] != 'undefined' )
        sub = this.parent.subweblets[s[0]];
      else
        sub = this.parent.weblets[s[0]];
      if ( typeof sub != 'undefined' )
        this.obj.menu.showcols = sub.showids;
    }

    if ( typeof param == 'string' )
      eval("param = { " + param + "}");

    if ( typeof this.obj.menu != 'undefined' && typeof this.obj.menu.act_action != 'undefined' && this.obj.menu.act_action != null )
    {
      if ( this.obj.menu.act_action.action == 'submenu')
        this.obj.act_menuid = this.obj.menu.act_action.menuid;
      else
        this.obj.act_menuid = ( typeof this.obj.menu.act_action.rootaction == 'undefined' ) ? '' : this.obj.menu.act_action.rootaction.menuid;
      param.menuid = this.obj.menu.act_action.menuid;
      param.menuparentid =  ( typeof this.obj.menu.actions[param.menuid].rootaction == 'undefined' ) ? null : this.obj.menu.actions[param.menuid].rootaction.menuid;
      param.path = this.obj.menu.act_action.path;
      param.parentpath = this.obj.menu.act_action.parentpath;
      if ( typeof param.name == 'undefined' ) param.name = this.obj.menu.act_action.name; 
    }

    result = MneAjaxWeblet.prototype.setValue.call(this, param, setdepend);
    
    return result;
  }

  weblet.refresh = function(menuid)
  {
    this.obj.menu.refresh(menuid);
  }

  weblet.click = function( evt )
  {
    var popupname = this.initpar.popup;
    var popup;
    if ( typeof popupname != 'undefined' && typeof (popup = this.parent.popups[popupname]) != 'undefined' )
        popup.hidden();   
  }
  
  weblet.click_right = function( evt )
  {
      var popupname = this.initpar.popup;
      if ( typeof popupname != 'undefined')
      {
          var popup = this.parent.popups[popupname];
          var param = { popup : true };
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
              this.act_values = evt.target.action;
              if ( popup.weblet.showValue(this, param ) == false )
                  popup.hidden();
              popup.weblet.onbtnobj = this;

              {
                  var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize == true, false); popup.root.style.top = evt.pageY + "px"; popup.root.style.left = evt.pageX + "px"; }
                  window.setTimeout(timeout, 10);
              }
          }
      }
  }

  weblet.showValue = function(weblet)
  {
    var param = {};
    var i;
    var sub;
    var error_found = false;


    if ( typeof weblet == 'undefined' || weblet == null) return;

    if (weblet == this)
    {
      this.act_values = weblet.act_values;
      return;
    }

    this.act_values = {};
    
    if ( typeof this.initpar.needvalues != 'undefined' )
    {
      var i;
      var check;
      for ( i in this.initpar.needvalues )
      {
        this.obj.contentframe.innerHTML = "";
        check = weblet.act_values[i];
        if ( typeof check == 'undefined' || check == null || check == '' || check == '################' )
          return;
      }
    }

    for (i in this.initpar)
      param[i] = this.initpar[i];

    var sw =  ( this.obj.showdynparweblet ) ? this.obj.showdynparweblet : weblet; 
    for (i in this.showdynpar)
    {
      if ( this.showdynpar[i].substr(0,1) == '#' )
        param[i] = this.showdynpar[i].substr(1);
      else if (typeof sw.act_values[this.showdynpar[i]] != 'undefined')
        param[i] = sw.act_values[this.showdynpar[i]]
      else if ( this.initpar.ignore_notdefined != true )
      {
        error_found = true;
        this.error(this.txtSprintf('Parameter <$1:$2> unbekannt', i, this.showdynpar[i]))
      }
    }
    if (error_found)
    {
      for (i in sw.act_values)
        this.warning(i + ": " + sw.act_values[i], true);
      this.warning('Mögliche Werte')
    }

    this.obj.contentframe.innerHTML = '';
    if ( typeof this.obj.menu != 'undefined' && this.obj.menu != null )
      this.obj.menu.release();

    this.obj.menu = new MneAjaxMenu(this.win, this.obj.contentframe, param);
    this.obj.act_menuid = '';

  };
  
  weblet.onbtninterest_check = function(check, vals)
  {
    var i = null;
    for ( i in check )
      if ( check[i] != vals[i] ) return false;
    
    return ( i != null );
  }
  
  weblet.onbtninterest = function(id, button)
  {
    var i;
    var empty = 1;
    var checkvals = {};
    var act_menuid = this.obj.act_menuid;

    if ( typeof this.obj.menu.showcols == 'undefined' || this.obj.menu.showcols == null )
      return;
      
    if ( id != 'del' && id != 'add' && id != 'ok' && button.needrefresh != true )
      return;

    if ( typeof this.menubutton != 'undefined' && this.initpar.showallways != true && this.menubutton.className.indexOf('active') < 0  )
      return;

    for ( i=0; i< this.obj.menu.showcols.length; i++)
      checkvals[this.obj.menu.showcols[i]] = button.weblet.act_values[this.obj.menu.showcols[i]];

    this.refresh(this.obj.act_menuid);
 
    for ( i in this.obj.menu.actions )
    {
      if ( this.onbtninterest_check(checkvals, this.obj.menu.actions[i].setvals) )
      {
          if ( act_menuid == '' || act_menuid != (( typeof this.obj.menu.actions[i].rootaction == 'undefined' ) ? '' : this.obj.menu.actions[i].rootaction.menuid ) )
          this.refresh(( typeof this.obj.menu.actions[i].rootaction == 'undefined' ) ? '' : this.obj.menu.actions[i].rootaction.menuid);
        break;
      }
    }

    for ( i in this.obj.menu.actions ) { empty = 0; break; }
    if ( empty )
      for ( i in this.obj.menu.actions ) { if ( this.obj.menu.actions[i].action == 'submenu' ) this.obj.menu.action(this.obj.menu.actions[i]); break; }
  }
}