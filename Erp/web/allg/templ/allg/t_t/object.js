// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
// ================================================================================
{

  if ( weblet.doc.body.getAttribute("aria-view-mode") == 'mobile' )
  {
    var i;
    weblet.frame.appendChild( (weblet.root.container.left = weblet.doc.createElement('div')) );
    weblet.frame.appendChild( (weblet.root.menus.right = weblet.doc.createElement('div')) );
    weblet.frame.appendChild( (weblet.root.container.right = weblet.doc.createElement('div')) );
    for ( i = 0; i < weblet.frame.childNodes.length; i++ ) weblet.frame.childNodes[i].className = 'container'
  }
  else
  {
    weblet.loadClass("MneAjaxSlider", "geometrie/mne_aslider.js");

    weblet.slider.fslider = weblet.slider.slider0 = new MneAjaxSlider(window, weblet.frame, "slider0", 'V', '50%', "move");
    weblet.slider.fix0    = new MneAjaxSlider(window, weblet.frame.slright, "fix0", 'H', 'auto', "invis");

    weblet.root.menus.right = weblet.frame.slright.sltop;

    weblet.root.container.left = weblet.frame.slleft;
    weblet.root.container.right    = weblet.frame.slright.slbottom;
  }

}