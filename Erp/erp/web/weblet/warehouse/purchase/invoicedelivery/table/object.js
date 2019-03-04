// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: warehouse/purchase/invoicedelivery/table
// ================================================================================
{
  var i;
  var str;

  weblet.loadbase('weblet/allg/table/fix', weblet);


  var ivalues = 
  {
      styleName    : 'style.css',
      refschema    : 'mne_warehouse',
      reffunction  : 'purchaseinvoicedelivery_ok'
  };

  weblet.initDefaults(ivalues);
  
  weblet.keydown = function(evt)
  {
    if ( this.checkInside(evt) )
    {
      r = this.obj.tables.content.act_rownum;
      c = this.obj.tables.content.act_colnum;
      switch(evt.keyCode)
      {
      case 13 :
        {
        var self = this;
        window.setTimeout( function() 
            { if ( self.act_values.haveinvoice == 'x' )
              self.del();
            else
              self.ok();
            if ( r < ( self.obj.tables.content.body.rows.length - 1 ) )
            {
              self.obj.tables.content.findCell(self.obj.tables.content.body.rows[++r].cells[c]);
              self.moveCursor(c,r);
            }
            },0);

        }
        break;
      default:
        return this.keydownBase(evt,true);
      break;
      }
      return false;
    }
    
    return true;
    
  }


  weblet.dblclickBody = function(tab)
  {
    this.clickBody(tab);
    if ( typeof tab.act_cell.datafield == 'undefined' )
      this.ok();
  };

  weblet.ok = function()
  {
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
      popup.weblet.obj.buttons.ok.onclick.call(popup.weblet.obj.buttons.ok);
      popup.hidden();
    }
  }
  
}
