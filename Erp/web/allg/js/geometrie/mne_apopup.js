// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    datei: js/geometrie/mne_apopup.js
//================================================================================

window.MneAjaxPopup = function (win, title, content, noframe)
{
  var str;
  var ajax = new MneAjax(win);
  ajax.loadCss("popup.css");
  
  this.weblet = null;
  
  var self = this;
  self.title = title;
  
  MneMisc.call(this,win);

  if ( noframe )
    str = '<div id="content" class="popupcontent"></div><div id="resize" class="popupresize"></div>';
  else
    str  = '<div id="titlebar" class="popupheader"><span id="closebutton" class="popupbutton"></span><span id="fullscreen" class="popupbutton"></span><span id="titletext" class="popupheadertext"></span></div><div id="content" class="popupcontent"></div><div id="resize" class="popupresize"></div>';

  if ( typeof content == 'string' ) self.content = self.doc.getElementById(content); else self.content = content;
  
  self.frame = self.doc.createElement('div');
  self.frame.className = "popup popup_main";
  if ( noframe ) self.frame.className += ' popup_noframe';
  
  self.frame.innerHTML = str;
  self.frame.id = "root";
  
  self.contentframe = self.eleGetById(self.frame, 'content');
  self.contentframe.appendChild(self.content);

  self.content.root = self.frame;
  
  var attr = new Array();
  attr['root']        = { 'show'    : this.show, "mousemove" : this.mousemove, "mouseup" : this.mouseup, "mne_popup" : this };
  attr['closebutton'] = { 'onclick'     : function(e) { if ( this.popup.frame.fullscreen.className.indexOf('fullscreen_active') != -1 ) this.popup.weblet.fullscreen(this.popup.frame.fullscreen, this.popup.frame); this.popup.hidden(e); }, popup : this };
  attr['fullscreen']  = { 'onclick'     : function(e) { this.popup.weblet.fullscreen(this, this.popup.frame); }, popup : this };

  if ( this.navigator.mobile || this.navigator.tablet )
  {
    attr['resize']      = { 'onclick' : "void(0)" , "mne_popup" : this };
    attr['titlebar']    = { 'onclick' : "void(0)" , "mne_popup" : this  };
    attr['titletext']   = { 'onclick' : "void(0)" , "mne_popup" : this, 'innerHTML' : this.title };                                     
  }
  else
  {
    attr['resize']      = { 'onmousedown' : this.startresize };
    attr['titlebar']    = { 'onmousedown' : this.startmove, 'onclick' : this.click, 'ondblclick' : this.dblclick  };
    attr['titletext']   = { 'onmousedown' : this.startmove, 'onclick' : this.click, 'innerHTML' : this.title };                                     
  }
  this.eleSetAttributes(self.frame, self.frame, attr);
  
  self.body = self.doc.getElementsByTagName('body')[0];
  self.root = self.frame;
  self.root.notinit = true;
  this.isclose = true;

  if ( this.navigator.mobile || this.navigator.tablet )
  {
    if( self.frame.resize )      self.frame.resize.addEventListener   ('touchstart', MneAjaxPopup.prototype.startresize, false);
    if( self.frame.titlebar )    self.frame.titlebar.addEventListener ('touchstart', MneAjaxPopup.prototype.startmove, false);
    if( self.frame.titletext )   self.frame.titletext.addEventListener('touchstart', MneAjaxPopup.prototype.startmove, false);
    if( self.frame.closebutton ) self.frame.closebutton.addEventListener('touchend', function(e) { this.popup.hidden(e); }, false);
  }
  
  self.body.appendChild(self.root);
  
};

window.MneAjaxPopup.zindex = 1000;
window.MneAjaxPopup.prototype = new MneMisc(window);

MneAjaxPopup.prototype.click = function(e)
{
  this.root.style.zIndex = window.MneAjaxPopup.zindex++;
};

MneAjaxPopup.prototype.dblclick = function(e)
{
  MneAjaxPopup.prototype.resize.call(this.root.mne_popup, true);
};

MneAjaxPopup.prototype.startmove = function(e)
{
 var evt = e;

  if ( typeof e != 'undefined' && typeof e.targetTouches != 'undefined' && e.targetTouches.length > 0 )
  {
    e.preventDefault();
    evt.clientX = e.targetTouches[0].clientX;
    evt.clientY = e.targetTouches[0].clientY;
  }

  this.root.posx = this.root.offsetLeft - evt.clientX;
  this.root.posy = this.root.offsetTop - evt.clientY;
  this.root.posw = this.root.mne_popup.posGetWidth(this.root);
  this.root.posh = this.root.mne_popup.posGetHeight(this.root);
  this.root.mne_popuptype = "move";
  this.root.mne_popupmove = false;
  
  this.root.style.zIndex = window.MneAjaxPopup.zindex++;
  if ( this.root.mne_popup.navigator.mobile || this.root.mne_popup.navigator.tablet )
  {
    this.addEventListener('touchmove', MneAjaxPopup.prototype.touchmove, false);
    this.addEventListener('touchend', MneAjaxPopup.prototype.touchend, false);
  }
  else
  {
    this.root.mne_popup.win.mneDocevents.addInterest('mousemove', this.root );
    this.root.mne_popup.win.mneDocevents.addInterest('mouseup', this.root );
  }
};

MneAjaxPopup.prototype.startresize = function(e)
{
  var evt = e;
  
  if ( typeof e != 'undefined' && typeof e.targetTouches != 'undefined' && e.targetTouches.length > 0 )
  {
    e.preventDefault();
    evt.clientX = e.targetTouches[0].clientX;
    evt.clientY = e.targetTouches[0].clientY;
    
  }

  this.root.posx = this.root.offsetWidth - evt.clientX;
  this.root.posy = this.root.offsetHeight - evt.clientY;
  this.root.post = this.root.mne_popup.posGetTop(this.root);
  this.root.posl = this.root.mne_popup.posGetLeft(this.root);
  this.root.mne_popuptype = "resize";
  this.root.mne_popupmove = false;

  if ( this.root.mne_popup.navigator.mobile || this.root.mne_popup.navigator.tablet )
  {
    this.addEventListener('touchmove', MneAjaxPopup.prototype.touchmove, false);
    this.addEventListener('touchend', MneAjaxPopup.prototype.touchend, false);
  }
  else
  {
    this.root.mne_popup.win.mneDocevents.addInterest('mousemove', this.root );
    this.root.mne_popup.win.mneDocevents.addInterest('mouseup', this.root );
  }
};

MneAjaxPopup.prototype.touchmove = function(e)
{
   var evt = e;
    
    if ( typeof e.targetTouches != 'undefined' && e.targetTouches.length > 0 )
    {
        evt.clientX = e.targetTouches[0].clientX;
        evt.clientY = e.targetTouches[0].clientY; 
        this.root.mne_popupmove = true;
        MneAjaxPopup.prototype.mousemove.call(this, evt);
    }
};

MneAjaxPopup.prototype.mousemove = function(evt)
{
  var x,y;

  x = evt.clientX  + this.root.posx;
  y = evt.clientY  + this.root.posy;
  
  switch ( this.root.mne_popuptype )
  {
    case "move" :
	    if ( x < 0 ) x = 0;
	    if ( y < 0 ) y = 0;
      if ( x + this.root.posw > this.root.mne_popup.body.scrollWidth ) x = this.root.mne_popup.body.scrollWidth - this.root.posw;
      if ( y + this.root.posh > this.root.mne_popup.body.scrollHeight ) y = this.root.mne_popup.body.scrollHeight - this.root.posh;

      this.root.style.left = x + "px";
      this.root.style.top  = y + "px";
	  break;
	case "resize" : 
	  if ( x < 50 ) x = 50;
      if ( y < 50 ) y = 50;
      if ( x + this.root.posl > this.root.mne_popup.body.scrolltWidth - 10 ) x = this.root.mne_popup.body.scrollWidth - this.root.posl - 10;
      if ( y + this.root.post > this.root.mne_popup.body.scrollHeight -10 ) y = this.root.mne_popup.body.scrollHeight - this.root.post - 10;

      this.root.style.width = x + "px";
      this.root.style.height  = y + "px";
      
      this.root.mne_popup.eleMkClass(this.root,'popup_resized', true );
	  break;
  }
  return true;
};

MneAjaxPopup.prototype.touchend = function(e)
{
    this.removeEventListener('touchmove', MneAjaxPopup.prototype.touchmove, false);
    this.removeEventListener('touchend',  MneAjaxPopup.prototype.touchend, false);

    if ( this.root.mne_popupmove == false )
    {
      if ( this.root.mne_popuptype == 'move')
      {
        this.root.mne_popup.click();
      }
      if ( this.root.mne_popuptype == 'resize')
      {
        this.root.mne_popup.dblclick();
      }
    }
};

MneAjaxPopup.prototype.mouseup = function(evt)
{
  this.root.mne_popup.win.mneDocevents.removeInterest("mousemove", this.root);
  this.root.mne_popup.win.mneDocevents.removeInterest("mouseup", this.root );
  
  if ( typeof this.root.mne_popup.weblet != 'undefined' && this.root.mne_popup.weblet != null )
  {
    if ( this.root.mne_popuptype == 'resize')
    {
      if ( typeof this.root.mne_popup.weblet.wresize == 'function' )
        this.root.mne_popup.weblet.wresize.call(this.root.mne_popup.weblet, this.root);
    }
  }
  
  return true;
};


MneAjaxPopup.prototype.remove  = function()
{
  if ( this.root.parentNode != null )
    this.root.parentNode.removeChild(this.root);
};

MneAjaxPopup.prototype.hidden  = function()
{ 
  
  if ( this.isclose != true && this.waitclose != true )
  {
    this.waitclose = true;
    if ( this.weblet != null && typeof this.weblet.onhidden == 'function' )
    {
      try 
      {
        this.weblet.onhidden();
        this.weblet.clearModify();
      }
      catch(e)
      {
        this.waitclose = false;
        this.weblet.exception("onhidden " + weblet.id + ": ", e);
      }
    }

    this.root.notinit = true;
    if ( this.weblet != null && this.weblet.initpar.popup_resize == true )
    {
      var r = this.root;
      r.style.width = "10px";
      r.style.height = "10px";
    }
    this.isclose = true;
    this.waitclose = false;
  }

  this.eleMkClass(this.root, 'display', false);
};

MneAjaxPopup.prototype.show = function(resize, repos, pshow, showallways )
{
  var show = pshow;
  var self = this;

  if ( showallways != true && ( this.weblet != null && this.weblet.initpar.showallways != true || this.weblet == null )  &&  this.root.className.indexOf('display') != -1 ) return;

   if ( show != false )
  {
    this.eleMkClass(this.root, 'display', true);
    this.isclose = false;
  }

  if ( this.weblet != null )
  {

   this.weblet.initpar.noshowatload = true;
   this.weblet.load();

    if ( typeof this.weblet.initpar.width != 'undefined' )
    {
      this.root.style.width = this.weblet.initpar.width + "%";
      this.root.style.left = (( 100 -  this.weblet.initpar.width ) / 2 ) + "%";
      this.root.notinit = false;
      if ( this.weblet.initpar.noresize -= true )
        this.root.resize.style.visibility = 'hidden';

      show = false;
      this.root.mne_popup.eleMkClass(this.root,'popup_resized', true );
    }
    if ( typeof this.weblet.initpar.height != 'undefined' )
    {
      this.root.style.height = this.weblet.initpar.height + "%";
      this.root.style.top = (( 100 -  this.weblet.initpar.height ) / 2 ) + "%";
      this.root.notinit = false;
      if ( this.weblet.initpar.noresize -= true )
        this.root.resize.style.visibility = 'hidden';

      show = false;
      this.root.mne_popup.eleMkClass(this.root,'popup_resized', true );
    }
    

    this.weblet.scrollframe = this.contentframe;
  }

  if ( show != false )
    window.setTimeout(function() { self.resize.call(self, resize, repos); }, 100 );
  
};

MneAjaxPopup.prototype.setPosition = function(x, y)
{
  this.root.notinit = false;
  if ( typeof x != 'undefined' && x != null )
    this.root.style.left = x + "px";

  if ( typeof y != 'undefined' && y != null )
    this.root.style.top = y + "px";
}

MneAjaxPopup.prototype.resize = function(resize, repos)
{
  try
  {
    this.root.style.zIndex = window.MneAjaxPopup.zindex++;

    if ( this.weblet != null && ( typeof this.weblet.initpar.width != 'undefined' || typeof this.weblet.initpar.height != 'undefined' )  )
      return;
    
    if ( resize == true || this.root.notinit )
    {
      this.eleMkClass(this.root, 'popup_resized', false);
      this.root.style.width = 'auto';
      this.root.style.height = 'auto';
      resize = false;
    }

    if ( this.root.notinit || resize == true || repos == true )
    {
      var wm = this.body.offsetWidth;
      var ws = this.root.scrollWidth;

      var hm = this.body.offsetHeight;
      var hs = this.root.scrollHeight;

      if ( repos == true || this.root.notinit )
        this.root.style.left = ((( wm - ws ) / 2 ) + this.body.parentNode.scrollLeft + this.body.scrollLeft ) + "px";

      if ( repos == true || this.root.notinit )
        this.root.style.top = ((( hm - hs ) / 2 ) +  this.body.parentNode.scrollTop + this.body.scrollTop ) + "px";
      
      this.root.notinit = false;
    }
  }
  catch(e)
  {
    alert(e.message);
  }
};

MneAjaxPopup.prototype.setClass = function(classname, clearname)
{
  this.eleMkClass(this.root, classname, true, clearname );
}

