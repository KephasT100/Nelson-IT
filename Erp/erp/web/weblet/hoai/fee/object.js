// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: hoai/fee
// ================================================================================
{
  weblet.loadbase('weblet/allg/table/fix', weblet);
  weblet.showValuebase = weblet.showValue;
  
  weblet.showValue = function(weblet, param)
  {
    var result = this.showValuebase(weblet,param);
    if ( this.values.length > 0 )
      this.obj.title.innerHTML = this.values[0][0];
  }

}
