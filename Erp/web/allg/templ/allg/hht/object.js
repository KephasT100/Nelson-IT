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
  weblet.frame.appendChild( (weblet.root.container.detail = weblet.doc.createElement('div')) );
  weblet.frame.appendChild( (weblet.root.container.middle = weblet.doc.createElement('div')) );
  weblet.frame.appendChild( (weblet.root.menus.bottom = weblet.doc.createElement('div')) );
  weblet.frame.appendChild( (weblet.root.container.bottom = weblet.doc.createElement('div')) );
  for ( i = 0; i < weblet.frame.childNodes.length; i++ ) weblet.frame.childNodes[i].className = 'container'
}
else
{

  weblet.slider.slider0 = new MneAjaxSlider(window, weblet.frame, "slider0", 'H', '33%', "move");
  weblet.slider.slider1 = new MneAjaxSlider(window, weblet.frame.slbottom, "slider0", 'H', '50%', "move");
  weblet.slider.fix0    = new MneAjaxSlider(window, weblet.frame.slbottom.slbottom, "fix0", 'H', 'auto', "invis");

  weblet.root.menus = {
      bottom : weblet.frame.slbottom.slbottom.sltop
  }

  weblet.root.container = {
      detail : weblet.frame.sltop,
      middle : weblet.frame.slbottom.sltop,
      bottom : weblet.frame.slbottom.slbottom.slbottom
  }
}
}