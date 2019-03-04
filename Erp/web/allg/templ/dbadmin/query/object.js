// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
// ================================================================================
{

weblet.loadClass("MneAjaxSlider", "geometrie/mne_aslider.js");

weblet.slider.fslider = weblet.root.fix1    = new MneAjaxSlider(window, weblet.frame, "fix1", 'H', 'auto', "invis");
weblet.root.slider1 = new MneAjaxSlider(window, weblet.frame.slbottom, "slider1", 'V', '25%', "move");
weblet.root.fix2    = new MneAjaxSlider(window, weblet.frame.slbottom.slright, "fix2", 'H', '17ex', "move");
weblet.root.slider2 = new MneAjaxSlider(window, weblet.frame.slbottom.slright.slbottom, "slider2", 'H', '50%', "move");
weblet.root.slider3 = new MneAjaxSlider(window, weblet.frame.slbottom.slright.slbottom.sltop, "slider3", 'V', '50%', "move");
weblet.root.fix3    = new MneAjaxSlider(window, weblet.frame.slbottom.slright.slbottom.slbottom, "fix3", 'H', 'auto', "invis");

weblet.root.menus.selection = weblet.frame.sltop;
weblet.root.menus.bottom = weblet.frame.slbottom.slright.slbottom.slbottom.sltop;

weblet.root.container.selection = weblet.frame.slbottom.slleft;
weblet.root.container.bottom    = weblet.frame.slbottom.slright.slbottom.slbottom.slbottom;
weblet.root.container.detail     = weblet.frame.slbottom.slright.sltop;
weblet.root.container.join       = weblet.frame.slbottom.slright.slbottom.sltop.slleft;
weblet.root.container.table      = weblet.frame.slbottom.slright.slbottom.sltop.slright;

}