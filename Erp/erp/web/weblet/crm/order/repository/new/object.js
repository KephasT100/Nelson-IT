// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: crm/order/repository/new
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      root : 'repository',
      schema : 'mne_repository',
      table : 'repository',
      
      autocommit : true
      
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.loadview();
  weblet.delbuttons('ok,del,cancel');

  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
  }

  weblet.findIO(attr);

  weblet.btnrequest  =
  {
        add : "/db/utils/repository/insert.xml",
        mod : "/db/utils/repository/modify.xml",
        del : '/db/utils/repository/delete.xml',
  };
  weblet.act_values.orderid = '';
  
  weblet.showValue = function(weblet)
  {
    this.act_values.orderid = '';
    if ( weblet != null )
    {
      if ( typeof weblet.act_values.orderid != 'undefined' && weblet.act_values.orderid != null && weblet.act_values.orderid != "################")
      {
        var i;
        for ( i in weblet.act_values )
          this.act_values[i] = weblet.act_values[i];
      }
    }
  }    

  weblet.getParam = function(pp)
  {
    var p = 
      {
        schema : this.initpar.schema,
        table : this.initpar.table,
        
        sqlend : "1"
      }
    
    p = this.addParam(p, "repositoryidInput", '################');
    p = this.addParam(p, "rootInput", this.initpar.root);
    p = this.addParam(p, "nameInput", this.act_values.ordernumber);
    p = this.addParam(p, "refidInput", this.act_values.orderid);
    
    return p;
  }

  weblet.add = function(setdepend)
  {
    this.okaction = "add";
    
    if ( this.act_values.orderid == '' )
    {
      this.warning("#mne_lang#Benötige zum Erzeugen eines Aktenorderns einen Auftrag");
      return;
    }
    
    this.ok(setdepend);
    this.parent.showValue(this);
  }
}
