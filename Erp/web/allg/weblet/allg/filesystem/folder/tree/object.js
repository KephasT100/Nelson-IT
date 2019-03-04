// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/filesystem/folder/tree
// ================================================================================
{
  var i;
  var str = "";
  var w;
  
  weblet.loadbase("/weblet/allg/tree/show", weblet);
  
  weblet.setValueShow = weblet.setValue;
  weblet.setValue = function(p, setdepend)
  {
    weblet.setValueShow(p, false);
    
    if ( this.act_values.leaf )
    {
      this.act_values.parentdir = this.act_values.menuparentid;
      this.act_values.dir = ( typeof this.obj.menu.act_action.rootaction == 'undefined' ) ? '/' : this.obj.menu.act_action.rootaction.menuid;
      this.act_values.filename = this.act_values.name;
    }
    else
    {
      this.act_values.parentdir = this.act_values.menuparentid
      this.act_values.parentpath = this.obj.menu.act_action.parentpath;
      this.act_values.dir = this.act_values.menuid;
      this.act_values.filename = null;
    }
    
    if ( setdepend != false)
      this.setDepends("setValue");
  };
  
  weblet.click_rightShow = weblet.click_right;
  weblet.click_right = function( evt )
  {
    var retval = weblet.click_rightShow( evt );

    if ( evt.target.action.leaf != "" )
    {
      this.act_values.parentdir = this.act_values.menuparentid;
      this.act_values.dir = ( typeof evt.target.action.rootaction == 'undefined' ) ? '' : evt.target.action.rootaction.menuid;
      this.act_values.filename = this.act_values.name;
    }
    else
    {
      this.act_values.parentdir = ( typeof evt.target.action.rootaction == 'undefined' ) ? '' : evt.target.action.rootaction.menuid;
      this.act_values.dir = this.act_values.menuid;
      this.act_values.filename = null;
    }
    
    return retval;
  }
  
}
