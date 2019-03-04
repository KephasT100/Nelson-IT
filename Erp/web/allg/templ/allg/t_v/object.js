// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
// ================================================================================
{

  weblet.loadClass("MneAjaxSlider", "geometrie/mne_aslider.js");

  if ( weblet.doc.body.getAttribute("aria-view-mode") == 'mobile' )
  {
    var i;
    weblet.frame.appendChild( (weblet.root.container.detail = weblet.doc.createElement('div')) );
    for ( i = 0; i < weblet.frame.childNodes.length; i++ ) weblet.frame.childNodes[i].className = 'container'
  }
  else
  {

    weblet.slider.fslider = weblet.slider.fix1    = new MneAjaxSlider(window, weblet.frame, "fix1", 'H', 'auto', "invis");
    weblet.slider.slider0 = new MneAjaxSlider(window, weblet.frame.slbottom, "slider1", 'V',  ( weblet.frame.offsetWidth > 1200 ) ? '300px' : '25%', "move");

    weblet.root.menus.selection = weblet.frame.sltop;

    weblet.root.container.selection = weblet.frame.slbottom.slleft;
    weblet.root.container.detail     = weblet.frame.slbottom.slright;
  }

}