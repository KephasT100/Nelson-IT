// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/repository/interest/table
// ================================================================================
{
  var i;
  var str = "";
  var e,t,r;
  
  var ivalues = 
  {
      root : 'repository',
      
           filepopup : 'interestsfile',
         personpopup : 'interestsperson',
      delpersonpopup : 'delperson',
      
      interestschema : 'mne_repository',
      interesttable  : 'fileinterests',
     
      filedelaction : '/db/utils/repository/rmfile.xml',
      
      autocommit    : true,
      
      checkid       : 'repositoryid',
      
      menuid : ''
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  MneAjaxWeblet.prototype.loadbase.call(weblet, "/weblet/allg/table/fix", weblet);

  weblet.delbuttons('showdetail,mdel');
  weblet.obj.mkbuttons.push ( { id : 'addperson', value : weblet.txtGetText('#mne_lang#Person hinzufügen#'), behind : 'showdetail', space : 'before', disable : true } ); 
  weblet.obj.mkbuttons.push ( { id : 'delperson', value : weblet.txtGetText('#mne_lang#Person löschen#'),    behind : 'addperson', disable : true  } ); 
  weblet.obj.mkbuttons.push ( { id : 'addfile', value : weblet.txtGetText('#mne_lang#Datei hinzufügen#'),    behind : 'delperson', space : 'before', disable : true  } ); 
  weblet.obj.mkbuttons.push ( { id : 'delfile', value : weblet.txtGetText('#mne_lang#Datei löschen#') ,      behind : 'addfile', disable : true } ); 

  weblet.obj.inputs.hash = weblet.doc.createElement("input");
  weblet.obj.inputs.hash.value = '';
  weblet.obj.inputs.hash.wrapper = weblet.obj.inputs.hash;

  weblet.obj.enablebuttonsvalue.push('addperson');
  weblet.obj.enablebuttonsvalue.push('delperson');
  weblet.obj.enablebuttonsvalue.push('delfile');
  
  weblet.obj.enablebuttons.push('addfile');
  
  weblet.showdvalueBaseTableFix = weblet.showValue;
  weblet.showValue = function(weblet, param)
  {

    this.sh
    var retval = this.showdvalueBaseTableFix(weblet, param);
    
    if ( weblet != this )
    {
      this.parent.popups[this.initpar.filepopup].hidden();
      this.parent.popups[this.initpar.personpopup].hidden();
      this.parent.popups[this.initpar.delpersonpopup].hidden();
    }
    return retval;
  };
  
  weblet.add = function()
  {
  };
  
  
  weblet.addfile = function()
  {
    var popupname = this.initpar.filepopup;
    
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
        this.act_values.menuid = this.initpar.menuid;
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

  weblet.addperson = function()
  {
    var popupname = this.initpar.personpopup;
    
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
  
  
  weblet.delperson = function()
  {
    var popupname = this.initpar.delpersonpopup;
    
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

  weblet.delfile = function(setdepend)
  {
    var p =
    {
        schema : this.initpar.fileschema,
        table  : this.initpar.filetable,
        
        sqlend : "1"
    };

    if ( this.confirm(this.txtSprintf(this.titleString.del, this.txtFormat.call(this, this.act_values[this.titleString.delid], this.typs[this.ids[this.titleString.delid]]) ) ) != true )
      return false;

    p = this.addParam(p, 'rootInput.old', this.initpar.root);
    p = this.addParam(p, 'repositoryidInput.old', this.act_values['repositoryid']);
    p = this.addParam(p, 'dirInput.old', "");
    p = this.addParam(p, 'filenameInput.old', this.act_values['filename']);
    p = this.addParam(p, 'autocommitInput', ( this.initpar.autocommit == true ) ? "true" : "" );

    if ( MneAjaxWeblet.prototype.write.call(this, this.initpar.filedelaction,  p ) == 'ok' )
    {
      this.showValue(this);
      if ( setdepend != false ) this.setDepends("del");
      return false;
    }
    return true;
  };



  weblet.clickBodyFix = weblet.clickBody;
  weblet.clickBody = function(tab)
  {

    this.clickBodyFix(tab);
    
    var cell = tab.act_cell;
    var evt = MneDocEvents.prototype.mkEvent(this.win, tab.act_event);
    if ( cell == null || typeof cell.secvalfield == 'undefined' || evt.noevent == true || evt.target.tagName != 'INPUT') return;
    
    var ajax = new MneAjaxData(this.win);
    var result = '';
    var p =
    {
        schema : this.initpar.interestschema,
        table  : this.initpar.interesttable,
        
        sqlend : "1"
    };

    p = this.addParam(p, "repositoryidInput.old", this.act_values['repositoryid']);
    p = this.addParam(p, "filenameInput.old", this.act_values['filename']);
    p = this.addParam(p, "personidInput.old", cell.secvalfield.value);

    if ( cell.datafield.value == '1' )
    {
      ajax.read("/db/utils/table/data.xml",  p);

      p = this.addParam(p, "activeInput", "true" );
      p = this.addParam(p, "repdateInput", '0');

      if ( ajax.values.length > 0 )
        result = ajax.write('/db/utils/table/modify.xml',  p );
      else
      {
        p = this.addParam(p, "fileinterestsidInput", '################');
        p = this.addParam(p, "repositoryidInput", this.act_values['repositoryid']);
        p = this.addParam(p, "filenameInput", this.act_values['filename']);
        p = this.addParam(p, "personidInput", cell.secvalfield.value);

        result = ajax.write('/db/utils/table/insert.xml',  p );
      }
    }
    else
    {
      p = this.addParam(p, "activeInput", "false" );
      result = ajax.write('/db/utils/table/modify.xml',  p );
    }

    if ( result == 'ok' )
    {
      var r = tab.act_rownum;
      var c = tab.act_colnum;
      var self = this;
      window.setTimeout(function()
      {
        var tab = self.obj.tables.content;
        tab.findCell(tab.body.rows[r].cells[c]);
        if ( typeof tab.act_cell.datafield != 'undefined' )
          self.inSetCursor.call(self, tab.act_cell.datafield);

       }, 0); 
      this.showValue(this);
      this.setDepends("ok");
      return false;
    }

  };
  
  weblet.getIdparam = function(pp)
  {
    var p =
    {
        schema : this.initpar.interestschema,
        table  : this.initpar.interesttable,

        sqlend : "1"
    };

    p = this.addParam(p, "repositoryidInput.old", this.act_values['repositoryid']);
    p = this.addParam(p, "personidInput.old", this.act_values['personid']);

    return p;
  };

  weblet.getParam = function(pp)
  {
    var p =
    {
        schema : this.initpar.interestschema,
        table  : this.initpar.interesttable,

        sqlend : "1"
    };

    p = this.addParam(p, "fileinterestsidInput", '################');
    p = this.addParam(p, "repositoryidInput", this.act_values['repositoryid']);
    p = this.addParam(p, "filenameInput", this.act_values['filename']);
    p = this.addParam(p, "personidInput", this.act_values['personid']);
    p = this.addParam(p, "activeInput", "true" );
    p = this.addParam(p, "repdateInput", '0');

    return p;
  };

  weblet.onbtnclick = function(id, button)
  {
    if ( id == 'ok' && this.inputlist == null )
    {
      
      for ( i in button.weblet.act_values )
        this.act_values[i] = button.weblet.act_values[i];
      
      var tab = this.obj.tables.content;
      var r = tab.act_rownum;
      var c = tab.act_colnum;
      var self = this;

      if ( button.weblet.oid == this.initpar.personpopup )
      {
        this.okaction = 'add';
        MneAjaxWeblet.prototype.ok.call(this);
      }
      else if ( button.weblet.oid == this.initpar.delpersonpopup )
      {
        MneAjaxWeblet.prototype.del.call(this, false);
        this.showValue(this);
        this.setDepends("del");
      }
      else
      {
        return;
      }

      if ( r>=0 && c>=0 )
      {

        window.setTimeout(function()
            {
          var tab = self.obj.tables.content;
          tab.findCell(tab.body.rows[r].cells[c]);
          if ( typeof tab.act_cell.datafield != 'undefined' )
            self.inSetCursor.call(self, tab.act_cell.datafield);

            }, 0); 
      }
    }
  };
 
  }
