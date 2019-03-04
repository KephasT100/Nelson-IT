// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/templ
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

  weblet.obj.titlemiddle = this.obj.title;
  weblet.obj.title = null;
  weblet.obj.titlemiddle.innerHTML = weblet.label;
  
  weblet.elements.mkClass(this.origframe, 'onlytitle', true);

  weblet.showValue = function(weblet, param)
  {
  }    

}
