// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    datei: js/ajax/mne_docevent.js
//================================================================================
'use strict';
window.MneDocEvents = function(win)
{
  //MneMisc.call(this, win);
  this.interests = {};
  this.win = win;
  this.exception = function(str,e,nt)  { this.errorfound = true; if ( typeof window.mnePrint != 'undefined' ) window.mnePrint.exception(str,e,nt); else alert(str + " " + e.message + "\n" + e.stack); };

  this.callFunctions = function(e, interests)
  {
    var i, length;
    var evt = this.mkEvent(this.win, e);

    var interest;
    var result, r;

    interest = this[interests + "Interests"];
    length = interest.length;
    result = true;
    for (i = 0; i < length; i++)
    {
      try
      {
        interest[i].doceventstop = false;
        r = interest[i][interests](evt);
        result = result && r;
        if (interest[i].doceventstop == true)
        {
          result = false;
          break;
        }
      }
      catch (e)
      {
        this.exception("MneDocEvents::callFunctions:", e);
      }
    }

    if (result == false) e.preventDefault();

    return result;
  };

  this.addInterest = function(evt, obj)
  {
    if (typeof this[evt + "Interests"] == 'undefined')
    {
      this[evt + "Interests"] = new Array();
      this.interests[evt] = this[evt + "Interests"];
    }
    if (this[evt + "Interests"].length == 0)
    {
      if (evt.substr(0, 3) == 'win') this.win["on" + evt.substr(3)] = function(e)
      {
        return this.mneDocevents.callFunctions(e, evt);
      };
      else this.win.document["on" + evt] = function(e)
      {
        return this.mneDocevents.callFunctions(e, evt);
      };
    }
    this[evt + "Interests"][this[evt + "Interests"].length] = obj;
  };

  this.removeInterest = function(evt, obj)
  {
    var i, oi;
    oi = this.interests[evt];

    if (typeof oi == 'undefined') return;

    this.interests[evt] = new Array();

    for (i = 0; i < oi.length; i++)
      if (oi[i] != obj) this.interests[evt][this.interests[evt].length] = oi[i];

    this[evt + "Interests"] = this.interests[evt];

    if (this.interests[evt].length == 0) if (evt.substr(0, 3) == 'win') this.win["on" + evt.substr(3)] = null;
    else this.win.document["on" + evt] = null;

  };

  this.remove = function(obj)
  {
    var i = null;
    for (i in this.interests)
      this.removeInterest(i, obj);
  };

  this.focus = function(obj)
  {
    if ( document.activeElement ) document.activeElement.blur();
    try { window.location.hash = obj; } catch(e) {};
    window.history.replaceState(null, null, window.location.pathname.replace(/^\/+/, '/'))
  }
  
  this.checkInside = function(evt, obj)
  {

    var e = evt.target;
    var ex, ey;

    if ( evt.type.substr(0, 3) == 'key' )
    {
      var wsel = window.getSelection();
      if (wsel.rangeCount == 0) return false;

      var s = wsel.getRangeAt(0);
      e = s.startContainer;
    }
    else
    {
      try
      {

        var r = obj.getBoundingClientRect();

        ex = evt.pageX - obj.scrollLeft;
        ey = evt.pageY - obj.scrollTop;

        if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom) return true;
      }
      catch (e)
      {
        return false;
      }

    }

    while (e != null && e.checkinside != true )
    {
      if (e == obj) return true;
      e = e.parentNode;
    }

    return (e == obj);
  };

  this.win.document.mneDocevents = this;
  this.win.mneDocevents = this;
};

window.MneDocEvents.prototype.mkEvent = function(win, evt)
{
  if ( typeof evt == 'object' )
    return evt;
  
  return { noevent : true };
};

window.MneDocEvents.prototype.cancelEvent = function(win, e)
{
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  e.returnValue = false;
  e.cancelBubble = true;
  return false;
};

window.MneDocEvents.prototype.fireEvent = function(el, evttype)
{
  
  if (typeof this.obj == 'undefined' || this.obj == null) this.obj = {};
  this.obj.fire = { ele : el, evttype : evttype };

  {
  var evt;
  var e = el;
    
  if ( typeof evttype == 'string' ) {  evt = document.createEvent('HTMLEvents'); evt.initEvent(evttype, false, true); }
  else evt = evttype;

  evt.sourceElement = ele;
  window.setTimeout(function() { e.dispatchEvent(evt); }, 0);
  }
};

window.mneDocevents = new MneDocEvents(window);
