// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/file/table
// ================================================================================
{
  var i;
  var str = "";
  var e,t,r;
  
  var ivalues = 
  {
      popupdata  : 'filedata'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  MneAjaxWeblet.prototype.loadbase.call(weblet, "/weblet/allg/table/filter", weblet);
  
  weblet.obj.mkbuttons.push({ id: 'data',     value : weblet.txtGetText('#mne_lang#Editor#'), behind : 'showdetail' } );
  weblet.obj.mkbuttons.push({ id: 'download', value : 'download', disable : true, space : 'before', behind : 'data' } );

  weblet.obj.enablebuttonsvalue.push('download');

  weblet.dblclickBody = function(tab)
  {
    this.clickBody(tab);
    this.download();
  };
  
  weblet.showdetailBaseTableFilter = weblet.showdetail;
  weblet.showdetail = function()
  {
    if ( typeof this.parent.popups[this.initpar.popupdata] != 'undefined' ) this.parent.popups[this.initpar.popupdata].hidden();
    if ( typeof this.parent.popups[this.initpar.popup] != 'undefined' ) this.parent.popups[this.initpar.popup].hidden();
    
    if ( this.act_values.havesource == '#mne_lang#wahr' )
      return weblet.data();
    
    return weblet.showdetailBaseTableFilter();
  };
 
  weblet.download = function()
  {
    var i = null;
    
    var form = this.win.document.createElement("form");
    form.action = '/db/utils/table/' + this.act_values.name;
    form.method = "post";
    form.style.visibility = "hidden";
    
    this.frame.appendChild(form);

    var param =
    {
        schema : this.initpar.schema,
        table  : this.initpar.table,
        cols   : 'data',
        sqlend : '1'
    };
    
    param["fileidInput.old"] = this.act_values.fileid;
    
    for ( i in param )
    {
      form.appendChild(this.doc.createElement('input'));
      form.lastChild.name= i;
      form.lastChild.value = param[i];
    }
    form.submit();
    this.frame.removeChild(form);
    return false;

  };
  
  weblet.data = function()
  {
    if ( typeof this.parent.popups[this.initpar.popup] != 'undefined' ) this.parent.popups[this.initpar.popup].hidden();
    if ( typeof this.initpar.popupdata != 'undefined')
    {
      var popup = this.parent.popups[this.initpar.popupdata];
      var param = { popup : true };
      if ( typeof popup != 'undefined' )
      {
        if ( this.act_values.havesource != '#mne_lang#wahr' || this.obj.tables.content.act_rownums.length != 1 )
        {
          this.act_values.fileid = '################';
          this.obj.tables.content.findCell(null);
        }
        
        if ( typeof this.act_values.fileid == 'undefined' || this.act_values.fileid == '################' || this.act_values.havesource == '#mne_lang#wahr' )
        {
         popup.show(false,false);
          if ( popup.weblet.showValue(this, param ) == false )
            popup.hidden();
          popup.weblet.onbtnobj = this;

          {
            var timeout = function() { popup.resize.call(popup, popup.weblet.initpar.popup_resize != false, popup.weblet.initpar.popup_repos == true); };
            window.setTimeout(timeout, 10);
          }
        }
        else
        {
          popup.hidden();
        }
      }
      else if ( typeof this.parent.subweblets[this.initpar.popupdata] != 'undefined' )
        this.parent.subweblets[this.initpar.popupdata].showValue(this, param );

    }
    return false;
  };
  
  weblet.onbtnclickfilter = weblet.onbtnclick;
  weblet.onbtnclick = function(id, button)
  {
    if ( button.weblet.oid == this.initpar.popupdata || button.weblet.oid == this.initpar.popup )
    {
      this.showValue(this);
      this.setDepends('popup');
      return;
    }
    weblet.onbtnclickfilter(id);
  }
  

}
