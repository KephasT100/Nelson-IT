// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/repository/folder/log/table
// ================================================================================
{
  var i;
  var str = "";
  var e,t,r;
  
  var ivalues = 
  {
      multiselect : false,
      view : weblet.path + '/view.html'

   };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  MneAjaxWeblet.prototype.loadbase.call(weblet, "/weblet/allg/table/fix", weblet);
  
  var attr =
  {
      downloadButton : { type : 'button', "style.width" : "100%", value : "download" },
 };
  
  weblet.obj.mkbuttons.push({ id : 'download', value : 'download', behind : 'refresh' });
  weblet.obj.enablebuttons.push('download');
  
  weblet.dblclickBody = function(tab)
  {
    if ( tab.act_event.target.tagName == 'INPUT' ) return;
    
    this.clickBody(tab);
    this.download();
  };
  
  weblet.showdvalueBaseTableFix = weblet.showValue;
  weblet.showValue = function(weblet, param)
  {
	  if ( weblet != null && weblet.act_values.submenu != true )
	  {
		  var retval = this.showdvalueBaseTableFix(weblet, param);
		  this.showOutputDefined("name", weblet.act_values.menuid);
	  }
	  else
	  {
		  this.showOutput("name", "");
          this.obj.tables.content.clear();
	  }

	  return retval;
  }
  
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
        "rootInput.old"  : this.act_values.root,
        "repositoryidInput.old"  : this.act_values.repositoryid,
        "filenameInput.old" : this.act_values.menuid,
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
  
  };
