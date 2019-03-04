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
    weblet.frame.appendChild( (weblet.root.container.middle = weblet.doc.createElement('div')) );
    weblet.frame.appendChild( (weblet.root.menus.bottom = weblet.doc.createElement('div')) );
    weblet.frame.appendChild( (weblet.root.container.bottom = weblet.doc.createElement('div')) );
    for ( i = 0; i < weblet.frame.childNodes.length; i++ ) weblet.frame.childNodes[i].className = 'container'
  }
  else
  {
    weblet.slider.fslider = weblet.slider.fix0    = new MneAjaxSlider(window, weblet.frame, "fix0", 'H', 'auto', "invis");
    weblet.slider.slider0 = new MneAjaxSlider(window, weblet.frame.slbottom, "slider0", 'V',  ( weblet.frame.offsetWidth > 1200 ) ? '300px' : '25%', "move");
    weblet.slider.slider1 = new MneAjaxSlider(window, weblet.frame.slbottom.slright, "silder1", 'H', '33%', "move");
    weblet.slider.slider2 = new MneAjaxSlider(window, weblet.frame.slbottom.slright.slbottom, "silder2", 'H', '33%', "move");
    weblet.slider.fix1    = new MneAjaxSlider(window, weblet.frame.slbottom.slright.slbottom.slbottom, "fix1", 'H', 'auto', "invis");

    weblet.root.menus =
    {
        selection : weblet.frame.sltop,
        bottom    : weblet.frame.slbottom.slright.slbottom.slbottom.sltop
    }

    weblet.root.container = 
    {
        selection : weblet.frame.slbottom.slleft,
        detail    : weblet.frame.slbottom.slright.sltop,
        middle    : weblet.frame.slbottom.slright.slbottom.sltop,
        bottom    : weblet.frame.slbottom.slright.slbottom.slbottom.slbottom
    }
  }
}