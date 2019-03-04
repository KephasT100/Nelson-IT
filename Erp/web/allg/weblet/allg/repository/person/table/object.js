// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/repository/person/table
// ================================================================================
{
  var i;
  var str = "";
  var e,t,r;

  var ivalues = 
  {
      stylePath : "/styles",
      styleName : "repository.css",
      
      schema : 'mne_repository',
      query  : 'fileinterests',

      cols : 'repositoryid,repositoryname,filename,mustsend',
      scols : 'repositoryname,filename',
      showdynpar : { "personidInput.old" : "personid" },

      tablehidecols : '0',
      tablerowstyle: 'send',
      tablerowstylecol : '3',

      ignore_notdefined : true,
      buttonsenable : true,
      
      multiselect : false
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  MneAjaxWeblet.prototype.loadbase.call(weblet, "/weblet/allg/table/fix", weblet);

  var attr =
  {
      downloadButton    : { type : 'button', "style.width" : "100%", value : "download" },
      downloadallButton : { type : 'button', "style.width" : "100%", value : "download all" },
  };

  weblet.obj.mkbuttons.push ( { id : 'download', value : 'download' });
  weblet.obj.mkbuttons.push ( { id : 'downloadall', value : 'download all' });

  weblet.obj.enablebuttonsvalue.push('download');
  weblet.obj.enablebuttonsvalue.push('downloadall');

  weblet.dblclickBody = function(tab)
  {
    if ( tab.act_event.target.tagName == 'INPUT' ) return;

    this.clickBody(tab);
    this.download();
  };

  weblet.showdetailBaseTableFix = weblet.showdetail;
  weblet.showdetail = function()
  {
    if ( typeof this.parent.popups[this.initpar.popup] != 'undefined' ) this.parent.popups[this.initpar.popup].hidden();
    return weblet.showdetailBaseTableFix();
  };

  weblet.add = function()
  {

  }

  weblet.download = function()
  {
    var i = null;

    var form = this.win.document.createElement("form");
    form.action = '/db/utils/repository/download.html';
    form.method = "post";
    form.style.visibility = "hidden";

    this.frame.appendChild(form);

    var param =
    {
        "repositoryidInput.old"  : this.act_values.repositoryid,
        "filenameInput.old" : this.act_values.filename,
        "hash" : ( typeof this.act_values.hash != 'undefined' ) ? this.act_values.hash : "",
    };

    for ( i in param )
    {
      form.appendChild(this.doc.createElement('input'));
      form.lastChild.name= i;
      form.lastChild.value = param[i];
    }

    form.submit();
    this.frame.removeChild(form);
    return false;
  }
  
  weblet.downloadall = function()
  {
    var i = null;

    var form = this.win.document.createElement("form");
    form.action = '/db/utils/repository/downloadall.html';
    form.method = "post";
    form.style.visibility = "hidden";

    this.frame.appendChild(form);

    var param =
    {
        "repositoryidInput.old"  : this.act_values.repositoryid,
        "personidInput.old"  : this.act_values.personid,
        "name" : '#mne_lang#Zeichnungen'
    };

    for ( i in param )
    {
      form.appendChild(this.doc.createElement('input'));
      form.lastChild.name= i;
      form.lastChild.value = param[i];
    }

    form.submit();
    this.frame.removeChild(form);
    return false;
  }
  

};
