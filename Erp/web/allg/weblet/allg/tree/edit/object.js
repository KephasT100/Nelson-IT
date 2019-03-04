// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/tree/edit
// ================================================================================
{
  weblet.loadview();

  var attr = 
  {
      hinput : false,
      parentidInput :{ notclear : true },
      parentnameOutput :{ notclear : true }
      
  }

  weblet.findIO(attr);
  weblet.showLabel();

  weblet.showids = new Array("menuid");
  weblet.titleString.add = weblet.txtGetText("#mne_lang#Kategorie hinzufügen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Kategorie bearbeiten");
  weblet.titleString.del = weblet.txtGetText("#mne_lang#Kategorie <$1> wirklich löschen");
  weblet.titleString.delid = 'item';
  
  weblet.obj.mkbuttons.push( { id : 'move', value : weblet.txtGetText('#mne_lang#Verschieben#'), behind : 'ok', show : ( typeof weblet.parent.popups[weblet.oid + 'move'] != 'undefined' ) });

  weblet.showValue = function(weblet)
  {
    if ( weblet == null )
    {
      this.add();
      return;
    }

    if ( weblet == this )
    {
      var cols = this.initpar.cols.split(',');
      if ( typeof this.act_values[cols[1]] != 'undefined' )
        this.act_values.menuid = this.act_values[cols[1]];
    }

    return MneAjaxWeblet.prototype.showValue.call(this, weblet);
    }
  
  weblet.getIdparam = function(p)
  {
    var cols;
    var i;
    
    p.schema = this.initpar.schema;
    p.table  = this.initpar.table;
    
    cols = this.initpar.dcols.split(',');
    
    p[cols[0] + "Input.old"] = this.act_values.menuid;
    if ( this.act_values.refid != null )
      p[cols[1] + "Input.old"] = this.act_values.refid;

    return p;
  }
  
  weblet.getParam = function(p)
  {
     var cols;
     var i;
     
     p.schema = this.initpar.schema;
     p.table  = this.initpar.table;
     
     cols = this.initpar.cols.split(',');
     
     this.addParam(p, cols[0] + "Input", this.obj.inputs.parentid);
     this.addParam(p, cols[1] + "Input", this.obj.inputs.menuid);
     this.addParam(p, cols[2] + "Input", this.obj.inputs.item);
     if ( this.act_values.refid != null )
       this.addParam(p, cols[3] + "Input", this.act_values.refid);

     return p;
  }
  
  weblet.add = function(setdepend)
  {

    var item   = ( typeof this.act_values.item == 'undefined'   ) ? '' : this.act_values.item;
    var menuid = ( typeof this.act_values.menuid == 'undefined' ) ? '' : this.act_values.menuid;
    
    this.defvalues = {};
    if ( this.obj.del != true )
    {
      this.defvalues['parentname'] = item;
      this.defvalues['parentid'] = ( menuid == '################' ) ? '' : menuid;
      this.defvalues['item'] = '';
      this.defvalues['menuid'] = '################';
    }
    
    MneAjaxWeblet.prototype.add.call(this, setdepend);
    this.clearModify();

    return false;
  }

  weblet.ok = function()
  {
    var r = this.okaction == 'add';
    var result = MneAjaxWeblet.prototype.ok.call(this);
    
  
    if ( result == false && typeof this.initpar.refreshweblet != 'undefined')
      this.parent.subweblets[this.initpar.refreshweblet].refresh( ( r == true ) ? this.act_values.parentid : this.act_values.menuid );

    return result;
  }
  
  weblet.del = function()
  {
    this.obj.del = true;
    try { var result = MneAjaxWeblet.prototype.del.call(this); } catch(e) { this.obj.del = false; throw (e) };
    
    this.obj.del = false;
    
    if ( result == false && typeof this.initpar.refreshweblet != 'undefined')
      this.parent.subweblets[this.initpar.refreshweblet].refresh(this.act_values.parentid);

    return result;
  }
  
  weblet.cancel = function()
  {
    if ( typeof this.parent != 'undefined' && typeof this.parent.popup != 'undefined' ) this.parent.popup.hidden();
    return false;
  }
  
  weblet.move = function()
  {
    this.parent.popups[this.oid + 'move'].show();
    this.parent.popups[this.oid + 'move'].weblet.onbtnobj = this;
    {
      var popup = this.parent.popups[this.oid + 'move'];
      var timeout = function() { popup.resize.call(popup, false, false ); }
      window.setTimeout(timeout, 100);
    }
    return false;
  }
  
  weblet.onbtnok = function(button)
  {
    if ( button.weblet == this.parent.subweblets[this.oid + 'move'])
    {
      var retval;
      var get_param = this.getParam;
      var oldparentid = this.act_values.parentid;
      
      this.getParam = function(p)
      {
         var cols;
         var i;
         
         p.schema = this.initpar.schema;
         p.table  = this.initpar.table;
         
         cols = this.initpar.ecols.split(',');
         
         p[cols[0] + "Input"] = button.weblet.act_values.parentid;
         p[cols[1] + "Input"] = this.act_values.menuid;

         return p;
      }
      this.okaction = 'mod';
      try { retval = MneAjaxWeblet.prototype.ok.call(this) } catch(e) { this.Param = get_param; throw(e); };
      this.getParam = get_param;
 
      if ( retval == false && typeof this.initpar.refreshweblet != 'undefined')
      {
        this.parent.subweblets[this.initpar.refreshweblet].refresh(button.weblet.act_values.parentid);
        this.parent.subweblets[this.initpar.refreshweblet].refresh(oldparentid);
      }

      return retval;
    }
    else
      MneAjaxWeblet.prototype.onbtnok.call(this,button);
  }
  
}
