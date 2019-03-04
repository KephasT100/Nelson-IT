// ================================================================================
//
// Copyright: M.Nelson - technische Informatik
//            Die Software darf unter den Bedingungen 
//            der APGL ( Affero Gnu Public Licence ) genutzt werden
//            
//    weblet: allg/count
// ================================================================================
{
  var i;
  var str = "";

  var ivalues = 
  {
      styleName  : 'style.css',
  };

  var svalues = 
  {
  };

  weblet.initDefaults(ivalues, svalues);
  weblet.loadview(weblet.origframe);
  weblet.obj.mkbuttons = [];

  weblet.showValue = function() {};

  weblet.obj.interval = 600000;
  weblet.obj.suminterval = 6000000;
  weblet.obj.timeval = 0;
  weblet.win.count_weblet = weblet;

  weblet.doc.body.appendChild(( weblet.obj.versioniframe = weblet.doc.createElement('iframe')) );
  weblet.obj.versioniframe.id = 'versioniframe';
  
  weblet.obj.countframe = weblet.origframe.querySelector("#countframe")
  weblet.obj.versionframe = weblet.origframe.querySelector('#versionframe');
  weblet.obj.versionframe.className = "";
  weblet.obj.versionframe.weblet = weblet;
  weblet.obj.versionframe.addEventListener ('animationend', function(evt) { this.className = ""; }, false);

  weblet.obj.versioncheck = ( typeof window.mne_config.updatehost == 'undefined' ) || window.mne_config.updatehost == '';
  
  window.mne_countmessage = function(evt)
  {
    this.count_weblet.obj.versionframe.innerText = evt.data.message;
    this.count_weblet.eleMkClass(this.count_weblet.obj.versionframe, 'versionshow', true, 'version')
  }
  
  weblet.timeout  = function()
  {
    var d = new Date();

    if ( this.obj.suminterval >= this.obj.interval && ( typeof window.mne_config == 'undefined' || window.mne_config.username != 'logout' ))
    {
      this.obj.suminterval = 0;
      try { this.obj.timeval = parseInt(MneAjax.prototype.load.call(this, "/utils/time.html?user=" + window.mne_config.username)); } catch(e) {};
      if ( isNaN(this.obj.timeval) ) { this.obj.timeval = parseInt(d.getTime() / 1000);}
      if ( this.obj.versioncheck != true )
      {
        var w = this;
        this.origframe.firstChild.weblet = this;
        this.origframe.firstChild.onload = function() { this.weblet.showversion(); };
        window.addEventListener("message", window.mne_countmessage, false);

        MneAjax.prototype.load.call(this, this.path + '/default/update.css');
        this.obj.versioniframe.src = window.location.protocol + '//' + window.mne_config.updatehost + '/index.php?version=' + encodeURIComponent(weblet.win.mne_config.version) + '&x=' + (parseInt(parseInt(this.doc.body.clientWidth) / 100 ) * 100) + "&y=" + ( parseInt(parseInt(this.doc.body.clientHeight ) / 100 ) * 100) + "&uuid=" + encodeURIComponent( weblet.win.mne_config.uuid ) + '&style=' + this.req.responseText;
        this.obj.versioncheck = true;
        window.setTimeout(function() { w.eleMkClass(w.obj.versionframe, "versionhide", true ); }, 10000);
      }
    }
    else
    {
      this.obj.suminterval = this.obj.suminterval + 60000;
      this.obj.timeval += 60;
    }
    
    d.setTime(this.obj.timeval * 1000 );

    this.obj.timeval -= d.getSeconds();
    this.printout(d);

    {
      var w = this;
      w.win.setTimeout(function() { w.timeout();} , 61000 - ( d.getSeconds() * 1000 ));
    }
    
  };

  weblet.showversion = function()
  {
    this.eleMkClass(this.obj.versionframe, 'versionshow', true );
  }
  
  weblet.printout = function(d)
  {
    var dd = d;
    var name = '';

    if ( typeof d == 'undefined' )
      dd = new Date();

    if ( typeof window.mne_config != 'undefined' && window.mne_config.fullname != '')
      name = window.mne_config.fullname + " ";
    else if ( typeof window.mne_config != 'undefined')
      name = window.mne_config.username + " ";

    this.obj.countframe.innerHTML =this.txtAddNull(dd.getHours(),2) + ":" + this.txtAddNull(dd.getMinutes(),2) + " " + name;
  };

  {
    var w = weblet;
    w.win.setTimeout(function() { w.timeout(); }, 0 );
  }

}