// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/repository/folder/interest/table
// ================================================================================
{
  var i;
  var str = "";
  var e,t,r;
  
  var ivalues = 
  {
      stylePath: '/styles',
      styleName : 'repository.css',
      
      view : weblet.path + '/view.html'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  MneAjaxWeblet.prototype.loadbase.call(weblet, "/weblet/allg/table/fix", weblet);

  weblet.showdvalueBaseTableFix = weblet.showValue;
  weblet.showValue = function(weblet, param)
  {

    var retval = this.showdvalueBaseTableFix(weblet, param);
    
    if ( typeof this.act_values.repositoryid == 'undefined' || this.act_values.repositoryid == '' )
      this.obj.buttons.showdetail.disabled = true;
    else
      this.obj.buttons.showdetail.disabled = false;

    this.showOutput("name", "");
    if ( weblet != null )
      {
      this.showOutputDefined("name", weblet.act_values.menuid);
      }
    
     return retval;
  }
  
  weblet.add = function()
  {
  }
  
  weblet.showdetailBaseTableFix = weblet.showdetail;
  weblet.showdetail = function()
  {
    if ( typeof this.act_values.repositoryid == 'undefined' || this.act_values.repositoryid == '' ) return false;
    return weblet.showdetailBaseTableFix();
  };

  weblet.getParam = function(pp)
  {
     var p =
      {
          schema : this.initpar.schema,
          table  : this.initpar.table,
          
          sqlend : "1"
      }

      p = this.addParam(p, "fileinterestsidInput", '################');
      p = this.addParam(p, "repositoryidInput", this.act_values['repositoryid']);
      p = this.addParam(p, "filenameInput", this.act_values['menuid']);
      p = this.addParam(p, "personidInput", this.act_values['personid']);
      p = this.addParam(p, "activeInput", "true" );
      p = this.addParam(p, "repdateInput", '0');
   
      return p;
  }

  weblet.onbtnclick = function(id, button)
  {
    if ( id == 'ok' && this.inputlist == null )
    {
      
      for ( i in button.weblet.act_values )
        this.act_values[i] = button.weblet.act_values[i];
      
      this.okaction = 'add';
      MneAjaxWeblet.prototype.ok.call(this);
    }
  };
 
  };
