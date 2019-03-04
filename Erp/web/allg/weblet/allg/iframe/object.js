// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/iframe
// ================================================================================
{
  var i;
  var str = "";
  
  var ivalues = 
  {
      origin   : weblet.win.location.origin,
      pathname :   weblet.win.location.pathname,
      search   : weblet.win.location.search
  };

  var svalues = 
  {
  };


  weblet.initDefaults(ivalues, svalues);
  weblet.frame = weblet.origframe;
  weblet.frame.style.overflow = 'hidden';
  weblet.frame.innerHTML = '<iframe id="contentFrame" style="transform: scale(0.33); transform-origin: top left;"></iframe>'
  var attr = 
  {
      hinput : weblet.initpar.hinput == true,
  }
  weblet.findIO(attr);

  weblet.showValue = function(weblet, param)
  {
    var w = this;
    this.win.setTimeout(function() { w.showFrames()}, 100 );
  }    

  weblet.showFrames = function(weblet, param)
  {
    this.obj.frames.content.src = this.initpar.origin + this.initpar.pathname + this.initpar.search;
    this.obj.frames.content.style.height = 3 * this.frame.offsetHeight + "px";
    this.obj.frames.content.style.width = 3 * this.frame.offsetWidth + "px";
  }    

}
