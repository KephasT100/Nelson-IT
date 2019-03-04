// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/storage/relocate/table
// ================================================================================
{
  var row;
  var btable;
  var path = weblet.path;
  
  weblet.loadbase('weblet/allg/table/fix', weblet);
  weblet.obj.mkbuttons.push( { id : 'ready', value : weblet.txtGetText("#mne_lang#Fertig#"), space : 'before' } );

  weblet.delbuttons('showdetail');
  weblet.obj.enablebuttons.push('ready')
  
  weblet.ready = function()
  {
    var result;
    if ( typeof this.initpar.popup != 'undefined')
    {
      var popup = this.parent.popups[this.initpar.popup];
      if ( typeof popup == 'undefined' )
      {
        popup =
        {
          weblet : this.parent.subweblets[this.initpar.popup],
          show   : function() { return; }
        }
      }
      popup.show(popup.weblet.initpar.popup_resize != false, popup.weblet.initpar.popup_repos == true, false );
      popup.weblet.showValue(this);
      popup.weblet.onbtnobj = this;
      result = popup.weblet.ready();
      MneAjaxWeblet.prototype.showTable.call(this, this, this.getFilter());
      this.enable(false);
    }
    return result;
  }
}
