// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: personnal/timemanagement/project/orderproduct
// ================================================================================
{


  var ivalues = 
  {
      dweblet : 'time'
  };

  weblet.initDefaults(ivalues);
  weblet.loadbase('weblet/allg/table/fix', weblet);

  weblet.clickBodysave = weblet.clickBody;
  weblet.clickBody = function(tab)
  {
      weblet.clickBodysave(tab);
      this.parent.weblets[this.initpar.dweblet].setOrderproduct(this);
  }

  weblet.dblclickBody = function(tab)
  {
    this.clickBodysave(tab);
    this.showdetail();
  }

}
