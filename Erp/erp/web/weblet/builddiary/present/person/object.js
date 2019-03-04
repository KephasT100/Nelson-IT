{
  var i,str;
  var btable, row;
  
  var ivalues = 
  {
      okschema : 'mne_builddiary',
      okfunction : 'present_mod',
      
      typ : '0',
      idname : 'timeid',
      
      okdepend : 'builddiary',
      
      multiselect : false,
      commentpopup : 'commentlist'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadbase('weblet/allg/table/filter', weblet);
  weblet.obj.mkbuttons.push( { id : 'comment', value : weblet.txtGetText('#mne_lang#Komentare'), behind : 'showdetail'} );
  
  weblet.showValuefilter = weblet.showValue;
  weblet.showValue = function(weblet, param)
  {
    if ( typeof weblet != 'undefined' && weblet != null ) this.obj.idvalue = weblet.act_values[this.initpar.idname];
    return this.showValuefilter(weblet, param);
  }
  
  weblet.comment = function()
  {
    if ( typeof this.act_values.personid == 'undefined' )
    {
      this.warning("#mne_lang#Bitte eine Person auswählen");
      return;
    }
    
    var popupname = this.initpar.commentpopup;
    if ( typeof popupname != 'undefined')
    {
      var popup = this.parent.popups[popupname];
      var param = { popup : true };
      if ( typeof popup != 'undefined' )
      {
        popup.show(false,false);
        if ( popup.weblet.showValue(this, param ) == false )
          popup.hidden();
      }
    }
    return false;
  }

  weblet.rhidden = function()
  {
    var popupname = this.initpar.commentpopup;
    if ( typeof popupname != 'undefined')
    {
      var popup = this.parent.popups[popupname];
      if ( typeof popup != 'undefined' )
          popup.hidden()
    }
  }

  weblet.clickBodyfilter = weblet.clickBody;
  weblet.clickBody = function(tab)
  {
    if ( typeof this.obj.rte != 'undefined' && this.obj.rte != null )
    {
      try 
      {
      this.obj.okshowvalue = false;
      if ( this.obj.rte.weblet.isModifed() == true )
        this.obj.rte.weblet.obj.editor.save(true);
      this.obj.rte.hidden();
      this.obj.rte = null;
      this.obj.okshowvalue = true;
      }
      catch(e)
      {
        this.obj.okshowvalue = true;
      }
    }
    
    var result = this.clickBodyfilter(tab);
    var popupname = this.initpar.commentpopup;
    if ( typeof popupname != 'undefined')
    {
      var popup = this.parent.popups[popupname];
      if ( typeof popup != 'undefined' )
      {
        if ( popup.isclose != true )
          popup.weblet.showValue(this, { popup : true } )
      }
    }
  };
  
  weblet.okfilter = weblet.ok;
  weblet.ok = function(setdepend, rownum, showvalue )
  {
    var personid = this.act_values.personid;
    var result = this.okfilter(setdepend,rownum, this.obj.okshowvalue );
    var w = this.parent.subweblets[this.initpar.okdepend];
    
    if ( result == false && typeof w != 'undefined' && personid == w.act_values.personid )
      w.showValue(null);

    return result;
  }

  weblet.onbtnclickfilter = weblet.onbtnclick; 
  weblet.onbtnclick = function(id, button)
  {    
    if ( this.inputlist == null && id == 'ok'  )
    {
      var p =
      {
          schema : this.initpar.okschema,
          name : this.initpar.okfunction,
          
          par0 : '################',
          typ0 : "text",
          par1 : button.weblet.act_values.personid,
          typ1 : "text",
          par2 : this.obj.idvalue,
          typ2 : "text",
          par3 : 'true',
          typ3 : "bool",
          par4 : 'true',
          typ4 : "bool",
          par5 : this.initpar.typ,
          typ5 : "long",
          par6 : '0',
          typ6 : "long",
          par7 : '',
          typ7 : "text",
          par8 : '',
          typ8 : "text",
          par9 : false,
          typ9 : "bool",
          
          sqlend : 1   
      }

      MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p);
      var w = this.parent.subweblets[this.initpar.okdepend];
      
      if ( typeof w != 'undefined' && button.weblet.act_values.personid == w.act_values.personid )
        w.showValue(null);
    }
    
    this.onbtnclickfilter(id, button)
  }
  
  weblet.del = function()
  {
    var p =
    {
        schema : this.initpar.okschema,
        name : this.initpar.okfunction,
        
        par0 : this.act_values.presentid,
        typ0 : "text",
        par1 : this.act_values.personid,
        typ1 : "text",
        par2 : this.obj.idvalue,
        typ2 : "text",
        par3 : 'false',
        typ3 : "bool",
        par4 : 'false',
        typ4 : "bool",
        par5 : this.initpar.typ,
        typ5 : "long",
        par6 : '0',
        typ6 : "long",
        par7 : '',
        typ7 : "text",
        par8 : '',
        typ8 : "text",
        par9 : false,
        typ9 : "bool",
        
        sqlend : 1   
    }
    var result = MneAjaxWeblet.prototype.func.call(this, p, 'dummy');
    var w = this.parent.subweblets[this.initpar.okdepend];
    
    if ( typeof w != 'undefined' )
      w.showValue(null);
   
    return result;
  }
  
}
