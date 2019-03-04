window.MneMisc = function(window)
{
}

MneMisc.prototype.nversion = 'unknown';
MneMisc.prototype.supported = 'nosupport';

if ( navigator.userAgent.indexOf("MSIE") >= 0 )
{
  MneMisc.prototype.supported = '';
  MneMisc.prototype.navigator = "MSIE";

  if ( navigator.userAgent.indexOf("9.0") >= 0 )
  {
    MneMisc.prototype.supported = 'nosupport';
	MneMisc.prototype.nversion = 9;
  }
  else if ( navigator.userAgent.indexOf("10.0") >= 0 )
  {
	MneMisc.prototype.nversion = 10;
  }
  else if ( navigator.userAgent.indexOf("11.0") >= 0 )
  {
	MneMisc.prototype.nversion = 11;
  }
  else
  {
    MneMisc.prototype.supported = 'nosupport';
    MneMisc.prototype.nversion = 8;
  }
  MneMisc.prototype.havepdf = true;
  try { new ActiveXObject('AcroPDF.PDF'); } catch(e) {try { new ActiveXObject('PDF.PdfCtrl'); } catch(e) {MneMisc.prototype.havepdf = false;}}
}
else if ( navigator.userAgent.indexOf("Trident") >= 0 )
{
  var i;
  MneMisc.prototype.supported = '';
  MneMisc.prototype.navigator = "MSIE";
  i = navigator.userAgent.indexOf("rv:");
  MneMisc.prototype.nversion = parseInt(navigator.userAgent.substr(i+3, i+5));

  MneMisc.prototype.havepdf = true;
  try { new ActiveXObject('AcroPDF.PDF'); } catch(e) {try { new ActiveXObject('PDF.PdfCtrl'); } catch(e) {MneMisc.prototype.havepdf = false;}}
}
else if (navigator.userAgent.indexOf("Chrome")  >= 0 )
{
  var i,j;
  MneMisc.prototype.navigator = "CHROME";

  i = navigator.userAgent.indexOf("Chrome"),
  MneMisc.prototype.nversion = MneMisc.prototype.nversion = parseInt(navigator.userAgent.substr(i+7, navigator.userAgent.indexOf('.', i+7)));
  if ( MneMisc.prototype.nversion >= 34 ) MneMisc.prototype.supported = '';

  for(i in navigator.plugins)
  {
    var plugin = navigator.plugins[i];
    for ( j in plugin)
      if ( typeof plugin[j].type != 'undefined' && plugin[j].type == 'application/pdf')
      {
        MneMisc.prototype.havepdf = true;
        break;
      }
    if ( MneMisc.prototype.havepdf == true ) break;
  }
}
else if (navigator.userAgent.indexOf("Firefox")  >= 0 )
{
  var i,j;
  MneMisc.prototype.navigator = "FIREFOX";
  i = navigator.userAgent.indexOf("Firefox");
  MneMisc.prototype.nversion = MneMisc.prototype.nversion = parseInt(navigator.userAgent.substr(i+8, navigator.userAgent.indexOf('.', i+8)));
  if ( MneMisc.prototype.nversion >= 25 ) MneMisc.prototype.supported = '';
  if ( Number(navigator.productSub.substr(0,2)) >= 20 ) MneMisc.prototype.havepdf = true;
}
else if ( navigator.userAgent.indexOf("Safari") >= 0 )
{
  MneMisc.prototype.navigator = "SAFARI";
  MneMisc.prototype.havepdf = true;

  var i = navigator.userAgent.indexOf("Version");
  if ( i != -1 )
  {
    MneMisc.prototype.nversion = MneMisc.prototype.nversion = parseInt(navigator.userAgent.substr(i+8,i+9));
    if ( MneMisc.prototype.nversion >= 6 ) MneMisc.prototype.supported = '';
  }
  else
  {
    i = navigator.userAgent.indexOf("Mercury");
    if ( i != -1 )
    {
      MneMisc.prototype.nversion = parseInt(navigator.userAgent.substr(i+8,navigator.userAgent.indexOf('.', i+8)));
      if ( MneMisc.prototype.nversion >= 8 ) MneMisc.prototype.supported = '';
      MneMisc.prototype.nversion = "M" + MneMisc.prototype.nversion;
    }
  }
}

if ( navigator.userAgent.indexOf("iPhone") >= 0 )
{
  MneMisc.prototype.os = "iphone";
  MneMisc.prototype.havepdf = false;
}
else if ( navigator.userAgent.indexOf("iPad") >= 0)
{
  MneMisc.prototype.os = "ipad";
  MneMisc.prototype.havepdf = false;
}
else if ( navigator.userAgent.indexOf("Mac OS X") >= 0 )
  MneMisc.prototype.os = "mac";
else if ( navigator.userAgent.indexOf("Windows") >= 0 )
  MneMisc.prototype.os = "win";
else if ( navigator.userAgent.indexOf("Linux") >= 0 )
  MneMisc.prototype.os = "linux";
else
  MneMisc.prototype.os = "other";

MneMisc.prototype.print_browser_line = function(t, id, str)
{
  var e;
  t.appendChild(document.createElement("tr"));
  e = t.lastChild;
  
  e.appendChild(document.createElement("td"));
  e.lastChild.appendChild(document.createTextNode(id));
  
  e.appendChild(document.createElement("td"));
  e.lastChild.appendChild(document.createTextNode(str));
 
  return e;
}

MneMisc.prototype.print_browser = function()
{
  var e = document.getElementById("browser");
  e.appendChild(document.createElement("table"));
  e = e.lastChild;
  
  this.print_browser_line(e, "#mne_lang#Navigator#:", MneMisc.prototype.navigator)
  this.print_browser_line(e, "#mne_lang#Version#:", MneMisc.prototype.nversion).className = MneMisc.prototype.supported;
  this.print_browser_line(e, "#mne_lang#OS#:", MneMisc.prototype.os)
  this.print_browser_line(e, "#mne_lang#Pdf Plugin#:", ( MneMisc.prototype.havepdf ) ? '#mne_lang#ja' : '#mne_lang#nein' )
  
  document.getElementById("supported").className = MneMisc.prototype.supported;
}