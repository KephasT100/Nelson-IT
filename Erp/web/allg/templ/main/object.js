// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//            /allg/templ/main
// ================================================================================
{

  weblet.reset();

  weblet.loadClass("MneAjaxSlider", "geometrie/mne_aslider.js");

  var fix1 = weblet.root.fix1 = new MneAjaxSlider(window, weblet.origframe, "fix1", 'H', 'auto', "invis");
  var fix2 = weblet.root.fix2 = new MneAjaxSlider(window, weblet.frame.slbottom, "fix3", 'V', '12em', "fix");

  weblet.frame.sltop.innerHTML = '<div id="mainrow"><div id="mainleft"></div><div id="mainright"></div></div>'
  weblet.eleMkClass(weblet.frame.sltop, 'maintop');
    
  weblet.root.fix2.setButtonframe(weblet.frame.sltop.querySelector('#mainleft'));

  weblet.root.menus[window.mne_appname] = weblet.frame.slbottom.slleft;
  weblet.root.menus[window.mne_appname].noresize = true;

  weblet.root.container["count"] = weblet.frame.sltop.querySelector('#mainright')
  weblet.root.container[window.mne_appname] = weblet.frame.slbottom.slright;

  weblet.root.container.print = window.document.createElement("div");
  window.document.body.appendChild(weblet.root.container.print);

  if ( weblet.doc.body.getAttribute("aria-view-mode") == 'mobile' )
  {
    window.setTimeout(function() { fix2.hide() } , 1000 );
  }
}