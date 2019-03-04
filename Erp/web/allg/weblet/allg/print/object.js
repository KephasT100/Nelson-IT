// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/print
// ================================================================================
{
  var i, str;
  
  weblet.popup = new MneAjaxPopup(window, weblet.txtGetText("#mne_lang#Meldungen"), weblet.origframe);
  weblet.popup.weblet = weblet;
  
  var ivalues = 
  {
      styleName    : 'style.css',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);

  weblet.frame = weblet.origframe;
  weblet.loadview();

  var attr = 
  {
      clear     : { "value" : MneMisc.prototype.txtGetText("#mne_lang#löschen"), weblet : weblet, "onclick" : function() { this.weblet.obj.frame.meldungen.innerHTML = ''; if ( typeof this.weblet.popup != 'undefined' && this.weblet.popup != null ) { var my = this.weblet.popup; my.root.style.width = "100px"; my.root.style.height = "100px";}}},
      meldungen : { }
  }
  weblet.findIO(attr);

  weblet.obj.meldungen = weblet.frame.meldungen;
  weblet.obj.anzahl = 0;
  
  weblet.obj.statusframe = weblet.doc.createElement("div");
  weblet.obj.statusframe.className = 'print_status';
  weblet.doc.body.appendChild(weblet.obj.statusframe);

  weblet.obj.mkbuttons = [];

  weblet.keydown = function(evt)
  {
    if ( evt.keyCode == 27 )
    {
      this.clear();
      this.popup.hidden();
      return false;
    }
    return true;
  };

  weblet.showValue = function() {};
  weblet.getTimestamp = function() { return this.txtToDateTime((new Date()).getTime() / 1000); };

  weblet.clear = function()
  {
    this.obj.meldungen.innerHTML = '';  
    return false;
  }
  
  weblet.printout = function(typ, str, notimestamp )
  {

    if ( typeof str == 'undefined' || str == null ) str = 'undefined';
    if ( typeof str != 'string' ) str = str.toString();

    console.log(str);

    var meldungen = str.toString().split('\n');
    var i;

    if ( str.indexOf('<!DOCTYPE') == 0 || typ == 'html' )
    {
      var text = this.doc.createElement("div");
      text.innerHTML = str;
      text.style.paddingLeft = "80px";
      text.id = "node" + this.obj.anzahl++;
      text.className = "print_" + typ;
      this.obj.meldungen.insertBefore(text, this.obj.meldungen.firstChild);
      meldungen = new Array();      
    }

    var ntsframe = this.doc.createElement('div');
    ntsframe.className = 'print_ntsframe';
    for ( i=meldungen.length; i>0; )
    { 
      i--;

      var text = this.doc.createElement("div");
      if ( i == 0 )
      {
        text.className = "print_row print_" + typ;
        text.innerHTML = '<div class="print_timestamp">' + ( ( notimestamp != true ) ? this.getTimestamp() : "" ) + '</div><div id="text" class="print_text" ></div>';
        text.querySelector('#text').textContent = meldungen[i];
        this.obj.meldungen.insertBefore(text, this.obj.meldungen.firstChild);
        text.lastChild.appendChild(ntsframe);
        text.ntsframe = ntsframe;
        text.popup = this.popup;
        text.style.cursor = 'pointer';
        text.onclick = function() { this.popup.eleMkClass(this.ntsframe, 'print_ntsframe_show', this.ntsframe.className.indexOf('print_ntsframe_show') == -1 ); var popup = this.popup; window.setTimeout(function() { popup.resize() }, 10); };
      }
      else
        {
        text.appendChild(this.doc.createElement('div'));
        text.lastChild.textContent = meldungen[i];
        ntsframe.insertBefore(text, ntsframe.firstChild);
        }
    }

    if ( typeof this.popup != "undefined" )
    {
      var popup = this.popup;
      var timeout = function() { popup.show(true); };
      window.setTimeout(timeout, 10);
    }
  };


  MneMisc.prototype.error  = function(str,nt)
  {
    weblet.errorfound = true; 
    weblet.printout('error', str, nt )
  };

  MneMisc.prototype.warning  = function(str,nt)
  {
    weblet.printout('warning', str, nt )
  };

  MneMisc.prototype.message  = function(str,nt)
  {
    weblet.printout('message', str, nt )
  };

  MneMisc.prototype.line  = function(str,nt)
  {
    weblet.printout('line', str, nt )
  };

  MneMisc.prototype.html  = function(str,nt)
  {
    weblet.printout('html', str, nt )
  };

  MneMisc.prototype.debug = function(debug, str, notimestamp)
  {
    if (debug <= weblet.debuglevel) weblet.printout("debug", str, notimestamp);
  };

  MneMisc.prototype.exception = function(str,e)
  {
    this.errorfound = true; 
    var message = ( typeof e == 'string' ) ? e : e.message;
    if ( typeof e != 'undefined' && typeof e.stack != 'undefined' ) message += "\n" + e.stack;

    this.error(str + " " + message);
  };

  MneMisc.prototype.status = function(str)
  {
    weblet.obj.statusframe.innerHTML = "<table class='print_status'><tr><td><div id='text'></div></td></tr></table>";
    weblet.obj.statusframe.querySelector('#text').textContent = str;
    weblet.obj.statusframe.className = 'print_status';
    window.setTimeout(function() { weblet.obj.statusframe.className = 'print_status print_status_animation' }, 0);
  };
}
