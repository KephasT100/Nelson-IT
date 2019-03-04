// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/filesystem/file/rename
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      hinput : false,
      
      diraddaction : '/file/mkdir.xml',
      dirdelaction : '/file/rmdir.xml',

      fileaddaction : '/file/mkfile.html',
      filedelaction : '/file/rmfile.xml',

      mvaction : '/file/mv.xml',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
  }

  weblet.findIO(attr);

  weblet.btnrequest['adddir']  = weblet.initpar.diraddaction;
  weblet.btnrequest['rename']  = weblet.initpar.mvaction;

  weblet.showValue = function(weblet, param)
  {
    var i;
    var item;
    
    if ( weblet == null)
      return;
    
    this.okaction = weblet.okaction;
    this.obj.refreshweblet = weblet;
    
    this.act_values = {};
    this.act_values['dir'] = ( ! param.adddir && weblet.act_values.leaf == '' ) ? weblet.act_values.parentdir : weblet.act_values.dir; 
    this.act_values['name'] = weblet.act_values['name'];
    
    this.clearModify();
  }    
  
  weblet.cancel = function()
  {
    this.popup.hidden();
    return false;
  }
  
  weblet.ok = function(setdepend)
  {
    var p = {};
    
    this.popup.hidden();
    p = this.addParam(p, 'rootInput.old', this.initpar.root);
    p = this.addParam(p, 'dirInput.old', this.act_values.dir);
    p = this.addParam(p, 'filenameInput.old', this.act_values.name);
    p = this.addParam(p, 'filename');

    if ( MneAjaxWeblet.prototype.write.call(this, this.btnrequest[this.okaction],  p ) == 'ok' )
    {
      this.act_values.name = this.obj.inputs.filename.value;
      if ( setdepend != false ) this.setDepends("ok");
      return false;
    }
    return true;
  }

}
