// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    datei: js/geometrie/mne_aslider.js
//================================================================================

window.MneAjaxSlider = function(win, frame, id, typ, pos, lline )
{
  (new MneAjax(win)).loadCss("slider.css");
  var line = lline;
  this.typ = typ;
    
  MneMisc.call(this,win);

  if ( typeof frame == 'string' )   this.frame = this.win.document.getElementById(frame); else this.frame = frame;
  if ( typeof line == 'undefined' ) line="move";
  
  this.eleMkClass(this.frame, 'sliderauto', false);
  this.frame.mne_slider = this;
  
  this.frame.slleft = null;
  this.frame.sltop = null;
  this.frame.slright = null;
  this.frame.slbottom = null;
  this.autosizecount = 0;
  
  this.minval = 10;
  this.num = window.MneAjaxSlider.prototype.num++;
  
  if ( typ == "V" )
  {
    this.frame.innerHTML = '<div id="slleft' + this.num + '" class="sliderframe sliderframe1 sliderleft pos"></div>'
      + '<div id="slider' + this.num + '" class="slider sliderv sliderall' + line + typ + ' sliderall' + line + ' pos" style="position: absolute; left: ' + ( ( pos == 'auto' ) ? '10px' : pos ) + '">'
      + '  <div class="slider slider' + line + typ + ' slider' + line + ' pos"></div>'
      + '</div>'
      + '<div id="slright' + this.num + '" class="sliderframe sliderframe2 sliderright pos"></div>';

    this.slider = this.eleGetById(this.frame, "slider" + this.num);
    this.frame1 = this.eleGetById(this.frame, "slleft" + this.num);
    this.frame2 = this.eleGetById(this.frame, "slright" + this.num);
  }
  else
  {
    
    this.frame.innerHTML = '<div id="sltop' + this.num + '" class="sliderframe sliderframe1 slidertop pos"></div>'
      + '<div id="slider' + this.num + '" class="slider sliderh sliderall' + line + typ + ' sliderall' + line + ' pos" style="position: absolute; top:  ' + ( ( pos == 'auto' ) ? '10px' : pos ) + '">'
      + '  <div class="slider slider' + line + typ + ' slider' + line + '" style=""></div>'
      + '</div>'
      + '<div id="slbottom' + this.num + '" class="sliderframe sliderframe2 sliderbottom pos"></div>';

    this.slider = this.eleGetById(this.frame, "slider" + this.num);
    this.frame1 = this.eleGetById(this.frame, "sltop" + this.num);
    this.frame2 = this.eleGetById(this.frame, "slbottom" + this.num);
    
  }

  var attr = new Array();
	if ( this.navigator.mobile || this.navigator.tablet )
	{
		  attr['slider' + this.num] = { 'onclick' : "void(0)" , mne_myslider : this, move : line.substr(0,4) == 'move' };
	}
	else if ( line.substr(0,4) == 'move' )
  {
		  attr['slider' + this.num] = { 'onmousedown' : this.startmove,  "mousemove" : this.mousemove, "mouseup" : this.mouseup, mne_myslider : this };
  }
	else
	{
		  attr['slider' + this.num] = { mne_myslider : this };
	}

  attr['slleft' + this.num]   = { mne_myslider : this };
  attr['slright' + this.num]  = { mne_myslider : this };
  attr['sltop' + this.num]    = { mne_myslider : this };
  attr['slbottom' + this.num] = { mne_myslider : this };
  
  this.eleSetAttributes(this.frame, this.frame, attr);
  if ( typ == "V" )
  {
    this.frame.slleft = this.frame['slleft' + this.num];
    this.frame.slright = this.frame['slright' + this.num];
    MneAjaxSlider.prototype.setPosition.call(this, this.slider.offsetLeft);
  }
  else
  {
    this.frame.sltop = this.frame['sltop' + this.num];
    this.frame.slbottom = this.frame['slbottom' + this.num];
    MneAjaxSlider.prototype.setPosition.call(this, this.slider.offsetTop);
  }

  if( pos == 'auto' )
  {
    this.eleMkClass(this.frame, 'sliderauto');
    
    this.checkframe = this.doc.createElement('div');
    this.checkframe.id = 'checkframe' + this.num;
    this.checkframe.sizeframe = this.frame1;
    this.frame1.appendChild(this.checkframe);
    
    if ( typ == 'V')
      this.frame.slleft = this.checkframe;
    else
      this.frame.sltop = this.checkframe;
    
    this.checksize = function()
    {
      //if ( this.autosizecount > 20 ) return;
      
      var s1 = ( this.typ == 'V' ) ? 'offsetWidth' : 'offsetHeight';
      var s2 = ( this.typ == 'V' ) ? 'scrollWidth' : 'scrollHeight';
      
      var size = ( this.checkframe[s1] > this.checkframe[s2] ) ?  this.checkframe[s1] : this.checkframe[s2]
      if ( size != this.autosize )
      {
        this.autosize = size;
        this.autosizecount++;
        this.setPosition(this.autosize);
        var w = this;
        window.setTimeout(function() { w.checksize(); }, 250);
      }
    }

    this.observer = new MutationObserver(function(mutations, server) { window.setTimeout(function() { server.mne_slider.checksize(); }, 0); });
    this.observer.mne_slider = this;
    this.observer.observe(this.checkframe, { attributes: true, childList: true, characterData: true, subtree : true });

  }

  this.slider.addEventListener ('animationend', function(evt) { evt.target.mne_myslider.animationend() }, false);

  if ( ( this.navigator.mobile || this.navigator.tablet ) && line.substr(0,4) == 'move' )
  {
    this.slider.addEventListener('touchstart', window.MneAjaxSlider.prototype.startmove, false);
    this.frame1.addEventListener ('touchstart', window.MneAjaxSlider.prototype.startmove, false);
    this.frame2.addEventListener ('touchstart', window.MneAjaxSlider.prototype.startmove, false);
  }


  return this; 
};

window.MneAjaxSlider.prototype = new MneMisc(window);
window.MneAjaxSlider.prototype.num = 0;

window.MneAjaxSlider.prototype.insertRule = function (str, pos)
{
  if ( typeof pos == 'undefined' ) pos = this.sheet.cssRules.length;
  this.sheet.insertRule(str, pos);
}

window.MneAjaxSlider.prototype.deleteRule = function (pos)
{
  if ( pos < this.sheet.cssRules.length )
    this.sheet.deleteRule(pos);
}

window.MneAjaxSlider.prototype.deleteRules = function()
{
  while ( this.sheet.cssRules.length != 0 )
    this.deleteRule(0);
}

window.MneAjaxSlider.prototype.animationend = function()
{
  if ( this.frame.className.indexOf('sliderclose') == -1 )
    this.eleMkClass(this.frame, 'slidershow', false, 'sliderhide');
  else
    this.eleMkClass(this.frame, 'sliderhide', true, 'sliderclose' );
}

window.MneAjaxSlider.prototype.setButtonframe = function(frame)
{
  if ( ! this.sheet )
  {
    this.style = document.createElement("style");
    this.style.type="text/css";
    this.style.id='slider' + this.num;
    document.head.appendChild(this.style);
    this.sheet = this.style.sheet;
  }

  frame.appendChild(this.doc.createElement("div"));
  frame.lastChild.className = "slidericon";
  frame.lastChild.innerText = ' ';
  frame.lastChild.mne_myslider = this;
  this.sliderbutton = frame.lastChild;
  frame.lastChild.onclick = function()
  {
    if ( this.mne_myslider.frame.className.indexOf('sliderhide') == -1 )
      this.mne_myslider.hide();
    else
      this.mne_myslider.show();
  }
  this.setPosition();
}

window.MneAjaxSlider.prototype.hide = function()
{
    this.eleMkClass(this.frame, 'sliderclose', true, 'sliderhide' );
}

window.MneAjaxSlider.prototype.show = function()
{
    this.eleMkClass(this.frame, 'slidershow', true, 'sliderhide' );
}

window.MneAjaxSlider.prototype.startmove = function(evt)
{
  if ( typeof this.root.mne_slider == 'undefined' ) return;

  var slider = this.root.mne_slider.slider;
  if ( typeof evt != 'undefined' && typeof evt.targetTouches != 'undefined' && evt.targetTouches.length > 0 )
  {
    var dist=0;

    if ( this.mne_myslider.typ == 'V' )
      dist = ( evt.targetTouches[0].clientX - MneMisc.prototype.posGetLeft(this.root.mne_slider.slider, this.root.mne_slider.win.document.getElementsByTagName("body")[0]));
    else
      dist = ( evt.targetTouches[0].clientY -  MneMisc.prototype.posGetTop(this.root.mne_slider.slider, this.root.mne_slider.win.document.getElementsByTagName("body")[0]));

    
    if ( dist < -16 || dist > 16 )
      {
      slider.dist = false;
      return;
      }
    else
      slider.dist = true;

    evt.preventDefault();
    evt.clientX = evt.targetTouches[0].clientX;
    evt.clientY = evt.targetTouches[0].clientY;
    
  }

  slider.posx = slider.offsetLeft - evt.clientX;
  slider.posy = slider.offsetTop - evt.clientY;
  
  slider.startx = evt.clientX;
  slider.starty = evt.clientY;

  this.mne_myslider.eleMkClass(slider, 'active', true);
  
  if ( this.mne_myslider.navigator.mobile || this.mne_myslider.navigator.tablet )
  {
	  this.addEventListener('touchmove', window.MneAjaxSlider.prototype.touchmove, false);
	  this.addEventListener('touchend',  window.MneAjaxSlider.prototype.touchend, false);
  }
  else
  {
	  this.root.mne_slider.win.mneDocevents.addInterest('mousemove', this.root.mne_slider.slider );
	  this.root.mne_slider.win.mneDocevents.addInterest('mouseup', this.root.mne_slider.slider );
  }
};

window.MneAjaxSlider.prototype.mousemove = function(evt)
{
	try
	{
	  var slider = this.root.mne_slider.slider;

		if ( this.root.mne_slider.typ == "V" )
		{
			var val = evt.clientX  + slider.posx;
			if ( val < this.root.mne_slider.minval ) val = this.root.mne_slider.minval;
			if ( val > ( MneMisc.prototype.posGetWidth(this.root) - this.root.mne_slider.minval) ) val = ( MneMisc.prototype.posGetWidth(this.root) - this.root.mne_slider.minval);
			
			if ( val != this.value )
    		this.root.mne_slider.setPosition.call(this.root.mne_slider, val);
		}
		else
		{
  		var val = evt.clientY  + slider.posy;
      if ( val < this.root.mne_slider.minval ) val = this.root.mne_slider.minval;
      if ( val > ( MneMisc.prototype.posGetHeight(this.root) - this.root.mne_slider.minval) ) val = ( MneMisc.prototype.posGetHeight(this.root) - this.root.mne_slider.minval);

			if ( val != this.value )
		    this.root.mne_slider.setPosition.call(this.root.mne_slider, val);
		}
	}
	catch(e)
	{
		throw e;
	}
	return true;
};

window.MneAjaxSlider.prototype.touchmove = function(evt)
{
    
  var slider = this.root.mne_slider.slider;

	  if ( typeof evt.targetTouches != 'undefined' && evt.targetTouches.length > 0 )
	  {
	    if ( slider.move && slider.dist )
	    {
	      evt.clientX = evt.targetTouches[0].clientX;
	      evt.clientY = evt.targetTouches[0].clientY;
	      evt.preventDefault();
	      window.MneAjaxSlider.prototype.mousemove.call(this, evt);
	    }
	    else
	    {
	      slider.distx = evt.targetTouches[0].clientX  - slider.startx;
	      slider.disty = evt.targetTouches[0].clientY  - slider.starty;
	    }
	  }


};

window.MneAjaxSlider.prototype.mouseup = function(evt)
{
  var slider = this.root.mne_slider.slider;

  this.mne_myslider.eleMkClass(slider, 'active', false);

  this.root.mne_slider.win.mneDocevents.removeInterest("mousemove", this.root.mne_slider.slider );
  this.root.mne_slider.win.mneDocevents.removeInterest("mouseup", this.root.mne_slider.slider );

  this.root.mne_slider.setPosition.call(this.root.mne_slider);
  this.root.mne_slider.updatePosition.call(this.root.mne_slider);
  
  return true;
};

window.MneAjaxSlider.prototype.touchend = function(evt)
{
    var slider = this.root.mne_slider.slider;
    this.mne_myslider.eleMkClass(slider, 'active', false);

    this.removeEventListener('touchmove', window.MneAjaxSlider.prototype.touchmove, false);
    this.removeEventListener('touchend',  window.MneAjaxSlider.prototype.touchend, false);

    if ( slider.move && slider.dist )
    {
      this.root.mne_slider.setPosition.call(this.root.mne_slider);
      this.root.mne_slider.updatePosition.call(this.root.mne_slider);
      evt.stopImmediatePropagation();
    }
    else if ( Math.abs(slider.distx / slider.disty) > 1.2 )
    {
      if ( evt.currentTarget == this.root.slleft  || evt.currentTarget == this.root.slright )
      {
        if ( slider.distx < 0 && parseInt(slider.style.left) != 0 )
        {
          this.root.mne_slider.savepos = slider.style.left;
          this.root.mne_slider.setPosition.call(this.root.mne_slider, 0)
          this.root.mne_slider.updatePosition.call(this.root.mne_slider);
          evt.stopImmediatePropagation();
        }
        else if ( slider.distx > 0 && parseInt(slider.style.left) == 0 )
        {
          slider.style.left = this.root.mne_slider.savepos;
          this.root.mne_slider.setPosition.call(this.root.mne_slider )
          this.root.mne_slider.updatePosition.call(this.root.mne_slider);
          evt.stopImmediatePropagation();
        }
        evt.preventDefault();
        return false;
      }
    }
};

window.MneAjaxSlider.prototype.setPosition = function(pos)
{
  var i;
  
  if ( typeof pos != 'undefined' )
  {
    if ( typeof pos == 'number' ) pos = pos + "px";
    this.value = parseInt(parseFloat(pos));
    this.slider.style[ ( this.typ == "V" ) ? 'left' : 'top'] = pos;
  }
  else
  {
    this.value = ( this.typ == "V") ? parseInt(parseFloat(this.posGetLeft(this.slider, this.frame))) : parseInt(parseFloat(this.posGetTop(this.slider, this.frame)));
  }

  if ( this.typ  == 'V' )
  {
    var width = this.posGetLeft(this.slider,this.frame);
    var left = width + this.posGetWidth(this.slider);
    
    this.frame1.style.width = width + "px";
    if ( typeof this.frame1.mne_slider == 'object' ) this.frame1.mne_slider.setPosition(); 
    if ( typeof this.frame1.weblet != 'undefined' && typeof this.frame1.weblet.slidermove == 'function' ) try { this.frame1.weblet.slidermove(); } catch(e) { this.frame1.weblet.exception("MneAjaxSlider::setpos", e); }

    this.frame2.style.left = left + "px";
    if ( typeof this.frame2.mne_slider == 'object' ) this.frame2.mne_slider.setPosition(); 
    if ( typeof this.frame2.weblet != 'undefined' && typeof this.frame2.weblet.slidermove == 'function' ) try { this.frame2.weblet.slidermove(); } catch(e) { this.frame2.weblet.exception("MneAjaxSlider::setpos", e); }


    if ( this.sliderbutton )
    {
      this.deleteRules();

      this.insertRule("@keyframes sliderresizel" + this.num + ' { 0% { width : ' + width + 'px;} 100% { width: 0px; }}');
      this.insertRule("@keyframes sliderresizes" + this.num + ' { 0% { left : ' + left + 'px;}    100% { left: 0px;}}');
      this.insertRule("@keyframes sliderresizer" + this.num + ' { 0% { left : ' + left + 'px;}    100% { left: 0px;}}');

      this.insertRule(".sliderclose > #slleft"  + this.num + ' {  animation-name: sliderresizel' + this.num + ';  width: 0px; }');
      this.insertRule(".sliderclose > #slider"  + this.num + ' {  animation-name: sliderresizes' + this.num + ';  left:  0px; }');
      this.insertRule(".sliderclose > #slright" + this.num + ' {  animation-name: sliderresizer' + this.num + ';  left:  0px; }');

      this.insertRule(".sliderhide > #slleft"  + this.num + ' {  width: 0px !important; }', this.animation);
      this.insertRule(".sliderhide > #slider"  + this.num + ' {  left:  0px !important; }', this.animation);
      this.insertRule(".sliderhide > #slright" + this.num + ' {  left:  0px !important; }', this.animation);

      this.insertRule(".slidershow > #slleft"  + this.num + ' {  animation-name: sliderresizel' + this.num + ';  width: ' + width + 'px;}');
      this.insertRule(".slidershow > #slider"  + this.num + ' {  animation-name: sliderresizes' + this.num + ';  left: '  + left + 'px; }');
      this.insertRule(".slidershow > #slright" + this.num + ' {  animation-name: sliderresizer' + this.num + ';  left: '  + left + 'px; }');
    }
  }
  else
  {
    var height = this.posGetTop(this.slider, this.frame);
    var top = height + this.posGetHeight(this.slider);

    this.frame1.style.height = height + "px";
    if ( typeof this.frame1.mne_slider == 'object' ) this.frame1.mne_slider.setPosition(); 
    if ( typeof this.frame1.weblet != 'undefined' && typeof this.frame1.weblet.slidermove == 'function' ) try { this.frame1.weblet.slidermove(); } catch(e) { this.frame1.weblet.exception("MneAjaxSlider::setpos", e); }
  
    this.frame2.style.top = + top + "px";
    if ( typeof this.frame2.mne_slider == 'object' ) this.frame2.mne_slider.setPosition(); 
    if ( typeof this.frame2.weblet != 'undefined' && typeof this.frame2.weblet.slidermove == 'function' ) try { this.frame2.weblet.slidermove(); } catch(e) { this.frame2.weblet.exception("MneAjaxSlider::setpos", e); }

    if ( this.sliderbutton )
    {
      this.deleteRules();

      this.insertRule("@keyframes sliderresizet" + this.num + ' { 0% { height : ' + height + 'px;} 100% { height: 0px;}}');
      this.insertRule("@keyframes sliderresizes" + this.num + ' { 0% { top : '    + top    + 'px;} 100% { top: 0px; }}');
      this.insertRule("@keyframes sliderresizeb" + this.num + ' { 0% { top : '    + top    + 'px;} 100% { top: 0px; }}');

      this.insertRule(".sliderclose  > #sltop"    + this.num + ' {  animation-name: sliderresizet' + this.num + ';  height: 0px; }');
      this.insertRule(".sliderclose  > #slider"   + this.num + ' {  animation-name: sliderresizes' + this.num + ';  top:    0px; }');
      this.insertRule(".sliderclose  > #slbottom" + this.num + ' {  animation-name: sliderresizeb' + this.num + ';  top:    0px; }');

      this.insertRule(".sliderhide  > #sltop"    + this.num + ' {  height: 0px !important;}');
      this.insertRule(".sliderhide  > #slider"   + this.num + ' {  top:    0px !important; }');
      this.insertRule(".sliderhide  > #slbottom" + this.num + ' {  top:    0px !important; }');

      this.insertRule(".slidershow  > #sltop"    + this.num + ' {  animation-name: sliderresizet' + this.num + ';  height: ' + height + 'px;}');
      this.insertRule(".slidershow  > #slider"   + this.num + ' {  animation-name: sliderresizes' + this.num + ';  top: ' + top + 'px; }');
      this.insertRule(".slidershow  > #slbottom" + this.num + ' {  animation-name: sliderresizeb' + this.num + ';  top: ' + top + 'px; }');
    }
  }
};

window.MneAjaxSlider.prototype.updatePosition = function()
{
  if ( this.frame1 != null )
  {
    if ( typeof this.frame1.weblet != 'undefined' ) try { this.frame1.weblet.wresize(); } catch(e) { this.frame1.weblet.exception("MneAjaxSlider::setpos", e); }
    if ( typeof this.frame1.mne_slider == 'object' ) this.frame1.mne_slider.updatePosition(); 
  }
  
  if ( this.frame2  != null )
  {
    if ( typeof this.frame2.weblet != 'undefined' ) try { this.frame2.weblet.wresize(); } catch(e) { this.frame2.weblet.exception("MneAjaxSlider::setpos", e); }
    if ( typeof this.frame2.mne_slider == 'object' ) this.frame2.mne_slider.updatePosition(); 
  }
};

window.MneAjaxSlider.prototype.setLine = function(line)
{
  this.slider.className = "sliderall" + line + this.typ;
  this.slider.firstChild.className = "slider" + line + this.typ;
  if ( line.substr(0,4) == 'move' )
  {
    this.slider.onmousedown = this.startmove;
    this.slider.mousemove = this.mousemove;
    this.slider.mouseup = this.mouseup;
    this.slider.mne_slider = this;
  }
  else
  {
    delete this.slider.onmousedown;
    delete this.slider.mousemove;
    delete this.slider.mouseup;
  }
};

window.MneAjaxSlider.prototype.destructor = function ()
{
  if ( this.style && this.style.parentNode != null ) document.head.removeChild(this.style);
}

