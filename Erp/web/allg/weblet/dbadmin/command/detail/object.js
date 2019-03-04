// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: dbadmin/command/detail
// ================================================================================
{
  var i;
  var str = "";

  weblet.loadview();
  weblet.delbuttons('add,cancel,del')
  var attr = 
  {
      hinput : false,
      commandInput : { spellcheck : false }
  };

  weblet.findIO(attr);

  weblet.titleString.add = weblet.txtGetText("#mne_lang#Sql Kommando ausführen");
  weblet.titleString.mod = weblet.txtGetText("#mne_lang#Sql Kommando ausführen");

  weblet.showValue = function(weblet, param)
  {
    return false;
  };

  weblet.add = function()
  {
  };

  weblet.ok = function(setdepend)
  {
    var p = {};
    if ( this.obj.inputs.sqlend.checked == true )
      p = this.addParam( p,  "sqlend", 1);
    p = this.addParam( p, 'command', this.obj.inputs.command.value);

    if ( this.obj.inputs.end.checked == true )
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/end.xml",  {} );

    if ( this.obj.inputs.start.checked == true )
      MneAjaxWeblet.prototype.write.call(this, "/db/utils/connect/start.xml",  {} );

    if ( this.obj.inputs.sqlend.checked != true )
    {
      this.obj.inputs.start.checked = false;
      this.obj.inputs.end.checked = false;
    }

    MneAjaxData.prototype.read.call(this, "/db/utils/connect/sql/execute.xml", p);
    this.setDepends("ok");
    return false;
  };

  weblet.wresize = function()
  {
    var h = this.origframe.offsetHeight;
    var t = this.posGetTop(this.obj.inputs.command, this.origframe);

    var w = this.origframe.offsetWidth;
    var l = this.posGetLeft(this.obj.inputs.command, this.origframe);

    this.obj.inputs.command.style.width  = ( w - l - 16 ) + "px";
    this.obj.inputs.command.style.height = ( h - t - 16 ) + "px";
  };

  {
    var self = weblet;
    window.setTimeout(function() { self.wresize(); }, 100);
  }


}
