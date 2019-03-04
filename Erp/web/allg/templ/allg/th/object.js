// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
// ================================================================================
{

  weblet.loadClass("MneAjaxSlider", "geometrie/mne_aslider.js");

  weblet.slider.fslider = weblet.slider.fix0    = new MneAjaxSlider(window, weblet.frame, "fix0", 'H', 'auto', "invis");
  weblet.slider.slider0 = new MneAjaxSlider(window, weblet.frame.slbottom, "slider0", 'H', '50%', "move");

  weblet.root.menus =
  {
      top : weblet.frame.sltop
  };

  weblet.root.container = 
  {
      top    : weblet.frame.slbottom.sltop,
      bottom : weblet.frame.slbottom.slbottom
  };
}