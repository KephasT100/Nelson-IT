//================================================================================

//Copyright: M.Nelson - technische Informatik
//Die Software darf unter den Bedingungen 
//der APGL ( Affero Gnu Public Licence ) genutzt werden

//weblet: allg/table/filter
//================================================================================
{
  var i;
  var str = "";
  
  weblet.loadClass("MneAjaxTable", "table/mne_atable.js");

  var ivalues = 
  {
      styleName : 'style.css',
      stylePath : '/weblet/allg/table/allg',

      refresh     : true,
      showlabel   : { de : 'hinzufügen/ändern', en : 'add/modify' },
      whereweblet : weblet.path + "/single",
  };

  weblet.initDefaults(ivalues);

  weblet.loadview();

  weblet.obj.whereframe = weblet.doc.createElement("div");
  weblet.obj.whereframe.id = 'whereframe';
  weblet.obj.whereframe.class = 'tablefilter';
  
  weblet.origframe.insertBefore(weblet.obj.whereframe, weblet.frame)
  
  weblet.checkwheresize = function()
  {
    if ( this.frame.style.top != ( this.obj.whereframe.offsetTop + this.obj.whereframe.scrollHeight) + "px" )
    {
      var w = this;
      this.frame.style.top = ( this.obj.whereframe.offsetTop + this.obj.whereframe.scrollHeight) + "px";
      window.setTimeout(function() { w.checkwheresize(); }, 250);
    }
  }
  weblet.obj.whereobserver = new MutationObserver(function(mutations, server) { window.setTimeout(function() { server.weblet.checkwheresize(); }, 0); });
  weblet.obj.whereobserver.weblet = this;
  weblet.obj.whereobserver.observe(weblet.obj.whereframe, { attributes: true, childList: true, characterData: true, subtree : true });


  weblet.loadview(weblet.obj.whereframe, weblet.initpar.whereweblet + "/view.html");
  this.eleMkElements(weblet.obj.whereframe);
  weblet.findIO({});
  
  weblet.loadbase(weblet.path + '/../allg', weblet);

  weblet.resetallg = weblet.reset;
  weblet.reset = function()
  {
    weblet.obj.whereobserver.disconnect();
    weblet.resetallg();
  }

  weblet.getFilter = function(p)
  {
    if ( typeof p == 'undefined' || p == null ) return {};
    return p;
  };


  weblet.showValue = function(weblet, param)
  {
    if (weblet == null && this.initpar.shownull != true ) return;
    if ( typeof param != 'undefined' && param != null )
    {
      if ( param.setdependid = 'select' && param.setdependweblet == this )
        return true;
    }

    if (weblet != this) this.act_values = {};

    this.showValueBase(weblet, this.getFilter(param));
  };

  weblet.refresh = function()
  {
    this.showValue(this, this.getFilter());
    return false;
  };

  weblet.print = function()
  {
    var p = this.getFilter(MneAjaxWeblet.prototype.readDataParam.call(this,this));

    if ( typeof this.initpar.reportschema != 'undefined' ) p.schema = this.initpar.reportschema;
    if ( typeof this.initpar.reportquery  != 'undefined' ) p.query  = this.initpar.reportquery;
    if ( typeof this.initpar.reporttable != 'undefined'  ) p.table = this.initpar.reporttable;

    return MneAjaxWeblet.prototype.print.call(this,p);
  };

  weblet.onbtnclick = function(id)
  {
    if ( ( id == 'del' || id == 'ok' || id == 'add' || this.initpar.refresh_allways == true ) && this.inputlist == null )
    {
      var p = {};
      this.act_values.schema = this.obj.act_schema;
      this.act_values.table = this.obj.act_table;
      p.no_perror = true;
      p.no_vals = false;
      p.intl = 1;
      var have_readed = MneAjaxWeblet.prototype.showTable.call(this, this, p);

      for (i in this.obj.showdynparvalues)
        this.act_values[i] = this.obj.showdynparvalues[i];
      this.disable();
      if ( typeof this.initpar.popup != 'undefined'  && this.initpar.needselected != true )
        this.enablevalue( have_readed );

      this.setDepends('onbtnclick');
    }
    else if ( id == 'rte' )
    {
      if ( this.initpar.autosave == true ) this.ok(null, this.obj.old_rownum);
    }

  };

  var inputlist_data_save = weblet.inputlist_data;
  weblet.inputlist_data = {};
  weblet.loadbase(weblet.initpar.whereweblet, weblet, ( typeof weblet.initpar.wherewebletid == 'undefined' ) ? weblet.oid + "where" : weblet.initpar.wherewebletid);
  weblet.create_inputlist(( typeof weblet.initpar.wherewebletid == 'undefined' ) ? weblet.oid + "where" : weblet.initpar.wherewebletid)
  weblet.inputlist_data = inputlist_data_save;

}
