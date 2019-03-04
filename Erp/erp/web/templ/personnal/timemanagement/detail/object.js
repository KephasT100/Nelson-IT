// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
// /templ/personal/timemanagement/detail
// ================================================================================
{

  weblet.loadClass("MneAjaxSlider", "geometrie/mne_aslider.js");

  weblet.slider.fslider = weblet.root.slider1 = new MneAjaxSlider(window, weblet.frame, "slider1", 'H', '33%', "move");
  weblet.root.slider2 = new MneAjaxSlider(window, weblet.frame.slbottom, "slider2", 'H', '50%', "move");
  weblet.root.slider3 = new MneAjaxSlider(window, weblet.frame.slbottom.slbottom, "slider3", 'V', '66%', "move");

  weblet.root.menus = {}

  weblet.root.container = 
  {
      project   : weblet.frame.sltop,
      person    : weblet.frame.slbottom.sltop,
      detail    : weblet.frame.slbottom.slbottom.slleft,
      time      : weblet.frame.slbottom.slbottom.slright
  }
}