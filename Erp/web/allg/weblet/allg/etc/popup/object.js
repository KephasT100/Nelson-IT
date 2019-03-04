// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/etc/popup
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview();

  var attr = 
  {
  }

  weblet.findIO(attr);

  weblet.showValue = function(weblet, param)
  {
    return true;
  }    
  
  weblet.getFrame = function()
  {
    return this.frame;
  }

}
