{
  var i,str;
  
  var ivalues = 
  {
      okschema : 'mne_builddiary',
      okfunction : 'comment_mod',
      
      idname : 'timeid',
      popup : null,
      
      showlabel : { de : 'hinzufügen', en : 'add' },
      
      typ : '0'
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadbase('weblet/allg/table/filter', weblet);
  
  weblet.showValuefilter = weblet.showValue;
  
  weblet.showValue = function(weblet, param)
  {
    if ( typeof weblet != 'undefined' && weblet != null ) this.obj.idvalue = weblet.act_values[this.initpar.idname];
    var result = this.showValuefilter(weblet, param);
    //this.obj.buttons.showdetail.disabled = ( typeof this.obj.idvalue == 'undefined' || this.obj.idvalue == '' );
  }
  
  weblet.showdetail = function()
  {    
      var p =
      {
          schema : this.initpar.okschema,
          name : this.initpar.okfunction,
          
          par0 : '################',
          typ0 : "text",
          par1 : this.act_values[this.initpar.idname],
          typ1 : "text",
          par2 : 'intern',
          typ2 : "text",
          par3 : '',
          typ3 : "text",
          par4 : 'false',
          typ4 : "bool",
          
          sqlend : 1   
      }

      if ( MneAjaxWeblet.prototype.write.call(this,'/db/utils/connect/func/execute.xml', p) == 'ok' )
      {
        this.refresh();
        return false;
      };
      
      return true;
  }
  
  weblet.refreshfilter = weblet.refresh;
  weblet.refresh = function()
  {
    var retval = weblet.refreshfilter();
    this.obj.buttons.showdetail.disabled = ( typeof this.obj.idvalue == 'undefined' || this.obj.idvalue == '' );
    
    return retval;
  }

}
