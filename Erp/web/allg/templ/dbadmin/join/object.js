// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
// ================================================================================
{

  weblet.loadClass("MneAjaxSlider", "geometrie/mne_aslider.js");

  weblet.slider.fslider = weblet.root.slider1 = new MneAjaxSlider(window, weblet.frame, "slider1", 'V', '300px', "move");
  weblet.root.slider2 = new MneAjaxSlider(window, weblet.frame.slleft, "slider2", 'H', '50%', "move");
  weblet.root.slider3 = new MneAjaxSlider(window, weblet.frame.slright, "slider3", 'V', '200px', "move");
  weblet.root.slider4 = new MneAjaxSlider(window, weblet.frame.slright.slleft, "slider4", 'H', '50%', "move");
  weblet.root.slider5 = new MneAjaxSlider(window, weblet.frame.slright.slright, "slider5", 'H', '50%', "move");

  weblet.root.menus = {}

  weblet.root.container = 
  {
      firstsel  : weblet.frame.slleft.sltop,
      secondsel : weblet.frame.slleft.slbottom,
      firsttab  : weblet.frame.slright.slleft.sltop,
      secondtab : weblet.frame.slright.slleft.slbottom,
      joins     : weblet.frame.slright.slright.sltop,
      detail    : weblet.frame.slright.slright.slbottom
  }
}